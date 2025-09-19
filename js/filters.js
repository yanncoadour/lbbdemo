/**
 * Module de gestion des filtres
 * Fonctions liées au filtrage et tri des POIs
 */

// Variables pour les filtres
// Note: isFiltersOpen est défini dans app.js
let currentFilters = {
    departments: [],
    categories: [],
    sort: 'distance'
};

/**
 * Initialise le système de filtres
 */
function initFilters() {
    if (window.filtersInitialized) {
        console.log('⚠️ Filtres déjà initialisés, on ignore');
        return;
    }

    console.log('🚀 InitFilters appelé!');
    const filterBtn = document.getElementById('filterBtn');
    const backFilterBtn = document.getElementById('backFilterBtn');
    const applyFiltersBtn = document.getElementById('applyFiltersInline');
    const resetFiltersBtn = document.getElementById('resetFiltersInline');

    console.log('🔧 InitFilters - Bouton filtre trouvé:', filterBtn ? 'OUI' : 'NON');
    console.log('🔧 Bouton filtre element:', filterBtn);

    if (filterBtn) {
        window.filtersInitialized = true;
        // Test direct d'event listener
        const testHandler = () => {
            console.log('🎯 BOUTON FILTRE CLIQUÉ - TEST DIRECT');
            showFiltersPopup();
        };

        // Retirer les anciens listeners
        filterBtn.removeEventListener('click', showFiltersPopup);
        filterBtn.removeEventListener('click', testHandler);

        // Ajouter le nouveau
        filterBtn.addEventListener('click', testHandler);
        console.log('✅ Event listener attaché au bouton filtre avec test handler');

        // Test si le bouton est visible et clickable
        console.log('📍 Bouton position:', filterBtn.getBoundingClientRect());
        console.log('👁️ Bouton visible:', filterBtn.offsetParent !== null);

    } else {
        console.error('❌ Bouton filtre non trouvé!');
        // Lister tous les éléments avec 'filter' dans l'ID
        console.log('🔍 Éléments avec filter:', document.querySelectorAll('[id*="filter"]'));
    }

    if (backFilterBtn) {
        backFilterBtn.addEventListener('click', hideFiltersPopup);
    }

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
}

/**
 * Affiche la popup de filtres
 */
function showFiltersPopup() {
    console.log('🚀 showFiltersPopup appelée - TEST');
    const bottomSheet = document.getElementById('bottomSheet');
    const filterContent = document.querySelector('.filter-content');

    console.log('📋 BottomSheet trouvé:', bottomSheet ? 'OUI' : 'NON');
    console.log('📋 FilterContent trouvé:', filterContent ? 'OUI' : 'NON');

    if (bottomSheet && filterContent) {
        const filtersContent = createSimpleFiltersContent();
        console.log('🔧 Contenu généré:', `${filtersContent.substring(0, 100)}...`);

        if (typeof window.Security !== 'undefined' && window.Security.safeSetInnerHTML) {
            window.Security.safeSetInnerHTML(filterContent, filtersContent);
        } else {
            filterContent.innerHTML = filtersContent;
        }

        bottomSheet.classList.add('mini-filters-mode');
        console.log('✅ Classe mini-filters-mode ajoutée');
        console.log('📏 Bottom sheet height:', window.getComputedStyle(bottomSheet).height);

        // Attacher les événements après insertion du HTML
        attachMiniFilterEvents();

        if (typeof window !== 'undefined') {
            window.isFiltersOpen = true;
        }
    } else {
        console.error('❌ Éléments requis non trouvés!');
    }
}

/**
 * Cache la popup de filtres
 */
function hideFiltersPopup() {
    const bottomSheet = document.getElementById('bottomSheet');
    if (bottomSheet) {
        bottomSheet.classList.remove('mini-filters-mode');

        const filterContent = document.querySelector('.filter-content');
        if (filterContent) {
            filterContent.innerHTML = '';
        }

        if (typeof window !== 'undefined') {
            window.isFiltersOpen = false;
        }
    }
}

