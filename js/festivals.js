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
    console.log('🎭 Initialisation de la page festivals...');
    
    // Initialiser les filtres
    initFilters();
    
    console.log('✅ Page festivals initialisée');
}

/**
 * Initialise les filtres
 */
function initFilters() {
    // Filtres département
    const departmentChips = document.querySelectorAll('[data-department]');
    departmentChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Désactiver tous les chips département
            departmentChips.forEach(c => c.classList.remove('active'));
            // Activer le chip cliqué
            chip.classList.add('active');
            applyFilters();
        });
    });
    
    // Filtres mois
    const monthChips = document.querySelectorAll('[data-month]');
    monthChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Désactiver tous les chips mois
            monthChips.forEach(c => c.classList.remove('active'));
            // Activer le chip cliqué
            chip.classList.add('active');
            applyFilters();
        });
    });
}

// ===================================================================
// FILTRES
// ===================================================================

/**
 * Applique les filtres sélectionnés
 */
function applyFilters() {
    const festivalsGrid = document.getElementById('festivals-grid');
    
    if (!festivalsGrid) {
        return;
    }
    
    // Récupérer les filtres actifs
    const activeDepartmentChip = document.querySelector('[data-department].active');
    const activeMonthChip = document.querySelector('[data-month].active');
    
    const selectedDepartment = activeDepartmentChip ? activeDepartmentChip.dataset.department : '';
    const selectedMonth = activeMonthChip ? activeMonthChip.dataset.month : '';
    
    // Récupérer toutes les cartes de festival
    const festivalCards = festivalsGrid.querySelectorAll('.festival-card');
    
    let visibleCount = 0;
    
    festivalCards.forEach(card => {
        let shouldShow = true;
        
        // Filtre département
        if (selectedDepartment && card.dataset.department !== selectedDepartment) {
            shouldShow = false;
        }
        
        // Filtre mois
        if (selectedMonth && card.dataset.month !== selectedMonth) {
            shouldShow = false;
        }
        
        // Afficher/masquer la carte
        if (shouldShow) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Afficher un message si aucun résultat
    showNoResultsMessage(visibleCount, festivalsGrid);
    
    console.log(`🔍 Filtres appliqués: ${visibleCount} festival(s) affiché(s)`);
}

/**
 * Remet à zéro tous les filtres
 */
function resetFilters() {
    // Réinitialiser les filtres département
    const departmentChips = document.querySelectorAll('[data-department]');
    departmentChips.forEach(chip => {
        chip.classList.toggle('active', chip.dataset.department === '');
    });
    
    // Réinitialiser les filtres mois
    const monthChips = document.querySelectorAll('[data-month]');
    monthChips.forEach(chip => {
        chip.classList.toggle('active', chip.dataset.month === '');
    });
    
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
    
    console.log('🔄 Filtres réinitialisés');
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