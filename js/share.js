/**
 * Système de Partage - La Belle Bretagne
 * Partage de lieux via Web Share API et fallbacks
 */

class ShareManager {
    constructor() {
        this.supportsWebShare = 'share' in navigator;
        this.baseUrl = window.location.origin;

        console.log('Web Share API supporté:', this.supportsWebShare);
        this.init();
    }

    init() {
        this.initEventListeners();
        this.createShareModal();
    }

    // Partager un lieu spécifique
    async sharePOI(poiData) {
        const shareData = this.createShareData(poiData);

        if (this.supportsWebShare) {
            try {
                await navigator.share(shareData);
                this.trackShare('native', poiData.id);
                return true;
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Erreur Web Share:', error);
                }
                // Fallback vers modal
                this.showShareModal(shareData, poiData);
            }
        } else {
            this.showShareModal(shareData, poiData);
        }
    }

    // Créer les données de partage
    createShareData(poiData) {
        const url = `${this.baseUrl}/poi.html?slug=${poiData.slug}`;
        const title = `${poiData.title} - La Belle Bretagne`;
        const text = `Découvrez ${poiData.title} en ${poiData.department}. ${poiData.shortDescription}`;

        return { title, text, url };
    }

    // Partager la position actuelle avec POIs proches
    async shareCurrentLocation(lat, lng, nearbyPois = []) {
        const shareData = {
            title: 'Ma position en Bretagne - La Belle Bretagne',
            text: `Je suis actuellement en Bretagne ! ${nearbyPois.length > 0 ? `Il y a ${nearbyPois.length} lieux intéressants à proximité.` : ''}`,
            url: `${this.baseUrl}/?lat=${lat}&lng=${lng}&zoom=13`
        };

        if (this.supportsWebShare) {
            try {
                await navigator.share(shareData);
                this.trackShare('location', 'current-position');
                return true;
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Erreur Web Share:', error);
                }
            }
        }

        this.showShareModal(shareData, { type: 'location', lat, lng });
    }

    // Afficher la modal de partage
    showShareModal(shareData, context) {
        const modal = document.getElementById('shareModal');
        if (!modal) return;

        // Remplir les données
        document.getElementById('shareTitle').textContent = shareData.title;
        document.getElementById('shareText').textContent = shareData.text;
        document.getElementById('shareUrl').textContent = shareData.url;

        // Configurer les boutons
        this.setupShareButtons(shareData, context);

        // Afficher la modal
        modal.style.display = 'flex';
    }

    // Configurer les boutons de partage
    setupShareButtons(shareData, context) {
        const { title, text, url } = shareData;
        const encodedTitle = encodeURIComponent(title);
        const encodedText = encodeURIComponent(text);
        const encodedUrl = encodeURIComponent(url);

        // WhatsApp
        const whatsappBtn = document.getElementById('shareWhatsApp');
        if (whatsappBtn) {
            const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
            whatsappBtn.href = whatsappUrl;
            whatsappBtn.onclick = () => this.trackShare('whatsapp', context.id || context.type);
        }

        // Facebook
        const facebookBtn = document.getElementById('shareFacebook');
        if (facebookBtn) {
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            facebookBtn.href = facebookUrl;
            facebookBtn.onclick = () => this.trackShare('facebook', context.id || context.type);
        }

        // Twitter
        const twitterBtn = document.getElementById('shareTwitter');
        if (twitterBtn) {
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
            twitterBtn.href = twitterUrl;
            twitterBtn.onclick = () => this.trackShare('twitter', context.id || context.type);
        }

        // Email
        const emailBtn = document.getElementById('shareEmail');
        if (emailBtn) {
            const emailUrl = `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`;
            emailBtn.href = emailUrl;
            emailBtn.onclick = () => this.trackShare('email', context.id || context.type);
        }

        // Copier le lien
        const copyBtn = document.getElementById('shareCopy');
        if (copyBtn) {
            copyBtn.onclick = (e) => {
                e.preventDefault();
                this.copyToClipboard(url);
                this.trackShare('copy', context.id || context.type);
            };
        }
    }

    // Copier dans le presse-papier
    async copyToClipboard(text) {
        try {
            if ('clipboard' in navigator) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback pour anciens navigateurs
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }

            this.showCopySuccess();
        } catch (error) {
            console.error('Erreur copie:', error);
            this.showCopyError();
        }
    }

    // Afficher succès de copie
    showCopySuccess() {
        const copyBtn = document.getElementById('shareCopy');
        if (copyBtn) {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copié !';
            copyBtn.style.background = 'var(--success)';

            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '';
            }, 2000);
        }
    }

    // Afficher erreur de copie
    showCopyError() {
        const copyBtn = document.getElementById('shareCopy');
        if (copyBtn) {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-times"></i> Erreur';
            copyBtn.style.background = 'var(--danger)';

            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '';
            }, 2000);
        }
    }

    // Créer la modal de partage
    createShareModal() {
        const modalHTML = `
            <div class="share-modal" id="shareModal" style="display: none;">
                <div class="share-modal-content">
                    <div class="share-header">
                        <h3>Partager ce lieu</h3>
                        <button class="share-close" id="shareClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="share-preview">
                        <h4 id="shareTitle"></h4>
                        <p id="shareText"></p>
                        <div class="share-url">
                            <code id="shareUrl"></code>
                        </div>
                    </div>

                    <div class="share-buttons">
                        <a href="#" target="_blank" class="share-btn whatsapp" id="shareWhatsApp">
                            <i class="fab fa-whatsapp"></i>
                            WhatsApp
                        </a>
                        <a href="#" target="_blank" class="share-btn facebook" id="shareFacebook">
                            <i class="fab fa-facebook"></i>
                            Facebook
                        </a>
                        <a href="#" target="_blank" class="share-btn twitter" id="shareTwitter">
                            <i class="fab fa-twitter"></i>
                            Twitter
                        </a>
                        <a href="#" class="share-btn email" id="shareEmail">
                            <i class="fas fa-envelope"></i>
                            Email
                        </a>
                        <button class="share-btn copy" id="shareCopy">
                            <i class="fas fa-copy"></i>
                            Copier le lien
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Initialiser les écouteurs d'événements
    initEventListeners() {
        // Écouter les clics sur les boutons de partage
        document.addEventListener('click', (e) => {
            const shareBtn = e.target.closest('.share-btn-poi');
            if (shareBtn) {
                e.preventDefault();
                e.stopPropagation();

                const poiId = shareBtn.dataset.poiId;
                if (poiId && window.allPois) {
                    const poi = window.allPois.find(p => p.id === poiId || p.slug === poiId);
                    if (poi) {
                        this.sharePOI(poi);
                    }
                }
            }

            // Fermer la modal
            if (e.target.closest('.share-close') || e.target.closest('.share-modal')) {
                const modal = document.getElementById('shareModal');
                if (modal && e.target === modal || e.target.closest('.share-close')) {
                    modal.style.display = 'none';
                }
            }
        });

        // Gestion des paramètres URL pour position partagée
        this.handleSharedLocation();
    }

    // Gérer une position partagée via URL
    handleSharedLocation() {
        const params = new URLSearchParams(window.location.search);
        const lat = params.get('lat');
        const lng = params.get('lng');
        const zoom = params.get('zoom');

        if (lat && lng && window.map) {
            const latNum = parseFloat(lat);
            const lngNum = parseFloat(lng);
            const zoomNum = parseInt(zoom) || 13;

            // Centrer la carte sur la position partagée
            setTimeout(() => {
                window.map.setView([latNum, lngNum], zoomNum);

                // Ajouter un marqueur temporaire
                const marker = L.marker([latNum, lngNum], {
                    icon: L.divIcon({
                        className: 'shared-location-marker',
                        html: `
                            <div class="shared-marker-content">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>Position partagée</span>
                            </div>
                        `,
                        iconSize: [120, 40],
                        iconAnchor: [60, 40]
                    })
                }).addTo(window.map);

                // Supprimer après 10 secondes
                setTimeout(() => {
                    window.map.removeLayer(marker);
                }, 10000);

                this.trackShare('received', 'shared-location');
            }, 1000);
        }
    }

    // Tracker les partages (pour analytics)
    trackShare(method, contentId) {
        console.log('Partage:', method, contentId);

        // Événement personnalisé pour analytics
        const event = new CustomEvent('lbb-share', {
            detail: { method, contentId, timestamp: new Date() }
        });
        document.dispatchEvent(event);

        // Google Analytics si disponible
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                method: method,
                content_type: 'poi',
                item_id: contentId
            });
        }
    }

    // Partager une collection de favoris
    async shareFavorites(favoriteIds) {
        if (!favoriteIds.length) return;

        const shareData = {
            title: `Mes ${favoriteIds.length} lieux favoris en Bretagne - La Belle Bretagne`,
            text: `Découvrez ma sélection de ${favoriteIds.length} lieux incontournables en Bretagne !`,
            url: `${this.baseUrl}/?favorites=${favoriteIds.join(',')}`
        };

        if (this.supportsWebShare) {
            try {
                await navigator.share(shareData);
                this.trackShare('native', 'favorites-collection');
                return true;
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Erreur Web Share:', error);
                }
            }
        }

        this.showShareModal(shareData, { type: 'favorites', ids: favoriteIds });
    }
}

// Instance globale
window.shareManager = new ShareManager();

// Export pour modules
window.LaBelleBretagne = window.LaBelleBretagne || {};
window.LaBelleBretagne.ShareManager = ShareManager;