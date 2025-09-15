/**
 * LOGEMENTS - LA BELLE BRETAGNE
 * Gestion des hébergements et système de filtres
 */

// ===================================================================
// DONNÉES DES LOGEMENTS (Chargées depuis pois.json)
// ===================================================================

let logementsData = [];

// ===================================================================
// CHARGEMENT DES DONNÉES DEPUIS POIS.JSON
// ===================================================================

/**
 * Charge les logements depuis le fichier pois.json
 */
async function loadLogementsFromPois() {
    try {
        const response = await fetch(`data/pois.json?${Date.now()}`);
        const data = await response.json();

        // Filtrer seulement les logements (hotel, villa, camping, logement_insolite)
        const logementCategories = ['hotel', 'villa', 'camping', 'logement_insolite'];
        const logements = data.pois.filter(poi =>
            poi.categories && poi.categories.some(cat => logementCategories.includes(cat))
        );

        // Adapter les données au format attendu par la page logements
        logementsData = logements.map(poi => ({
            id: poi.id,
            name: poi.title,
            category: poi.categories[0], // Prendre la première catégorie
            location: `${poi.address || poi.department}`,
            department: poi.department, // Garder le département séparé pour le filtrage
            description: poi.shortDescription,
            image: poi.image,
            images: poi.images || [poi.image],
            features: poi.tags || [],
            bookingUrl: poi.website,
            rating: 4.5, // Note par défaut
            coords: [poi.lat, poi.lng],
            coupDeCoeur: poi.coupDeCoeur || false,
            tested: poi.tested || false
        }));

        return logementsData;
    } catch (error) {
        console.error('❌ Erreur lors du chargement des logements:', error);
        return [];
    }
}

// ===================================================================
// VARIABLES GLOBALES
// ===================================================================

let currentFilter = 'all';
let filteredLogements = [...logementsData];

// ===================================================================
// FONCTIONS D'AFFICHAGE
// ===================================================================

/**
 * Met à jour le titre et le compteur des résultats
 * @param {string} category - Catégorie sélectionnée
 * @param {number} count - Nombre de résultats
 */
function updateResultsHeader(category, count) {
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsCount = document.getElementById('resultsCount');

    const titles = {
        'all': 'Tous nos hébergements',
        'villa': 'Villas de charme',
        'hotel': 'Hôtels 4-5 étoiles',
        'insolite': 'Logements insolites'
    };

    if (resultsTitle) {
        resultsTitle.textContent = titles[category] || 'Hébergements';
    }

    if (resultsCount) {
        const logementText = count <= 1 ? 'hébergement trouvé' : 'hébergements trouvés';
        resultsCount.textContent = `${count} ${logementText}`;
    }
}

/**
 * Génère une carte de logement
 * @param {Object} logement - Données du logement
 * @returns {string} - HTML de la carte
 */