/**
 * Attache les événements aux mini filtres
 */
function attachMiniFilterEvents() {
    const filterContent = document.querySelector('.filter-content');
    if (!filterContent) {
        return;
    }

    // Gérer les changements d'état des inputs directement
    filterContent.addEventListener('change', (e) => {
        const input = e.target;
        if (!input.matches('input[type="radio"], input[type="checkbox"]')) {
            return;
        }

        if (input.type === 'radio') {
            // Pour les radios, pas besoin de gestion spéciale de classe
            console.log('Radio sélectionné:', input.value);
        } else if (input.type === 'checkbox') {
            // Pour les checkboxes, pas besoin de gestion spéciale de classe
            console.log('Checkbox toggled:', input.value, input.checked);
        }
    });

    console.log('✅ Événements des filtres démo attachés');
}

/**
 * Crée le contenu HTML des filtres simples
 */
function createSimpleFiltersContent() {
    return `
        <div class="demo-filters">
            <div class="filters-header">
                <h3>Filtres</h3>
                <button class="close-btn" onclick="window.FiltersModule.hideFiltersPopup()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- Tri -->
            <div class="filter-group">
                <h4>Trier par</h4>
                <div class="radio-options">
                    <label class="radio-option">
                        <input type="radio" name="sort" value="distance" ${currentFilters.sort === 'distance' ? 'checked' : ''}>
                        <span class="radio-label">Distance</span>
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="sort" value="recent" ${currentFilters.sort === 'recent' ? 'checked' : ''}>
                        <span class="radio-label">Récents</span>
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="sort" value="rating" ${currentFilters.sort === 'rating' ? 'checked' : ''}>
                        <span class="radio-label">Populaires</span>
                    </label>
                </div>
            </div>
            
            <!-- Départements -->
            <div class="filter-group">
                <h4>Départements</h4>
                <div class="checkbox-grid">
                    <label class="checkbox-option">
                        <input type="checkbox" value="Finistère" name="department" ${currentFilters.departments.includes('Finistère') ? 'checked' : ''}>
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Finistère</span>
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" value="Ille-et-Vilaine" name="department" ${currentFilters.departments.includes('Ille-et-Vilaine') ? 'checked' : ''}>
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Ille-et-Vilaine</span>
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" value="Loire-Atlantique" name="department" ${currentFilters.departments.includes('Loire-Atlantique') ? 'checked' : ''}>
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Loire-Atlantique</span>
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" value="Morbihan" name="department" ${currentFilters.departments.includes('Morbihan') ? 'checked' : ''}>
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Morbihan</span>
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" value="Côtes-d'Armor" name="department" ${currentFilters.departments.includes("Côtes-d'Armor") ? 'checked' : ''}>
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Côtes-d'Armor</span>
                    </label>
                </div>
            </div>
            
            <!-- Catégories -->
            <div class="filter-group">
                <h4>Types de lieux</h4>
                <div class="checkbox-grid">
                    <label class="checkbox-option">
                        <input type="checkbox" value="plage" name="category" ${currentFilters.categories.includes('plage') ? 'checked' : ''}>
                        <i class="fas fa-umbrella-beach"></i>
                        <span>Plages</span>
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" value="village" name="category" ${currentFilters.categories.includes('village') ? 'checked' : ''}>
                        <i class="fas fa-home"></i>
                        <span>Villages</span>
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" value="monument" name="category" ${currentFilters.categories.includes('monument') ? 'checked' : ''}>
                        <i class="fas fa-landmark"></i>
                        <span>Monuments</span>
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" value="point_de_vue" name="category" ${currentFilters.categories.includes('point_de_vue') ? 'checked' : ''}>
                        <i class="fas fa-eye"></i>
                        <span>Panoramas</span>
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" value="randonnee" name="category" ${currentFilters.categories.includes('randonnee') ? 'checked' : ''}>
                        <i class="fas fa-hiking"></i>
                        <span>Randonnées</span>
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" value="musee" name="category" ${currentFilters.categories.includes('musee') ? 'checked' : ''}>
                        <i class="fas fa-university"></i>
                        <span>Culture</span>
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" value="hotel" name="category" ${currentFilters.categories.includes('hotel') ? 'checked' : ''}>
                        <i class="fas fa-bed"></i>
                        <span>Hébergement</span>
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" value="logement_insolite" name="category" ${currentFilters.categories.includes('logement_insolite') ? 'checked' : ''}>
                        <i class="fas fa-tree-city"></i>
                        <span>Insolite</span>
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" value="festival" name="category" ${currentFilters.categories.includes('festival') ? 'checked' : ''}>
                        <i class="fas fa-music"></i>
                        <span>Festivals</span>
                    </label>
                </div>
            </div>
            
            <div class="filter-actions">
                <button class="btn-apply" onclick="window.FiltersModule.applyFilters()">
                    Appliquer les filtres
                </button>
                <button class="btn-reset" onclick="window.FiltersModule.resetFilters()">
                    Réinitialiser
                </button>
            </div>
        </div>
    `;
}

