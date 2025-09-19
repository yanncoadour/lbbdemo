/**
 * La Belle Bretagne - Application JavaScript v2025.01.09.2
 * Gestion de la carte interactive, filtres, et favoris
 * MARKER OFFSET DISABLED - GPS EXACT COORDINATES ONLY
 */

/* global L, CONFIG, Utils, Security, createSimplePoiPopup */

// Utiliser la configuration centralisée depuis config.js

// Variables globales
let map;
let markersGroup;
let allPois = [];
let filteredPois = [];
let isFiltersOpen = false;
let loadingPois = false;

// Fix pour viewport mobile Chrome
function fixBottomNav() {
    const vh = window.innerHeight;
    document.documentElement.style.setProperty('--real-vh', `${vh}px`);
}

// Écouter les changements de taille de viewport
window.addEventListener('resize', fixBottomNav);
window.addEventListener('orientationchange', () => {
    setTimeout(fixBottomNav, 100); // Petit délai pour l'orientation
});

/**
 * Initialisation de l'application
 */
document.addEventListener('DOMContentLoaded', function() {
    fixBottomNav(); // Initialiser dès le chargement
    const mapElement = document.getElementById('map');

    if (mapElement) {
        initMap();
        initLocationButton();
        initBottomSheet();
        initBottomSheetControls();
        initFixedPopup();
        initSearchAutoComplete();
        loadPois();

        // Initialiser le module de filtres externe
        if (typeof window.FiltersModule !== 'undefined' && window.FiltersModule.initFilters) {
            window.FiltersModule.initFilters();
        }

        // Vérifier si on doit filtrer les logements depuis la page logements
        checkLogementFilter();
    } else {
        console.error('Map element not found!');

        // Si on n'est pas sur la page principale, initialiser la navigation intelligente
        initSmartNavigation();
    }
});

/**
 * Vérifie si on doit appliquer le filtre logements depuis l'URL
 * Recherche le paramètre 'filter' dans l'URL et applique le filtre correspondant
 * @function checkLogementFilter
 */
function checkLogementFilter() {
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');

    if (filter === 'logements') {

        // Attendre que les POIs soient chargés
        setTimeout(() => {
            applyLogementFilter();
        }, 500);
    }
}

/**
 * Initialise la navigation intelligente pour les pages secondaires
 */
function initSmartNavigation() {

    const backLink = document.querySelector('.back-link');
    if (!backLink) {
        return;
    }

    // Détecter la page de provenance
    const referrer = document.referrer;
    const currentUrl = window.location.href;

    let backUrl = 'index.html'; // URL par défaut

    // Si on vient de la page logements
    if (referrer.includes('logements.html')) {
        backUrl = 'logements.html';
    }
    // Si on vient de la page festivals
    else if (referrer.includes('festivals.html')) {
        backUrl = 'festivals.html';
    }
    // Si on vient de la page blog
    else if (referrer.includes('blog.html')) {
        backUrl = 'blog.html';
    }
    // Sinon, utiliser l'historique du navigateur si disponible
    else if (history.length > 1) {
        // Utiliser le bouton retour du navigateur
        backLink.addEventListener('click', (e) => {
            e.preventDefault();
            history.back();
        });
        return;
    }

    // Mettre à jour l'URL du bouton retour
    backLink.href = backUrl;
}

/**
 * Applique le filtre pour n'afficher que les logements
 * Filtre les POIs pour ne garder que ceux des catégories de logement
 * @function applyLogementFilter
 */
function applyLogementFilter() {
    if (!allPois || allPois.length === 0) {
        console.error('POIs non chargés pour appliquer le filtre logements');
        return;
    }

    // Filtrer seulement les logements
    const logementCategories = ['hotel', 'villa', 'camping', 'logement_insolite'];
    filteredPois = allPois.filter(poi =>
        poi.categories && poi.categories.some(cat => logementCategories.includes(cat))
    );


    // Mettre à jour l'affichage
    displayPois();
    updateCounter();

    // Auto-focus sur les logements filtrés
    autoFocusOnFilteredPois();

    // Nettoyer l'URL pour éviter de réappliquer le filtre
    const url = new URL(window.location);
    url.searchParams.delete('filter');
    window.history.replaceState({}, '', url);
}

/**
 * Initialise le bottom sheet expansible
 */
function initBottomSheet() {
    const bottomSheet = document.getElementById('bottomSheet');
    const handle = bottomSheet.querySelector('.handle');

    if (bottomSheet && handle) {
        handle.addEventListener('click', () => {
            bottomSheet.classList.toggle('collapsed');
        });

        // Fermer les filtres en cliquant sur la carte
        document.getElementById('map').addEventListener('click', () => {
            if (isFiltersOpen) {
                hideFixedPopup();
            }
            // Masquer les suggestions de recherche
            hideSearchSuggestions();
        });
    }
}

/**
 * Initialise l'autocomplétion de recherche
 */
function initSearchAutoComplete() {
    // Masquer l'autocomplétion quand on clique ailleurs
    document.addEventListener('click', (e) => {
        const searchField = e.target.closest('.search-field');
        if (!searchField) {
            hideSearchSuggestions();
        }
    });
}

/**
 * Initialise le bouton de géolocalisation
 */
