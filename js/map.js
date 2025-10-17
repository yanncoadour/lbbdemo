/**
 * Module de gestion de la carte Leaflet
 * Fonctions liées à l'initialisation et manipulation de la carte
 */

/* global map, markersGroup, CONFIG, L, allPois, filteredPois, currentFilters */

// Variables globales pour la carte
// Note: map et markersGroup sont définis dans app.js

/**
 * Initialise la carte Leaflet
 */
function initMap() {

    try {
        // Créer la carte
        map = L.map('map', {
            center: CONFIG.map.center,
            zoom: CONFIG.map.zoom,
            minZoom: CONFIG.map.minZoom,
            maxZoom: CONFIG.map.maxZoom,
            zoomControl: false,
            attributionControl: false
        });

        // Ajouter les tuiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Créer le groupe de markers (LayerGroup simple)
        console.log('DEBUG MAP: Création markersGroup avec L.layerGroup');
        markersGroup = L.layerGroup().addTo(map);
        console.log('DEBUG MAP: markersGroup créé avec succès:', !!markersGroup);

        // Ajouter contrôle de zoom personnalisé
        L.control.zoom({
            position: 'bottomright'
        }).addTo(map);

        return true;
    } catch (error) {
        console.error('Error initializing map:', error);
        return false;
    }
}

/**
 * Calcule la distance entre deux points géographiques
 * @param {number} lat1 - Latitude du premier point
 * @param {number} lng1 - Longitude du premier point
 * @param {number} lat2 - Latitude du second point
 * @param {number} lng2 - Longitude du second point
 * @returns {number} Distance en kilomètres
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Convertit les degrés en radians
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Met en évidence les POIs proches de l'utilisateur
 */
function highlightNearbyPois(userLat, userLng, radiusKm = 10) {
    if (!markersGroup) {
        return;
    }

    markersGroup.eachLayer(function(marker) {
        const poi = marker.poi;
        if (poi) {
            const distance = calculateDistance(userLat, userLng, poi.lat, poi.lng);

            if (distance <= radiusKm) {
                // Marker proche - effet visuel
                marker.setOpacity(1);
                if (marker._icon) {
                    marker._icon.style.filter = 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))';
                    marker._icon.style.transform += ' scale(1.1)';
                }
            } else {
                // Marker éloigné - opacité réduite
                marker.setOpacity(0.6);
                if (marker._icon) {
                    marker._icon.style.filter = 'none';
                    marker._icon.style.transform = marker._icon.style.transform.replace(' scale(1.1)', '');
                }
            }
        }
    });
}

/**
 * Ajoute un marker à la carte
 */
function addMarkerToMap(poi) {
    if (!map || !markersGroup) {
        return null;
    }

    try {
        const marker = L.marker([poi.lat, poi.lng], {
            icon: createCustomIcon(poi)
        });

        marker.poi = poi;

        // Générer le contenu de la popup Leaflet directement
        const popupContent = window.createSimplePoiPopup ?
            window.createSimplePoiPopup(poi) :
            `<div><h3>${poi.title || poi.name}</h3><p>Erreur: createSimplePoiPopup non trouvée</p></div>`;

        marker.bindPopup(popupContent, {
            maxWidth: 'none', // Permettre à la popup de prendre la largeur nécessaire
            minWidth: 320,
            className: 'custom-popup',
            offset: [0, -60], // Position plus haute pour éviter le chevauchement avec la barre de recherche
            autoPan: true,
            keepInView: true,
            autoPanPadding: [20, 20], // Marge autour de la popup lors du pan automatique
            autoPanPaddingBottomRight: [20, 200] // Marge supplémentaire en bas pour éviter la barre de recherche
        });

        markersGroup.addLayer(marker);
        return marker;
    } catch (error) {
        console.error('Error adding marker:', error);
        return null;
    }
}

/**
 * Crée une icône personnalisée pour un POI
 */
function createCustomIcon(poi) {
    const category = poi.categories[0];
    const color = CONFIG.colors[category] || '#666666';

    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div class="marker-pin" style="background-color: ${color}">
                <i class="fas ${getCategoryIcon(category)}"></i>
            </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28]
    });
}

/**
 * Obtient l'icône Font Awesome pour une catégorie
 */
function getCategoryIcon(category) {
    const icons = {
        monument: 'fas fa-landmark',
        musee: 'fas fa-university',
        plage: 'fas fa-umbrella-beach',
        village: 'fas fa-home',
        chateau: 'fas fa-chess-rook',
        festival: 'fas fa-music',
        loisirs: 'fas fa-star',
        hotel: 'fas fa-bed',
        villa: 'fas fa-house-user',
        logement_insolite: 'fas fa-tree-city',
        camping: 'fas fa-campground',
        panorama: 'fas fa-eye',
        randonnee: 'fas fa-hiking',
        nature: 'fas fa-tree'
    };

    return icons[category] || 'fas fa-map-marker-alt';
}

/**
 * Nettoie tous les markers de la carte
 */
function clearMapMarkers() {
    if (markersGroup) {
        markersGroup.clearLayers();
    }
}

/**
 * Centre la carte sur un point spécifique
 */
function centerMapOn(lat, lng, zoom = 12) {
    if (map) {
        map.setView([lat, lng], zoom);
    }
}

/**
 * Obtient la carte (pour accès externe)
 */
function getMap() {
    return map;
}

/**
 * Obtient le groupe de markers (pour accès externe)
 */
function getMarkersGroup() {
    return markersGroup;
}

// Exporter les fonctions pour utilisation globale
window.MapModule = {
    initMap,
    calculateDistance,
    highlightNearbyPois,
    addMarkerToMap,
    clearMapMarkers,
    centerMapOn,
    getMap,
    getMarkersGroup
};