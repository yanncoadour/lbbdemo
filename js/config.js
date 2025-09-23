/**
 * CONFIGURATION CENTRALISÉE - LA BELLE BRETAGNE
 * Configuration globale unifiée pour toute l'application
 */

window.LaBelleBretagne = window.LaBelleBretagne || {};

// Configuration principale
const CONFIG = {
    // Configuration de la carte
    map: {
        center: [48.2020, -2.9326], // Centre de la Bretagne
        zoom: 8,
        minZoom: 7,
        maxZoom: 16
    },

    // Couleurs par type de POI
    colors: {
        monument: '#ff6b35', // Orange vif pour monuments
        musee: '#a855f7', // Violet lumineux pour musées
        point_de_vue: '#10b981', // Vert émeraude pour points de vue
        plage: '#0ea5e9', // Bleu ciel pour plages
        village: '#f43f5e', // Rouge coral pour villages
        parc: '#22c55e', // Vert lime pour parcs/jardins
        randonnee: '#06d6a0', // Vert menthe pour randonnées
        chateau: '#d97706', // Orange doré pour châteaux
        festival: '#ff3b82', // Rose magenta pour festivals
        loisirs: '#6366f1', // Indigo lumineux pour activités/loisirs
        hotel: '#3b82f6', // Bleu vif pour hôtels
        villa: '#8b5cf6', // Violet clair pour villas
        logement_insolite: '#ec4899', // Rose fuchsia pour logements insolites
        camping: '#22d3ee', // Cyan lumineux pour camping
        panorama: '#f59e0b', // Jaune doré pour panoramas
        restaurant: '#ef4444' // Rouge vif pour restaurants
    },

    // Configuration du cache
    cache: {
        defaultDuration: 3600000, // 1 heure
        maxSize: 50000 // 50KB
    },

    // URLs et endpoints (si nécessaire plus tard)
    api: {
        baseUrl: '',
        endpoints: {
            pois: '/data/pois.json',
            festivals: '/data/festivals.json'
        }
    },

    // Paramètres UI
    ui: {
        debounceDelay: 300, // Délai debounce pour la recherche
        animationDuration: 300, // Durée animations
        notificationDuration: 3000 // Durée notifications
    }
};

// Ajouter timestamp pour forcer rechargement
CONFIG._timestamp = Date.now();

// Exporter globalement
window.CONFIG = CONFIG;
window.LaBelleBretagne.config = CONFIG;

// Configuration pour les modules
window.LaBelleBretagne.modules = window.LaBelleBretagne.modules || {};