function initLocationButton() {
    const locationBtn = document.getElementById('locationBtn');
    if (locationBtn) {
        locationBtn.addEventListener('click', () => {
            // Afficher la popup ET demander immédiatement la géolocalisation
            const popup = document.getElementById('geolocationPopup');
            if (popup) {
                popup.style.display = 'flex';
            }

            // Demander la géolocalisation IMMÉDIATEMENT
            if (navigator.geolocation) {
                locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // Succès - fermer la popup
                        popup.style.display = 'none';
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        console.log('Geolocation success!', lat, lng);

                        // Code existant pour la carte...
                        const radiusInDegrees = 25 / 111;
                        const bounds = [
                            [lat - radiusInDegrees, lng - radiusInDegrees],
                            [lat + radiusInDegrees, lng + radiusInDegrees]
                        ];

                        map.flyToBounds(bounds, {
                            animate: true,
                            duration: 1.5,
                            padding: [20, 20],
                            maxZoom: 12
                        });

                        const userMarker = L.marker([lat, lng], {
                            icon: L.divIcon({
                                className: 'user-location-marker',
                                html: `
                                    <div class="user-location-pulse">
                                        <div class="user-location-dot">
                                            <i class="fas fa-crosshairs"></i>
                                        </div>
                                    </div>
                                `,
                                iconSize: [40, 40],
                                iconAnchor: [20, 20]
                            })
                        }).addTo(map);

                        try {
                            highlightNearbyPois(lat, lng, 50);
                        } catch (error) {
                            console.error('Error calling highlightNearbyPois:', error);
                        }

                        setTimeout(() => map.removeLayer(userMarker), 5000);
                        locationBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
                    },
                    (error) => {
                        // Erreur - garder la popup ouverte pour expliquer
                        console.error('Erreur de géolocalisation:', error);
                        locationBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
                        // La popup reste ouverte pour aider l'utilisateur
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
                );
            }
        });

        // Gestionnaire pour le bouton "Autoriser" dans la popup
        const btnAllow = document.getElementById('btnAllowGeolocation');
        const btnCancel = document.getElementById('btnCancelGeolocation');
        const popup = document.getElementById('geolocationPopup');

        if (btnAllow) {
            btnAllow.addEventListener('click', () => {
                if (navigator.geolocation) {
                    // Fermer la popup
                    popup.style.display = 'none';
                    locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

                    navigator.geolocation.getCurrentPosition(
                    (position) => {
                        console.log('Geolocation success!', position);
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        console.log('User coordinates:', lat, lng);

                        // Calculer un rayon de 25km autour de la position pour un zoom plus serré
                        // 1 degré ≈ 111km, donc 25km ≈ 0.225 degrés
                        const radiusInDegrees = 25 / 111;

                        const bounds = [
                            [lat - radiusInDegrees, lng - radiusInDegrees], // Sud-ouest
                            [lat + radiusInDegrees, lng + radiusInDegrees] // Nord-est
                        ];

                        // Zoomer sur la zone avec un rayon plus serré
                        map.flyToBounds(bounds, {
                            animate: true,
                            duration: 1.5,
                            padding: [20, 20],
                            maxZoom: 12
                        });

                        // Ajouter un marqueur temporaire avec icône de position plus visible
                        const userMarker = L.marker([lat, lng], {
                            icon: L.divIcon({
                                className: 'user-location-marker',
                                html: `
                                    <div class="user-location-pulse">
                                        <div class="user-location-dot">
                                            <i class="fas fa-crosshairs"></i>
                                        </div>
                                    </div>
                                `,
                                iconSize: [40, 40],
                                iconAnchor: [20, 20]
                            })
                        }).addTo(map);

                        // Afficher les POIs proches
                        console.log('About to call highlightNearbyPois...');
                        console.log('Function exists?', typeof highlightNearbyPois);
                        console.log('allPois exists?', typeof allPois);
                        console.log('allPois value:', allPois);
                        
                        try {
                            // Test direct inline au lieu d'appeler la fonction
                            console.log('Testing inline logic...');
                            const nearbyPois = allPois.filter(poi => {
                                if (!poi.lat || !poi.lng) return false;
                                const R = 6371; // Rayon de la Terre en km
                                const dLat = (lat - poi.lat) * Math.PI / 180;
                                const dLng = (lng - poi.lng) * Math.PI / 180;
                                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                          Math.cos(poi.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
                                          Math.sin(dLng / 2) * Math.sin(dLng / 2);
                                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                const distance = R * c;
                                return distance <= 50;
                            });
                            
                            console.log('Found nearby POIs inline:', nearbyPois.length);
                            
                            if (nearbyPois.length > 0) {
                                console.log('Attempting to show carousel...');
                                
                                // Ajouter la distance à chaque POI et trier
                                nearbyPois.forEach(poi => {
                                    const R = 6371; // Rayon de la Terre en km
                                    const dLat = (lat - poi.lat) * Math.PI / 180;
                                    const dLng = (lng - poi.lng) * Math.PI / 180;
                                    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                              Math.cos(poi.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
                                              Math.sin(dLng / 2) * Math.sin(dLng / 2);
                                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                    poi.distance = R * c;
                                });
                                
                                // Trier par distance et limiter à 10
                                nearbyPois.sort((a, b) => a.distance - b.distance);
                                const limitedPois = nearbyPois.slice(0, 10);
                                
                                // Générer les vraies cartes POI
                                const nearbySection = document.getElementById('nearbyLocationSection');
                                const nearbyCarousel = document.getElementById('nearbyLocationCarousel');
                                
                                console.log('Elements found:', {
                                    section: !!nearbySection,
                                    carousel: !!nearbyCarousel
                                });
                                
                                if (nearbySection && nearbyCarousel) {
                                    // Créer les cartes HTML
                                    const cardsHTML = limitedPois.map(poi => {
                                        const categoryName = getCategoryName(poi.categories[0]);
                                        const distanceText = poi.distance < 1 ?
                                            `${Math.round(poi.distance * 1000)}m` :
                                            `${Math.round(poi.distance)}km`;

                                        return `
                                            <div class="nearby-poi-card" onclick="window.location.href='poi.html?slug=${poi.slug}'">
                                                <img src="${poi.image}" alt="${poi.title}" class="nearby-poi-image" 
                                                     onerror="this.src='assets/img/placeholder.jpg'">
                                                <div class="nearby-poi-content">
                                                    <div class="nearby-poi-meta">
                                                        <span class="nearby-poi-department">${poi.department}</span>
                                                        <span class="nearby-poi-distance">${distanceText}</span>
                                                    </div>
                                                    <span class="nearby-poi-category category-${poi.categories[0]}">
                                                        <i class="${getPoiIcon(poi.categories[0])}"></i>
                                                        ${categoryName}
                                                    </span>
                                                    <h3 class="nearby-poi-title">${poi.title}</h3>
                                                    <p class="nearby-poi-description">${poi.shortDescription}</p>
                                                </div>
                                            </div>
                                        `;
                                    }).join('');
                                    
                                    nearbyCarousel.innerHTML = cardsHTML;
                                    nearbySection.style.display = 'block';
                                    
                                    // Initialiser les contrôles du carrousel
                                    initNearbyLocationCarousel();
                                    
                                    // Mettre à jour le compteur d'indicateur
                                    updateIndicatorCount(limitedPois.length);
                                    
                                    // Afficher les contrôles de géolocalisation
                                    showGeolocationControls();
                                    
                                    // Ouvrir la bottom sheet
                                    const bottomSheet = document.getElementById('bottomSheet');
                                    if (bottomSheet) {
                                        bottomSheet.classList.add('open');
                                        console.log('Bottom sheet opened');
                                    }
                                    
                                    console.log('Carousel displayed with', limitedPois.length, 'real POI cards');
                                }
                            }
                            
                            // Appeler la vraie fonction aussi
                            highlightNearbyPois(lat, lng, 50);
                            console.log('highlightNearbyPois call completed');
                        } catch (error) {
                            console.error('Error calling highlightNearbyPois:', error);
                        }

                        setTimeout(() => map.removeLayer(userMarker), 5000);
                        locationBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
                    },
                    (error) => {
                        console.error('Erreur de géolocalisation:', error);
                        locationBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';

                        let message = '';
                        let showRetry = false;

                        switch(error.code) {
                            case error.PERMISSION_DENIED:
                                message = 'Accès à la géolocalisation refusé.\n\nPour utiliser cette fonctionnalité :\n1. Cliquez sur l\'icône 🔒 dans la barre d\'adresse\n2. Autorisez la géolocalisation\n3. Rechargez la page';
                                break;
                            case error.POSITION_UNAVAILABLE:
                                message = 'Position GPS non disponible.\n\nVérifiez que :\n• Votre GPS est activé\n• Vous êtes en extérieur\n• La connexion est stable';
                                showRetry = true;
                                break;
                            case error.TIMEOUT:
                                message = 'Délai de géolocalisation dépassé.\n\nEssayez de :\n• Vous déplacer vers l\'extérieur\n• Vérifier votre connexion';
                                showRetry = true;
                                break;
                            default:
                                message = 'Erreur de géolocalisation.\n\nVérifiez vos paramètres de localisation.';
                                showRetry = true;
                        }

                        if (showRetry) {
                            if (confirm(message + '\n\nVoulez-vous réessayer ?')) {
                                setTimeout(() => locationBtn.click(), 500);
                            }
                        } else {
                            alert(message);
                        }
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
                }
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', () => {
                popup.style.display = 'none';
            });
        }
    }
}

/**
 * Met en évidence les POIs proches de la position utilisateur
 */
function highlightNearbyPois(userLat, userLng, radiusKm) {
    console.log('highlightNearbyPois called with:', userLat, userLng, radiusKm);
    console.log('allPois length:', allPois ? allPois.length : 'allPois is null/undefined');
    
    if (!allPois || allPois.length === 0) {
        console.log('No POIs available, trying to load them...');
        // Essayer de charger les POIs si pas encore fait
        if (typeof loadPois === 'function') {
            loadPois().then(() => {
                console.log('POIs loaded, retrying...');
                highlightNearbyPois(userLat, userLng, radiusKm);
            });
        }
        return;
    }

    // Utiliser une fonction de calcul de distance simple si Utils n'est pas disponible
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        if (Utils && Utils.GeoUtils && Utils.GeoUtils.calculateDistance) {
            return Utils.GeoUtils.calculateDistance(lat1, lng1, lat2, lng2);
        } else {
            // Calcul de distance de fallback
            const R = 6371000; // Rayon de la Terre en mètres
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLng = (lng2 - lng1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance en mètres
        }
    };

    // Calculer les POIs dans le rayon
    const nearbyPois = allPois.filter(poi => {
        if (!poi.lat || !poi.lng) return false;
        const distance = calculateDistance(userLat, userLng, poi.lat, poi.lng) / 1000; // Convert to km
        return distance <= radiusKm;
    });

    console.log('Found nearby POIs:', nearbyPois.length);

    if (nearbyPois.length > 0) {
        // Ajouter la distance à chaque POI pour l'affichage
        nearbyPois.forEach(poi => {
            poi.distance = calculateDistance(userLat, userLng, poi.lat, poi.lng) / 1000;
        });

        // Trier par distance
        nearbyPois.sort((a, b) => a.distance - b.distance);

        console.log('Calling displayNearbyLocationCarousel with', nearbyPois.length, 'POIs');
        // Afficher le carrousel des lieux proches
        displayNearbyLocationCarousel(nearbyPois);

        // Filtrer pour afficher seulement les POIs proches
        filteredPois = nearbyPois;
        displayPois();
        updateCounter();
    } else {
        console.log('No POIs found within', radiusKm, 'km radius');
    }
}

// Fonction calculateDistance désormais disponible via Utils.GeoUtils.calculateDistance

/**
 * Initialise la carte Leaflet avec les couches et contrôles
 * Configure la carte principale de l'application avec tiles OSM et satellite
 * @function initMap
 * @returns {void}
 */
function initMap() {
    try {
        const mapElement = document.getElementById('map');

        map = L.map('map', {
            preferCanvas: false,
            attributionControl: true,
            zoomControl: true
        }).setView(CONFIG.map.center, CONFIG.map.zoom);


        // Couches de cartes
        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: CONFIG.map.minZoom,
            maxZoom: CONFIG.map.maxZoom
        });

        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, DigitalGlobe, GeoEye, i-cubed, USDA FSA, USGS, AeroGRID, IGN, IGP, and the GIS User Community',
            minZoom: CONFIG.map.minZoom,
            maxZoom: 18
        });

        // Ajouter la couche par défaut
        osmLayer.addTo(map);

        // Bouton de basculement de couche personnalisé
        let currentLayer = 'osm';

        // Créer le bouton après que la carte soit initialisée
        setTimeout(() => {
            const mapTypeControl = L.control({ position: 'topleft' });
            mapTypeControl.onAdd = function(map) {
                const div = L.DomUtil.create('div', 'map-type-control');
                if (window.Security && window.Security.safeSetInnerHTML) {
                    window.Security.safeSetInnerHTML(div, `
                        <button class="map-type-btn" id="mapTypeBtn" title="Changer de vue">
                            <i class="fas fa-map"></i>
                        </button>
                    `);
                } else {
                    div.innerHTML = `
                        <button class="map-type-btn" id="mapTypeBtn" title="Changer de vue">
                            <i class="fas fa-map"></i>
                        </button>
                    `;
                }

                // Empêcher les événements de se propager à la carte
                L.DomEvent.disableClickPropagation(div);
                L.DomEvent.on(div, 'click', function(e) {
                    e.stopPropagation();
                });

                return div;
            };
            mapTypeControl.addTo(map);

            // Gérer le clic sur le bouton
            setTimeout(() => {
                const mapTypeBtn = document.getElementById('mapTypeBtn');

                if (mapTypeBtn) {
                    mapTypeBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (currentLayer === 'osm') {
                            map.removeLayer(osmLayer);
                            map.addLayer(satelliteLayer);
                            mapTypeBtn.innerHTML = '<i class="fas fa-map"></i>';
                            mapTypeBtn.title = 'Changer de vue';
                            currentLayer = 'satellite';
                        } else {
                            map.removeLayer(satelliteLayer);
                            map.addLayer(osmLayer);
                            mapTypeBtn.innerHTML = '<i class="fas fa-map"></i>';
                            mapTypeBtn.title = 'Changer de vue';
                            currentLayer = 'osm';
                        }
                    });
                } else {
                    console.error('❌ Bouton de type de carte non trouvé');
                }
            }, 200);
        }, 500);


        // Forcer le redimensionnement de la carte
        setTimeout(() => {
            map.invalidateSize();
        }, 100);

        // Groupe de marqueurs avec gestion des superpositions
        markersGroup = L.layerGroup().addTo(map);

        // Ajuster la vue sur la Bretagne
        // Zoom automatique sera fait après le chargement des POIs
        console.log('🗺️ Carte initialisée avec zoom:', CONFIG.map.zoom, 'centre:', CONFIG.map.center);

        // Optimisation : précharger les tuiles
        map.on('load', () => {
        });

    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la carte:', error);
    }
}

/**
 * Centre la carte sur un POI spécifique en prenant en compte la hauteur de la vignette
 */
function centerMapOnPOI(poi) {
    if (map && poi.lat && poi.lng) {
        // Détection mobile pour ajuster les dimensions
        const isMobile = window.innerWidth <= 480;
        const zoomLevel = isMobile ? 11 : 12;

        // Centrer la carte 5km plus bas que le POI
        // 1 degré de latitude ≈ 111 km, donc 5km ≈ 0.045 degrés
        const latOffset = 5 / 111; // 5km convertis en degrés de latitude
        const adjustedLat = poi.lat - latOffset; // Position 5km au sud du POI

        // Zoomer sur cette position ajustée
        map.flyTo([adjustedLat, poi.lng], zoomLevel, {
            animate: true,
            duration: 1.2,
            easeLinearity: 0.1
        });
    }
}


/**
 * Variables pour l'autocomplétion
 */
let currentSuggestionIndex = -1;
let currentSuggestions = [];

/**
 * Affiche l'autocomplétion inline
 */
function showSearchSuggestions(query) {
    if (!allPois || allPois.length === 0) {
        return;
    }

    const autocompleteInput = document.getElementById('searchAutocomplete');
    if (!autocompleteInput) {
        return;
    }

    // Générer les suggestions
    const suggestions = generateSuggestions(query);
    currentSuggestions = suggestions;
    currentSuggestionIndex = -1;

    if (suggestions.length === 0) {
        hideSearchSuggestions();
        return;
    }

    // Afficher la première suggestion dans le champ d'autocomplétion
    const firstSuggestion = suggestions[0];
    const suggestionText = firstSuggestion.text;

    // Afficher seulement la partie qui complète la recherche
    if (suggestionText.toLowerCase().startsWith(query.toLowerCase())) {
        const completionText = query + suggestionText.slice(query.length);
        autocompleteInput.value = completionText;
    } else {
        autocompleteInput.value = '';
    }
}

/**
 * Masque l'autocomplétion
 */
function hideSearchSuggestions() {
    const autocompleteInput = document.getElementById('searchAutocomplete');
    if (autocompleteInput) {
        autocompleteInput.value = '';
        currentSuggestions = [];
        currentSuggestionIndex = -1;
    }
}

/**
 * Génère les suggestions basées sur la requête
 */
function generateSuggestions(query) {
    const suggestions = [];
    const maxSuggestions = 8;

    // Fonction pour vérifier si un mot de la requête est dans le titre
    const hasWordMatch = (title, query) => {
        const titleWords = title.toLowerCase().split(/\s+/);
        const queryWords = query.toLowerCase().split(/\s+/);
        return queryWords.some(queryWord =>
            titleWords.some(titleWord =>
                titleWord.startsWith(queryWord) || titleWord.includes(queryWord)
            )
        );
    };

    // Recherche exacte d'abord (priorité haute)
    const exactTitleMatches = allPois.filter(poi =>
        poi.title.toLowerCase().startsWith(query)
    ).slice(0, 3);

    exactTitleMatches.forEach(poi => {
        suggestions.push({
            text: poi.title,
            value: poi.title,
            category: getCategoryName(poi.categories[0]),
            icon: getPoiIcon(poi.categories[0]),
            priority: 1
        });
    });

    // Recherche par mots dans les titres (ex: "vieilles" trouve "Festival des Vieilles Charrues")
    const wordMatches = allPois.filter(poi =>
        hasWordMatch(poi.title, query) &&
        !poi.title.toLowerCase().startsWith(query)
    ).slice(0, 4);

    wordMatches.forEach(poi => {
        suggestions.push({
            text: poi.title,
            value: poi.title,
            category: getCategoryName(poi.categories[0]),
            icon: getPoiIcon(poi.categories[0]),
            priority: 2
        });
    });

    // Recherche partielle dans les titres (contient la chaîne complète)
    const partialTitleMatches = allPois.filter(poi =>
        poi.title.toLowerCase().includes(query) &&
        !poi.title.toLowerCase().startsWith(query) &&
        !hasWordMatch(poi.title, query)
    ).slice(0, 2);

    partialTitleMatches.forEach(poi => {
        suggestions.push({
            text: poi.title,
            value: poi.title,
            category: getCategoryName(poi.categories[0]),
            icon: getPoiIcon(poi.categories[0]),
            priority: 3
        });
    });

    // Recherche dans les descriptions et tags
    const descriptionMatches = allPois.filter(poi =>
        (poi.shortDescription.toLowerCase().includes(query) ||
         (poi.tags && poi.tags.some(tag => tag.toLowerCase().includes(query)))) &&
        !poi.title.toLowerCase().includes(query) &&
        !hasWordMatch(poi.title, query)
    ).slice(0, 1);

    descriptionMatches.forEach(poi => {
        suggestions.push({
            text: poi.title,
            value: poi.title,
            category: getCategoryName(poi.categories[0]),
            icon: getPoiIcon(poi.categories[0]),
            priority: 4
        });
    });

    // Suggestions basées sur les départements
    const departments = ['Finistère', 'Ille-et-Vilaine', 'Loire-Atlantique', 'Morbihan', 'Côtes-d\'Armor'];
    departments.forEach(dept => {
        if (dept.toLowerCase().includes(query) && suggestions.length < maxSuggestions) {
            suggestions.push({
                text: dept,
                value: dept,
                category: 'Département',
                icon: 'fas fa-map-marker-alt',
                priority: 5
            });
        }
    });

    // Suggestions basées sur les catégories
    const categoryNames = {
        monument: 'Monuments', musee: 'Musées', point_de_vue: 'Points de vue',
        plage: 'Plages', village: 'Villages', parc: 'Parcs / Jardins',
        randonnee: 'Randonnées', chateau: 'Châteaux', festival: 'Festivals',
        loisirs: 'Activités / Loisirs', hotel: 'Hôtels', villa: 'Villas',
        logement_insolite: 'Logements insolites', camping: 'Campings',
        restaurant: 'Restaurants'
    };

    Object.entries(categoryNames).forEach(([key, name]) => {
        if (name.toLowerCase().includes(query) && suggestions.length < maxSuggestions) {
            suggestions.push({
                text: name,
                value: name,
                category: 'Catégorie',
                icon: getPoiIcon(key),
                priority: 6
            });
        }
    });

    // Trier par priorité puis par ordre alphabétique
    return suggestions
        .sort((a, b) => {
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }
            return a.text.localeCompare(b.text);
        })
        .slice(0, maxSuggestions);
}

