/**
 * FESTIVALS - LA BELLE BRETAGNE
 * Gestion des filtres et affichage des festivals
 */

// ===================================================================
// INITIALISATION ET DONNÉES
// ===================================================================

/**
 * Initialise la page festivals
 */
function initFestivals() {
    console.log('🎪 Initialisation des festivals...');

    // Initialiser les filtres
    initFilters();

}

/**
 * Initialise les filtres
 */
function initFilters() {
    console.log('🔧 Initialisation des filtres...');

    // Filtre département (select dropdown)
    const departmentSelect = document.getElementById('department-select');
    if (departmentSelect) {
        console.log('✅ Département select trouvé');
        departmentSelect.addEventListener('change', () => {
            console.log('🏛️ Changement département:', departmentSelect.value);
            applyFilters();
        });
    } else {
        console.error('❌ Département select non trouvé');
    }

    // Filtre mois (select dropdown)
    const monthSelect = document.getElementById('month-select');
    if (monthSelect) {
        console.log('✅ Mois select trouvé');
        monthSelect.addEventListener('change', () => {
            console.log('📅 Changement mois:', monthSelect.value);
            applyFilters();
        });
    } else {
        console.error('❌ Mois select non trouvé');
    }
}


// ===================================================================
// FILTRES
// ===================================================================

/**
 * Applique les filtres sélectionnés
 */
function applyFilters() {
    console.log('🔄 Application des filtres...');
    const festivalsGrid = document.getElementById('festivals-grid');

    if (!festivalsGrid) {
        console.error('❌ Festivals grid non trouvé');
        return;
    }

    // Récupérer les filtres actifs depuis les selects
    const departmentSelect = document.getElementById('department-select');
    const monthSelect = document.getElementById('month-select');

    const selectedDepartment = departmentSelect ? departmentSelect.value : '';
    const selectedMonth = monthSelect ? monthSelect.value : '';

    console.log('🎯 Filtres sélectionnés:', { département: selectedDepartment, mois: selectedMonth });

    // Récupérer toutes les cartes de festival
    const festivalCards = festivalsGrid.querySelectorAll('.festival-card');
    console.log('📊 Cartes trouvées:', festivalCards.length);

    let visibleCount = 0;

    festivalCards.forEach((card, index) => {
        let shouldShow = true;
        const cardDept = card.dataset.department;
        const cardMonth = card.dataset.month;

        console.log(`🎪 Festival ${index}:`, { département: cardDept, mois: cardMonth });

        // Filtre département
        if (selectedDepartment && cardDept !== selectedDepartment) {
            shouldShow = false;
            console.log(`❌ Éliminé par département: ${cardDept} !== ${selectedDepartment}`);
        }

        // Filtre mois
        if (selectedMonth && cardMonth !== selectedMonth) {
            shouldShow = false;
            console.log(`❌ Éliminé par mois: ${cardMonth} !== ${selectedMonth}`);
        }

        // Afficher/masquer la carte
        if (shouldShow) {
            card.style.display = 'block';
            visibleCount++;
            console.log(`✅ Festival ${index} affiché`);
        } else {
            card.style.display = 'none';
            console.log(`🚫 Festival ${index} masqué`);
        }
    });

    console.log('📈 Résultats visibles:', visibleCount);

    // Afficher un message si aucun résultat
    showNoResultsMessage(visibleCount, festivalsGrid);

}

/**
 * Remet à zéro tous les filtres
 */
function resetFilters() {
    // Réinitialiser les filtres select
    const departmentSelect = document.getElementById('department-select');
    if (departmentSelect) {
        departmentSelect.value = '';
    }

    const monthSelect = document.getElementById('month-select');
    if (monthSelect) {
        monthSelect.value = '';
    }

    // Appliquer les filtres (tout afficher)
    applyFilters();

    // Afficher toutes les cartes
    const festivalsGrid = document.getElementById('festivals-grid');
    if (festivalsGrid) {
        const festivalCards = festivalsGrid.querySelectorAll('.festival-card');
        festivalCards.forEach(card => {
            card.style.display = 'block';
        });

        // Supprimer le message "aucun résultat"
        const noResultsMsg = festivalsGrid.querySelector('.no-results-message');
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

}

/**
 * Affiche un message quand aucun festival ne correspond aux filtres
 */
function showNoResultsMessage(visibleCount, container) {
    // Supprimer le message existant
    const existingMessage = container.querySelector('.no-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Ajouter le message si nécessaire
    if (visibleCount === 0) {
        const message = document.createElement('div');
        message.className = 'no-results-message';
        message.innerHTML = `
            <div class="no-results-content">
                <i class="fas fa-search"></i>
                <h3>Aucun festival trouvé</h3>
                <p>Essayez de modifier vos filtres pour voir plus de résultats.</p>
                <button onclick="resetFilters()" class="reset-filters-btn">
                    <i class="fas fa-refresh"></i>
                    Réinitialiser les filtres
                </button>
            </div>
        `;
        container.appendChild(message);
    }
}

// ===================================================================
// INITIALISATION
// ===================================================================

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFestivals);
} else {
    initFestivals();
}

// Exporter pour utilisation globale
window.FestivalsApp = {
    applyFilters,
    resetFilters
};