/**
 * Crée le contenu HTML des filtres compacts (ancienne version)
 */
function createCompactFiltersContent() {
    return `
        <div class="compact-filters">
            <!-- Header avec bouton fermer -->
            <div class="compact-filters-header">
                <h4>Filtres</h4>
                <button class="compact-close-btn" onclick="window.FiltersModule.hideFiltersPopup()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- Options de tri horizontales -->
            <div class="compact-sort">
                <span class="compact-label">Tri:</span>
                <div class="compact-pills">
                    <label class="compact-pill">
                        <input type="radio" name="sort" value="distance" ${currentFilters.sort === 'distance' ? 'checked' : ''}>
                        <span>Distance</span>
                    </label>
                    <label class="compact-pill">
                        <input type="radio" name="sort" value="recent" ${currentFilters.sort === 'recent' ? 'checked' : ''}>
                        <span>Récents</span>
                    </label>
                    <label class="compact-pill">
                        <input type="radio" name="sort" value="rating" ${currentFilters.sort === 'rating' ? 'checked' : ''}>
                        <span>Populaires</span>
                    </label>
                </div>
            </div>
            
            <!-- Catégories compactes -->
            <div class="compact-categories">
                <span class="compact-label">Type:</span>
                <div class="compact-chips">
                    ${createCompactCategoryFilters()}
                </div>
            </div>
            
            <!-- Départements compacts -->
            <div class="compact-departments">
                <span class="compact-label">Dept:</span>
                <div class="compact-chips">
                    ${createCompactDepartmentFilters()}
                </div>
            </div>
            
            <!-- Actions -->
            <div class="compact-actions">
                <button class="compact-apply" onclick="window.FiltersModule.applyFilters()">
                    Appliquer
                </button>
                <button class="compact-reset" onclick="window.FiltersModule.resetFilters()">
                    Reset
                </button>
            </div>
        </div>
    `;
}

/**
 * Crée le contenu HTML des filtres (version complète - conservée pour compatibilité)
 */
function createFiltersContent() {
    return `
        <div class="filter-header">
            <button class="back-filter-btn" onclick="window.FiltersModule.hideFiltersPopup()">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2>Filtres</h2>
        </div>
        
        <!-- Tri -->
        <div class="filter-group">
            <h3>Trier par</h3>
            <div class="radio-group">
                <label class="radio-option">
                    <input type="radio" name="sort" value="distance" ${currentFilters.sort === 'distance' ? 'checked' : ''}>
                    <span class="radio-label">Distance</span>
                </label>
                <label class="radio-option">
                    <input type="radio" name="sort" value="recent" ${currentFilters.sort === 'recent' ? 'checked' : ''}>
                    <span class="radio-label">Récents</span>
                </label>
                <label class="radio-option">
                    <input type="radio" name="sort" value="rating" ${currentFilters.sort === 'rating' ? 'checked' : ''}>
                    <span class="radio-label">Populaires</span>
                </label>
            </div>
        </div>
        
        <!-- Départements -->
        <div class="filter-group">
            <h3>Départements</h3>
            <div class="type-grid">
                ${createDepartmentFilters()}
            </div>
        </div>
        
        <!-- Categories -->
        <div class="filter-group">
            <h3>Types de lieux</h3>
            <div class="type-grid">
                ${createCategoryFilters()}
            </div>
        </div>
        
        <div class="filter-actions">
            <button class="btn-apply" onclick="window.FiltersModule.applyFilters()">
                Appliquer les filtres
            </button>
            <button class="btn-reset" onclick="window.FiltersModule.resetFilters()">
                Réinitialiser
            </button>
        </div>
    `;
}

