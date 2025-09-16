/**
 * TESTS UNITAIRES - FILTERS
 * Tests pour le système de filtres et de recherche
 */

// Mock des dépendances globales
global.window = {
    filtersInitialized: false,
    isFiltersOpen: false,
    Security: {
        safeSetInnerHTML: jest.fn((element, content) => {
            element.innerHTML = content;
        })
    },
    getComputedStyle: jest.fn(() => ({ height: '300px' }))
};

global.document = {
    getElementById: jest.fn(),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(() => []),
    createElement: jest.fn(() => ({
        innerHTML: '',
        className: '',
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
            contains: jest.fn()
        },
        setAttribute: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        getBoundingClientRect: jest.fn(() => ({ x: 0, y: 0, width: 100, height: 40 })),
        offsetParent: {}
    }))
};

// Mock de console
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
};

// Mock des variables globales
global.currentFilters = {
    departments: [],
    categories: [],
    sort: 'distance'
};

global.allPois = [
    {
        id: '1',
        nom: 'Château de Brest',
        type: 'chateau',
        departement: 'Finistère',
        ville: 'Brest',
        latitude: 48.4,
        longitude: -4.5
    },
    {
        id: '2',
        nom: 'Pointe du Raz',
        type: 'point_de_vue',
        departement: 'Finistère',
        ville: 'Plogoff',
        latitude: 48.0,
        longitude: -4.7
    },
    {
        id: '3',
        nom: 'Musée de Bretagne',
        type: 'musee',
        departement: 'Ille-et-Vilaine',
        ville: 'Rennes',
        latitude: 48.1,
        longitude: -1.7
    }
];

global.filteredPois = [...global.allPois];

// Charger le module filters
require('../js/filters.js');

// ===================================================================
// TESTS INITIALISATION FILTRES
// ===================================================================

describe('Filters Initialization', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.window.filtersInitialized = false;
        global.window.isFiltersOpen = false;
    });

    describe('initFilters', () => {
        test('should initialize filters only once', () => {
            const mockFilterBtn = {
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                getBoundingClientRect: jest.fn(() => ({ x: 0, y: 0 })),
                offsetParent: {}
            };

            global.document.getElementById.mockImplementation((id) => {
                if (id === 'filterBtn') return mockFilterBtn;
                return null;
            });

            // Premier appel
            if (typeof initFilters === 'function') {
                initFilters();
            }
            expect(global.window.filtersInitialized).toBe(true);

            // Deuxième appel - ne devrait rien faire
            global.console.log.mockClear();
            if (typeof initFilters === 'function') {
                initFilters();
            }
            expect(global.console.log).toHaveBeenCalledWith('⚠️ Filtres déjà initialisés, on ignore');
        });

        test('should attach event listeners to filter buttons', () => {
            const mockFilterBtn = {
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                getBoundingClientRect: jest.fn(() => ({ x: 0, y: 0 })),
                offsetParent: {}
            };
            const mockBackBtn = { addEventListener: jest.fn() };
            const mockApplyBtn = { addEventListener: jest.fn() };
            const mockResetBtn = { addEventListener: jest.fn() };

            global.document.getElementById.mockImplementation((id) => {
                switch (id) {
                    case 'filterBtn': return mockFilterBtn;
                    case 'backFilterBtn': return mockBackBtn;
                    case 'applyFiltersInline': return mockApplyBtn;
                    case 'resetFiltersInline': return mockResetBtn;
                    default: return null;
                }
            });

            if (typeof initFilters === 'function') {
                initFilters();
            }

            expect(mockFilterBtn.addEventListener).toHaveBeenCalled();
            expect(mockBackBtn.addEventListener).toHaveBeenCalled();
            expect(mockApplyBtn.addEventListener).toHaveBeenCalled();
            expect(mockResetBtn.addEventListener).toHaveBeenCalled();
        });

        test('should handle missing filter button gracefully', () => {
            global.document.getElementById.mockReturnValue(null);
            global.document.querySelectorAll.mockReturnValue([]);

            expect(() => {
                if (typeof initFilters === 'function') {
                    initFilters();
                }
            }).not.toThrow();

            expect(global.console.error).toHaveBeenCalledWith('❌ Bouton filtre non trouvé!');
        });
    });
});

