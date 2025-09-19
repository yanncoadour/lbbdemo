/**
 * Mode Offline - La Belle Bretagne
 * Détection hors ligne et fonctionnalités offline
 */

class OfflineManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.offlineData = new Map();
        this.syncQueue = [];
        this.retryInterval = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createOfflineUI();
        this.loadOfflineData();

        console.log('Mode offline initialisé - En ligne:', this.isOnline);
    }

    // Configuration des écouteurs d'événements
    setupEventListeners() {
        // Écouter les changements de connectivité
        window.addEventListener('online', () => {
            this.handleOnline();
        });

        window.addEventListener('offline', () => {
            this.handleOffline();
        });

        // Vérification périodique de la connectivité
        setInterval(() => {
            this.checkConnectivity();
        }, 30000); // Toutes les 30 secondes
    }

    // Gérer la reconnexion
    handleOnline() {
        console.log('📡 Connexion rétablie');
        this.isOnline = true;

        this.hideOfflineNotification();
        this.syncPendingData();
        this.updateOfflineUI();

        // Événement personnalisé
        this.dispatchEvent('online-restored');
    }

    // Gérer la déconnexion
    handleOffline() {
        console.log('📴 Connexion perdue');
        this.isOnline = false;

        this.showOfflineNotification();
        this.updateOfflineUI();

        // Événement personnalisé
        this.dispatchEvent('offline-detected');
    }

    // Vérifier la connectivité réelle
    async checkConnectivity() {
        try {
            // Test avec une petite image de notre domaine
            const response = await fetch('/favicon.ico', {
                method: 'HEAD',
                cache: 'no-cache'
            });

            const wasOnline = this.isOnline;
            this.isOnline = response.ok;

            // Si le statut a changé
            if (wasOnline !== this.isOnline) {
                if (this.isOnline) {
                    this.handleOnline();
                } else {
                    this.handleOffline();
                }
            }

        } catch (error) {
            if (this.isOnline) {
                this.handleOffline();
            }
        }
    }

    // Afficher la notification offline
    showOfflineNotification() {
        let notification = document.getElementById('offlineNotification');

        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'offlineNotification';
            notification.className = 'offline-notification';
            notification.innerHTML = `
                <div class="offline-content">
                    <i class="fas fa-wifi" style="opacity: 0.5;"></i>
                    <span>Mode hors ligne</span>
                    <button class="offline-retry" id="offlineRetry">
                        <i class="fas fa-sync"></i>
                    </button>
                </div>
            `;
            document.body.appendChild(notification);

            // Bouton retry
            notification.querySelector('.offline-retry').addEventListener('click', () => {
                this.checkConnectivity();
            });
        }

        notification.classList.add('visible');

        // Auto-hide après 5 secondes
        setTimeout(() => {
            if (!this.isOnline) {
                notification.classList.add('minimized');
            }
        }, 5000);
    }

    // Masquer la notification offline
    hideOfflineNotification() {
        const notification = document.getElementById('offlineNotification');
        if (notification) {
            notification.classList.remove('visible', 'minimized');
            setTimeout(() => {
                if (this.isOnline) {
                    notification.remove();
                }
            }, 300);
        }
    }

    // Créer l'UI offline
    createOfflineUI() {
        // Styles CSS pour les notifications
        const styles = `
            <style id="offline-styles">
                .offline-notification {
                    position: fixed;
                    top: -60px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--warning, #d97706);
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0 0 12px 12px;
                    box-shadow: var(--shadow-lg, 0 8px 32px rgba(0, 0, 0, 0.12));
                    z-index: 10000;
                    transition: all 0.3s ease;
                    min-width: 200px;
                    text-align: center;
                }

                .offline-notification.visible {
                    top: 0;
                }

                .offline-notification.minimized {
                    top: -45px;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                }

                .offline-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    justify-content: center;
                }

                .offline-retry {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .offline-retry:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(180deg);
                }

                .offline-indicator {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.25rem 0.75rem;
                    background: rgba(217, 119, 6, 0.1);
                    color: var(--warning, #d97706);
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    margin-left: 0.5rem;
                }

                .offline-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: var(--warning, #d97706);
                    color: white;
                    font-size: 0.75rem;
                    padding: 0.25rem 0.5rem;
                    border-radius: 12px;
                    font-weight: 600;
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Charger les données offline
    loadOfflineData() {
        try {
            const stored = localStorage.getItem('lbb-offline-data');
            if (stored) {
                const data = JSON.parse(stored);
                data.forEach((value, key) => {
                    this.offlineData.set(key, value);
                });
            }

            console.log('Données offline chargées:', this.offlineData.size, 'éléments');
        } catch (error) {
            console.error('Erreur chargement données offline:', error);
        }
    }

    // Sauvegarder les données offline
    saveOfflineData() {
        try {
            const dataArray = Array.from(this.offlineData.entries());
            localStorage.setItem('lbb-offline-data', JSON.stringify(dataArray));
        } catch (error) {
            console.error('Erreur sauvegarde offline:', error);
        }
    }

    // Stocker des données pour l'offline
    storeForOffline(key, data) {
        this.offlineData.set(key, {
            data: data,
            timestamp: new Date().toISOString(),
            version: 1
        });

        this.saveOfflineData();
    }

    // Récupérer des données offline
    getOfflineData(key) {
        const stored = this.offlineData.get(key);
        if (!stored) return null;

        // Vérifier si les données ne sont pas trop anciennes (7 jours max)
        const age = Date.now() - new Date(stored.timestamp).getTime();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 jours

        if (age > maxAge) {
            this.offlineData.delete(key);
            this.saveOfflineData();
            return null;
        }

        return stored.data;
    }

    // Ajouter à la queue de synchronisation
    addToSyncQueue(action, data) {
        const syncItem = {
            id: Date.now() + Math.random(),
            action: action,
            data: data,
            timestamp: new Date().toISOString(),
            retries: 0
        };

        this.syncQueue.push(syncItem);
        this.saveSyncQueue();

        // Essayer de synchroniser si en ligne
        if (this.isOnline) {
            this.syncPendingData();
        }
    }

    // Synchroniser les données en attente
    async syncPendingData() {
        if (!this.isOnline || this.syncQueue.length === 0) {
            return;
        }

        console.log('🔄 Synchronisation de', this.syncQueue.length, 'éléments...');

        const itemsToSync = [...this.syncQueue];
        let syncedCount = 0;

        for (const item of itemsToSync) {
            try {
                const success = await this.syncItem(item);
                if (success) {
                    // Retirer de la queue
                    const index = this.syncQueue.findIndex(i => i.id === item.id);
                    if (index > -1) {
                        this.syncQueue.splice(index, 1);
                        syncedCount++;
                    }
                }
            } catch (error) {
                console.error('Erreur sync item:', error);
                item.retries++;

                // Abandon après 3 tentatives
                if (item.retries >= 3) {
                    const index = this.syncQueue.findIndex(i => i.id === item.id);
                    if (index > -1) {
                        this.syncQueue.splice(index, 1);
                    }
                }
            }
        }

        this.saveSyncQueue();

        if (syncedCount > 0) {
            console.log('✅ Synchronisation terminée:', syncedCount, 'éléments');
            this.dispatchEvent('sync-completed', { synced: syncedCount });
        }
    }

    // Synchroniser un élément spécifique
    async syncItem(item) {
        // Logique de synchronisation selon l'action
        switch (item.action) {
            case 'favorite-add':
                // Sync favoris avec serveur (futur)
                return true;

            case 'favorite-remove':
                // Sync suppression favoris (futur)
                return true;

            case 'analytics':
                // Sync événements analytics
                return this.syncAnalytics(item.data);

            default:
                return false;
        }
    }

    // Synchroniser les analytics
    async syncAnalytics(data) {
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', data.event, data.parameters);
                return true;
            }
            return true; // Pas d'analytics configuré
        } catch (error) {
            return false;
        }
    }

    // Sauvegarder la queue de synchronisation
    saveSyncQueue() {
        try {
            localStorage.setItem('lbb-sync-queue', JSON.stringify(this.syncQueue));
        } catch (error) {
            console.error('Erreur sauvegarde sync queue:', error);
        }
    }

    // Charger la queue de synchronisation
    loadSyncQueue() {
        try {
            const stored = localStorage.getItem('lbb-sync-queue');
            if (stored) {
                this.syncQueue = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Erreur chargement sync queue:', error);
            this.syncQueue = [];
        }
    }

    // Mettre à jour l'UI offline
    updateOfflineUI() {
        // Ajouter des indicateurs offline aux éléments qui en ont besoin
        const buttons = document.querySelectorAll('.share-btn, .favorite-btn');

        buttons.forEach(btn => {
            const existingBadge = btn.querySelector('.offline-badge');

            if (!this.isOnline && !existingBadge) {
                const badge = document.createElement('span');
                badge.className = 'offline-indicator';
                badge.innerHTML = '<i class="fas fa-wifi" style="opacity: 0.5;"></i>';
                badge.title = 'Action sera synchronisée en ligne';
                btn.appendChild(badge);
            } else if (this.isOnline && existingBadge) {
                existingBadge.remove();
            }
        });
    }

    // Vérifier si une fonctionnalité est disponible offline
    isFeatureAvailableOffline(feature) {
        const offlineFeatures = [
            'favorites',
            'view-cached-pois',
            'basic-navigation',
            'search-cached'
        ];

        return offlineFeatures.includes(feature);
    }

    // Dispatcher un événement personnalisé
    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(`lbb-${eventName}`, {
            detail: { ...data, isOnline: this.isOnline },
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    // Nettoyer les anciennes données
    cleanup() {
        const now = Date.now();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 jours

        // Nettoyer les données offline
        for (const [key, value] of this.offlineData.entries()) {
            const age = now - new Date(value.timestamp).getTime();
            if (age > maxAge) {
                this.offlineData.delete(key);
            }
        }

        // Nettoyer la sync queue (éléments trop anciens)
        this.syncQueue = this.syncQueue.filter(item => {
            const age = now - new Date(item.timestamp).getTime();
            return age < maxAge;
        });

        this.saveOfflineData();
        this.saveSyncQueue();
    }

    // Obtenir le statut offline
    getStatus() {
        return {
            isOnline: this.isOnline,
            offlineDataCount: this.offlineData.size,
            syncQueueLength: this.syncQueue.length
        };
    }
}

// Instance globale
window.offlineManager = new OfflineManager();

// Export pour modules
window.LaBelleBretagne = window.LaBelleBretagne || {};
window.LaBelleBretagne.OfflineManager = OfflineManager;