/**
 * Crée les filtres de départements
 */
function createDepartmentFilters() {
    const departments = [
        { name: 'Finistère', icon: 'fa-map-marker-alt' },
        { name: 'Ille-et-Vilaine', icon: 'fa-map-marker-alt' },
        { name: 'Loire-Atlantique', icon: 'fa-map-marker-alt' },
        { name: 'Morbihan', icon: 'fa-map-marker-alt' },
        { name: 'Côtes-d\'Armor', icon: 'fa-map-marker-alt' }
    ];

    return departments.map(dept => {
        const isChecked = currentFilters.departments.includes(dept.name);
        return `
            <label class="type-option">
                <input type="checkbox" value="${dept.name}" name="department" ${isChecked ? 'checked' : ''}>
                <i class="fas ${dept.icon}"></i>
                <span>${dept.name}</span>
            </label>
        `;
    }).join('');
}

/**
 * Crée les filtres de catégories compactes
 */
function createCompactCategoryFilters() {
    const categories = [
        { value: 'plage', label: 'Plages', icon: 'fas fa-umbrella-beach' },
        { value: 'village', label: 'Villages', icon: 'fas fa-home' },
        { value: 'monument', label: 'Monuments', icon: 'fas fa-landmark' },
        { value: 'hotel', label: 'Hôtels', icon: 'fas fa-bed' },
        { value: 'festival', label: 'Festivals', icon: 'fas fa-music' },
        { value: 'randonnee', label: 'Rando', icon: 'fas fa-hiking' }
    ];

    return categories.map(cat => {
        const isChecked = currentFilters.categories.includes(cat.value);
        return `
            <label class="compact-chip">
                <input type="checkbox" value="${cat.value}" name="category" ${isChecked ? 'checked' : ''}>
                <i class="${cat.icon}"></i>
                <span>${cat.label}</span>
            </label>
        `;
    }).join('');
}

/**
 * Crée les filtres de départements compacts
 */
function createCompactDepartmentFilters() {
    const departments = [
        { name: '29', fullName: 'Finistère' },
        { name: '35', fullName: 'Ille-et-Vilaine' },
        { name: '44', fullName: 'Loire-Atlantique' },
        { name: '56', fullName: 'Morbihan' },
        { name: '22', fullName: 'Côtes-d\'Armor' }
    ];

    return departments.map(dept => {
        const isChecked = currentFilters.departments.includes(dept.fullName);
        return `
            <label class="compact-chip">
                <input type="checkbox" value="${dept.fullName}" name="department" ${isChecked ? 'checked' : ''}>
                <span>${dept.name}</span>
            </label>
        `;
    }).join('');
}

/**
 * Crée les filtres de catégories (version complète)
 */