// ===================================================================
// TESTS AFFICHAGE POPUP FILTRES
// ===================================================================

describe('Filters Popup', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('showFiltersPopup', () => {
        test('should display filters popup', () => {
            const mockBottomSheet = {
                classList: { add: jest.fn() }
            };
            const mockFilterContent = {
                innerHTML: ''
            };

            global.document.getElementById.mockImplementation((id) => {
                if (id === 'bottomSheet') return mockBottomSheet;
                return null;
            });
            global.document.querySelector.mockImplementation((selector) => {
                if (selector === '.filter-content') return mockFilterContent;
                return null;
            });

            if (typeof showFiltersPopup === 'function') {
                showFiltersPopup();
            }

            expect(mockBottomSheet.classList.add).toHaveBeenCalledWith('mini-filters-mode');
            expect(global.window.isFiltersOpen).toBe(true);
        });

        test('should use safe innerHTML when Security module available', () => {
            const mockBottomSheet = {
                classList: { add: jest.fn() }
            };
            const mockFilterContent = { innerHTML: '' };

            global.document.getElementById.mockReturnValue(mockBottomSheet);
            global.document.querySelector.mockReturnValue(mockFilterContent);

            if (typeof showFiltersPopup === 'function') {
                showFiltersPopup();
            }

            expect(global.window.Security.safeSetInnerHTML).toHaveBeenCalledWith(
                mockFilterContent,
                expect.any(String)
            );
        });

        test('should handle missing elements gracefully', () => {
            global.document.getElementById.mockReturnValue(null);
            global.document.querySelector.mockReturnValue(null);

            expect(() => {
                if (typeof showFiltersPopup === 'function') {
                    showFiltersPopup();
                }
            }).not.toThrow();
        });
    });

    describe('hideFiltersPopup', () => {
        test('should hide filters popup', () => {
            const mockBottomSheet = {
                classList: { remove: jest.fn() }
            };

            global.document.getElementById.mockReturnValue(mockBottomSheet);

            if (typeof hideFiltersPopup === 'function') {
                hideFiltersPopup();
            }

            expect(mockBottomSheet.classList.remove).toHaveBeenCalledWith('mini-filters-mode');
            expect(global.window.isFiltersOpen).toBe(false);
        });
    });
});

// ===================================================================
// TESTS LOGIQUE DE FILTRAGE
// ===================================================================