/**
 * Gère la navigation clavier pour l'autocomplétion inline
 */
function handleSearchKeyboard(e) {
    const searchInput = document.getElementById('searchInput');
    const autocompleteInput = document.getElementById('searchAutocomplete');

    if (!searchInput || !autocompleteInput) {
        return;
    }

    switch (e.key) {
    case 'Tab':
    case 'ArrowRight':
        // Accepter la suggestion d'autocomplétion
        if (autocompleteInput.value && autocompleteInput.value !== searchInput.value) {
            e.preventDefault();
            selectSuggestion(autocompleteInput.value);
        }
        break;
    case 'ArrowDown':
        // Naviguer vers la suggestion suivante
        if (currentSuggestions.length > 0) {
            e.preventDefault();
            currentSuggestionIndex = Math.min(currentSuggestionIndex + 1, currentSuggestions.length - 1);
            updateAutocompleteDisplay();
        }
        break;
    case 'ArrowUp':
        // Naviguer vers la suggestion précédente
        if (currentSuggestions.length > 0) {
            e.preventDefault();
            currentSuggestionIndex = Math.max(currentSuggestionIndex - 1, -1);
            updateAutocompleteDisplay();
        }
        break;
    case 'Enter':
        // Accepter la suggestion courante ou afficher le lieu directement
        e.preventDefault();
        if (autocompleteInput.value) {
            selectSuggestion(autocompleteInput.value);
            // Vérifier si c'est un lieu exact et l'afficher
            checkAndShowExactMatch(autocompleteInput.value);
        } else {
            // Vérifier si la recherche correspond à un lieu exact
            checkAndShowExactMatch(searchInput.value);
            applyFilters();
        }
        break;
    case 'Escape':
        hideSearchSuggestions();
        break;
    }
}

/**
 * Met à jour l'affichage de l'autocomplétion selon l'index sélectionné
 */
function updateAutocompleteDisplay() {
    const searchInput = document.getElementById('searchInput');
    const autocompleteInput = document.getElementById('searchAutocomplete');

    if (!searchInput || !autocompleteInput || !currentSuggestions.length) {
        return;
    }

    const query = searchInput.value.toLowerCase();

    if (currentSuggestionIndex >= 0 && currentSuggestions[currentSuggestionIndex]) {
        const suggestion = currentSuggestions[currentSuggestionIndex];
        if (suggestion.text.toLowerCase().startsWith(query)) {
            const completionText = searchInput.value + suggestion.text.slice(query.length);
            autocompleteInput.value = completionText;
        } else {
            autocompleteInput.value = suggestion.text;
        }
    } else {
        // Revenir à la première suggestion
        const firstSuggestion = currentSuggestions[0];
        if (firstSuggestion.text.toLowerCase().startsWith(query)) {
            const completionText = searchInput.value + firstSuggestion.text.slice(query.length);
            autocompleteInput.value = completionText;
        } else {
            autocompleteInput.value = '';
        }
    }
}

/**
 * Sélectionne une suggestion
 */
function selectSuggestion(value) {
    const searchInput = document.getElementById('searchInput');
    const autocompleteInput = document.getElementById('searchAutocomplete');

    if (searchInput) {
        searchInput.value = value;
        if (autocompleteInput) {
            autocompleteInput.value = '';
        }
        hideSearchSuggestions();
        applyFilters();
        searchInput.focus();

        // Vérifier si c'est un lieu exact et l'afficher
        checkAndShowExactMatch(value);
    }
}

/**
 * Vérifie si la recherche correspond exactement à un lieu et l'affiche
 */
function checkAndShowExactMatch(searchValue) {
    if (!searchValue || !allPois) {
        return;
    }

    const exactMatch = allPois.find(poi =>
        poi.title.toLowerCase() === searchValue.toLowerCase().trim()
    );

    if (exactMatch) {
        // Attendre un peu pour que les filtres soient appliqués
        setTimeout(() => {
            // Centrer la carte sur le POI
            centerMapOnPOI(exactMatch);
            // Afficher la popup du POI
            showFixedPopup(exactMatch);
        }, 300);
    }
}

/**
 * Charge les données des POIs
 */
async function loadPois() {
    try {

        const response = await fetch(`data/pois.json?v=${Date.now()}&mobile=${Math.random()}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        allPois = data.pois || [];


        // Filtrer immédiatement pour ne garder que les POIs essentiels au premier chargement
        filteredPois = [...allPois];

        // Afficher les POIs avec un petit délai pour laisser la carte se charger
        setTimeout(() => {
            displayPois();
            updateCounter();
        }, 100);

    } catch (error) {
        console.error('Erreur lors du chargement des POIs:', error);
        showError('Impossible de charger les données');
    }
}

/**
 * Affiche les POIs sur la carte et dans les cartes
 */
function displayPois() {
    if (loadingPois) {
        return;
    } // Éviter les appels multiples
    loadingPois = true;


    if (!map || !markersGroup) {
        console.error('Carte ou groupe de marqueurs non initialisé !');
        loadingPois = false;
        return;
    }

    // Utiliser requestAnimationFrame pour ne pas bloquer l'interface
    requestAnimationFrame(() => {
        try {
            markersGroup.clearLayers();

            // Afficher les marqueurs par petits groupes pour éviter le blocage
            displayMarkersInBatches(filteredPois);

            // Afficher dans les cartes (toujours tous les POIs filtrés)
            displayPoiCards();

            // Ajuster automatiquement le zoom pour voir tous les POIs
            setTimeout(() => {
                fitMapToAllPois();
            }, 500); // Attendre que tous les marqueurs soient ajoutés

        } catch (error) {
            console.error('Erreur lors de l\'affichage des POIs:', error);
        } finally {
            loadingPois = false;
        }
    });
}

/**
 * Affiche les marqueurs par lots pour éviter le blocage de l'interface
 */
function displayMarkersInBatches(pois, batchSize = 25) {
    if (pois.length === 0) {
        return;
    }

    const batch = pois.slice(0, batchSize);
    const remaining = pois.slice(batchSize);

    // Ajouter le lot actuel
    batch.forEach((poi, index) => {
        const marker = createMarker(poi);
        markersGroup.addLayer(marker);
    });

    // Programmer le lot suivant si nécessaire
    if (remaining.length > 0) {
        setTimeout(() => displayMarkersInBatches(remaining, batchSize), 50); // Plus lent mais plus stable
    } else {
    }
}



/**
 * Applique un décalage automatique aux marqueurs trop proches pour éviter la superposition
 */
function applyMarkerOffset_DISABLED_OLD(pois, threshold = 0.005) {
    const offsetPois = pois.map(poi => ({ ...poi })); // Copie profonde
    const processed = new Set();

    pois.forEach((poi, index) => {
        if (processed.has(index)) {
            return;
        }

        // Chercher les POIs proches de celui-ci
        const nearbyIndices = [index];
        processed.add(index);

        pois.forEach((otherPoi, otherIndex) => {
            if (otherIndex === index || processed.has(otherIndex)) {
                return;
            }

            const distance = Math.sqrt(
                Math.pow(poi.lat - otherPoi.lat, 2) +
                Math.pow(poi.lng - otherPoi.lng, 2)
            );

            if (distance < threshold) {
                nearbyIndices.push(otherIndex);
                processed.add(otherIndex);
            }
        });

        // Si plusieurs marqueurs sont proches, les décaler en spiral
        if (nearbyIndices.length > 1) {
            nearbyIndices.forEach((poiIndex, spiralIndex) => {
                if (spiralIndex === 0) {
                    return;
                } // Le premier reste à sa position originale

                // Calculer la position en spiral avec des décalages plus petits
                const angle = (spiralIndex * 1.57) % (2 * Math.PI); // 90 degrés entre chaque point
                const radius = 0.002 + (Math.floor(spiralIndex / 4) * 0.001); // Décalage plus petit

                // Appliquer le décalage
                offsetPois[poiIndex].lat = poi.lat + Math.cos(angle) * radius;
                offsetPois[poiIndex].lng = poi.lng + Math.sin(angle) * radius;
            });
        }
    });

    return offsetPois;
}

/**
 * Crée un marqueur personnalisé pour un POI avec icône de catégorie
 */
function createMarker(poi) {
    const iconClass = getPoiIcon(poi.categories[0]);

    // Créer une icône personnalisée avec l'icône de la catégorie
    const customIcon = L.divIcon({
        className: 'custom-poi-marker',
        html: `<div class="poi-marker-content" data-category="${poi.categories[0]}">
                   <i class="${iconClass}"></i>
               </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
    });

    const marker = L.marker([poi.lat, poi.lng], {
        icon: customIcon
    });

    // Clic pour ouvrir la popup fixe ET centrer la carte
    marker.on('click', function() {
        showFixedPopup(poi);
        centerMapOnPOI(poi);
    });

    return marker;
}

/**
 * Crée le contenu HTML d'une popup moderne
 */
function createPopupContent(poi) {
    const favorites = getFavorites();
    const isFavorite = favorites.includes(poi.id);
    const categoryName = getCategoryName(poi.categories[0]);

    // Déterminer l'article correct (le/la)
    const article = getArticleForCategory(poi.categories[0]);

    return `
        <div class="popup-simple">
            <div class="popup-header-simple">
                <h3 class="popup-title-simple">${poi.title}</h3>
            </div>
            
            <div class="popup-image-simple">
                ${poi.images && poi.images.length > 1 ? `
                    <div class="popup-image-gallery">
                        ${poi.images.map((img, index) => `
                            <img src="${img}" alt="${poi.title} - Photo ${index + 1}" 
                                 class="gallery-image ${index === 0 ? 'active' : ''}"
                                 data-position="${index === 0 ? 'center-top-soft' : 'center'}"
                                 onerror="this.src='assets/img/placeholder.jpg'">
                        `).join('')}
                        <div class="gallery-dots">
                            ${poi.images.map((_, index) => `
                                <span class="gallery-dot ${index === 0 ? 'active' : ''}" onclick="showGalleryImage(${index})"></span>
                            `).join('')}
                        </div>
                    </div>
                ` : `
                    <img src="${poi.image}" alt="${poi.title}" 
                         onerror="this.src='assets/img/placeholder.jpg'">
                `}
            </div>
            
            <p class="popup-description-simple">${poi.shortDescription}</p>
            
            <div class="popup-action-simple">
                ${(poi.id === 'vallee-de-pratmeur' || poi.id === 'agapa-hotel-perros-guirec' || poi.id === 'villa-blockhaus-audrey' || poi.id === 'grand-hotel-barriere-dinard' || poi.id === 'sandaya-camping-carnac' || poi.id === 'hotel-castelbrac-dinard-v3' || poi.id === 'balthazar-hotel-spa-rennes' || poi.id === 'grand-hotel-thermes-saint-malo' || poi.id === 'chateau-apigne-le-rheu' || poi.id === 'domaine-locguenole-spa-kervignac' || poi.id === 'domaine-bretesche-golf-spa-missillac' || poi.id === 'miramar-la-cigale-arzon' || poi.id === 'sofitel-quiberon-thalassa-sea-spa' || poi.id === 'hotel-barriere-hermitage-la-baule' || poi.id === 'hotel-barriere-royal-thalasso-la-baule' || poi.id === 'hotel-castel-marie-louise-la-baule' || poi.id === 'chateau-maubreuil-carquefou' || poi.id === 'hotel-de-carantec' || poi.id === 'dihan-evasion-ploemel' || poi.id === 'domaine-des-ormes' || poi.id === 'domaine-de-meros' || poi.id === 'villa-lily-spa' || poi.id === '5-etoiles-hebergement-insolite-luxe' || poi.id === 'domaine-du-treuscoat' || poi.id === 'les-cabanes-de-koaddour' || poi.id === 'nuances-dalcoves') ? `
                    <div class="popup-actions-grid">
                        <a href="poi.html?slug=${poi.slug || poi.id}" class="discover-btn-simple secondary">
                            Découvrir
                        </a>
                        <button class="reserve-btn-simple" onclick="handleReservation('${poi.website}', '${poi.title}')">
                            Réserver
                        </button>
                    </div>
                ` : `
                    <a href="poi.html?slug=${poi.slug || poi.id}" class="discover-btn-simple">
                        Découvrir ${article} ${categoryName}
                    </a>
                `}
            </div>
        </div>
    `;
}

