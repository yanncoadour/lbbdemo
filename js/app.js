/**
 * La Belle Bretagne - Application JavaScript
 * Gestion de la carte interactive, filtres, et favoris
 */

// Configuration globale
const CONFIG = {
    map: {
        center: [48.2020, -2.9326], // Centre de la Bretagne
        zoom: 8,
        minZoom: 7,
        maxZoom: 16
    },
    colors: {
        monument: '#d97706',           // Orange foncé pour monuments
        musee: '#8b5cf6',             // Violet pour musées
        point_de_vue: '#059669',       // Vert émeraude pour points de vue
        plage: '#06b6d4',             // Cyan pour plages
        village: '#ef4444',           // Rouge pour villages
        parc: '#22c55e',              // Vert pour parcs/jardins
        randonnee: '#10b981',         // Vert teal pour randonnées
        chateau: '#92400e',           // Marron pour châteaux
        festival: '#f97316',          // Orange vif pour festivals
        loisirs: '#6366f1',           // Indigo pour activités/loisirs
        hotel: '#64748b',             // Gris ardoise pour hôtels
        villa: '#94a3b8',             // Gris clair pour villas
        logement_insolite: '#ec4899', // Rose pour logements insolites
        camping: '#34d399',           // Vert émeraude pour camping
        restaurant: '#f59e0b'         // Amber pour restaurants
    }
};

// Variables globales
let map;
let markersGroup;
let allPois = [];
let filteredPois = [];
let isFiltersOpen = false;
let loadingPois = false;

/**
 * Initialisation de l'application
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    const mapElement = document.getElementById('map');
    console.log('Map element found:', !!mapElement);
    
    if (mapElement) {
        console.log('Starting map initialization...');
        initMap();
        initFilters();
        initLocationButton();
        initBottomSheet();
        initFixedPopup();
        initSearchAutoComplete();
        loadPois();
        
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
 */
