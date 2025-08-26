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
        plage: '#06b6d4',
        musee: '#8b5cf6',
        monument: '#f59e0b',
        randonnee: '#10b981',
        festival: '#f97316',
        village: '#ef4444',
        hotel: '#64748b',
        logement_insolite: '#ec4899',
        point_de_vue: '#059669',
        loisirs: '#6366f1'
    }
};

// Variables globales
let map;
let markersGroup;
let allPois = [];
let filteredPois = [];

/**
 * Initialisation de l'application
 */
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('map')) {
        initMap();
        initFilters();
        initLocationButton();
        initBottomSheet();
        initFixedPopup();
        loadPois();
    }
});

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
        
        // Optionnel: réduire en cliquant sur la carte
        document.getElementById('map').addEventListener('click', () => {
            // Pas de fermeture automatique pour garder l'équilibre
        });
    }
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
                        map.setView([lat, lng], 12);
                        
                        // Ajouter un marqueur temporaire
                        const userMarker = L.marker([lat, lng], {
                            icon: L.divIcon({
                                className: 'user-location-marker',
                                html: '<i class="fas fa-location-arrow" style="color: #60d394;"></i>',
                                iconSize: [20, 20]
                            })
                        }).addTo(map);
                        
                        setTimeout(() => map.removeLayer(userMarker), 3000);
                        locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
                    },
                    (error) => {
                        console.error('Erreur de géolocalisation:', error);
                        locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
                    }
                );
            }
        });
    }
}

/**
 * Initialise la carte Leaflet
 */
function initMap() {
    map = L.map('map').setView(CONFIG.map.center, CONFIG.map.zoom);
    
    // Tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: CONFIG.map.minZoom,
        maxZoom: CONFIG.map.maxZoom
    }).addTo(map);
    
    // Groupe de marqueurs
    markersGroup = L.layerGroup().addTo(map);
    
    // Ajuster la vue sur la Bretagne
    const bretagneBounds = [
        [47.2, -5.2], // Sud-ouest
        [49.0, -1.0]  // Nord-est
    ];
    map.fitBounds(bretagneBounds);
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
            showFiltersPopup();
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
    
    // Recherche en temps réel
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
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
 * Charge les données des POIs
 */
async function loadPois() {
    try {
        const response = await fetch('data/pois.json');
        const data = await response.json();
        allPois = data.pois || [];
        filteredPois = [...allPois];
        displayPois();
        updateCounter();
    } catch (error) {
        console.error('Erreur lors du chargement des POIs:', error);
        showError('Impossible de charger les données');
    }
}

/**
 * Affiche les POIs sur la carte et dans les cartes
 */
function displayPois() {
    markersGroup.clearLayers();
    
    // Afficher sur la carte
    filteredPois.forEach(poi => {
        const marker = createMarker(poi);
        markersGroup.addLayer(marker);
    });
    
    // Afficher dans les cartes
    displayPoiCards();
}

/**
 * Crée un marqueur personnalisé pour un POI avec icône de catégorie
 */
