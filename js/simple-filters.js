/**
 * FILTRES SIMPLES - Solution directe et efficace
 * Une simple bulle qui monte quand on clique sur le bouton filtre
 */

// Fonction d'initialisation simple
function initSimpleFilters() {
    console.log('🚀 Initialisation des filtres simples');

    // Bouton principal visible
    const filterBtnMain = document.getElementById('filterBtnMain');
    // Ancien bouton caché (pour compatibilité)
    const filterBtn = document.getElementById('filterBtn');

    // Bouton d'overlay et de fermeture
    const overlay = document.getElementById('overlay');
    const backFilterBtn = document.getElementById('backFilterBtn');
    const filterContent = document.getElementById('filterContent');

    // Ouvrir le modal moderne
    if (filterBtnMain) {
        console.log('✅ Bouton filtre principal trouvé!');

        filterBtnMain.addEventListener('click', function() {
            console.log('🎯 Bouton filtre principal cliqué!');
            openModernFilters();
        });
    }

    // Ancien bouton (compatibilité)
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            console.log('🎯 Ancien bouton filtre cliqué!');
            openModernFilters();
        });
    }

    // Fermer avec le bouton X
    if (backFilterBtn) {
        backFilterBtn.addEventListener('click', function() {
            closeModernFilters();
        });
    }

    // Fermer en cliquant sur l'overlay
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeModernFilters();
        });
    }

    // Boutons appliquer et réinitialiser
    const applyBtn = document.getElementById('applyFiltersInline');
    const resetBtn = document.getElementById('resetFiltersInline');

    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            applyModernFilters();
            closeModernFilters();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetModernFilters();
        });
    }

    // Écouter les changements sur les checkboxes pour mettre à jour le compteur en temps réel
    document.querySelectorAll('.department-item-modern input, .category-card-modern input').forEach(checkbox => {
        checkbox.addEventListener('change', updateFilterPreview);
    });

    // Initialiser le compteur au chargement
    updateFilterPreview();

    if (!filterBtnMain && !filterBtn) {
        console.error('❌ Aucun bouton filtre trouvé!');
    }
}

// Mettre à jour le compteur de résultats en temps réel (avant application)
function updateFilterPreview() {
    if (typeof window.allPois === 'undefined' || window.allPois.length === 0) {
        return;
    }

    // Récupérer les sélections actuelles
    const selectedDepartments = Array.from(
        document.querySelectorAll('.department-item-modern input:checked')
    ).map(input => input.value);

    const selectedCategories = Array.from(
        document.querySelectorAll('.category-card-modern input:checked')
    ).map(input => input.value);

    // Compter combien de POIs correspondent
    let count = window.allPois.filter(poi => {
        // Filtre départements
        if (selectedDepartments.length > 0 && !selectedDepartments.includes(poi.department)) {
            return false;
        }

        // Filtre catégories
        if (selectedCategories.length > 0) {
            if (!poi.categories || !poi.categories.some(cat => selectedCategories.includes(cat))) {
                return false;
            }
        }

        return true;
    }).length;

    // Mettre à jour l'affichage
    updateFilterCount(count);
}

// Ouvrir le modal moderne
function openModernFilters() {
    const filterContent = document.getElementById('filterContent');
    const overlay = document.getElementById('overlay');

    if (filterContent && overlay) {
        filterContent.classList.add('active');
        overlay.classList.add('active');
        console.log('✅ Modal moderne ouvert');
    }
}

// Fermer le modal moderne
function closeModernFilters() {
    const filterContent = document.getElementById('filterContent');
    const overlay = document.getElementById('overlay');

    if (filterContent && overlay) {
        filterContent.classList.remove('active');
        overlay.classList.remove('active');
        console.log('✅ Modal moderne fermé');
    }
}

// Appliquer les filtres du modal moderne
function applyModernFilters() {
    console.log('🔧 Application des filtres modernes');

    // Récupérer les départements sélectionnés
    const selectedDepartments = Array.from(
        document.querySelectorAll('.department-item-modern input:checked')
    ).map(input => input.value);

    // Récupérer les catégories sélectionnées
    const selectedCategories = Array.from(
        document.querySelectorAll('.category-card-modern input:checked')
    ).map(input => input.value);

    console.log('📊 Filtres sélectionnés:');
    console.log('  - Départements:', selectedDepartments);
    console.log('  - Catégories:', selectedCategories);
    console.log('  - Total POIs avant filtrage:', window.allPois?.length || 0);

    // Appliquer les filtres
    applyFiltersWithSelection(selectedDepartments, selectedCategories);

    console.log('  - Total POIs après filtrage:', window.filteredPois?.length || 0);
}

// Réinitialiser les filtres du modal moderne
function resetModernFilters() {
    console.log('🔄 Réinitialisation des filtres modernes');

    // Décocher tous les checkboxes
    document.querySelectorAll('.department-item-modern input, .category-card-modern input, .pill-modern input').forEach(input => {
        input.checked = false;
    });

    // Remettre tous les POIs
    if (typeof window.allPois !== 'undefined' && window.allPois.length > 0) {
        window.filteredPois = [...window.allPois];

        // Mettre à jour la carte
        if (typeof window.displayPois === 'function') {
            console.log('🗺️ Restauration de la carte...');
            window.displayPois();
        }

        // Mettre à jour le compteur
        if (typeof window.updateResultsCounter === 'function') {
            window.updateResultsCounter();
        }

        // Mettre à jour le compteur dans le modal
        const filterResultCount = document.getElementById('filterResultCount');
        if (filterResultCount) {
            filterResultCount.textContent = window.filteredPois.length;
        }

        console.log('✅ Tous les POIs restaurés:', window.filteredPois.length);
    }
}

// ANCIEN SYSTÈME DE BULLE SUPPRIMÉ - Utilise maintenant le modal moderne

// Fonction pour appliquer les filtres avec le système existant
function applyFiltersWithSelection(departments, categories) {
    console.log('🔧 Application des filtres', { departments, categories });

    if (typeof window.allPois === 'undefined' || window.allPois.length === 0) {
        console.error('❌ Aucun POI chargé');
        return;
    }

    // Filtrer les POIs directement
    const filtered = window.allPois.filter(poi => {
        // Filtre départements
        if (departments.length > 0 && !departments.includes(poi.department)) {
            return false;
        }

        // Filtre catégories
        if (categories.length > 0) {
            if (!poi.categories || !poi.categories.some(cat => categories.includes(cat))) {
                return false;
            }
        }

        return true;
    });

    console.log(`✅ ${filtered.length} POIs trouvés sur ${window.allPois.length}`);

    // Accéder directement à la variable filteredPois du module app.js via un événement personnalisé
    const event = new CustomEvent('applyCustomFilters', {
        detail: {
            filteredPois: filtered,
            departments: departments,
            categories: categories
        }
    });
    window.dispatchEvent(event);

    // Mettre à jour le compteur dans le modal
    updateFilterCount(filtered.length);
}

// Mettre à jour le compteur dans le modal
function updateFilterCount(count) {
    const filterResultCount = document.getElementById('filterResultCount');
    if (filterResultCount) {
        filterResultCount.textContent = count;
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 DOM chargé - Init filtres modernes');
    setTimeout(initSimpleFilters, 100);
});

// Sécurité si DOM déjà chargé
if (document.readyState !== 'loading') {
    console.log('📋 DOM déjà prêt - Init immédiate');
    setTimeout(initSimpleFilters, 100);
}