// Rendre la fonction globale pour map.js
window.createSimplePoiPopup = createPopupContent;

/**
 * Affiche la popup d'un POI
 * @param {Object} poi - Le POI à afficher
 */
function showPoiPopup(poi) {
    console.log('🎯 showPoiPopup appelée !', poi);
    alert(`showPoiPopup appelée pour: ${poi ? poi.title || poi.name : 'POI inconnu'}`);

    if (!poi) {
        console.error('POI manquant pour showPoiPopup');
        return;
    }

    // Vérifier que le POI a un slug, sinon le générer
    if (!poi.slug && poi.name) {
        poi.slug = poi.name
            .toLowerCase()
            .replace(/[àáâäãåą]/g, 'a')
            .replace(/[èéêëę]/g, 'e')
            .replace(/[ìíîïį]/g, 'i')
            .replace(/[òóôöõø]/g, 'o')
            .replace(/[ùúûüų]/g, 'u')
            .replace(/[ç]/g, 'c')
            .replace(/[ñ]/g, 'n')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    // Créer le contenu de la popup
    const popupContent = createSimplePoiPopup ? createSimplePoiPopup(poi) : `<h3>${poi.title || poi.nom}</h3><p>${poi.description || ''}</p>`;
    console.log('Popup content generated for:', poi.title || poi.name);
    console.log('POI data:', { id: poi.id, slug: poi.slug, title: poi.title, name: poi.name });

    // Afficher dans le popup fixe
    const fixedPopup = document.getElementById('fixedPopup');
    const fixedPopupContent = document.getElementById('fixedPopupContent');

    if (fixedPopup && fixedPopupContent) {
        if (window.Security && window.Security.safeSetInnerHTML) {
            window.Security.safeSetInnerHTML(fixedPopupContent, popupContent);
        } else {
            fixedPopupContent.innerHTML = popupContent;
        }

        // Afficher la popup
        fixedPopup.classList.add('open');
        document.body.classList.add('no-scroll');

        // Logger l'ouverture de la popup
        if (window.loggers) {
            window.loggers.ui.info(`POI popup opened: ${poi.name}`, { poiId: poi.id });
        }
    } else {
        console.error('Elements popup fixes non trouvés');
    }
}

/**
 * Gère les clics sur le bouton Réserver
 * @param {string} website - URL du site web
 * @param {string} title - Nom du POI
 */
function handleReservation(website, title) {
    // Logger l'action
    if (window.loggers) {
        window.loggers.ui.info(`Reservation attempt: ${title}`, { website });
    }

    // Vérifier que l'URL existe et est valide
    if (!website || website === 'undefined' || website === '') {
        console.warn('Pas de site web disponible pour ce POI:', title);

        // Afficher une notification à l'utilisateur
        if (window.UIUtils && window.UIUtils.showNotification) {
            window.UIUtils.showNotification(
                'Site web non disponible pour ce lieu',
                'warning',
                3000
            );
        } else {
            alert('Désolé, aucun site web n\'est disponible pour ce lieu.');
        }
        return;
    }

    // Essayer d'ouvrir le site web
    try {
        console.log('Opening website:', website);
        const newWindow = window.open(website, '_blank', 'noopener,noreferrer');

        // Vérifier si la fenêtre s'est ouverte (peut être bloquée par un popup blocker)
        if (!newWindow) {
            console.warn('Popup bloqué, essai avec location.href');
            if (confirm(`Ouvrir le site web de ${title} dans cet onglet ?`)) {
                window.location.href = website;
            }
        }
    } catch (error) {
        console.error('Erreur lors de l\'ouverture du site web:', error);

        if (window.loggers) {
            window.loggers.ui.error('Reservation link failed', { website, error: error.message });
        }

        // Fallback : copier l'URL dans le presse-papier
        if (navigator.clipboard) {
            navigator.clipboard.writeText(website).then(() => {
                alert(`Impossible d'ouvrir le site web. L'URL a été copiée dans le presse-papier : ${website}`);
            }).catch(() => {
                alert(`Impossible d'ouvrir le site web. URL : ${website}`);
            });
        } else {
            alert(`Impossible d'ouvrir le site web. URL : ${website}`);
        }
    }
}

/**
 * Gère les clics sur le bouton Découvrir
 * @param {string} slug - Slug du POI ou nom si pas de slug
 * @param {string} title - Titre du POI
 */
window.handleDiscover = function handleDiscover(slug, title) {
    // Logger l'action
    if (window.loggers) {
        window.loggers.ui.info(`Discover click: ${title}`, { slug });
    }

    // Générer un slug propre si nécessaire
    let cleanSlug = slug;
    if (!slug || slug === 'undefined' || !slug.includes('-')) {
        cleanSlug = title
            .toLowerCase()
            .replace(/[àáâäãåą]/g, 'a')
            .replace(/[èéêëę]/g, 'e')
            .replace(/[ìíîïį]/g, 'i')
            .replace(/[òóôöõø]/g, 'o')
            .replace(/[ùúûüų]/g, 'u')
            .replace(/[ç]/g, 'c')
            .replace(/[ñ]/g, 'n')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    const targetUrl = `poi.html?slug=${cleanSlug}`;

    console.log('Navigating to:', targetUrl);

    try {
        window.location.href = targetUrl;
    } catch (error) {
        console.error('Erreur navigation:', error);

        if (window.loggers) {
            window.loggers.ui.error('Navigation failed', { targetUrl, error: error.message });
        }

        // Fallback
        alert(`Impossible d'ouvrir la page. URL : ${targetUrl}`);
    }
};

// Aussi accessible sans window.
window.handleReservation = handleReservation;

/**
 * Applique les filtres sélectionnés
 */
function applyFilters() {
    // Nettoyer la section nearby quand on applique des filtres
    clearNearbySection();

    if (allPois.length === 0) {
        console.error('Aucun POI chargé !');
        return;
    }

    // Récupérer la recherche textuelle
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    // Récupérer les catégories et départements sélectionnés
    const selectedCategories = [];
    const selectedDepartments = [];

    // Vérifier d'abord dans la popup fixe
    const fixedPopup = document.getElementById('fixedPopup');
    if (fixedPopup) {
        const checkboxes = fixedPopup.querySelectorAll('input[type="checkbox"]:checked');

        checkboxes.forEach(checkbox => {
            if (checkbox.name === 'department') {
                selectedDepartments.push(checkbox.value);
            } else {
                selectedCategories.push(checkbox.value);
            }
        });
    }

    // Sinon vérifier dans les filtres principaux
    if (selectedCategories.length === 0 && selectedDepartments.length === 0) {
        const categoryCheckboxes = document.querySelectorAll('.filters-panel input[type="checkbox"]:checked:not([name="department"])');
        const departmentCheckboxes = document.querySelectorAll('.filters-panel input[name="department"]:checked');

        categoryCheckboxes.forEach(checkbox => selectedCategories.push(checkbox.value));
        departmentCheckboxes.forEach(checkbox => selectedDepartments.push(checkbox.value));
    }


    // Filtrer les POIs de manière optimisée
    const startTime = performance.now();

    filteredPois = allPois.filter(poi => {
        // Optimisation : vérifications rapides d'abord

        // Filtre départements (plus rapide)
        if (selectedDepartments.length > 0 && !selectedDepartments.includes(poi.department)) {
            return false;
        }

        // Filtre catégories
        if (selectedCategories.length > 0) {
            if (!poi.categories || !poi.categories.some(cat => selectedCategories.includes(cat))) {
                return false;
            }
        }

        // Filtre de recherche textuelle (plus coûteux, fait en dernier)
        if (searchTerm) {
            const lowerTitle = poi.title.toLowerCase();
            const lowerDesc = poi.shortDescription.toLowerCase();
            const lowerDept = poi.department.toLowerCase();

            const searchMatch = lowerTitle.includes(searchTerm) ||
                              lowerDesc.includes(searchTerm) ||
                              lowerDept.includes(searchTerm) ||
                              (poi.tags && poi.tags.some(tag => tag.toLowerCase().includes(searchTerm)));

            if (!searchMatch) {
                return false;
            }
        }

        return true;
    });

    const filterTime = performance.now() - startTime;

    // Mettre à jour l'affichage
    displayPois();
    updateCounter();

    // Auto-focus sur les POIs filtrés
    autoFocusOnFilteredPois();

}

/**
 * Auto-focus la carte sur les POIs filtrés
 */
function autoFocusOnFilteredPois() {
    if (!map || filteredPois.length === 0) {
        return;
    }

    // Si un seul POI, centrer dessus avec zoom approprié
    if (filteredPois.length === 1) {
        const poi = filteredPois[0];
        map.flyTo([poi.lat, poi.lng], 12, {
            animate: true,
            duration: 1.0
        });
        return;
    }

    // Si plusieurs POIs, calculer les limites et ajuster la vue
    const lats = filteredPois.map(poi => poi.lat);
    const lngs = filteredPois.map(poi => poi.lng);

    const bounds = [
        [Math.min(...lats), Math.min(...lngs)], // Sud-ouest
        [Math.max(...lats), Math.max(...lngs)] // Nord-est
    ];

    // Ajouter une marge pour éviter que les marqueurs soient collés aux bords
    const padding = {
        top: 50,
        bottom: 100, // Plus d'espace en bas pour le bottom sheet
        left: 50,
        right: 50
    };

    map.flyToBounds(bounds, {
        animate: true,
        duration: 1.0,
        padding: padding,
        maxZoom: 14 // Limiter le zoom maximum pour éviter d'être trop proche
    });
}

/**
 * Met à jour le compteur de résultats
 */
function updateCounter() {
    const counter = document.getElementById('resultsCount');
    if (counter) {
        counter.textContent = filteredPois.length;
    }
}

/**
 * Affiche les POIs sous forme de cartes
 */
function displayPoiCards() {
    const cardsGrid = document.getElementById('cardsGrid');
    if (!cardsGrid) {
        return;
    }

    cardsGrid.innerHTML = '';
}

/**
 * Obtient les valeurs cochées d'un groupe de cases à cocher
 */
function getCheckedValues(selector) {
    return Array.from(document.querySelectorAll(`${selector}:checked`))
        .map(checkbox => checkbox.value);
}

/**
 * Retourne la couleur d'un POI selon sa catégorie
 */
function getPoiColor(category) {
    return CONFIG.colors[category] || '#95a5a6';
}

/**
 * Retourne l'icône d'un POI selon sa catégorie
 */
function getPoiIcon(category) {
    const icons = {
        monument: 'fas fa-landmark', // Monument
        musee: 'fas fa-university', // Musée
        point_de_vue: 'fas fa-eye', // Point de vue
        plage: 'fas fa-umbrella-beach', // Plage
        village: 'fas fa-home', // Village
        parc: 'fas fa-tree', // Parc / Jardin
        randonnee: 'fas fa-hiking', // Randonnée
        chateau: 'fas fa-chess-rook', // Château
        festival: 'fas fa-music', // Festival
        loisirs: 'fas fa-star', // Activité / Loisir
        hotel: 'fas fa-bed', // Hotel
        villa: 'fas fa-house-user', // Villa
        logement_insolite: 'fas fa-tree-city', // Logement Insolite
        camping: 'fas fa-campground', // Camping
        restaurant: 'fas fa-utensils' // Restaurant
    };
    return icons[category] || 'fas fa-map-marker-alt';
}

/**
 * Ouvre l'itinéraire vers un lieu
 */
function openItinerary(lat, lng) {
    const url = `https://maps.google.com/maps?daddr=${lat},${lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Affiche une erreur
 */
function showError(message) {
    const resultsCounter = document.querySelector('.results-counter');
    if (resultsCounter) {
        if (window.Security && window.Security.safeSetInnerHTML) {
            window.Security.safeSetInnerHTML(resultsCounter, `<i class="fas fa-exclamation-triangle"></i> ${message}`);
        } else {
            resultsCounter.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        }
        resultsCounter.style.background = '#e74c3c';
        resultsCounter.style.color = '#fff';
    }
}

/**
 * Fonction debounce pour optimiser la recherche
 */
function debounce(func, wait) {
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

/**
 * Gestion des favoris avec localStorage
 */
function getFavorites() {
    try {
        if (typeof window.Security !== 'undefined' && window.Security.secureLocalStorage) {
            const favorites = window.Security.secureLocalStorage.getItem('labellebretagne-favorites');
            return Array.isArray(favorites) ? favorites : [];
        } else {
            // Fallback
            return JSON.parse(localStorage.getItem('labellebretagne-favorites') || '[]');
        }
    } catch {
        return [];
    }
}

function addToFavorites(poiId) {
    // Valider l'entrée
    if (typeof window.Security !== 'undefined' && window.Security.validateInput) {
        if (!window.Security.validateInput(poiId, {
            maxLength: 100,
            allowedChars: /^[a-z0-9\-_]+$/i,
            required: true
        })) {
            console.warn('ID POI invalide pour favoris:', poiId);
            return false;
        }
    }

    const favorites = getFavorites();
    if (!favorites.includes(poiId)) {
        favorites.push(poiId);

        if (typeof window.Security !== 'undefined' && window.Security.secureLocalStorage) {
            window.Security.secureLocalStorage.setItem('labellebretagne-favorites', favorites);
        } else {
            localStorage.setItem('labellebretagne-favorites', JSON.stringify(favorites));
        }
        return true;
    }
    return false;
}

function removeFromFavorites(poiId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(poiId);
    if (index > -1) {
        favorites.splice(index, 1);

        if (typeof window.Security !== 'undefined' && window.Security.secureLocalStorage) {
            window.Security.secureLocalStorage.setItem('labellebretagne-favorites', favorites);
        } else {
            localStorage.setItem('labellebretagne-favorites', JSON.stringify(favorites));
        }
        return true;
    }
    return false;
}

function toggleFavorite(poiId) {
    const favorites = getFavorites();
    if (favorites.includes(poiId)) {
        removeFromFavorites(poiId);
        return false;
    } else {
        addToFavorites(poiId);
        return true;
    }
}

/**
 * Initialisation de la page POI
 */
function initPoiPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
        showPoiError();
        return;
    }

    // Validation de sécurité pour le slug
    if (typeof window.Security !== 'undefined' && window.Security.validateInput) {
        if (!window.Security.validateInput(slug, {
            maxLength: 100,
            allowedChars: /^[a-z0-9\-_]+$/i,
            required: true
        })) {
            showPoiError();
            return;
        }
    } else {
        // Fallback de validation basique
        if (!/^[a-z0-9\-_]{1,100}$/i.test(slug)) {
            showPoiError();
            return;
        }
    }

    loadPoiData(slug);
}

/**
 * Charge les données d'un POI spécifique
 */
async function loadPoiData(slug) {
    try {
        const response = await fetch(`data/pois.json?v=${Date.now()}&mobile=${Math.random()}`);
        const data = await response.json();
        const poi = data.pois.find(p => p.slug === slug);

        if (!poi) {
            showPoiError();
            return;
        }

        displayPoiData(poi);
    } catch (error) {
        console.error('Erreur lors du chargement du POI:', error);
        showPoiError();
    }
}

/**
 * Affiche les données d'un POI
 */
function displayPoiData(poi) {
    const loading = document.getElementById('loading');
    const content = document.getElementById('poiContent');

    if (loading) {
        loading.style.display = 'none';
    }
    if (content) {
        content.style.display = 'block';
    }

    // Mise à jour du titre de la page
    document.title = `${poi.title} - La Belle Bretagne`;

    // Remplissage des données
    updateElement('poiTitleOverlay', poi.title); // Titre sur l'image
    updateElement('poiDepartment', poi.department);
    updateElement('poiShortDescription', poi.shortDescription);
    updateElement('poiDescription', poi.description);
    updateElement('addressText', poi.address);

    // Image principale
    const poiImage = document.getElementById('poiImage');
    if (poiImage) {
        poiImage.src = poi.image;
        poiImage.alt = poi.title;
        poiImage.onerror = function() {
            this.src = 'assets/img/placeholder.jpg';
        };
    }

    // Catégories
    const categoriesContainer = document.getElementById('poiCategories');
    if (categoriesContainer && poi.categories) {
        const categoriesHTML = poi.categories.map(cat =>
            `<span class="category-tag">
                <i class="${getPoiIcon(cat)}"></i>
                ${getCategoryName(cat)}
            </span>`
        ).join('');

        if (window.Security && window.Security.safeSetInnerHTML) {
            window.Security.safeSetInnerHTML(categoriesContainer, categoriesHTML);
        } else {
            categoriesContainer.innerHTML = categoriesHTML;
        }
    }

    // Badges (masqués temporairement)
    const badgesContainer = document.getElementById('poiBadges');
    if (badgesContainer) {
        badgesContainer.innerHTML = ''; // Pas de badges pour le moment
    }

    // Section avis (masquée temporairement)
    const avisSection = document.getElementById('avisSection');
    if (avisSection) {
        avisSection.style.display = 'none'; // Masquée pour le moment
    }

    // Téléphone
    if (poi.phone) {
        const phoneItem = document.getElementById('poiPhone');
        const phoneText = document.getElementById('phoneText');
        if (phoneItem && phoneText) {
            phoneItem.style.display = 'flex';
            phoneText.href = `tel:${poi.phone}`;
            phoneText.textContent = poi.phone;
        }
    }

    // Site web
    if (poi.website) {
        const websiteItem = document.getElementById('poiWebsite');
        const websiteText = document.getElementById('websiteText');
        const websiteBtn = document.getElementById('websiteBtn');

        if (websiteItem && websiteText) {
            websiteItem.style.display = 'flex';
            websiteText.href = poi.website;
            websiteText.textContent = poi.website;
        }

        if (websiteBtn) {
            websiteBtn.style.display = 'inline-flex';
            websiteBtn.onclick = () => window.open(poi.website, '_blank', 'noopener,noreferrer');
        }
    }

    // Stats rapides (masqué pour l'instant)
    const statsContainer = document.getElementById('poiStats');
    if (statsContainer) {
        statsContainer.style.display = 'none';
    }

    // Informations de localisation
    const locationAddress = document.getElementById('locationAddress');
    const locationCoords = document.getElementById('locationCoords');
    if (locationAddress) {
        locationAddress.textContent = poi.address || 'Adresse non disponible';
    }
    if (locationCoords) {
        locationCoords.textContent = `${poi.lat.toFixed(6)}°N, ${poi.lng.toFixed(6)}°E`;
    }

    // Bouton "Voir sur la carte"
    const showMapBtn = document.getElementById('showMapBtn');
    if (showMapBtn) {
        showMapBtn.onclick = () => openItinerary(poi.lat, poi.lng);
    }

    // Tags
    if (poi.tags && poi.tags.length > 0) {
        const tagsSection = document.getElementById('tagsSection');
        const tagsContainer = document.getElementById('poiTags');
        if (tagsSection && tagsContainer) {
            tagsSection.style.display = 'block';
            const tagsHTML = poi.tags.map(tag =>
                `<span class="tag">${tag}</span>`
            ).join('');

            if (window.Security && window.Security.safeSetInnerHTML) {
                window.Security.safeSetInnerHTML(tagsContainer, tagsHTML);
            } else {
                tagsContainer.innerHTML = tagsHTML;
            }
        }
    }

    // Bouton itinéraire
    const itineraryBtn = document.getElementById('itineraryBtn');
    if (itineraryBtn) {
        itineraryBtn.onclick = () => openItinerary(poi.lat, poi.lng);
    }

    // Boutons réserver (pour certains POIs comme la Vallée de Pratmeur, l'Agapa Hotel, la Villa Blockhaus, le Grand Hôtel Barrière, le Camping Sandaya, l'Hôtel Castelbrac, Dihan Evasion, Domaine des Ormes, Domaine de Meros, Villa Lily Spa, 5 Etoiles hébergement insolite, Domaine du Treuscoat, Les Cabanes de Koad'dour et Nuances d'Alcôves)
    if ((poi.id === 'vallee-de-pratmeur' || poi.id === 'agapa-hotel-perros-guirec' || poi.id === 'villa-blockhaus-audrey' || poi.id === 'grand-hotel-barriere-dinard' || poi.id === 'sandaya-camping-carnac' || poi.id === 'hotel-castelbrac-dinard-v3' || poi.id === 'balthazar-hotel-spa-rennes' || poi.id === 'grand-hotel-thermes-saint-malo' || poi.id === 'chateau-apigne-le-rheu' || poi.id === 'domaine-locguenole-spa-kervignac' || poi.id === 'domaine-bretesche-golf-spa-missillac' || poi.id === 'miramar-la-cigale-arzon' || poi.id === 'sofitel-quiberon-thalassa-sea-spa' || poi.id === 'hotel-barriere-hermitage-la-baule' || poi.id === 'hotel-barriere-royal-thalasso-la-baule' || poi.id === 'hotel-castel-marie-louise-la-baule' || poi.id === 'chateau-maubreuil-carquefou' || poi.id === 'hotel-de-carantec' || poi.id === 'dihan-evasion-ploemel' || poi.id === 'domaine-des-ormes' || poi.id === 'domaine-de-meros' || poi.id === 'villa-lily-spa' || poi.id === '5-etoiles-hebergement-insolite-luxe' || poi.id === 'domaine-du-treuscoat' || poi.id === 'les-cabanes-de-koaddour' || poi.id === 'nuances-dalcoves') && poi.website) {
        const reserveTopBtn = document.getElementById('reserveTopBtn');
        const reserveBottomBtn = document.getElementById('reserveBottomBtn');
        const reserveButtonTop = document.getElementById('reserveButtonTop');

        if (reserveButtonTop) {
            reserveButtonTop.style.display = 'block';
        }

        if (reserveTopBtn) {
            reserveTopBtn.onclick = () => window.open(poi.website, '_blank', 'noopener,noreferrer');
        }

        if (reserveBottomBtn) {
            reserveBottomBtn.style.display = 'inline-flex';
            reserveBottomBtn.onclick = () => window.open(poi.website, '_blank', 'noopener,noreferrer');
        }
    }

    // Galerie d'images supplémentaires
    displayPoiGallery(poi);

    // Carrousel de lieux proches
    displayNearbyPois(poi);

    // Bouton partage
    initShareButton(poi);
}

/**
 * Affiche la galerie d'images supplémentaires du POI
 */
function displayPoiGallery(poi) {
    const gallerySection = document.getElementById('poiGallery');
    const imagesGrid = document.getElementById('poiImagesGrid');

    if (!gallerySection || !imagesGrid) {
        return;
    }

    // Afficher seulement si le POI a plus d'une image
    if (!poi.images || poi.images.length <= 1) {
        gallerySection.style.display = 'none';
        return;
    }

    // Afficher la section et ajouter l'attribut data-poi-slug pour le CSS
    gallerySection.style.display = 'block';
    gallerySection.setAttribute('data-poi-slug', poi.slug);

    // Générer les images (toutes les images y compris la première)
    const additionalImages = poi.images;

    // Labels personnalisés selon le POI
    let imageLabels = [];

    switch (poi.id) {
    case 'parc-du-thabor':
        imageLabels = [
            'Vue d\'ensemble du parc',
            'Jardin à la française',
            'Roseraie et parc à l\'anglaise'
        ];
        break;
    case 'mont-saint-michel-bretagne':
        imageLabels = [
            'Vue d\'ensemble de l\'abbaye',
            'Baie et grandes marées',
            'Ruelles et architecture médiévale'
        ];
        break;
    case 'rochefort-en-terre':
        imageLabels = [
            'Place du village et maisons à colombages',
            'Ruelles fleuries et pavées',
            'Château et patrimoine historique'
        ];
        break;
    case 'musee-beaux-arts-rennes':
        imageLabels = [
            'Façade du palais du XVIIIe siècle',
            'Collections et œuvres d\'art',
            'Salles d\'exposition et architecture intérieure'
        ];
        break;
    case 'chateau-de-josselin':
        imageLabels = [
            'Façade gothique flamboyant',
            'Château et reflets sur l\'Oust',
            'Jardins et cour intérieure'
        ];
        break;
    default:
        imageLabels = [
            'Vue principale',
            'Vue alternative',
            'Détail architectural'
        ];
    }

    // Créer les éléments de galerie
    const galleryHTML = additionalImages.map((imageUrl, index) => {
        // Échapper les données utilisateur pour éviter les injections
        const escapedImageUrl = imageUrl.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
        const escapedTitle = poi.title.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
        const escapedLabel = (imageLabels[index] || `Vue ${index + 1}`).replace(/'/g, '&#39;').replace(/"/g, '&quot;');

        return `
            <div class="poi-gallery-image" onclick="openImageModal('${escapedImageUrl}', '${escapedTitle} - ${escapedLabel}')">
                <img src="${escapedImageUrl}" 
                     alt="${escapedTitle} - ${escapedLabel}" 
                     onerror="this.src='assets/img/placeholder.jpg'">
                <div class="poi-gallery-overlay">
                    <div class="poi-gallery-caption">
                        ${escapedLabel}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Utiliser la méthode sécurisée si disponible, sinon innerHTML standard
    if (typeof window.Security !== 'undefined' && window.Security.safeSetInnerHTML) {
        window.Security.safeSetInnerHTML(imagesGrid, galleryHTML);
    } else {
        imagesGrid.innerHTML = galleryHTML;
    }
}

/**
 * Ouvre une image en modal (fonction simple pour l'instant)
 */
function openImageModal(imageUrl, caption) {
    // Pour l'instant, on ouvre l'image dans un nouvel onglet
    // On pourra améliorer avec une vraie modal plus tard
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
        <html>
            <head>
                <title>${caption}</title>
                <style>
                    body { 
                        margin: 0; 
                        padding: 20px; 
                        background: #000; 
                        display: flex; 
                        flex-direction: column; 
                        align-items: center; 
                        justify-content: center; 
                        min-height: 100vh;
                        font-family: 'Inter', sans-serif;
                    }
                    img { 
                        max-width: 100%; 
                        max-height: 90vh; 
                        object-fit: contain;
                        box-shadow: 0 10px 30px rgba(255,255,255,0.1);
                    }
                    .caption {
                        color: white;
                        font-size: 18px;
                        font-weight: 600;
                        margin-top: 20px;
                        text-align: center;
                    }
                    .close-hint {
                        color: rgba(255,255,255,0.7);
                        font-size: 14px;
                        margin-top: 10px;
                    }
                </style>
            </head>
            <body>
                <img src="${imageUrl}" alt="${caption}">
                <div class="caption">${caption}</div>
                <div class="close-hint">Fermez cet onglet pour revenir</div>
            </body>
        </html>
    `);
}

/**
 * Initialise le bouton favori
 */
function initFavoriteButton(poiId) {
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (!favoriteBtn) {
        return;
    }

    const updateFavoriteButton = (isFavorite) => {
        const icon = favoriteBtn.querySelector('i');
        if (isFavorite) {
            icon.className = 'fas fa-heart';
            favoriteBtn.classList.add('active');
            favoriteBtn.setAttribute('aria-label', 'Retirer des favoris');
        } else {
            icon.className = 'far fa-heart';
            favoriteBtn.classList.remove('active');
            favoriteBtn.setAttribute('aria-label', 'Ajouter aux favoris');
        }
    };

    // État initial
    const favorites = getFavorites();
    updateFavoriteButton(favorites.includes(poiId));

    // Gestion du clic
    favoriteBtn.addEventListener('click', () => {
        const newState = toggleFavorite(poiId);
        updateFavoriteButton(newState);

        // Feedback visuel
        favoriteBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            favoriteBtn.style.transform = '';
        }, 200);
    });
}

/**
 * Initialise le bouton de partage
 */
function initShareButton(poi) {
    const shareBtn = document.getElementById('shareBtn');
    if (!shareBtn) {
        return;
    }

    shareBtn.addEventListener('click', async () => {
        const shareData = {
            title: poi.title,
            text: poi.shortDescription,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                // API Web Share native (mobile)
                await navigator.share(shareData);
            } else {
                // Fallback : copier l'URL
                await navigator.clipboard.writeText(window.location.href);

                // Feedback visuel
                const originalIcon = shareBtn.querySelector('i').className;
                shareBtn.querySelector('i').className = 'fas fa-check';
                shareBtn.title = 'Lien copié !';

                setTimeout(() => {
                    shareBtn.querySelector('i').className = originalIcon;
                    shareBtn.title = 'Partager';
                }, 2000);
            }
        } catch (err) {
            console.log('Erreur lors du partage:', err);
        }
    });
}

/**
 * Affiche une erreur sur la page POI
 */
function showPoiError() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');

    if (loading) {
        loading.style.display = 'none';
    }
    if (error) {
        error.style.display = 'flex';
    }
}

/**
 * Met à jour un élément avec du contenu
 */
function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element && content) {
        element.textContent = content;
    }
}

/**
 * Retourne le nom affiché d'une catégorie
 */
function getCategoryName(category) {
    const names = {
        monument: 'Monument',
        musee: 'Musée',
        point_de_vue: 'Point de vue',
        plage: 'Plage',
        village: 'Village',
        parc: 'Parc / Jardin',
        randonnee: 'Randonnée',
        chateau: 'Château',
        festival: 'Festival',
        loisirs: 'Activité / Loisir',
        hotel: 'Hôtel',
        villa: 'Villa',
        logement_insolite: 'Logement Insolite',
        camping: 'Camping',
        restaurant: 'Restaurant'
    };
    return names[category] || category;
}

/**
 * Retourne l'article correct pour une catégorie
 */
function getArticleForCategory(category) {
    const articles = {
        plage: 'la',
        musee: 'le',
        monument: 'le',
        randonnee: 'la',
        festival: 'le',
        village: 'le',
        hotel: 'l\'',
        villa: 'la',
        logement_insolite: 'le',
        point_de_vue: 'le',
        loisirs: 'les'
    };
    return articles[category] || 'le';
}

/**
 * Gère le toggle des favoris dans la popup
 */
function toggleFavoriteInPopup(poiId, button) {
    const isNowFavorite = toggleFavorite(poiId);

    if (isNowFavorite) {
        button.classList.add('active');
    } else {
        button.classList.remove('active');
    }

    // Animation du cœur
    button.style.transform = 'scale(1.3)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
}

/**
 * Initialise la popup fixe
 */
function initFixedPopup() {
    const closeBtn = document.getElementById('closeFixedPopup');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideFixedPopup);
    }

    // Fermer avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideFixedPopup();
        }
    });
}

/**
 * Affiche la popup fixe avec les données d'un POI
 */
function showFixedPopup(poi) {
    const fixedPopup = document.getElementById('fixedPopup');
    const popupContent = document.getElementById('fixedPopupContent');

    if (fixedPopup && popupContent) {
        // Générer le contenu de manière sécurisée
        if (typeof window.Security !== 'undefined' && window.Security.safeSetInnerHTML) {
            window.Security.safeSetInnerHTML(popupContent, createPopupContent(poi));
        } else {
            // Fallback sécurisé si Security n'est pas disponible
            popupContent.textContent = `${poi.title} - Contenu non disponible pour des raisons de sécurité`;
        }

        // Afficher la popup
        fixedPopup.style.display = 'block';
        setTimeout(() => {
            fixedPopup.classList.add('show');

            // Initialiser la galerie si il y a plusieurs images
            if (poi.images && poi.images.length > 1) {
                currentGalleryIndex = 0;
                galleryTotalImages = poi.images.length;
                setTimeout(() => {
                    initGalleryEvents();
                    startGalleryAutoplay();
                }, 100);
            }
        }, 10);
    }
}

/**
 * Masque la popup fixe
 */
function hideFixedPopup() {
    const fixedPopup = document.getElementById('fixedPopup');

    if (fixedPopup) {
        fixedPopup.classList.remove('show');
        // Arrêter le défilement automatique
        stopGalleryAutoplay();
        setTimeout(() => {
            fixedPopup.style.display = 'none';
        }, 400);

        // Marquer comme fermé
        isFiltersOpen = false;
    }
}

/**
 * Affiche les filtres dans la popup fixe
 */
function showFiltersPopup() {
    const fixedPopup = document.getElementById('fixedPopup');
    const popupContent = document.getElementById('fixedPopupContent');

    if (fixedPopup && popupContent) {
        // Générer le contenu des filtres de manière sécurisée
        if (typeof window.Security !== 'undefined' && window.Security.safeSetInnerHTML) {
            window.Security.safeSetInnerHTML(popupContent, createFiltersContent());
        } else {
            popupContent.textContent = 'Filtres non disponibles pour des raisons de sécurité';
        }

        // Afficher la popup
        fixedPopup.style.display = 'block';
        setTimeout(() => {
            fixedPopup.classList.add('show');
        }, 10);

        // Marquer comme ouvert
        isFiltersOpen = true;
    }
}

/**
 * Crée le contenu HTML des filtres
 */
function createFiltersContent() {
    return `
        <div class="filters-container">
            <div class="filters-header-popup">
                <h3>Filtres</h3>
            </div>
            
            <div class="filters-body-popup">
                <!-- Départements -->
                <div class="filter-section">
                    <h4 style="margin: 16px 0 8px 0; font-size: 14px; font-weight: 600; color: var(--text-primary);">Départements</h4>
                    <div class="categories-grid-compact">
                        <label class="category-chip">
                            <input type="checkbox" value="Finistère" name="department">
                            <div class="chip-content">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>Finistère</span>
                            </div>
                        </label>
                        <label class="category-chip">
                            <input type="checkbox" value="Ille-et-Vilaine" name="department">
                            <div class="chip-content">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>Ille-et-Vilaine</span>
                            </div>
                        </label>
                        <label class="category-chip">
                            <input type="checkbox" value="Loire-Atlantique" name="department">
                            <div class="chip-content">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>Loire-Atlantique</span>
                            </div>
                        </label>
                        <label class="category-chip">
                            <input type="checkbox" value="Morbihan" name="department">
                            <div class="chip-content">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>Morbihan</span>
                            </div>
                        </label>
                        <label class="category-chip">
                            <input type="checkbox" value="Côtes-d'Armor" name="department">
                            <div class="chip-content">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>Côtes-d'Armor</span>
                            </div>
                        </label>
                    </div>
                </div>
                
                <!-- Catégories -->
                <div class="filter-section">
                    <h4 style="margin: 16px 0 8px 0; font-size: 14px; font-weight: 600; color: var(--text-primary);">Catégories</h4>
                <div class="categories-grid-compact">
                    <label class="category-chip">
                        <input type="checkbox" value="monument">
                        <div class="chip-content">
                            <i class="fas fa-landmark"></i>
                            <span>Monuments</span>
                        </div>
                    </label>
                    <label class="category-chip">
                        <input type="checkbox" value="musee">
                        <div class="chip-content">
                            <i class="fas fa-university"></i>
                            <span>Musées</span>
                        </div>
                    </label>
                    <label class="category-chip">
                        <input type="checkbox" value="point_de_vue">
                        <div class="chip-content">
                            <i class="fas fa-eye"></i>
                            <span>Points de vue</span>
                        </div>
                    </label>
                    <label class="category-chip">
                        <input type="checkbox" value="plage">
                        <div class="chip-content">
                            <i class="fas fa-umbrella-beach"></i>
                            <span>Plages</span>
                        </div>
                    </label>
                    <label class="category-chip">
                        <input type="checkbox" value="village">
                        <div class="chip-content">
                            <i class="fas fa-home"></i>
                            <span>Villages</span>
                        </div>
                    </label>
                    <label class="category-chip">
                        <input type="checkbox" value="parc">
                        <div class="chip-content">
                            <i class="fas fa-tree"></i>
                            <span>Parcs / Jardins</span>
                        </div>
                    </label>
                    <label class="category-chip">
                        <input type="checkbox" value="randonnee">
                        <div class="chip-content">
                            <i class="fas fa-hiking"></i>
                            <span>Randonnées</span>
                        </div>
                    </label>
                    <label class="category-chip">
                        <input type="checkbox" value="chateau">
                        <div class="chip-content">
                            <i class="fas fa-chess-rook"></i>
                            <span>Châteaux</span>
                        </div>
                    </label>
                    <label class="category-chip">
                        <input type="checkbox" value="festival">
                        <div class="chip-content">
                            <i class="fas fa-music"></i>
                            <span>Festivals</span>
                        </div>
                    </label>
                    <label class="category-chip">
                        <input type="checkbox" value="loisirs">
                        <div class="chip-content">
                            <i class="fas fa-star"></i>
                            <span>Activités / Loisirs</span>
                        </div>
                    </label>
                    <label class="category-chip">
                        <input type="checkbox" value="hotel">
                        <div class="chip-content">
                            <i class="fas fa-bed"></i>
                            <span>Hôtels</span>
                        </div>
                    </label>
                    <label class="category-chip">
                        <input type="checkbox" value="villa">
                        <div class="chip-content">
                            <i class="fas fa-house-user"></i>
                            <span>Villas</span>
                        </div>
                    </label>
                    <label class="category-chip">
                        <input type="checkbox" value="logement_insolite">
                        <div class="chip-content">
                            <i class="fas fa-tree-city"></i>
                            <span>Logements Insolites</span>
                        </div>
                    </label>
                    <label class="category-chip">
                        <input type="checkbox" value="camping">
                        <div class="chip-content">
                            <i class="fas fa-campground"></i>
                            <span>Campings</span>
                        </div>
                    </label>
                    <label class="category-chip">
                        <input type="checkbox" value="restaurant">
                        <div class="chip-content">
                            <i class="fas fa-utensils"></i>
                            <span>Restaurants</span>
                        </div>
                    </label>
                </div>
                </div>
            </div>
            
            <div class="filters-actions-bottom">
                <button class="btn-apply-popup" onclick="handleApplyFilters()">
                    Appliquer
                </button>
                <button class="btn-reset-popup" onclick="handleResetFilters()">
                    Tout effacer
                </button>
            </div>
        </div>
    `;
}

/**
 * Gère le clic sur le bouton Appliquer des filtres
 */
function handleApplyFilters() {

    applyFilters();
    hideFixedPopup();

    // Replier le bottom sheet pour voir les résultats sur la carte
    const bottomSheet = document.getElementById('bottomSheet');
    if (bottomSheet) {
        bottomSheet.classList.add('collapsed');
    }
}

/**
 * Utilitaire pour récupérer les valeurs des checkboxes sélectionnées
 */
function getSelectedCheckboxValues(selector) {
    const popup = document.getElementById('fixedPopup');
    if (popup) {
        return Array.from(popup.querySelectorAll(`${selector}:checked`))
            .map(checkbox => checkbox.value);
    }
    return [];
}

/**
 * Gère le clic sur le bouton Reset des filtres
 */
function handleResetFilters() {
    // Décocher toutes les cases
    const popup = document.getElementById('fixedPopup');
    if (popup) {
        popup.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    }
    applyFilters();
    hideFixedPopup();
}



// Variables globales pour la galerie
let currentGalleryIndex = 0;
let galleryAutoInterval = null;
let galleryTotalImages = 0;

/**
 * Affiche une image spécifique dans la galerie de la popup
 */
function showGalleryImage(index) {
    const galleryImages = document.querySelectorAll('.gallery-image');
    const galleryDots = document.querySelectorAll('.gallery-dot');

    if (galleryImages.length === 0) {
        return;
    }

    // Mettre à jour l'index global
    currentGalleryIndex = index;
    galleryTotalImages = galleryImages.length;

    // Retirer la classe active de tous les éléments
    galleryImages.forEach(img => img.classList.remove('active'));
    galleryDots.forEach(dot => dot.classList.remove('active'));

    // Ajouter la classe active aux éléments sélectionnés
    if (galleryImages[index]) {
        galleryImages[index].classList.add('active');
    }
    if (galleryDots[index]) {
        galleryDots[index].classList.add('active');
    }

    // Redémarrer le défilement automatique
    restartGalleryAutoplay();
}

/**
 * Passe à l'image suivante dans la galerie
 */
function nextGalleryImage() {
    const nextIndex = (currentGalleryIndex + 1) % galleryTotalImages;
    showGalleryImage(nextIndex);
}

/**
 * Passe à l'image précédente dans la galerie
 */
function prevGalleryImage() {
    const prevIndex = (currentGalleryIndex - 1 + galleryTotalImages) % galleryTotalImages;
    showGalleryImage(prevIndex);
}

/**
 * Démarre le défilement automatique de la galerie
 */
function startGalleryAutoplay() {
    if (galleryTotalImages > 1) {
        galleryAutoInterval = setInterval(() => {
            nextGalleryImage();
        }, 6000); // Change d'image toutes les 6 secondes
    }
}

/**
 * Arrête le défilement automatique
 */
function stopGalleryAutoplay() {
    if (galleryAutoInterval) {
        clearInterval(galleryAutoInterval);
        galleryAutoInterval = null;
    }
}

/**
 * Redémarre le défilement automatique
 */
function restartGalleryAutoplay() {
    stopGalleryAutoplay();
    startGalleryAutoplay();
}

/**
 * Initialise les événements de la galerie
 */
function initGalleryEvents() {
    const gallery = document.querySelector('.popup-image-gallery');
    if (!gallery) {
        return;
    }

    let startX = 0;
    let startY = 0;
    let isDragging = false;

    // Événements tactiles pour mobile
    gallery.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        stopGalleryAutoplay();
    }, { passive: true });

    gallery.addEventListener('touchmove', (e) => {
        if (!isDragging) {
            return;
        }
        e.preventDefault();
    }, { passive: false });

    gallery.addEventListener('touchend', (e) => {
        if (!isDragging) {
            return;
        }

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;

        // Seuil minimum pour déclencher le swipe
        if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                nextGalleryImage(); // Swipe vers la gauche = image suivante
            } else {
                prevGalleryImage(); // Swipe vers la droite = image précédente
            }
        }

        isDragging = false;
        setTimeout(() => startGalleryAutoplay(), 1000);
    }, { passive: true });

    // Événements de clic pour desktop
    gallery.addEventListener('click', (e) => {
        const rect = gallery.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const galleryWidth = rect.width;

        // Clic à gauche = image précédente, clic à droite = image suivante
        if (clickX < galleryWidth / 2) {
            prevGalleryImage();
        } else {
            nextGalleryImage();
        }
    });

    // Arrêter l'autoplay au survol, redémarrer quand on sort
    gallery.addEventListener('mouseenter', stopGalleryAutoplay);
    gallery.addEventListener('mouseleave', () => {
        setTimeout(() => startGalleryAutoplay(), 500);
    });
}

// Fonction calculateDistance dupliquée supprimée - utiliser Utils.GeoUtils.calculateDistance

/**
 * Ajuste automatiquement le zoom de la carte pour afficher tous les POIs
 */
function fitMapToAllPois() {
    if (!map || !markersGroup || !filteredPois || filteredPois.length === 0) {
        return;
    }

    try {
        // Créer un groupe de coordonnées à partir des POIs filtrés
        const coordinates = filteredPois.map(poi => [poi.lat, poi.lng]);

        if (coordinates.length === 1) {
            // Si un seul POI, centrer sur lui avec un zoom approprié
            map.setView(coordinates[0], 12);
        } else if (coordinates.length > 1) {
            // Si plusieurs POIs, ajuster les limites pour tous les voir
            const bounds = L.latLngBounds(coordinates);
            map.fitBounds(bounds, {
                padding: [20, 20],
                maxZoom: 10 // Limiter le zoom maximum pour éviter d'être trop proche
            });
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajustement automatique du zoom:', error);
    }
}

/**
 * Affiche les points d'intérêt à proximité du POI actuel
 */
async function displayNearbyPois(currentPoi) {
    const nearbySection = document.getElementById('nearbySection');
    const nearbyCarousel = document.getElementById('nearbyCarousel');

    if (!nearbySection || !nearbyCarousel) {
        return;
    }

    try {
        // Charger tous les POIs si pas déjà fait
        if (allPois.length === 0) {
            const response = await fetch('data/pois.json');
            const data = await response.json();
            allPois = data.pois || [];
        }

        // Filtrer et trier les POIs par distance (exclure le POI actuel)
        const nearbyPois = allPois
            .filter(poi => poi.id !== currentPoi.id)
            .map(poi => ({
                ...poi,
                distance: Utils.GeoUtils.calculateDistance(currentPoi.lat, currentPoi.lng, poi.lat, poi.lng) / 1000
            }))
            .filter(poi => poi.distance <= 50) // Dans un rayon de 50km
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 8); // Limiter à 8 POIs maximum

        if (nearbyPois.length === 0) {
            nearbySection.style.display = 'none';
            return;
        }

        // Générer le HTML des cartes
        const nearbyHTML = nearbyPois.map(poi => createNearbyPoiCard(poi)).join('');

        if (window.Security && window.Security.safeSetInnerHTML) {
            window.Security.safeSetInnerHTML(nearbyCarousel, nearbyHTML);
        } else {
            nearbyCarousel.innerHTML = nearbyHTML;
        }

        // Afficher la section
        nearbySection.style.display = 'block';

        // Initialiser les contrôles du carrousel
        initNearbyCarousel();

    } catch (error) {
        console.error('Erreur lors du chargement des POIs proches:', error);
        nearbySection.style.display = 'none';
    }
}

/**
 * Crée une carte pour un POI proche
 */
function createNearbyPoiCard(poi) {
    try {
        const categoryName = getCategoryName(poi.categories[0]);
        const distanceText = poi.distance < 1 ?
            `${Math.round(poi.distance * 1000)}m` :
            `${Math.round(poi.distance)}km`;

        return `
            <div class="nearby-poi-card" onclick="window.location.href='poi.html?slug=${poi.slug}'">
                <img src="${poi.image}" alt="${poi.title}" class="nearby-poi-image" 
                     onerror="this.src='assets/img/placeholder.jpg'">
                <div class="nearby-poi-content">
                    <div class="nearby-poi-meta">
                        <span class="nearby-poi-department">${poi.department}</span>
                        <span class="nearby-poi-distance">${distanceText}</span>
                    </div>
                    <span class="nearby-poi-category category-${poi.categories[0]}">
                        <i class="${getPoiIcon(poi.categories[0])}"></i>
                        ${categoryName}
                    </span>
                    <h3 class="nearby-poi-title">${poi.title}</h3>
                    <p class="nearby-poi-description">${poi.shortDescription}</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error creating POI card for:', poi, error);
        return '';
    }
}

/**
 * Initialise les contrôles du carrousel de POIs proches
 */
function initNearbyCarousel() {
    const carousel = document.getElementById('nearbyCarousel');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');

    if (!carousel || !prevBtn || !nextBtn) {
        return;
    }

    const cardWidth = 280 + 16; // largeur carte + gap
    let currentPosition = 0;

    const updateButtons = () => {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        prevBtn.disabled = currentPosition <= 0;
        nextBtn.disabled = currentPosition >= maxScroll;
    };

    prevBtn.addEventListener('click', () => {
        currentPosition = Math.max(0, currentPosition - cardWidth * 2);
        carousel.scrollTo({
            left: currentPosition,
            behavior: 'smooth'
        });
        setTimeout(updateButtons, 300);
    });

    nextBtn.addEventListener('click', () => {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        currentPosition = Math.min(maxScroll, currentPosition + cardWidth * 2);
        carousel.scrollTo({
            left: currentPosition,
            behavior: 'smooth'
        });
        setTimeout(updateButtons, 300);
    });

    // Mise à jour initiale des boutons
    updateButtons();

    // Mise à jour lors du redimensionnement
    window.addEventListener('resize', updateButtons);
}

/**
 * Affiche le carrousel des lieux proches lors de la géolocalisation
 */
function displayNearbyLocationCarousel(nearbyPois) {
    console.log('displayNearbyLocationCarousel called with:', nearbyPois.length, 'POIs');
    
    const nearbySection = document.getElementById('nearbyLocationSection');
    const nearbyCarousel = document.getElementById('nearbyLocationCarousel');

    console.log('nearbySection found:', !!nearbySection);
    console.log('nearbyCarousel found:', !!nearbyCarousel);

    if (!nearbySection || !nearbyCarousel) {
        console.error('Required elements not found:', {
            nearbySection: !!nearbySection,
            nearbyCarousel: !!nearbyCarousel
        });
        return;
    }

    if (nearbyPois.length === 0) {
        console.log('No POIs to display, hiding section');
        nearbySection.style.display = 'none';
        return;
    }

    // Limiter à 10 POIs maximum pour éviter le surchargement
    const limitedPois = nearbyPois.slice(0, 10);
    console.log('Displaying', limitedPois.length, 'POIs');

    // Test simple pour voir si le carrousel fonctionne
    let nearbyHTML;
    
    if (limitedPois.length > 0) {
        // Version de test simple
        nearbyHTML = `<div style="padding: 20px; background: white; border-radius: 8px; margin: 10px;">
            <h3>Test: ${limitedPois.length} lieux trouvés !</h3>
            <p>Premier lieu: ${limitedPois[0].title}</p>
        </div>`;
        
        // Version complète (commentée pour le debug)
        /*
        nearbyHTML = limitedPois.map(poi => {
            console.log('Creating card for POI:', poi.title);
            return createNearbyPoiCard(poi);
        }).join('');
        */
    } else {
        nearbyHTML = '<div>Aucun lieu trouvé</div>';
    }

    console.log('Generated HTML length:', nearbyHTML.length);

    if (window.Security && window.Security.safeSetInnerHTML) {
        window.Security.safeSetInnerHTML(nearbyCarousel, nearbyHTML);
    } else {
        nearbyCarousel.innerHTML = nearbyHTML;
    }

    // Afficher la section
    nearbySection.style.display = 'block';
    console.log('Section displayed, initializing carousel controls');

    // Initialiser les contrôles du carrousel
    initNearbyLocationCarousel();

    // Ouvrir automatiquement la bottom sheet pour montrer les résultats
    const bottomSheet = document.getElementById('bottomSheet');
    if (bottomSheet) {
        console.log('Opening bottom sheet');
        bottomSheet.classList.add('open');
    } else {
        console.error('Bottom sheet not found');
    }
}

/**
 * Initialise les contrôles du carrousel de géolocalisation
 */
function initNearbyLocationCarousel() {
    const carousel = document.getElementById('nearbyLocationCarousel');
    const prevBtn = document.getElementById('locationCarouselPrev');
    const nextBtn = document.getElementById('locationCarouselNext');

    if (!carousel || !prevBtn || !nextBtn) {
        return;
    }

    const cardWidth = 280 + 16; // largeur carte + gap
    let currentPosition = 0;

    const updateButtons = () => {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        prevBtn.disabled = currentPosition <= 0;
        nextBtn.disabled = currentPosition >= maxScroll;
    };

    prevBtn.addEventListener('click', () => {
        currentPosition = Math.max(0, currentPosition - cardWidth * 2);
        carousel.scrollTo({
            left: currentPosition,
            behavior: 'smooth'
        });
        setTimeout(updateButtons, 300);
    });

    nextBtn.addEventListener('click', () => {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        currentPosition = Math.min(maxScroll, currentPosition + cardWidth * 2);
        carousel.scrollTo({
            left: currentPosition,
            behavior: 'smooth'
        });
        setTimeout(updateButtons, 300);
    });

    // Mise à jour initiale des boutons
    updateButtons();

    // Mise à jour lors du redimensionnement
    window.addEventListener('resize', updateButtons);
}

/**
 * Gestion des contrôles de la bottom-sheet
 */
function initBottomSheetControls() {
    const bottomSheet = document.getElementById('bottomSheet');
    const sheetToggleBtn = document.getElementById('sheetToggleBtn');
    const carouselIndicatorBtn = document.getElementById('carouselIndicatorBtn');
    const indicatorCount = document.getElementById('indicatorCount');

    if (!bottomSheet || !sheetToggleBtn || !carouselIndicatorBtn) {
        console.log('Bottom sheet controls not found');
        return;
    }

    // Gestionnaire pour le bouton de toggle de la sheet
    sheetToggleBtn.addEventListener('click', () => {
        // Vérifier si les contrôles de géolocalisation sont actifs
        const sheetControls = document.querySelector('.sheet-controls');
        if (!sheetControls || !sheetControls.classList.contains('show-geolocation-controls')) {
            return; // Ne rien faire si les contrôles ne sont pas actifs
        }
        
        const isMinimized = bottomSheet.classList.contains('minimized');
        
        if (isMinimized) {
            // Restaurer la sheet
            bottomSheet.classList.remove('minimized');
            sheetToggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
            sheetToggleBtn.title = 'Minimiser';
            carouselIndicatorBtn.style.display = 'none';
        } else {
            // Minimiser la sheet et revenir à l'interface normale
            hideNearbyCarousel();
        }
    });

    // Gestionnaire pour le bouton indicateur
    carouselIndicatorBtn.addEventListener('click', () => {
        showNearbyCarousel();
    });
    
    // Gestionnaire pour le bouton de réaffichage du carrousel
    const showNearbyBtn = document.getElementById('showNearbyBtn');
    if (showNearbyBtn) {
        showNearbyBtn.addEventListener('click', () => {
            showNearbyCarousel();
        });
    }
    
    // Gestion du swipe sur la bottom-sheet pour les mobiles
    initBottomSheetSwipe(bottomSheet);
}

/**
 * Initialise la gestion du swipe sur la bottom-sheet
 */
function initBottomSheetSwipe(bottomSheet) {
    if (!bottomSheet) return;
    
    let startY = 0;
    let currentY = 0;
    let isSwipeActive = false;
    
    const handleTouchStart = (e) => {
        // Vérifier si les contrôles de géolocalisation sont actifs
        const sheetControls = document.querySelector('.sheet-controls');
        if (!sheetControls || !sheetControls.classList.contains('show-geolocation-controls')) {
            return;
        }
        
        startY = e.touches[0].clientY;
        isSwipeActive = true;
    };
    
    const handleTouchMove = (e) => {
        if (!isSwipeActive) return;
        currentY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e) => {
        if (!isSwipeActive) return;
        isSwipeActive = false;
        
        const deltaY = currentY - startY;
        const threshold = 50; // Seuil minimum pour déclencher l'action
        
        if (Math.abs(deltaY) > threshold) {
            if (deltaY > 0) {
                // Swipe vers le bas - cacher le carrousel
                hideNearbyCarousel();
            } else {
                // Swipe vers le haut - afficher le carrousel (si caché)
                const nearbySection = document.getElementById('nearbyLocationSection');
                if (nearbySection && nearbySection.style.display === 'none') {
                    showNearbyCarousel();
                }
            }
        }
    };
    
    bottomSheet.addEventListener('touchstart', handleTouchStart, { passive: true });
    bottomSheet.addEventListener('touchmove', handleTouchMove, { passive: true });
    bottomSheet.addEventListener('touchend', handleTouchEnd, { passive: true });
}

/**
 * Met à jour le compteur d'indicateur avec le nombre de POIs trouvés
 */
function updateIndicatorCount(count) {
    const indicatorCount = document.getElementById('indicatorCount');
    const nearbyCountBtn = document.getElementById('nearbyCountBtn');
    
    if (indicatorCount) {
        indicatorCount.textContent = count;
    }
    
    if (nearbyCountBtn) {
        nearbyCountBtn.textContent = count;
    }
}

/**
 * Affiche les contrôles de géolocalisation (toggle et indicateur)
 */
function showGeolocationControls() {
    const sheetControls = document.querySelector('.sheet-controls');
    const sheetHeader = document.querySelector('.sheet-header');
    
    if (sheetControls) {
        sheetControls.classList.add('show-geolocation-controls');
    }
    
    if (sheetHeader) {
        sheetHeader.classList.add('with-geolocation-controls');
    }
}

/**
 * Cache les contrôles de géolocalisation
 */
function hideGeolocationControls() {
    const sheetControls = document.querySelector('.sheet-controls');
    const sheetHeader = document.querySelector('.sheet-header');
    const carouselIndicatorBtn = document.getElementById('carouselIndicatorBtn');
    const bottomSheet = document.getElementById('bottomSheet');
    
    if (sheetControls) {
        sheetControls.classList.remove('show-geolocation-controls');
    }
    
    if (sheetHeader) {
        sheetHeader.classList.remove('with-geolocation-controls');
    }
    
    if (carouselIndicatorBtn) {
        carouselIndicatorBtn.style.display = 'none';
    }
    
    if (bottomSheet) {
        bottomSheet.classList.remove('minimized');
    }
}

/**
 * Nettoie la section nearby et cache les contrôles de géolocalisation
 */
function clearNearbySection() {
    const nearbySection = document.getElementById('nearbyLocationSection');
    const nearbyCarousel = document.getElementById('nearbyLocationCarousel');
    
    if (nearbySection) {
        nearbySection.style.display = 'none';
    }
    
    if (nearbyCarousel) {
        nearbyCarousel.innerHTML = '';
    }
    
    // Cacher les contrôles de géolocalisation
    hideGeolocationControls();
    
    // Cacher le bouton de réaffichage
    hideShowNearbyButton();
}

/**
 * Cache le carrousel mais garde l'interface normale + bouton de réaffichage
 */
function hideNearbyCarousel() {
    const nearbySection = document.getElementById('nearbyLocationSection');
    const bottomSheet = document.getElementById('bottomSheet');
    
    // Cacher la section nearby
    if (nearbySection) {
        nearbySection.style.display = 'none';
    }
    
    // Remettre la bottom sheet normale
    if (bottomSheet) {
        bottomSheet.classList.remove('minimized');
    }
    
    // Cacher les contrôles de géolocalisation
    hideGeolocationControls();
    
    // Afficher le bouton pour réafficher le carrousel
    showShowNearbyButton();
}

/**
 * Réaffiche le carrousel de géolocalisation
 */
function showNearbyCarousel() {
    const nearbySection = document.getElementById('nearbyLocationSection');
    const bottomSheet = document.getElementById('bottomSheet');
    
    // Afficher la section nearby
    if (nearbySection) {
        nearbySection.style.display = 'block';
    }
    
    // Ouvrir la bottom sheet
    if (bottomSheet) {
        bottomSheet.classList.add('open');
    }
    
    // Afficher les contrôles de géolocalisation
    showGeolocationControls();
    
    // Cacher le bouton de réaffichage
    hideShowNearbyButton();
}

/**
 * Affiche le bouton de réaffichage du carrousel
 */
function showShowNearbyButton() {
    const showNearbyBtn = document.getElementById('showNearbyBtn');
    if (showNearbyBtn) {
        showNearbyBtn.style.display = 'flex';
    }
}

/**
 * Cache le bouton de réaffichage du carrousel
 */
function hideShowNearbyButton() {
    const showNearbyBtn = document.getElementById('showNearbyBtn');
    if (showNearbyBtn) {
        showNearbyBtn.style.display = 'none';
    }
}

// Exposer les fonctions globalement
window.initPoiPage = initPoiPage;
window.openItinerary = openItinerary;
window.toggleFavorite = toggleFavorite;
window.toggleFavoriteInPopup = toggleFavoriteInPopup;
window.showFixedPopup = showFixedPopup;
window.hideFixedPopup = hideFixedPopup;
window.handleApplyFilters = handleApplyFilters;
window.handleResetFilters = handleResetFilters;
window.selectSuggestion = selectSuggestion;
window.showGalleryImage = showGalleryImage;
window.nextGalleryImage = nextGalleryImage;
window.prevGalleryImage = prevGalleryImage;
window.openImageModal = openImageModal;
window.initBottomSheetControls = initBottomSheetControls;
window.updateIndicatorCount = updateIndicatorCount;
window.showGeolocationControls = showGeolocationControls;
window.hideGeolocationControls = hideGeolocationControls;
window.clearNearbySection = clearNearbySection;
window.hideNearbyCarousel = hideNearbyCarousel;
window.showNearbyCarousel = showNearbyCarousel;
window.showShowNearbyButton = showShowNearbyButton;
window.hideShowNearbyButton = hideShowNearbyButton;
window.initBottomSheetSwipe = initBottomSheetSwipe;