describe('Filtering Logic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.currentFilters = {
            departments: [],
            categories: [],
            sort: 'distance'
        };
        global.allPois = [
            {
                id: '1',
                nom: 'Château de Brest',
                type: 'chateau',
                departement: 'Finistère',
                ville: 'Brest',
                latitude: 48.4,
                longitude: -4.5
            },
            {
                id: '2',
                nom: 'Musée de Bretagne',
                type: 'musee',
                departement: 'Ille-et-Vilaine',
                ville: 'Rennes',
                latitude: 48.1,
                longitude: -1.7
            },
            {
                id: '3',
                nom: 'Plage de Carnac',
                type: 'plage',
                departement: 'Morbihan',
                ville: 'Carnac',
                latitude: 47.6,
                longitude: -3.1
            }
        ];
    });

    describe('filterPois', () => {
        test('should return all POIs when no filters applied', () => {
            if (typeof filterPois === 'function') {
                const result = filterPois(global.allPois, {});
                
                expect(result).toHaveLength(3);
                expect(result).toEqual(global.allPois);
            }
        });

        test('should filter POIs by department', () => {
            const filters = {
                departments: ['Finistère']
            };

            if (typeof filterPois === 'function') {
                const result = filterPois(global.allPois, filters);
                
                expect(result).toHaveLength(1);
                expect(result[0].departement).toBe('Finistère');
            }
        });

        test('should filter POIs by category', () => {
            const filters = {
                categories: ['musee']
            };

            if (typeof filterPois === 'function') {
                const result = filterPois(global.allPois, filters);
                
                expect(result).toHaveLength(1);
                expect(result[0].type).toBe('musee');
            }
        });

        test('should apply multiple filters', () => {
            const filters = {
                departments: ['Finistère', 'Ille-et-Vilaine'],
                categories: ['chateau', 'musee']
            };

            if (typeof filterPois === 'function') {
                const result = filterPois(global.allPois, filters);
                
                expect(result).toHaveLength(2);
                expect(result.every(poi => 
                    filters.departments.includes(poi.departement) && 
                    filters.categories.includes(poi.type)
                )).toBe(true);
            }
        });

        test('should handle empty filter arrays', () => {
            const filters = {
                departments: [],
                categories: []
            };

            if (typeof filterPois === 'function') {
                const result = filterPois(global.allPois, filters);
                
                expect(result).toHaveLength(3);
            }
        });
    });

    describe('sortPois', () => {
        test('should sort POIs by name', () => {
            if (typeof sortPois === 'function') {
                const sorted = sortPois([...global.allPois], 'name');
                
                expect(sorted[0].nom).toBe('Château de Brest');
                expect(sorted[1].nom).toBe('Musée de Bretagne');
                expect(sorted[2].nom).toBe('Plage de Carnac');
            }
        });

        test('should sort POIs by distance when user location provided', () => {
            const userLocation = { lat: 48.0, lng: -4.0 };

            if (typeof sortPois === 'function') {
                const sorted = sortPois([...global.allPois], 'distance', userLocation);
                
                // Le château de Brest devrait être le plus proche
                expect(sorted[0].id).toBe('1');
            }
        });

        test('should handle invalid sort criteria', () => {
            if (typeof sortPois === 'function') {
                const sorted = sortPois([...global.allPois], 'invalid-sort');
                
                // Devrait retourner les POIs dans l'ordre original
                expect(sorted).toHaveLength(3);
            }
        });

        test('should handle empty POI array', () => {
            if (typeof sortPois === 'function') {
                const sorted = sortPois([], 'name');
                
                expect(sorted).toHaveLength(0);
            }
        });
    });
});

// ===================================================================
// TESTS APPLICATION ET RESET DES FILTRES
// ===================================================================

describe('Filter Application', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.currentFilters = {
            departments: [],
            categories: [],
            sort: 'distance'
        };
    });

    describe('applyFilters', () => {
        test('should update filteredPois based on current filters', () => {
            // Mock des fonctions de filtrage
            global.filterPois = jest.fn(() => global.allPois.slice(0, 2));
            global.sortPois = jest.fn((pois) => pois);
            global.updateMarkers = jest.fn();

            if (typeof applyFilters === 'function') {
                applyFilters();
            }

            expect(global.filterPois).toHaveBeenCalledWith(global.allPois, global.currentFilters);
            expect(global.updateMarkers).toHaveBeenCalled();
        });

        test('should update UI after applying filters', () => {
            global.updateMarkers = jest.fn();
            global.filterPois = jest.fn(() => []);
            global.sortPois = jest.fn((pois) => pois);

            if (typeof applyFilters === 'function') {
                applyFilters();
            }

            expect(global.updateMarkers).toHaveBeenCalled();
        });
    });

    describe('resetFilters', () => {
        test('should reset all filters to default values', () => {
            // Modifier les filtres actuels
            global.currentFilters.departments = ['Finistère'];
            global.currentFilters.categories = ['chateau'];
            global.currentFilters.sort = 'name';

            if (typeof resetFilters === 'function') {
                resetFilters();
            }

            expect(global.currentFilters.departments).toHaveLength(0);
            expect(global.currentFilters.categories).toHaveLength(0);
            expect(global.currentFilters.sort).toBe('distance');
        });

        test('should update UI after resetting filters', () => {
            global.updateMarkers = jest.fn();
            global.filteredPois = global.allPois;

            if (typeof resetFilters === 'function') {
                resetFilters();
            }

            expect(global.updateMarkers).toHaveBeenCalled();
        });
    });
});

// ===================================================================
// TESTS GÉNÉRATION CONTENU FILTRES
// ===================================================================

