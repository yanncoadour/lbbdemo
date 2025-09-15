/**
 * UTILITAIRES COMMUNS - LA BELLE BRETAGNE
 * Fonctions réutilisables dans toute l'application
 */

// ===================================================================
// CONFIGURATION GLOBALE
// ===================================================================

// Configuration centralisée désormais dans config.js
window.LaBelleBretagne = window.LaBelleBretagne || {
    modules: {}
};

// ===================================================================
// UTILITAIRES DE STOCKAGE
// ===================================================================

const StorageUtils = {
    /**
     * Stockage sécurisé avec fallback
     */
    set(key, value) {
        return window.Security ?
            window.Security.secureLocalStorage(key, value) :
            this.fallbackSet(key, value);
    },

    /**
     * Lecture sécurisée avec fallback
     */
    get(key, defaultValue = null) {
        return window.Security ?
            window.Security.secureGetLocalStorage(key, defaultValue) :
            this.fallbackGet(key, defaultValue);
    },

    /**
     * Fallback pour stockage sans module sécurité
     */
    fallbackSet(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    },

    /**
     * Fallback pour lecture sans module sécurité
     */
    fallbackGet(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage read error:', error);
            return defaultValue;
        }
    },

    /**
     * Suppression d'une clé
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    }
};

// ===================================================================
// UTILITAIRES DOM
// ===================================================================

const DOM = {
    /**
     * Sélection sécurisée d'éléments
     */
    $(selector) {
        return document.querySelector(selector);
    },

    /**
     * Sélection multiple d'éléments
     */
    $$(selector) {
        return document.querySelectorAll(selector);
    },

    /**
     * Création d'élément avec attributs
     */
    create(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        });

        if (content) {
            element.textContent = content;
        }

        return element;
    },

    /**
     * Animation d'éléments
     */
    animate(element, className, duration = 300) {
        element.classList.add(className);
        setTimeout(() => {
            element.classList.remove(className);
        }, duration);
    },

    /**
     * Masquer/Afficher avec transition
     */
    toggle(element, show = null) {
        if (show === null) {
            show = element.style.display === 'none';
        }

        element.style.display = show ? 'block' : 'none';
        return show;
    }
};

// ===================================================================
// UTILITAIRES DE DONNÉES
// ===================================================================

const DataUtils = {
    /**
     * Validation et sanitisation des entrées
     */
    sanitize(input, type = 'text') {
        return window.Security ?
            window.Security.validateAndSanitize(input, type) :
            this.basicSanitize(input);
    },

    /**
     * Sanitisation basique sans module sécurité
     */
    basicSanitize(input) {
        if (typeof input !== 'string') {
            return '';
        }
        return input.replace(/[<>]/g, '').substring(0, 500).trim();
    },

    /**
     * Formatage des distances
     */
    formatDistance(distance) {
        if (distance < 1000) {
            return `${Math.round(distance)}m`;
        } else {
            return `${(distance / 1000).toFixed(1)}km`;
        }
    },

    /**
     * Génération d'ID unique
     */
    generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Debouncing pour optimiser les recherches
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// ===================================================================
// UTILITAIRES UI
// ===================================================================

const UIUtils = {
    /**
     * Affichage de notifications
     */
    showNotification(message, type = 'info', duration = 3000) {
        const notification = DOM.create('div', {
            className: `notification notification-${type}`,
            innerHTML: `
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            `
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    },

    /**
     * Icônes pour notifications
     */
    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    },

    /**
     * Création de loader
     */
    createLoader(text = 'Chargement...') {
        return DOM.create('div', {
            className: 'loading-state',
            innerHTML: `
                <i class="fas fa-spinner fa-spin"></i>
                <p>${text}</p>
            `
        });
    },

    /**
     * Gestion des états de chargement
     */
    setLoadingState(container, isLoading, loadingText = 'Chargement...') {
        if (isLoading) {
            container.innerHTML = '';
            container.appendChild(this.createLoader(loadingText));
        }
    }
};

// ===================================================================
// UTILITAIRES GÉOGRAPHIQUES
// ===================================================================

const GeoUtils = {
    /**
     * Calcul de distance entre deux points
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Rayon de la Terre en km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000; // Distance en mètres
    },

    /**
     * Conversion degrés vers radians
     */
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    },

    /**
     * Validation des coordonnées
     */
    isValidCoords(lat, lng) {
        return typeof lat === 'number' &&
               typeof lng === 'number' &&
               lat >= -90 && lat <= 90 &&
               lng >= -180 && lng <= 180;
    }
};

// ===================================================================
// GESTIONNAIRE D'ÉVÉNEMENTS
// ===================================================================

const EventManager = {
    listeners: new Map(),

    /**
     * Attacher un événement avec namespace
     */
    on(eventName, callback, namespace = 'global') {
        if (!this.listeners.has(namespace)) {
            this.listeners.set(namespace, new Map());
        }

        const namespaceListeners = this.listeners.get(namespace);
        if (!namespaceListeners.has(eventName)) {
            namespaceListeners.set(eventName, []);
        }

        namespaceListeners.get(eventName).push(callback);
    },

    /**
     * Déclencher un événement
     */
    emit(eventName, data = null, namespace = 'global') {
        const namespaceListeners = this.listeners.get(namespace);
        if (namespaceListeners && namespaceListeners.has(eventName)) {
            namespaceListeners.get(eventName).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${eventName}:`, error);
                }
            });
        }
    },

    /**
     * Supprimer les événements d'un namespace
     */
    off(namespace) {
        this.listeners.delete(namespace);
    }
};

// ===================================================================
// EXPORTATION GLOBALE
// ===================================================================

// Attacher aux modules globaux
window.LaBelleBretagne.Storage = StorageUtils;
window.LaBelleBretagne.DOM = DOM;
window.LaBelleBretagne.DataUtils = DataUtils;
window.LaBelleBretagne.UIUtils = UIUtils;
window.LaBelleBretagne.GeoUtils = GeoUtils;
window.LaBelleBretagne.EventManager = EventManager;

// Alias pour compatibilité
window.Utils = {
    Storage: StorageUtils,
    DOM,
    DataUtils,
    UIUtils,
    GeoUtils,
    EventManager
};

