// Festival management JavaScript
let festivals = [];
let filteredFestivals = [];
let currentView = 'grid';
let currentFilters = {
    search: '',
    month: '',
    department: '',
    sort: 'date',
    quickFilter: 'all'
};

// Load festivals data
async function loadFestivalsData() {
    try {
        const response = await fetch('data/pois.json');
        const data = await response.json();
        
        // Filter only festivals
        festivals = data.pois.filter(poi => poi.categories.includes('festival'));
        
        // Sort festivals by date (upcoming first)
        sortFestivals('date');
        
        filteredFestivals = [...festivals];
        updateStats();
        displayFestivals(filteredFestivals);
    } catch (error) {
        console.error('Erreur lors du chargement des festivals:', error);
    }
}

// Sort festivals based on criteria
function sortFestivals(sortBy) {
    festivals.sort((a, b) => {
        switch (sortBy) {
            case 'date':
                const dateA = parseFestivalDate(a.dates);
                const dateB = parseFestivalDate(b.dates);
                if (!dateA && !dateB) return 0;
                if (!dateA) return 1;
                if (!dateB) return -1;
                return dateA - dateB;
            
            case 'name':
                return a.title.localeCompare(b.title);
            
            case 'department':
                return a.department.localeCompare(b.department);
                
            case 'coups-de-coeur':
                if (a.coupDeCoeur && !b.coupDeCoeur) return -1;
                if (!a.coupDeCoeur && b.coupDeCoeur) return 1;
                return 0;
                
            default:
                return 0;
        }
    });
}

// Parse festival date string to Date object
function parseFestivalDate(dateString) {
    if (!dateString || dateString === 'dates à définir') return null;
    
    // Extract year and month from date string
    const year2025Match = dateString.match(/2025/);
    const year2026Match = dateString.match(/2026/);
    const currentYear = year2025Match ? 2025 : year2026Match ? 2026 : new Date().getFullYear();
    
    // Month mapping
    const monthMap = {
        'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04',
        'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08',
        'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12'
    };
    
    // Try to extract month from string
    for (const [monthName, monthNum] of Object.entries(monthMap)) {
        if (dateString.toLowerCase().includes(monthName)) {
            return new Date(currentYear, parseInt(monthNum) - 1, 1);
        }
    }
    
    return null;
}

// Display festivals in grid
function displayFestivals(festivalsToShow) {
    const grid = document.getElementById('festivalsGrid');
    grid.innerHTML = '';
    
    if (festivalsToShow.length === 0) {
        grid.innerHTML = '<div class="no-results">Aucun festival trouvé pour ces critères.</div>';
        return;
    }
    
    festivalsToShow.forEach(festival => {
        const festivalCard = createFestivalCard(festival);
        grid.appendChild(festivalCard);
    });
}

// Create festival card element
function createFestivalCard(festival) {
    const card = document.createElement('div');
    card.className = currentView === 'grid' ? 'festival-card' : 'festival-card list-view';
    
    const dateDisplay = festival.dates !== 'dates à définir' ? festival.dates : 'Dates à venir';
    const isUpcoming = festival.dates && !festival.dates.includes('dates à définir');
    const departmentColor = getDepartmentColor(festival.department);
    
    card.innerHTML = `
        <div class="festival-image">
            <img src="${festival.image}" alt="${festival.title}" loading="lazy">
            <div class="festival-badge ${isUpcoming ? 'upcoming' : 'tbd'}">
                ${isUpcoming ? 'À venir' : 'TBD'}
            </div>
            ${festival.coupDeCoeur ? '<div class="coup-de-coeur-indicator"><i class="fas fa-star"></i></div>' : ''}
        </div>
        
        <div class="festival-content">
            <div class="festival-header">
                <div class="festival-category">
                    <span class="department-badge" style="background-color: ${departmentColor}">
                        ${festival.department}
                    </span>
                    ${festival.coupDeCoeur ? '<span class="coup-de-coeur-text"><i class="fas fa-star"></i> Coup de cœur</span>' : ''}
                </div>
                <h3 class="festival-title">${festival.title}</h3>
                <div class="festival-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${festival.address}</span>
                </div>
            </div>
            
            <div class="festival-meta">
                <div class="festival-dates">
                    <i class="fas fa-calendar"></i>
                    <span>${dateDisplay}</span>
                </div>
            </div>
            
            <div class="festival-description">
                ${festival.shortDescription}
            </div>
            
            <div class="festival-tags">
                ${festival.tags.slice(0, 4).map(tag => 
                    `<span class="festival-tag">#${tag}</span>`
                ).join('')}
            </div>
            
            <div class="festival-actions">
                <a href="poi.html?slug=${festival.slug}" class="btn-festival-site">
                    <i class="fas fa-info-circle"></i>
                    En savoir plus
                </a>
                <button class="btn-festival-map" onclick="showOnMap(${festival.lat}, ${festival.lng}, '${festival.title.replace(/'/g, "\\'")}')">
                    <i class="fas fa-map"></i>
                    Voir sur la carte
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Get department color
function getDepartmentColor(department) {
    const colors = {
        'Finistère': '#1e40af',
        'Côtes-d\'Armor': '#059669',
        'Ille-et-Vilaine': '#dc2626',
        'Morbihan': '#7c3aed',
        'Loire-Atlantique': '#ea580c',
        'Maine-et-Loire': '#0891b2'
    };
    return colors[department] || '#6b7280';
}

