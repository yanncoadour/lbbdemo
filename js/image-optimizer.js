/**
 * Optimiseur d'images - La Belle Bretagne
 * Lazy loading, compression et WebP support
 */

class ImageOptimizer {
    constructor() {
        this.observer = null;
        this.supportsWebP = false;
        this.init();
    }

    async init() {
        // Tester le support WebP
        this.supportsWebP = await this.testWebPSupport();
        console.log('WebP supporté:', this.supportsWebP);

        // Initialiser l'Intersection Observer pour lazy loading
        this.initLazyLoading();

        // Optimiser les images existantes
        this.optimizeExistingImages();
    }

    // Test du support WebP
    testWebPSupport() {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;

            canvas.toBlob((blob) => {
                resolve(blob ? blob.type === 'image/webp' : false);
            }, 'image/webp');
        });
    }

    // Initialiser le lazy loading
    initLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            // Fallback pour anciens navigateurs
            this.loadAllImages();
            return;
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px', // Charger 50px avant que l'image soit visible
            threshold: 0.1
        });

        // Observer toutes les images lazy
        this.observeImages();
    }

    // Observer les images lazy
    observeImages() {
        const lazyImages = document.querySelectorAll('img[data-src], .poi-card img, .nearby-poi-image');
        lazyImages.forEach((img) => {
            this.observer?.observe(img);
        });
    }

    // Charger une image spécifique
    async loadImage(img) {
        const src = img.dataset.src || img.src;
        if (!src) return;

        try {
            // Optimiser l'URL de l'image
            const optimizedSrc = this.getOptimizedImageUrl(src);

            // Précharger l'image
            const image = new Image();
            image.onload = () => {
                img.src = optimizedSrc;
                img.classList.add('loaded');

                // Animation d'apparition
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                requestAnimationFrame(() => {
                    img.style.opacity = '1';
                });
            };

            image.onerror = () => {
                // Fallback vers l'image originale
                img.src = src;
                img.classList.add('error');
            };

            image.src = optimizedSrc;

        } catch (error) {
            console.error('Erreur chargement image:', error);
            img.src = src; // Fallback
        }
    }

    // Obtenir l'URL d'image optimisée
    getOptimizedImageUrl(originalUrl) {
        // Si l'image est déjà optimisée, la retourner
        if (originalUrl.includes('.webp') || originalUrl.includes('?format=webp')) {
            return originalUrl;
        }

        // Stratégies d'optimisation selon la source
        if (originalUrl.includes('assets/img/')) {
            return this.optimizeLocalImage(originalUrl);
        }

        // Pour les images externes, on garde l'original
        return originalUrl;
    }

    // Optimiser les images locales
    optimizeLocalImage(url) {
        const urlParts = url.split('.');
        const extension = urlParts.pop();
        const baseName = urlParts.join('.');

        // Si WebP est supporté, essayer la version WebP
        if (this.supportsWebP) {
            return `${baseName}.webp`;
        }

        // Sinon, optimiser selon la taille d'écran
        const screenWidth = window.innerWidth;
        let sizePrefix = '';

        if (screenWidth <= 480) {
            sizePrefix = '-small';
        } else if (screenWidth <= 768) {
            sizePrefix = '-medium';
        }

        return `${baseName}${sizePrefix}.${extension}`;
    }

    // Optimiser les images existantes
    optimizeExistingImages() {
        const images = document.querySelectorAll('img:not([data-optimized])');

        images.forEach((img) => {
            // Marquer comme optimisé pour éviter les re-traitements
            img.dataset.optimized = 'true';

            // Ajouter lazy loading si pas déjà présent
            if (!img.complete && img.src) {
                const originalSrc = img.src;
                img.dataset.src = originalSrc;
                img.src = this.createPlaceholder();
                this.observer?.observe(img);
            }
        });
    }

    // Créer un placeholder
    createPlaceholder() {
        // Placeholder SVG minimaliste
        return `data:image/svg+xml;base64,${btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
                <rect width="100%" height="100%" fill="#f0f9ff"/>
                <circle cx="150" cy="100" r="20" fill="#3b82f6" opacity="0.3"/>
                <text x="150" y="130" font-family="Arial" font-size="12" fill="#64748b" text-anchor="middle">Chargement...</text>
            </svg>
        `)}`;
    }

    // Précharger les images critiques
    preloadCriticalImages(urls) {
        urls.forEach((url) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = this.getOptimizedImageUrl(url);
            document.head.appendChild(link);
        });
    }

    // Charger toutes les images (fallback)
    loadAllImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach((img) => this.loadImage(img));
    }

    // Nettoyer les observers
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    // Observer de nouvelles images ajoutées dynamiquement
    observeNewImages() {
        this.observeImages();
    }
}

// Instance globale
window.imageOptimizer = new ImageOptimizer();

// Export pour modules
window.LaBelleBretagne = window.LaBelleBretagne || {};
window.LaBelleBretagne.ImageOptimizer = ImageOptimizer;