function checkLogementFilter() {
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    
    if (filter === 'logements') {
        console.log('🏠 Application du filtre logements depuis l\'URL');
        
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
    console.log('🧭 Initialisation de la navigation intelligente...');
    
    const backLink = document.querySelector('.back-link');
    if (!backLink) return;
    
    // Détecter la page de provenance
    const referrer = document.referrer;
    const currentUrl = window.location.href;
    
    let backUrl = 'index.html'; // URL par défaut
    
    // Si on vient de la page logements
    if (referrer.includes('logements.html')) {
        backUrl = 'logements.html';
        console.log('🏠 Provenance détectée: page logements');
    }
    // Si on vient de la page festivals
    else if (referrer.includes('festivals.html')) {
        backUrl = 'festivals.html';
        console.log('🎵 Provenance détectée: page festivals');
    }
    // Si on vient de la page blog
    else if (referrer.includes('blog.html')) {
        backUrl = 'blog.html';
        console.log('📰 Provenance détectée: page blog');
    }
    // Sinon, utiliser l'historique du navigateur si disponible
    else if (history.length > 1) {
        // Utiliser le bouton retour du navigateur
        backLink.addEventListener('click', (e) => {
            e.preventDefault();
            history.back();
        });
        console.log('🔙 Utilisation de l\'historique du navigateur');
        return;
    }
    
    // Mettre à jour l'URL du bouton retour
    backLink.href = backUrl;
    console.log(`🔗 URL de retour définie: ${backUrl}`);
}

/**
 * Applique le filtre pour n'afficher que les logements
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
    
    console.log(`🏠 Filtre logements appliqué: ${filteredPois.length} logements affichés`);
    
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
            if (navigator.geolocation) {
                locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        
                        // Calculer un rayon de 25km autour de la position pour un zoom plus serré
                        // 1 degré ≈ 111km, donc 25km ≈ 0.225 degrés
                        const radiusInDegrees = 25 / 111;
                        
                        const bounds = [
                            [lat - radiusInDegrees, lng - radiusInDegrees], // Sud-ouest
                            [lat + radiusInDegrees, lng + radiusInDegrees]  // Nord-est
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
                        highlightNearbyPois(lat, lng, 50);
                        
                        setTimeout(() => map.removeLayer(userMarker), 5000);
                        locationBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
                    },
                    (error) => {
                        console.error('Erreur de géolocalisation:', error);
                        locationBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
                    }
                );
            }
        });
    }
}

/**
 * Met en évidence les POIs proches de la position utilisateur
 */
function highlightNearbyPois(userLat, userLng, radiusKm) {
    if (!allPois || allPois.length === 0) return;
    
    // Calculer les POIs dans le rayon
    const nearbyPois = allPois.filter(poi => {
        const distance = calculateDistance(userLat, userLng, poi.lat, poi.lng);
        return distance <= radiusKm;
    });
    
    console.log(`${nearbyPois.length} POIs trouvés dans un rayon de ${radiusKm}km`);
    
    if (nearbyPois.length > 0) {
        // Filtrer pour afficher seulement les POIs proches
        filteredPois = nearbyPois;
        displayPois();
        updateCounter();
        
        // Optionnel : afficher un message
        setTimeout(() => {
            const message = nearbyPois.length === 1 ? 
                `${nearbyPois.length} lieu trouvé près de vous` : 
                `${nearbyPois.length} lieux trouvés près de vous`;
            console.log(message);
        }, 1000);
    }
}

/**
 * Calcule la distance entre deux points en kilomètres (formule haversine)
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

/**
 * Convertit les degrés en radians
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Initialise la carte Leaflet
 */
function initMap() {
    try {
        console.log('Initialisation de la carte...');
        console.log('Leaflet disponible:', typeof L !== 'undefined');
        
        const mapElement = document.getElementById('map');
        console.log('Element map dimensions:', mapElement.clientWidth, 'x', mapElement.clientHeight);
        
        map = L.map('map', {
            preferCanvas: false,
            attributionControl: true,
            zoomControl: true
        }).setView(CONFIG.map.center, CONFIG.map.zoom);
        
        console.log('Map object created:', !!map);
        
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
                div.innerHTML = `
                    <button class="map-type-btn" id="mapTypeBtn" title="Changer de vue">
                        <i class="fas fa-map"></i>
                    </button>
                `;
                
                // Empêcher les événements de se propager à la carte
                L.DomEvent.disableClickPropagation(div);
                L.DomEvent.on(div, 'click', function(e) {
                    e.stopPropagation();
                });
                
                return div;
            };
            mapTypeControl.addTo(map);
            console.log('Contrôle de type de carte ajouté à gauche');
            
            // Gérer le clic sur le bouton
            setTimeout(() => {
                const mapTypeBtn = document.getElementById('mapTypeBtn');
                console.log('Bouton trouvé:', !!mapTypeBtn);
                
                if (mapTypeBtn) {
                    mapTypeBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Clic sur bouton de type de carte, état actuel:', currentLayer);
                        
                        if (currentLayer === 'osm') {
                            map.removeLayer(osmLayer);
                            map.addLayer(satelliteLayer);
                            mapTypeBtn.innerHTML = '<i class="fas fa-map"></i>';
                            mapTypeBtn.title = 'Changer de vue';
                            currentLayer = 'satellite';
                            console.log('✅ Basculé vers la vue satellite');
                        } else {
                            map.removeLayer(satelliteLayer);
                            map.addLayer(osmLayer);
                            mapTypeBtn.innerHTML = '<i class="fas fa-map"></i>';
                            mapTypeBtn.title = 'Changer de vue';
                            currentLayer = 'osm';
                            console.log('✅ Basculé vers la vue plan');
                        }
                    });
                } else {
                    console.error('❌ Bouton de type de carte non trouvé');
                }
            }, 200);
        }, 500);
        
        console.log('Map layers added with control');
        
        // Forcer le redimensionnement de la carte
        setTimeout(() => {
            map.invalidateSize();
            console.log('Map size invalidated');
        }, 100);
        
        // Groupe de marqueurs avec gestion des superpositions
        markersGroup = L.layerGroup().addTo(map);
        
        // Ajuster la vue sur la Bretagne
        const bretagneBounds = [
            [47.2, -5.2], // Sud-ouest
            [49.0, -1.0]  // Nord-est
        ];
        map.fitBounds(bretagneBounds);
        
        // Optimisation : précharger les tuiles
        map.on('load', () => {
            console.log('Carte chargée, préchauffage des tuiles...');
        });
        
        console.log('Carte initialisée avec succès');
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
 * Initialise les filtres et événements
 */
