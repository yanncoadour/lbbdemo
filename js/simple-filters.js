/**
 * FILTRES SIMPLES - Solution directe et efficace
 * Une simple bulle qui monte quand on clique sur le bouton filtre
 */

// Fonction d'initialisation simple
function initSimpleFilters() {
    console.log('🚀 Initialisation des filtres simples');

    const filterBtn = document.getElementById('filterBtn');

    if (filterBtn) {
        console.log('✅ Bouton filtre trouvé!');

        filterBtn.addEventListener('click', function() {
            console.log('🎯 Bouton filtre cliqué!');
            showSimpleFiltersPopup();
        });

    } else {
        console.error('❌ Bouton filtre introuvable!');
    }
}

// Fonction pour afficher la bulle
function showSimpleFiltersPopup() {
    console.log('🔵 Affichage de la bulle de filtres');

    // Supprimer l'ancienne bulle si elle existe
    const existingPopup = document.getElementById('simpleFiltersPopup');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Créer la bulle
    const popup = document.createElement('div');
    popup.id = 'simpleFiltersPopup';
    popup.innerHTML = `
        <div class="filters-bubble">
            <div class="bubble-header">
                <h3>Filtres</h3>
                <button class="close-bubble" onclick="hideSimpleFiltersPopup()">×</button>
            </div>
            
            <div class="bubble-content">
                <!-- Départements -->
                <div class="filter-section">
                    <h4>Départements</h4>
                    <div class="filter-chips">
                        <button class="filter-chip" data-value="Finistère">29</button>
                        <button class="filter-chip" data-value="Ille-et-Vilaine">35</button>
                        <button class="filter-chip" data-value="Loire-Atlantique">44</button>
                        <button class="filter-chip" data-value="Morbihan">56</button>
                        <button class="filter-chip" data-value="Côtes-d'Armor">22</button>
                    </div>
                </div>
                
                <!-- Catégories -->
                <div class="filter-section">
                    <h4>Types de lieux</h4>
                    <div class="filter-chips">
                        <button class="filter-chip" data-value="plage">🏖️ Plages</button>
                        <button class="filter-chip" data-value="village">🏘️ Villages</button>
                        <button class="filter-chip" data-value="monument">🏛️ Monuments</button>
                        <button class="filter-chip" data-value="chateau">🏰 Châteaux</button>
                        <button class="filter-chip" data-value="musee">🎨 Musées</button>
                        <button class="filter-chip" data-value="point_de_vue">🌄 Panoramas</button>
                        <button class="filter-chip" data-value="randonnee">🥾 Randonnées</button>
                        <button class="filter-chip" data-value="parc">🌳 Parcs</button>
                        <button class="filter-chip" data-value="hotel">🛏️ Hôtels</button>
                        <button class="filter-chip" data-value="villa">🏖️ Villas</button>
                        <button class="filter-chip" data-value="camping">⛺ Camping</button>
                        <button class="filter-chip" data-value="logement_insolite">🛖 Insolite</button>
                        <button class="filter-chip" data-value="restaurant">🍽️ Restaurants</button>
                        <button class="filter-chip" data-value="festival">🎵 Festivals</button>
                        <button class="filter-chip" data-value="loisirs">🎪 Loisirs</button>
                    </div>
                </div>
            </div>
            
            <div class="bubble-actions">
                <button class="btn-apply" onclick="applySimpleFilters()">Appliquer</button>
                <button class="btn-reset" onclick="resetSimpleFilters()">Reset</button>
            </div>
        </div>
    `;

    // Ajouter au body
    document.body.appendChild(popup);

    // Animation d'apparition
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);

    // Ajouter les événements aux chips
    addChipEvents();
}

// Fonction pour cacher la bulle
function hideSimpleFiltersPopup() {
    const popup = document.getElementById('simpleFiltersPopup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.remove();
        }, 300);
    }
}

// Fonction pour gérer les clics sur les chips
function addChipEvents() {
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            chip.classList.toggle('active');
            console.log('Chip cliqué:', chip.dataset.value, chip.classList.contains('active'));
        });
    });
}