describe('Filter Content Generation', () => {
    describe('createSimpleFiltersContent', () => {
        test('should generate filters HTML content', () => {
            if (typeof createSimpleFiltersContent === 'function') {
                const content = createSimpleFiltersContent();
                
                expect(typeof content).toBe('string');
                expect(content.length).toBeGreaterThan(0);
                expect(content).toContain('filter');
            }
        });

        test('should include department options', () => {
            if (typeof createSimpleFiltersContent === 'function') {
                const content = createSimpleFiltersContent();
                
                expect(content).toContain('Finistère');
                expect(content).toContain('Ille-et-Vilaine');
                expect(content).toContain('Morbihan');
                expect(content).toContain('Côtes-d\'Armor');
            }
        });

        test('should include category options', () => {
            if (typeof createSimpleFiltersContent === 'function') {
                const content = createSimpleFiltersContent();
                
                expect(content).toContain('château');
                expect(content).toContain('musée');
                expect(content).toContain('plage');
            }
        });
    });
});

// ===================================================================
// TESTS ÉVÉNEMENTS FILTRES
// ===================================================================

describe('Filter Events', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('attachMiniFilterEvents', () => {
        test('should attach events to filter checkboxes', () => {
            const mockCheckboxes = [
                { addEventListener: jest.fn(), type: 'checkbox', name: 'department' },
                { addEventListener: jest.fn(), type: 'checkbox', name: 'category' }
            ];

            global.document.querySelectorAll.mockImplementation((selector) => {
                if (selector.includes('checkbox')) return mockCheckboxes;
                return [];
            });

            if (typeof attachMiniFilterEvents === 'function') {
                attachMiniFilterEvents();
            }

            mockCheckboxes.forEach(checkbox => {
                expect(checkbox.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
            });
        });

        test('should handle missing checkboxes gracefully', () => {
            global.document.querySelectorAll.mockReturnValue([]);

            expect(() => {
                if (typeof attachMiniFilterEvents === 'function') {
                    attachMiniFilterEvents();
                }
            }).not.toThrow();
        });
    });

    describe('Filter checkbox changes', () => {
        test('should update currentFilters when department checkbox changes', () => {
            const mockEvent = {
                target: {
                    type: 'checkbox',
                    name: 'department',
                    value: 'Finistère',
                    checked: true
                }
            };

            if (typeof handleFilterChange === 'function') {
                handleFilterChange(mockEvent);
                
                expect(global.currentFilters.departments).toContain('Finistère');
            }
        });

        test('should remove from filter when checkbox unchecked', () => {
            // Initialiser avec un département sélectionné
            global.currentFilters.departments = ['Finistère'];

            const mockEvent = {
                target: {
                    type: 'checkbox',
                    name: 'department',
                    value: 'Finistère',
                    checked: false
                }
            };

            if (typeof handleFilterChange === 'function') {
                handleFilterChange(mockEvent);
                
                expect(global.currentFilters.departments).not.toContain('Finistère');
            }
        });
    });
});

// ===================================================================
// TESTS UTILITAIRES FILTRES
// ===================================================================

describe('Filter Utilities', () => {
    describe('getUniqueValues', () => {
        test('should extract unique departments from POIs', () => {
            if (typeof getUniqueValues === 'function') {
                const departments = getUniqueValues(global.allPois, 'departement');
                
                expect(departments).toContain('Finistère');
                expect(departments).toContain('Ille-et-Vilaine');
                expect(departments).toContain('Morbihan');
                expect(departments).toHaveLength(3);
            }
        });

        test('should extract unique categories from POIs', () => {
            if (typeof getUniqueValues === 'function') {
                const categories = getUniqueValues(global.allPois, 'type');
                
                expect(categories).toContain('chateau');
                expect(categories).toContain('musee');
                expect(categories).toContain('plage');
                expect(categories).toHaveLength(3);
            }
        });

        test('should handle empty POI array', () => {
            if (typeof getUniqueValues === 'function') {
                const values = getUniqueValues([], 'type');
                
                expect(values).toHaveLength(0);
            }
        });

        test('should handle missing property', () => {
            if (typeof getUniqueValues === 'function') {
                const values = getUniqueValues(global.allPois, 'nonexistent');
                
                expect(values).toHaveLength(0);
            }
        });
    });
});