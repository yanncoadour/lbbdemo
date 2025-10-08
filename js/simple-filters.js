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

    // Mettre à jour les compteurs dans les labels
    updateCategoryCounters();

    if (!filterBtnMain && !filterBtn) {
        console.error('❌ Aucun bouton filtre trouvé!');
    }
}

// Mettre à jour les compteurs de POIs dans les labels de catégories et départements
function updateCategoryCounters() {
    const currentPois = window.filteredPois || window.allPois || [];

    if (currentPois.length === 0) return;

    // Compter les POIs par catégorie
    const categoryCounts = {};
    const departmentCounts = {};

    currentPois.forEach(poi => {
        // Compter les catégories
        if (poi.categories && Array.isArray(poi.categories)) {
            poi.categories.forEach(cat => {
                categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
            });
        }

        // Compter les départements
        if (poi.department) {
            departmentCounts[poi.department] = (departmentCounts[poi.department] || 0) + 1;
        }
    });

    // Mettre à jour les labels de catégories
    document.querySelectorAll('.category-card-modern').forEach(card => {
        const input = card.querySelector('input');
        const label = card.querySelector('label span');
        if (input && label) {
            const category = input.value;
            const count = categoryCounts[category] || 0;
            const labelText = label.textContent.replace(/\s*\(\d+\)/, ''); // Enlever l'ancien compteur
            label.textContent = `${labelText} (${count})`;
        }
    });

    // Mettre à jour les labels de départements
    document.querySelectorAll('.department-item-modern').forEach(item => {
        const input = item.querySelector('input');
        const label = item.querySelector('label span');
        if (input && label) {
            const department = input.value;
            const count = departmentCounts[department] || 0;
            const labelText = label.textContent.replace(/\s*\(\d+\)/, ''); // Enlever l'ancien compteur
            label.textContent = `${labelText} (${count})`;
        }
    });
}

// Mettre à jour le compteur de résultats en temps réel (avant application)
function updateFilterPreview() {
    // Utiliser filteredPois au lieu de allPois pour afficher le nombre actuel affiché
    const currentPois = window.filteredPois || window.allPois || [];

    if (currentPois.length === 0) {
        updateFilterCount(0);
        return;
    }

    // Récupérer les sélections actuelles
    const selectedDepartments = Array.from(
        document.querySelectorAll('.department-item-modern input:checked')
    ).map(input => input.value);

    const selectedCategories = Array.from(
        document.querySelectorAll('.category-card-modern input:checked')
    ).map(input => input.value);

    // Si aucun filtre n'est sélectionné, afficher le nombre actuel
    if (selectedDepartments.length === 0 && selectedCategories.length === 0) {
        updateFilterCount(currentPois.length);
        return;
    }

    // Compter combien de POIs correspondent (à partir de tous les POIs disponibles)
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
        // Mettre à jour les compteurs à l'ouverture
        updateCategoryCounters();
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

    // Mettre à jour les compteurs après l'application
    setTimeout(() => {
        updateCategoryCounters();
    }, 100);
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

        // Mettre à jour les compteurs des catégories/départements
        setTimeout(() => {
            updateCategoryCounters();
        }, 100);

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