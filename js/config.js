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
        monument: '#d97706', // Orange foncé pour monuments
        musee: '#8b5cf6', // Violet pour musées
        point_de_vue: '#059669', // Vert émeraude pour points de vue
        plage: '#06b6d4', // Cyan pour plages
        village: '#ef4444', // Rouge pour villages
        parc: '#22c55e', // Vert pour parcs/jardins
        randonnee: '#10b981', // Vert teal pour randonnées
        chateau: '#92400e', // Marron pour châteaux
        festival: '#f97316', // Orange vif pour festivals
        loisirs: '#6366f1', // Indigo pour activités/loisirs
        hotel: '#64748b', // Gris ardoise pour hôtels
        villa: '#94a3b8', // Gris clair pour villas
        logement_insolite: '#ec4899', // Rose pour logements insolites
        camping: '#34d399', // Vert émeraude pour camping
        restaurant: '#f59e0b' // Amber pour restaurants
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

// Exporter globalement
window.CONFIG = CONFIG;
window.LaBelleBretagne.config = CONFIG;

// Configuration pour les modules
window.LaBelleBretagne.modules = window.LaBelleBretagne.modules || {};