function generateLogementCard(logement) {
    const featuresHtml = logement.features
        .slice(0, 4)
        .map(feature => `<span class="feature-tag">${feature}</span>`)
        .join('');

    const categoryInfo = {
        'villa': { icon: 'fas fa-house-user', label: 'Villa' },
        'hotel': { icon: 'fas fa-bed', label: 'Hôtel' },
        'camping': { icon: 'fas fa-campground', label: 'Camping' },
        'logement_insolite': { icon: 'fas fa-tree-city', label: 'Insolite' }
    };

    const category = categoryInfo[logement.category] || { icon: 'fas fa-home', label: 'Logement' };

    return `
        <div class="logement-card" data-category="${logement.category}">
            <div class="logement-image">
                <img src="${logement.image}" alt="${logement.name}" 
                     onerror="this.src='assets/img/placeholder.jpg'" loading="lazy">
                <div class="logement-badge">
                    <i class="${category.icon}"></i>
                    <span>${category.label}</span>
                </div>
            </div>
            
            <div class="logement-content">
                <div class="logement-header">
                    <h3 class="logement-title">${logement.name}</h3>
                </div>
                
                <div class="logement-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${logement.location}</span>
                </div>
                
                <p class="logement-description">${logement.description}</p>
                
                <div class="logement-features">
                    ${featuresHtml}
                </div>
                
                <div class="logement-actions">
                    <a href="poi.html?slug=${getSlugFromId(logement.id)}" 
                       class="logement-btn logement-btn-primary logement-discover-link"
                       data-logement-id="${logement.id}">
                        <i class="fas fa-info-circle"></i>
                        <span>Découvrir</span>
                    </a>
                    ${logement.bookingUrl ? `
                        <a href="${logement.bookingUrl}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="logement-btn logement-btn-secondary">
                            <i class="fas fa-external-link-alt"></i>
                            <span>Réserver</span>
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Convertit un ID en slug pour les liens
 */
function getSlugFromId(id) {
    // Pour l'instant, on utilise l'ID comme slug
    // Dans le futur, on pourrait avoir un mapping plus sophistiqué
    return id;
}

/**
 * Affiche les logements dans la grille
 * @param {Array} logements - Liste des logements à afficher
 */
function displayLogements(logements) {
    const grid = document.getElementById('logementsGrid');

    if (!grid) {
        return;
    }

    if (logements.length === 0) {
        const noResultsHTML = `
            <div class="no-results">
                <div class="no-results-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>Aucun hébergement trouvé</h3>
                <p>Essayez de modifier vos critères de recherche</p>
                <button class="reset-filters-btn" onclick="resetFilters()">
                    <i class="fas fa-redo"></i>
                    <span>Voir tous les hébergements</span>
                </button>
            </div>
        `;

        if (window.Security && window.Security.safeSetInnerHTML) {
            window.Security.safeSetInnerHTML(grid, noResultsHTML);
        } else {
            grid.innerHTML = noResultsHTML;
        }
        return;
    }

    const logementsHTML = logements.map(logement => generateLogementCard(logement)).join('');

    if (window.Security && window.Security.safeSetInnerHTML) {
        window.Security.safeSetInnerHTML(grid, logementsHTML);
    } else {
        grid.innerHTML = logementsHTML;
    }

    // Attacher les event listeners pour sauvegarder l'état avant de partir
    attachDiscoverLinkListeners();
}

/**
 * Attache les event listeners aux liens "Découvrir" pour sauvegarder l'état
 */
function attachDiscoverLinkListeners() {
    document.querySelectorAll('.logement-discover-link').forEach(link => {
        link.addEventListener('click', (e) => {
            // Sauvegarder l'état avant de naviguer vers la fiche
            saveFiltersState();
        });
    });
}

// ===================================================================
// FONCTIONS DE FILTRAGE
// ===================================================================

/**
 * Filtre les logements par catégorie
 * @param {string} category - Catégorie à filtrer
 */
function filterByCategory(category) {
    currentFilter = category;

    // Mettre à jour les boutons actifs
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeButton = document.querySelector(`[data-category="${category}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Appliquer tous les filtres
    applyFilters();

    // Sauvegarder l'état des filtres
    saveFiltersState();
}

/**
 * Applique tous les filtres (catégorie + département)
 */
function applyFilters() {
    const departmentFilter = document.getElementById('departmentFilter');
    const selectedDepartment = departmentFilter ? departmentFilter.value : 'all';

    // Filtrer par catégorie
    let filtered = [...logementsData];
    if (currentFilter !== 'all') {
        filtered = filtered.filter(logement => logement.category === currentFilter);
    }

    // Filtrer par département
    if (selectedDepartment !== 'all') {
        filtered = filtered.filter(logement =>
            logement.department === selectedDepartment
        );
    }

    filteredLogements = filtered;

    // Mettre à jour l'affichage
    updateResultsHeader(currentFilter, filteredLogements.length);
    displayLogements(filteredLogements);

    // Sauvegarder l'état des filtres
    saveFiltersState();

}

/**
 * Remet à zéro tous les filtres
 */
function resetFilters() {
    // Réinitialiser le département
    const departmentFilter = document.getElementById('departmentFilter');
    if (departmentFilter) {
        departmentFilter.value = 'all';
    }

    filterByCategory('all');
}

// ===================================================================
// GESTION DE L'ÉTAT DES FILTRES ET DU SCROLL
// ===================================================================

/**
 * Sauvegarde l'état actuel des filtres et la position de scroll
 */
function saveFiltersState() {
    const departmentFilter = document.getElementById('departmentFilter');
    const selectedDepartment = departmentFilter ? departmentFilter.value : 'all';

    const state = {
        categoryFilter: currentFilter,
        departmentFilter: selectedDepartment,
        scrollPosition: window.scrollY,
        timestamp: Date.now()
    };

    sessionStorage.setItem('logementsFiltersState', JSON.stringify(state));
}

/**
 * Restaure l'état des filtres et la position de scroll
 */
function restoreFiltersState() {
    try {
        const savedState = sessionStorage.getItem('logementsFiltersState');
        if (!savedState) {
            return false;
        }

        const state = JSON.parse(savedState);

        // Vérifier que l'état n'est pas trop ancien (30 minutes max)
        const maxAge = 30 * 60 * 1000; // 30 minutes
        if (Date.now() - state.timestamp > maxAge) {
            sessionStorage.removeItem('logementsFiltersState');
            return false;
        }


        // Restaurer le filtre de département
        const departmentFilter = document.getElementById('departmentFilter');
        if (departmentFilter && state.departmentFilter) {
            departmentFilter.value = state.departmentFilter;
        }

        // Restaurer le filtre de catégorie (sans sauvegarder à nouveau)
        currentFilter = state.categoryFilter || 'all';

        // Mettre à jour les boutons actifs
        document.querySelectorAll('.filter-chip').forEach(btn => {
            btn.classList.remove('active');
        });

        const activeButton = document.querySelector(`[data-category="${currentFilter}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Appliquer les filtres sans sauvegarder
        applyFiltersWithoutSave();

        // Restaurer la position de scroll après un petit délai
        if (state.scrollPosition) {
            setTimeout(() => {
                window.scrollTo({
                    top: state.scrollPosition,
                    behavior: 'smooth'
                });
            }, 300);
        }

        return true;
    } catch (error) {
        console.error('❌ Erreur lors de la restauration des filtres:', error);
        sessionStorage.removeItem('logementsFiltersState');
        return false;
    }
}

/**
 * Applique les filtres sans sauvegarder l'état (utilisé lors de la restauration)
 */
function applyFiltersWithoutSave() {
    const departmentFilter = document.getElementById('departmentFilter');
    const selectedDepartment = departmentFilter ? departmentFilter.value : 'all';

    // Filtrer par catégorie
    let filtered = [...logementsData];
    if (currentFilter !== 'all') {
        filtered = filtered.filter(logement => logement.category === currentFilter);
    }

    // Filtrer par département
    if (selectedDepartment !== 'all') {
        filtered = filtered.filter(logement =>
            logement.department === selectedDepartment
        );
    }

    filteredLogements = filtered;

    // Mettre à jour l'affichage
    updateResultsHeader(currentFilter, filteredLogements.length);
    displayLogements(filteredLogements);

}

/**
 * Affiche les détails d'un logement (modal ou redirection)
 * @param {string} logementId - ID du logement
 */
function showLogementDetails(logementId) {
    const logement = logementsData.find(l => l.id === logementId);

    if (!logement) {
        return;
    }

    // Pour l'instant, simple alert avec les détails
    // Plus tard, on pourrait créer une modal ou une page détail
    const details = `
🏠 ${logement.name}
📍 ${logement.location}
👥 Capacité: ${logement.capacity} personnes
⭐ Note: ${logement.rating}/5

📝 Description:
${logement.description}

✨ Équipements:
• ${logement.features.join('\n• ')}
    `;

    if (confirm(`${details}\n\nVoulez-vous être redirigé vers Booking.com pour réserver ?`)) {
        window.open(logement.bookingUrl, '_blank', 'noopener,noreferrer');
    }
}

// ===================================================================
// ÉVÉNEMENTS ET INITIALISATION
// ===================================================================

/**
 * Initialise la page des logements
 */
async function initLogements() {

    // Charger les données depuis pois.json
    await loadLogementsFromPois();

    // Attacher les événements aux boutons de filtre de catégorie
    document.querySelectorAll('.filter-chip').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterByCategory(category);
        });
    });

    // Attacher l'événement au filtre de département
    const departmentFilter = document.getElementById('departmentFilter');
    if (departmentFilter) {
        departmentFilter.addEventListener('change', applyFilters);
    }

    // Les logements sont maintenant chargés

    // Essayer de restaurer l'état des filtres, sinon affichage par défaut
    const restored = restoreFiltersState();
    if (!restored) {
        filterByCategory('all');
    }

}

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLogements);
} else {
    initLogements();
}

// Exporter les fonctions pour utilisation globale
window.LogementsApp = {
    filterByCategory,
    resetFilters,
    showLogementDetails,
    data: logementsData
};