// Fonctions des boutons
function applySimpleFilters() {
    const activeChips = document.querySelectorAll('.filter-chip.active');
    const selectedValues = Array.from(activeChips).map(chip => chip.dataset.value);

    // Séparer les départements des catégories
    const departments = ['Finistère', 'Ille-et-Vilaine', 'Loire-Atlantique', 'Morbihan', 'Côtes-d\'Armor'];
    const selectedDepartments = selectedValues.filter(value => departments.includes(value));
    const selectedCategories = selectedValues.filter(value => !departments.includes(value));

    console.log('✅ Filtres appliqués:');
    console.log('- Départements:', selectedDepartments);
    console.log('- Catégories:', selectedCategories);

    // Appliquer les filtres directement
    console.log('🔧 Application directe des filtres');
    applyFiltersWithSelection(selectedDepartments, selectedCategories);

    hideSimpleFiltersPopup();
}

// Fonction pour appliquer les filtres avec le système existant
function applyFiltersWithSelection(departments, categories) {
    console.log('🔧 Application des filtres par simulation des checkboxes');

    // Approche 1: Simuler la sélection des checkboxes existantes
    try {
        // Chercher les checkboxes dans tous les conteneurs possibles
        const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        console.log('📋 Checkboxes trouvées:', allCheckboxes.length);

        // Décocher toutes les checkboxes d'abord
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Cocher les départements sélectionnés
        departments.forEach(dept => {
            const deptCheckboxes = document.querySelectorAll(`input[type="checkbox"][value="${dept}"]`);
            deptCheckboxes.forEach(checkbox => {
                checkbox.checked = true;
                console.log('✅ Département sélectionné:', dept);
            });
        });

        // Cocher les catégories sélectionnées
        categories.forEach(cat => {
            const catCheckboxes = document.querySelectorAll(`input[type="checkbox"][value="${cat}"]`);
            catCheckboxes.forEach(checkbox => {
                checkbox.checked = true;
                console.log('✅ Catégorie sélectionnée:', cat);
            });
        });

        // Appliquer les filtres via le système existant
        if (typeof window.applyFilters === 'function') {
            console.log('🔄 Appel de applyFilters() avec checkboxes simulées...');
            // Intercepter l'erreur de coordonnées
            const originalAutoFocus = window.autoFocusOnFilteredPois;

            // Désactiver temporairement l'auto-focus qui cause l'erreur LatLng
            if (typeof originalAutoFocus === 'function') {
                window.autoFocusOnFilteredPois = function() {
                    console.log('🚫 AutoFocus désactivé temporairement pour éviter l\'erreur LatLng');
                };
            }

            // Appliquer les filtres
            window.applyFilters();

            // Remettre l'auto-focus après 1 seconde
            setTimeout(() => {
                if (originalAutoFocus) {
                    window.autoFocusOnFilteredPois = originalAutoFocus;
                    console.log('✅ AutoFocus restauré');
                }
            }, 1000);

            console.log('✅ Filtres appliqués via simulation de checkboxes');
        } else {
            console.log('❌ Fonction applyFilters non disponible');
        }

    } catch (error) {
        console.error('❌ Erreur lors de la simulation des filtres:', error);

        // Plan B: Juste afficher un message d'information
        console.log('💡 Astuce: Attendez que la page soit complètement chargée avant d\'utiliser les filtres');

        // Proposer de réessayer dans quelques secondes
        setTimeout(() => {
            console.log('🔄 Nouvel essai automatique dans 3 secondes...');
            if (typeof window.applyFilters === 'function' && window.allPois && window.allPois.length > 0) {
                applyFiltersWithSelection(departments, categories);
            }
        }, 3000);
    }
}

function resetSimpleFilters() {
    console.log('🔄 Filtres réinitialisés');
    const popup = document.getElementById('simpleFiltersPopup');
    if (popup) {
        // Désactiver tous les chips
        popup.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
        });
    }

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

        console.log('✅ Tous les POIs restaurés:', window.filteredPois.length);
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 DOM chargé - Init filtres simples');
    setTimeout(initSimpleFilters, 100);
});

// Sécurité si DOM déjà chargé
if (document.readyState !== 'loading') {
    console.log('📋 DOM déjà prêt - Init immédiate');
    setTimeout(initSimpleFilters, 100);
}