function createMarker(poi) {
    const iconClass = getPoiIcon(poi.categories[0]);
    
    // Créer une icône personnalisée avec l'icône de la catégorie
    const customIcon = L.divIcon({
        className: 'custom-poi-marker',
        html: `<div class="poi-marker-content">
                   <i class="${iconClass}"></i>
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
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
                <img src="${poi.image}" alt="${poi.title}" 
                     onerror="this.src='assets/img/placeholder.jpg'">
            </div>
            
            <p class="popup-description-simple">${poi.shortDescription}</p>
            
            <button class="favorite-btn-simple ${isFavorite ? 'active' : ''}" onclick="toggleFavoriteInPopup('${poi.id}', this)">
                <i class="fas fa-heart"></i>
            </button>
            
            <div class="popup-action-simple">
                <button class="discover-btn-simple" onclick="window.location.href='poi.html?slug=${poi.slug}'">
                    Découvrir ${article} ${categoryName}
                </button>
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
    
    // Si aucun filtre n'est sélectionné, afficher tous les POIs
    if (selectedCategories.length === 0 && selectedDepartments.length === 0) {
        console.log('Aucun filtre sélectionné, affichage de tous les POIs');
        filteredPois = [...allPois];
    } else {
        // Filtrer par catégories ET départements
        filteredPois = allPois.filter(poi => {
            let matches = true;
            
            // Vérifier les catégories si des catégories sont sélectionnées
            if (selectedCategories.length > 0) {
                const hasCategory = poi.categories && poi.categories.some(cat => selectedCategories.includes(cat));
                matches = matches && hasCategory;
            }
            
            // Vérifier les départements si des départements sont sélectionnés
            if (selectedDepartments.length > 0) {
                const hasDepartment = selectedDepartments.includes(poi.department);
                matches = matches && hasDepartment;
            }
            
            if (matches) {
                console.log(`POI "${poi.title}" correspond (catégories: ${poi.categories?.join(', ')}, département: ${poi.department})`);
            }
            return matches;
        });
    }
    
    console.log('Résultat du filtrage:', filteredPois.length, 'POIs');
    console.log('POIs filtrés:', filteredPois.map(poi => poi.title));
    
    // Mettre à jour l'affichage
    displayPois();
    console.log('=== FIN applyFilters ===');
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
        plage: 'fas fa-umbrella-beach',
        musee: 'fas fa-university',
        monument: 'fas fa-landmark',
        randonnee: 'fas fa-hiking',
        festival: 'fas fa-music',
        village: 'fas fa-home',
        hotel: 'fas fa-bed',
        villa: 'fas fa-house-user',
        logement_insolite: 'fas fa-campground',
        point_de_vue: 'fas fa-mountain',
        loisirs: 'fas fa-gamepad'
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
        const response = await fetch('data/pois.json');
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
    updateElement('poiTitle', poi.title);
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
    
    // Badges
    const badgesContainer = document.getElementById('poiBadges');
    if (badgesContainer) {
        const badges = [];
        if (poi.tested) badges.push('<span class="badge badge-tested">Testé par LBB</span>');
        if (poi.coupDeCoeur) badges.push('<span class="badge badge-heart">Coup de ❤️ LBB</span>');
        badgesContainer.innerHTML = badges.join('');
    }
    
    // Section avis (si testé)
    const avisSection = document.getElementById('avisSection');
    const avisText = document.getElementById('avisText');
    if (avisSection && poi.tested) {
        avisSection.style.display = 'block';
        
        // Texte personnalisé selon le lieu
        let customAvisText = '';
        switch(poi.id) {
            case 'festival-vieilles-charrues':
                customAvisText = '🎸 Notre rendez-vous de l\'année ! Les Vieilles Charrues est LE festival immanquable pour nous ! Une programmation exceptionnelle, une ambiance bretonne unique et des souvenirs inoubliables nous attendent chaque été à Carhaix.';
                break;
            case 'pointe-du-raz':
                customAvisText = '🌊 Un site à couper le souffle ! La Pointe du Raz nous fascine par sa beauté sauvage et ses panoramas extraordinaires. Un incontournable pour découvrir la Bretagne authentique.';
                break;
            case 'mont-saint-michel':
                customAvisText = '🏰 Majestueux et mystique ! Le Mont-Saint-Michel nous émerveille à chaque visite. Un joyau architectural au cœur des plus grandes marées d\'Europe.';
                break;
            case 'saint-malo':
                customAvisText = '🏴‍☠️ La cité corsaire nous transporte ! Saint-Malo conjugue parfaitement histoire maritime et charme breton. Ses remparts et ses plages en font une destination parfaite.';
                break;
            default:
                customAvisText = '🎆 Ce lieu a été personnellement visité et testé par notre équipe. Nous le recommandons pour son authenticité et la qualité de l\'expérience proposée.';
        }
        
        if (avisText) {
            avisText.textContent = customAvisText;
        }
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
    
    // Bouton favoris
    initFavoriteButton(poi.id);
    
    // Bouton partage
    initShareButton(poi);
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
        plage: 'plage',
        musee: 'musée',
        monument: 'monument',
        randonnee: 'randonnée',
        festival: 'festival',
        village: 'village',
        hotel: 'hôtel',
        villa: 'villa',
        logement_insolite: 'logement insolite',
        point_de_vue: 'point de vue',
        loisirs: 'loisirs'
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
        setTimeout(() => {
            fixedPopup.style.display = 'none';
        }, 400);
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
        
        // Initialiser les événements des filtres
        initFilterEvents();
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
                        <input type="checkbox" value="monument">
                        <div class="chip-content">
                            <i class="fas fa-landmark"></i>
                            <span>Monuments</span>
                        </div>
                    </label>
                    <label class="category-chip">
                        <input type="checkbox" value="point_de_vue">
                        <div class="chip-content">
                            <i class="fas fa-mountain"></i>
                            <span>Panoramas</span>
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
                        <input type="checkbox" value="musee">
                        <div class="chip-content">
                            <i class="fas fa-university"></i>
                            <span>Culture</span>
                        </div>
                    </label>
                    <label class="category-chip">
                        <input type="checkbox" value="hotel">
                        <div class="chip-content">
                            <i class="fas fa-bed"></i>
                            <span>Hébergement</span>
                        </div>
                    </label>
                    <label class="category-chip">
                        <input type="checkbox" value="logement_insolite">
                        <div class="chip-content">
                            <i class="fas fa-campground"></i>
                            <span>Insolite</span>
                        </div>
                    </label>
                    <label class="category-chip">
                        <input type="checkbox" value="festival">
                        <div class="chip-content">
                            <i class="fas fa-music"></i>
                            <span>Festivals</span>
                        </div>
                    </label>
                </div>
                </div>
            </div>
            
            <div class="filters-footer-popup">
                <button class="btn-apply-popup" id="applyFiltersPopup">
                    Appliquer
                </button>
                <button class="btn-reset-popup" id="resetFiltersPopup">
                    Tout effacer
                </button>
            </div>
        </div>
    `;
}

/**
 * Initialise les événements des filtres dans la popup
 */
function initFilterEvents() {
    console.log('=== Initialisation des événements de filtres ===');
    
    const applyBtn = document.getElementById('applyFiltersPopup');
    const resetBtn = document.getElementById('resetFiltersPopup');
    
    console.log('Bouton Appliquer trouvé:', !!applyBtn);
    console.log('Bouton Reset trouvé:', !!resetBtn);
    
    if (applyBtn) {
        applyBtn.addEventListener('click', (e) => {
            console.log('=== CLIC sur Appliquer ===');
            e.preventDefault();
            applyFilters();
            hideFixedPopup();
        });
    } else {
        console.error('Bouton Appliquer non trouvé !');
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            console.log('=== CLIC sur Reset ===');
            e.preventDefault();
            // Décocher toutes les cases
            const popup = document.getElementById('fixedPopup');
            if (popup) {
                popup.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = false;
                });
            }
            applyFilters();
        });
    } else {
        console.error('Bouton Reset non trouvé !');
    }
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

// Exposer les fonctions globalement
window.initPoiPage = initPoiPage;
window.openItinerary = openItinerary;
window.toggleFavorite = toggleFavorite;
window.toggleFavoriteInPopup = toggleFavoriteInPopup;
window.showFixedPopup = showFixedPopup;
window.hideFixedPopup = hideFixedPopup;
window.testFilters = testFilters; // Pour debug