function initFilters() {
    const filterBtn = document.getElementById('filterBtn');
    const backFilterBtn = document.getElementById('backFilterBtn');
    const bottomSheet = document.getElementById('bottomSheet');
    const applyFiltersBtn = document.getElementById('applyFiltersInline');
    const resetFiltersBtn = document.getElementById('resetFiltersInline');
    const searchInput = document.querySelector('.search-input');
    
    // Toggle des filtres dans la popup fixe
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            if (isFiltersOpen) {
                hideFixedPopup();
            } else {
                showFiltersPopup();
            }
        });
    }
    
    // Retour depuis les filtres
    if (backFilterBtn) {
        backFilterBtn.addEventListener('click', () => {
            bottomSheet.classList.remove('filter-mode');
        });
    }
    
    // Appliquer les filtres
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            applyFilters();
            bottomSheet.classList.remove('filter-mode');
        });
    }
    
    // Réinitialiser les filtres
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
                input.checked = input.value === 'distance';
            });
            if (searchInput) searchInput.value = '';
            applyFilters();
        });
    }
    
    // Recherche en temps réel avec autocomplétion
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            const query = searchInput.value.toLowerCase().trim();
            if (query.length >= 1) {
                showSearchSuggestions(query);
                applyFilters();
            } else {
                hideSearchSuggestions();
                applyFilters();
            }
            // Fermer les filtres si ouverts lors de la recherche
            if (isFiltersOpen) {
                hideFixedPopup();
            }
        }, 150));
        
        // Gestion du focus et blur
        searchInput.addEventListener('focus', () => {
            const query = searchInput.value.toLowerCase().trim();
            if (query.length >= 1) {
                showSearchSuggestions(query);
            }
        });
        
        // Navigation clavier dans les suggestions
        searchInput.addEventListener('keydown', handleSearchKeyboard);
        
        // Masquer l'autocomplétion quand on efface le champ
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Backspace' || e.key === 'Delete') {
                const autocompleteInput = document.getElementById('searchAutocomplete');
                if (autocompleteInput && searchInput.value.length === 0) {
                    autocompleteInput.value = '';
                }
            }
        });
    }
    
    // Filtres par cases à cocher et radio
    document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
        input.addEventListener('change', () => {
            if (input.type === 'radio') {
                // Pour les radio buttons, désélectionner les autres du même groupe
                const name = input.name;
                document.querySelectorAll(`input[type="radio"][name="${name}"]`).forEach(radio => {
                    radio.checked = radio === input;
                });
            }
        });
    });
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
    if (!allPois || allPois.length === 0) return;
    
    const autocompleteInput = document.getElementById('searchAutocomplete');
    if (!autocompleteInput) return;
    
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
            if (a.priority !== b.priority) return a.priority - b.priority;
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
    
    if (!searchInput || !autocompleteInput) return;
    
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
    
    if (!searchInput || !autocompleteInput || !currentSuggestions.length) return;
    
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
    if (!searchValue || !allPois) return;
    
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
        console.log('Chargement optimisé des POIs...');
        
        const response = await fetch('data/pois.json?' + Date.now());
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        allPois = data.pois || [];
        
        console.log(`${allPois.length} POIs chargés`);
        
        // Filtrer immédiatement pour ne garder que les POIs essentiels au premier chargement
        filteredPois = [...allPois];
        
        // Afficher les POIs avec un petit délai pour laisser la carte se charger
        setTimeout(() => {
            displayPois();
            updateCounter();
            console.log('POIs affichés avec succès');
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
    if (loadingPois) return; // Éviter les appels multiples
    loadingPois = true;
    
    console.log('=== displayPois appelée (optimisée) ===');
    console.log('POIs filtrés à afficher:', filteredPois.length);
    
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
        console.log('Aucun marqueur à afficher');
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
        console.log(`✅ Tous les marqueurs ajoutés: ${markersGroup.getLayers().length} POIs affichés`);
    }
}



/**
 * Applique un décalage automatique aux marqueurs trop proches pour éviter la superposition
 */
