/**
 * Système de Favoris Avancé - La Belle Bretagne
 * Gestion des favoris avec synchronisation et stockage local
 */

class FavoritesManager {
    constructor() {
        this.storageKey = 'lbb-favorites';
        this.syncKey = 'lbb-favorites-sync';
        this.favorites = new Set();
        this.syncEnabled = false;
        this.lastSync = null;

        this.init();
    }

    async init() {
        // Charger les favoris depuis le stockage local
        await this.loadFavorites();

        // Initialiser les événements
        this.initEventListeners();

        // Détecter si la sync est possible (localStorage + IndexedDB)
        this.syncEnabled = this.detectSyncCapability();

        console.log('Favoris initialisés:', this.favorites.size, 'éléments');
    }

    // Charger les favoris depuis le stockage
    async loadFavorites() {
        try {
            // Essayer localStorage d'abord
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const favoritesArray = JSON.parse(stored);
                this.favorites = new Set(favoritesArray.map(fav => fav.id || fav));
            }

            // Charger les métadonnées de sync
            const syncData = localStorage.getItem(this.syncKey);
            if (syncData) {
                const { lastSync } = JSON.parse(syncData);
                this.lastSync = new Date(lastSync);
            }

        } catch (error) {
            console.error('Erreur chargement favoris:', error);
            this.favorites = new Set();
        }
    }

    // Sauvegarder les favoris
    async saveFavorites() {
        try {
            // Sauvegarder la liste des IDs
            const favoritesArray = Array.from(this.favorites);
            localStorage.setItem(this.storageKey, JSON.stringify(favoritesArray));

            // Sauvegarder les métadonnées de sync
            const syncData = {
                lastSync: new Date().toISOString(),
                version: 1
            };
            localStorage.setItem(this.syncKey, JSON.stringify(syncData));

            // Déclencher l'événement de sauvegarde
            this.dispatchEvent('favorites-saved', {
                count: this.favorites.size,
                favorites: favoritesArray
            });

        } catch (error) {
            console.error('Erreur sauvegarde favoris:', error);
        }
    }

    // Ajouter un favori
    async addFavorite(poiId, poiData = null) {
        if (this.favorites.has(poiId)) {
            return false; // Déjà en favoris
        }

        this.favorites.add(poiId);

        // Sauvegarder les données complètes du POI pour l'offline
        if (poiData) {
            await this.savePOIData(poiId, poiData);
        }

        await this.saveFavorites();

        // Mettre à jour l'UI
        this.updateFavoriteButton(poiId, true);

        this.dispatchEvent('favorite-added', { poiId, poiData });

        console.log('Favori ajouté:', poiId);
        return true;
    }

    // Supprimer un favori
    async removeFavorite(poiId) {
        if (!this.favorites.has(poiId)) {
            return false; // Pas en favoris
        }

        this.favorites.delete(poiId);
        await this.saveFavorites();

        // Mettre à jour l'UI
        this.updateFavoriteButton(poiId, false);

        this.dispatchEvent('favorite-removed', { poiId });

        console.log('Favori supprimé:', poiId);
        return true;
    }

    // Basculer un favori
    async toggleFavorite(poiId, poiData = null) {
        if (this.favorites.has(poiId)) {
            return await this.removeFavorite(poiId);
        } else {
            return await this.addFavorite(poiId, poiData);
        }
    }

    // Vérifier si un POI est en favoris
    isFavorite(poiId) {
        return this.favorites.has(poiId);
    }

    // Obtenir tous les favoris
    getFavorites() {
        return Array.from(this.favorites);
    }

    // Obtenir le nombre de favoris
    getCount() {
        return this.favorites.size;
    }

    // Sauvegarder les données d'un POI pour l'offline
    async savePOIData(poiId, poiData) {
        try {
            const key = `lbb-poi-${poiId}`;
            const dataToStore = {
                ...poiData,
                savedAt: new Date().toISOString(),
                version: 1
            };
            localStorage.setItem(key, JSON.stringify(dataToStore));
        } catch (error) {
            console.error('Erreur sauvegarde POI data:', error);
        }
    }

    // Récupérer les données d'un POI sauvegardé
    async getPOIData(poiId) {
        try {
            const key = `lbb-poi-${poiId}`;
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Erreur récupération POI data:', error);
            return null;
        }
    }

    // Mettre à jour le bouton favori dans l'UI
    updateFavoriteButton(poiId, isFavorite) {
        // Boutons dans les popups
        const favoriteButtons = document.querySelectorAll(`[data-poi-id="${poiId}"] .favorite-btn, .favorite-btn[data-poi-id="${poiId}"]`);

        favoriteButtons.forEach(btn => {
            const icon = btn.querySelector('i');
            if (isFavorite) {
                btn.classList.add('active');
                icon.className = 'fas fa-heart';
                btn.title = 'Retirer des favoris';
            } else {
                btn.classList.remove('active');
                icon.className = 'far fa-heart';
                btn.title = 'Ajouter aux favoris';
            }
        });

        // Mettre à jour le compteur global si présent
        this.updateFavoritesCounter();
    }

    // Mettre à jour le compteur de favoris
    updateFavoritesCounter() {
        const counters = document.querySelectorAll('.favorites-count');
        counters.forEach(counter => {
            counter.textContent = this.favorites.size;
        });
    }

    // Initialiser les écouteurs d'événements
    initEventListeners() {
        // Écouter les clics sur les boutons favoris
        document.addEventListener('click', (e) => {
            const favoriteBtn = e.target.closest('.favorite-btn');
            if (favoriteBtn) {
                e.preventDefault();
                e.stopPropagation();

                const poiId = favoriteBtn.dataset.poiId;
                if (poiId) {
                    this.handleFavoriteClick(poiId, favoriteBtn);
                }
            }
        });

        // Synchroniser lors de la visibilité de la page
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.syncEnabled) {
                this.syncFavorites();
            }
        });
    }

    // Gérer le clic sur un bouton favori
    async handleFavoriteClick(poiId, button) {
        try {
            // Animation de loading
            button.style.transform = 'scale(0.8)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);

            // Trouver les données du POI si disponibles
            let poiData = null;
            if (window.allPois) {
                poiData = window.allPois.find(poi => poi.id === poiId || poi.slug === poiId);
            }

            await this.toggleFavorite(poiId, poiData);

        } catch (error) {
            console.error('Erreur toggle favori:', error);
        }
    }

    // Exporter les favoris
    exportFavorites() {
        const data = {
            favorites: Array.from(this.favorites),
            exportDate: new Date().toISOString(),
            version: 1
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'favoris-la-belle-bretagne.json';
        a.click();

        URL.revokeObjectURL(url);

        this.dispatchEvent('favorites-exported', { count: this.favorites.size });
    }

    // Importer des favoris
    async importFavorites(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (data.favorites && Array.isArray(data.favorites)) {
                const importCount = data.favorites.length;
                const existingCount = this.favorites.size;

                // Ajouter les nouveaux favoris
                data.favorites.forEach(fav => {
                    this.favorites.add(typeof fav === 'string' ? fav : fav.id);
                });

                await this.saveFavorites();

                const addedCount = this.favorites.size - existingCount;

                this.dispatchEvent('favorites-imported', {
                    imported: importCount,
                    added: addedCount,
                    total: this.favorites.size
                });

                return { success: true, imported: importCount, added: addedCount };
            }

            throw new Error('Format de fichier invalide');

        } catch (error) {
            console.error('Erreur import favoris:', error);
            return { success: false, error: error.message };
        }
    }

    // Synchroniser les favoris (futur : avec backend)
    async syncFavorites() {
        // Pour l'instant, juste une synchronisation locale
        console.log('Sync favoris...');
        this.lastSync = new Date();
    }

    // Détecter la capacité de synchronisation
    detectSyncCapability() {
        return 'localStorage' in window && 'indexedDB' in window;
    }

    // Dispatcher un événement personnalisé
    dispatchEvent(eventName, data) {
        const event = new CustomEvent(`lbb-${eventName}`, {
            detail: data,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    // Nettoyer les données anciennes
    async cleanup() {
        try {
            // Supprimer les POI data de plus de 30 jours
            const keys = Object.keys(localStorage);
            const now = new Date();

            keys.forEach(key => {
                if (key.startsWith('lbb-poi-')) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        const savedAt = new Date(data.savedAt);
                        const daysDiff = (now - savedAt) / (1000 * 60 * 60 * 24);

                        if (daysDiff > 30) {
                            localStorage.removeItem(key);
                        }
                    } catch (e) {
                        // Supprimer les clés corrompues
                        localStorage.removeItem(key);
                    }
                }
            });

        } catch (error) {
            console.error('Erreur cleanup favoris:', error);
        }
    }
}

// Instance globale
window.favoritesManager = new FavoritesManager();

// Export pour modules
window.LaBelleBretagne = window.LaBelleBretagne || {};
window.LaBelleBretagne.FavoritesManager = FavoritesManager;