function createCategoryFilters() {
    const categories = [
        { value: 'plage', label: 'Plages', icon: 'fas fa-umbrella-beach' },
        { value: 'village', label: 'Villages', icon: 'fas fa-home' },
        { value: 'monument', label: 'Monuments', icon: 'fas fa-landmark' },
        { value: 'point_de_vue', label: 'Panoramas', icon: 'fas fa-eye' },
        { value: 'randonnee', label: 'Randonnées', icon: 'fas fa-hiking' },
        { value: 'musee', label: 'Culture', icon: 'fas fa-university' },
        { value: 'hotel', label: 'Hébergement', icon: 'fas fa-bed' },
        { value: 'logement_insolite', label: 'Insolite', icon: 'fas fa-tree-city' },
        { value: 'festival', label: 'Festivals', icon: 'fas fa-music' },
        { value: 'chateau', label: 'Châteaux', icon: 'fas fa-chess-rook' },
        { value: 'parc', label: 'Parcs', icon: 'fas fa-tree' },
        { value: 'restaurant', label: 'Restaurants', icon: 'fas fa-utensils' },
        { value: 'camping', label: 'Camping', icon: 'fas fa-campground' },
        { value: 'loisirs', label: 'Loisirs', icon: 'fas fa-star' }
    ];

    return categories.map(cat => {
        const isChecked = currentFilters.categories.includes(cat.value);
        return `
            <label class="type-option">
                <input type="checkbox" value="${cat.value}" name="category" ${isChecked ? 'checked' : ''}>
                <i class="${cat.icon}"></i>
                <span>${cat.label}</span>
            </label>
        `;
    }).join('');
}

/**
 * Applique les filtres sélectionnés
 */
function applyFilters() {
    // Récupérer les valeurs des filtres depuis la filter-content
    const filterContent = document.querySelector('.filter-content');
    if (!filterContent) {
        return;
    }

    const formData = new FormData(filterContent);

    // Tri
    currentFilters.sort = formData.get('sort') || 'distance';

    // Départements
    currentFilters.departments = formData.getAll('department');

    // Catégories
    currentFilters.categories = formData.getAll('category');

    // Appliquer les filtres aux POIs
    if (typeof window.PoiModule !== 'undefined' && window.PoiModule.filterPois) {
        window.PoiModule.filterPois(currentFilters);
    }

    // Fermer la popup
    hideFiltersPopup();

}

/**
 * Remet à zéro tous les filtres
 */
function resetFilters() {
    currentFilters = {
        departments: [],
        categories: [],
        sort: 'distance'
    };

    // Réinitialiser le formulaire
    const filterContent = document.querySelector('.filter-content');
    if (filterContent) {
        const inputs = filterContent.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else if (input.type === 'radio' && input.value === 'distance') {
                input.checked = true;
            } else if (input.type === 'radio') {
                input.checked = false;
            }
        });
    }

    // Appliquer les filtres vides
    if (typeof window.PoiModule !== 'undefined' && window.PoiModule.filterPois) {
        window.PoiModule.filterPois(currentFilters);
    }

}

/**
 * Applique un filtre spécifique (ex: logements)
 */
function applySpecificFilter(filterType, filterValue) {
    if (filterType === 'category') {
        currentFilters.categories = [filterValue];
    } else if (filterType === 'department') {
        currentFilters.departments = [filterValue];
    }

    if (typeof window.PoiModule !== 'undefined' && window.PoiModule.filterPois) {
        window.PoiModule.filterPois(currentFilters);
    }
}

/**
 * Obtient les filtres actuels
 */
function getCurrentFilters() {
    return { ...currentFilters };
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Filters.js DOMContentLoaded - Initialisation automatique');

    // Attendre un petit délai pour être sûr que tout est chargé
    setTimeout(() => {
        initFilters();
    }, 100);
});

// Initialisation de secours si DOMContentLoaded a déjà été déclenché
if (document.readyState === 'loading') {
    console.log('⏳ Document en cours de chargement...');
} else {
    console.log('✅ Document déjà chargé - Initialisation immédiate');
    setTimeout(() => {
        initFilters();
    }, 100);
}

// Initialisation ultime en dernier recours
setTimeout(() => {
    console.log('🔄 Tentative d\'initialisation en dernier recours');
    if (document.getElementById('filterBtn') && !window.filtersInitialized) {
        initFilters();
        window.filtersInitialized = true;
    }
}, 1000);

// Exporter les fonctions pour utilisation globale
window.FiltersModule = {
    initFilters,
    showFiltersPopup,
    hideFiltersPopup,
    applyFilters,
    resetFilters,
    applySpecificFilter,
    getCurrentFilters
};