// Show festival location on map
function showOnMap(lat, lng, title) {
    // Store location data for the map page
    localStorage.setItem('mapFocus', JSON.stringify({
        lat: lat,
        lng: lng,
        title: title
    }));
    
    // Navigate to map page
    window.location.href = 'index.html';
}

// Filter festivals based on selected criteria
function filterFestivals() {
    const monthFilter = document.getElementById('monthFilter').value;
    const departmentFilter = document.getElementById('departmentFilter').value;
    
    const filtered = festivals.filter(festival => {
        // Month filter
        if (monthFilter) {
            const festivalDate = parseFestivalDate(festival.dates);
            if (!festivalDate || (festivalDate.getMonth() + 1).toString().padStart(2, '0') !== monthFilter) {
                return false;
            }
        }
        
        // Department filter
        if (departmentFilter && festival.department !== departmentFilter) {
            return false;
        }
        
        return true;
    });
    
    displayFestivals(filtered);
}

// Advanced filtering function
function applyFilters() {
    let filtered = [...festivals];
    
    // Search filter
    if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        filtered = filtered.filter(festival =>
            festival.title.toLowerCase().includes(searchTerm) ||
            festival.description.toLowerCase().includes(searchTerm) ||
            festival.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            festival.department.toLowerCase().includes(searchTerm)
        );
    }
    
    // Month filter
    if (currentFilters.month) {
        filtered = filtered.filter(festival => {
            const festivalDate = parseFestivalDate(festival.dates);
            return festivalDate && (festivalDate.getMonth() + 1).toString().padStart(2, '0') === currentFilters.month;
        });
    }
    
    // Department filter
    if (currentFilters.department) {
        filtered = filtered.filter(festival => festival.department === currentFilters.department);
    }
    
    // Quick filters
    switch (currentFilters.quickFilter) {
        case 'upcoming':
            filtered = filtered.filter(festival => 
                festival.dates && !festival.dates.includes('dates à définir')
            );
            break;
        case 'coups-de-coeur':
            filtered = filtered.filter(festival => festival.coupDeCoeur);
            break;
        case 'summer':
            filtered = filtered.filter(festival => {
                const festivalDate = parseFestivalDate(festival.dates);
                return festivalDate && [6, 7, 8].includes(festivalDate.getMonth() + 1);
            });
            break;
    }
    
    // Sort
    filtered.sort((a, b) => {
        switch (currentFilters.sort) {
            case 'name':
                return a.title.localeCompare(b.title);
            case 'department':
                return a.department.localeCompare(b.department);
            case 'coups-de-coeur':
                if (a.coupDeCoeur && !b.coupDeCoeur) return -1;
                if (!a.coupDeCoeur && b.coupDeCoeur) return 1;
                return 0;
            default: // date
                const dateA = parseFestivalDate(a.dates);
                const dateB = parseFestivalDate(b.dates);
                if (!dateA && !dateB) return 0;
                if (!dateA) return 1;
                if (!dateB) return -1;
                return dateA - dateB;
        }
    });
    
    filteredFestivals = filtered;
    updateResultsInfo();
    displayFestivals(filteredFestivals);
}