function applyMarkerOffset(pois, threshold = 0.005) {
    const offsetPois = pois.map(poi => ({ ...poi })); // Copie profonde
    const processed = new Set();
    
    pois.forEach((poi, index) => {
        if (processed.has(index)) return;
        
        // Chercher les POIs proches de celui-ci
        const nearbyIndices = [index];
        processed.add(index);
        
        pois.forEach((otherPoi, otherIndex) => {
            if (otherIndex === index || processed.has(otherIndex)) return;
            
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
                if (spiralIndex === 0) return; // Le premier reste à sa position originale
                
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
                ${(poi.id === 'vallee-de-pratmeur' || poi.id === 'agapa-hotel-perros-guirec' || poi.id === 'villa-blockhaus-audrey' || poi.id === 'grand-hotel-barriere-dinard' || poi.id === 'sandaya-camping-carnac' || poi.id === 'hotel-castelbrac-dinard-v2' || poi.id === 'balthazar-hotel-spa-rennes' || poi.id === 'grand-hotel-thermes-saint-malo' || poi.id === 'chateau-apigne-le-rheu' || poi.id === 'domaine-locguenole-spa-kervignac' || poi.id === 'domaine-bretesche-golf-spa-missillac' || poi.id === 'miramar-la-cigale-arzon' || poi.id === 'sofitel-quiberon-thalassa-sea-spa') ? `
                    <div class="popup-actions-grid">
                        <button class="discover-btn-simple secondary" onclick="window.location.href='poi.html?slug=${poi.slug}'">
                            Découvrir
                        </button>
                        <button class="reserve-btn-simple" onclick="window.open('${poi.website}', '_blank', 'noopener,noreferrer')">
                            Réserver
                        </button>
                    </div>
                ` : `
                    <button class="discover-btn-simple" onclick="window.location.href='poi.html?slug=${poi.slug}'">
                        Découvrir ${article} ${categoryName}
                    </button>
                `}
            </div>
        </div>
    `;
}

/**
 * Applique les filtres sélectionnés
 */
function applyFilters() {
    console.log('=== DEBUT applyFilters ===');
    console.log('Tous les POIs disponibles:', allPois.length);
    
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
        console.log('Checkboxes trouvées dans la popup:', checkboxes.length);
        
        checkboxes.forEach(checkbox => {
            console.log('Checkbox cochée:', checkbox.value, 'name:', checkbox.name);
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
    
    console.log('Catégories sélectionnées:', selectedCategories);
    console.log('Départements sélectionnés:', selectedDepartments);
    console.log('Terme de recherche:', searchTerm);
    
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
                              
            if (!searchMatch) return false;
        }
        
        return true;
    });
    
    const filterTime = performance.now() - startTime;
    console.log(`Filtrage optimisé: ${filterTime.toFixed(2)}ms pour ${filteredPois.length}/${allPois.length} POIs`);
    
    console.log('Résultat du filtrage:', filteredPois.length, 'POIs');
    console.log('POIs filtrés:', filteredPois.map(poi => poi.title));
    
    // Mettre à jour l'affichage
    displayPois();
    updateCounter();
    
    // Auto-focus sur les POIs filtrés
    autoFocusOnFilteredPois();
    
    console.log('=== FIN applyFilters ===');
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
        [Math.max(...lats), Math.max(...lngs)]  // Nord-est
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
    if (!cardsGrid) return;
    
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
        monument: 'fas fa-landmark',          // Monument
        musee: 'fas fa-university',           // Musée
        point_de_vue: 'fas fa-eye',           // Point de vue
        plage: 'fas fa-umbrella-beach',       // Plage
        village: 'fas fa-home',               // Village
        parc: 'fas fa-tree',                  // Parc / Jardin
        randonnee: 'fas fa-hiking',           // Randonnée
        chateau: 'fas fa-chess-rook',         // Château
        festival: 'fas fa-music',             // Festival
        loisirs: 'fas fa-star',               // Activité / Loisir
        hotel: 'fas fa-bed',                  // Hotel
        villa: 'fas fa-house-user',           // Villa
        logement_insolite: 'fas fa-tree-city',   // Logement Insolite
        camping: 'fas fa-campground',         // Camping
        restaurant: 'fas fa-utensils'         // Restaurant
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
        resultsCounter.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
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
        return JSON.parse(localStorage.getItem('labellebretagne-favorites') || '[]');
    } catch {
        return [];
    }
}

function addToFavorites(poiId) {
    const favorites = getFavorites();
    if (!favorites.includes(poiId)) {
        favorites.push(poiId);
        localStorage.setItem('labellebretagne-favorites', JSON.stringify(favorites));
        return true;
    }
    return false;
}

function removeFromFavorites(poiId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(poiId);
    if (index > -1) {
        favorites.splice(index, 1);
        localStorage.setItem('labellebretagne-favorites', JSON.stringify(favorites));
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
    
    loadPoiData(slug);
}

/**
 * Charge les données d'un POI spécifique
 */
async function loadPoiData(slug) {
    try {
        const response = await fetch('data/pois.json?' + Date.now());
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
    
    if (loading) loading.style.display = 'none';
    if (content) content.style.display = 'block';
    
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
        categoriesContainer.innerHTML = poi.categories.map(cat => 
            `<span class="category-tag">
                <i class="${getPoiIcon(cat)}"></i>
                ${getCategoryName(cat)}
            </span>`
        ).join('');
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
            tagsContainer.innerHTML = poi.tags.map(tag => 
                `<span class="tag">${tag}</span>`
            ).join('');
        }
    }
    
    // Bouton itinéraire
    const itineraryBtn = document.getElementById('itineraryBtn');
    if (itineraryBtn) {
        itineraryBtn.onclick = () => openItinerary(poi.lat, poi.lng);
    }
    
    // Boutons réserver (pour certains POIs comme la Vallée de Pratmeur, l'Agapa Hotel, la Villa Blockhaus, le Grand Hôtel Barrière, le Camping Sandaya et l'Hôtel Castelbrac)
    if ((poi.id === 'vallee-de-pratmeur' || poi.id === 'agapa-hotel-perros-guirec' || poi.id === 'villa-blockhaus-audrey' || poi.id === 'grand-hotel-barriere-dinard' || poi.id === 'sandaya-camping-carnac' || poi.id === 'hotel-castelbrac-dinard-v2' || poi.id === 'balthazar-hotel-spa-rennes' || poi.id === 'grand-hotel-thermes-saint-malo' || poi.id === 'chateau-apigne-le-rheu' || poi.id === 'domaine-locguenole-spa-kervignac' || poi.id === 'domaine-bretesche-golf-spa-missillac' || poi.id === 'miramar-la-cigale-arzon' || poi.id === 'sofitel-quiberon-thalassa-sea-spa') && poi.website) {
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
    
    // Bouton partage
    initShareButton(poi);
}

/**
 * Affiche la galerie d'images supplémentaires du POI
 */
function displayPoiGallery(poi) {
    const gallerySection = document.getElementById('poiGallery');
    const imagesGrid = document.getElementById('poiImagesGrid');
    
    if (!gallerySection || !imagesGrid) return;
    
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
    
    switch(poi.id) {
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
    
    imagesGrid.innerHTML = additionalImages.map((imageUrl, index) => `
        <div class="poi-gallery-image" onclick="openImageModal('${imageUrl}', '${poi.title} - ${imageLabels[index] || 'Vue ' + (index + 1)}')">
            <img src="${imageUrl}" 
                 alt="${poi.title} - ${imageLabels[index] || 'Vue ' + (index + 1)}" 
                 onerror="this.src='assets/img/placeholder.jpg'">
            <div class="poi-gallery-overlay">
                <div class="poi-gallery-caption">
                    ${imageLabels[index] || `Vue ${index + 1}`}
                </div>
            </div>
        </div>
    `).join('');
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
    if (!favoriteBtn) return;
    
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
    if (!shareBtn) return;
    
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
    
    if (loading) loading.style.display = 'none';
    if (error) error.style.display = 'flex';
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
        // Générer le contenu
        popupContent.innerHTML = createPopupContent(poi);
        
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
        // Générer le contenu des filtres
        popupContent.innerHTML = createFiltersContent();
        
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
    console.log('=== handleApplyFilters appelée ===');
    console.log('Filtres avant application:', {
        categories: getSelectedCheckboxValues('input[type="checkbox"]:not([name="department"])'),
        departments: getSelectedCheckboxValues('input[name="department"]')
    });
    
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
    console.log('=== handleResetFilters appelée ===');
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


/**
 * Test simple des filtres - à supprimer après debug
 */
function testFilters() {
    console.log('=== TEST FILTRES ===');
    console.log('Total POIs:', allPois.length);
    
    // Test : filtrer seulement les monuments
    const monumentPois = allPois.filter(poi => {
        return poi.categories && poi.categories.includes('monument');
    });
    
    console.log('POIs avec catégorie "monument":', monumentPois.length);
    monumentPois.forEach(poi => {
        console.log(`- ${poi.title}: ${poi.categories.join(', ')}`);
    });
    
    // Test : filtrer seulement les plages
    const plagePois = allPois.filter(poi => {
        return poi.categories && poi.categories.includes('plage');
    });
    
    console.log('POIs avec catégorie "plage":', plagePois.length);
    plagePois.forEach(poi => {
        console.log(`- ${poi.title}: ${poi.categories.join(', ')}`);
    });
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
    
    if (galleryImages.length === 0) return;
    
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
    if (!gallery) return;
    
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
        if (!isDragging) return;
        e.preventDefault();
    }, { passive: false });
    
    gallery.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
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
window.testFilters = testFilters; // Pour debug