// Update statistics
function updateStats() {
    const total = festivals.length;
    const upcoming = festivals.filter(f => f.dates && !f.dates.includes('dates à définir')).length;
    
    document.getElementById('totalFestivals').textContent = total;
    document.getElementById('upcomingFestivals').textContent = upcoming;
}

// Update results info
function updateResultsInfo() {
    const count = filteredFestivals.length;
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsCount = document.getElementById('resultsCount');
    
    let title = 'Tous les festivals';
    if (currentFilters.quickFilter !== 'all') {
        const quickFilters = {
            'upcoming': 'Festivals à venir',
            'coups-de-coeur': 'Coups de cœur',
            'summer': 'Festivals d\'été 2026'
        };
        title = quickFilters[currentFilters.quickFilter] || title;
    } else if (currentFilters.search) {
        title = `Résultats pour "${currentFilters.search}"`;
    }
    
    resultsTitle.textContent = title;
    resultsCount.textContent = `${count} festival${count !== 1 ? 's' : ''} trouvé${count !== 1 ? 's' : ''}`;
}

// Fonction favoris supprimée - site vitrine uniquement

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadFestivalsData();
    
    // Search input
    document.getElementById('festivalSearch').addEventListener('input', (e) => {
        currentFilters.search = e.target.value;
        applyFilters();
    });
    
    // Standard filters
    document.getElementById('monthFilter').addEventListener('change', (e) => {
        currentFilters.month = e.target.value;
        applyFilters();
    });
    
    document.getElementById('departmentFilter').addEventListener('change', (e) => {
        currentFilters.department = e.target.value;
        applyFilters();
    });
    
    document.getElementById('sortFilter').addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        applyFilters();
    });
    
    // Advanced filters toggle
    const advancedToggle = document.getElementById('showAdvancedFilters');
    const advancedPanel = document.getElementById('advancedFiltersPanel');
    if (advancedToggle && advancedPanel) {
        advancedToggle.addEventListener('click', () => {
            const isOpen = advancedPanel.classList.contains('open');
            advancedPanel.classList.toggle('open', !isOpen);
            advancedToggle.classList.toggle('active', !isOpen);
        });
    }

    // New filter chips
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilters.quickFilter = btn.dataset.filter;
            applyFilters();
        });
    });

    // Quick filter buttons (fallback)
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.quick-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilters.quickFilter = btn.dataset.filter;
            applyFilters();
        });
    });
    
    // Apply filters button
    const applyBtn = document.getElementById('applyFilters');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            applyFilters();
            // Close advanced panel after applying
            if (advancedPanel) {
                advancedPanel.classList.remove('open');
                advancedToggle.classList.remove('active');
            }
        });
    }

    // Reset all filters button (new)
    const resetAllBtn = document.getElementById('resetAllFilters');
    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', () => {
            currentFilters = {
                search: '',
                month: '',
                department: '',
                sort: 'date',
                quickFilter: 'all'
            };
            
            const searchInput = document.getElementById('festivalSearch');
            const monthFilter = document.getElementById('monthFilter');
            const departmentFilter = document.getElementById('departmentFilter');
            const sortFilter = document.getElementById('sortFilter');
            
            if (searchInput) searchInput.value = '';
            if (monthFilter) monthFilter.value = '';
            if (departmentFilter) departmentFilter.value = '';
            if (sortFilter) sortFilter.value = 'date';
            
            document.querySelectorAll('.filter-chip').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === 'all');
            });
            
            applyFilters();
        });
    }

    // Reset filters (old button fallback)
    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            currentFilters = {
                search: '',
                month: '',
                department: '',
                sort: 'date',
                quickFilter: 'all'
            };
            
            document.getElementById('festivalSearch').value = '';
            document.getElementById('monthFilter').value = '';
            document.getElementById('departmentFilter').value = '';
            document.getElementById('sortFilter').value = 'date';
            document.querySelectorAll('.quick-filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === 'all');
            });
            
            applyFilters();
        });
    }
    
    // View toggle buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            
            const grid = document.getElementById('festivalsGrid');
            grid.classList.toggle('list-view', currentView === 'list');
            
            displayFestivals(filteredFestivals);
        });
    });
});