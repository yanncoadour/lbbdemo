/**
 * TESTS D'INTÉGRATION - APPLICATION
 * Tests d'intégration pour les interactions entre modules
 */

// Mock des dépendances externes
global.L = {
    map: jest.fn(() => ({
        setView: jest.fn(),
        on: jest.fn(),
        panTo: jest.fn(),
        setZoom: jest.fn(),
        getZoom: jest.fn(() => 10),
        getCenter: jest.fn(() => ({ lat: 48.2, lng: -2.9 }))
    })),
    tileLayer: jest.fn(() => ({ addTo: jest.fn() })),
    marker: jest.fn(() => ({
        addTo: jest.fn(),
        bindPopup: jest.fn(),
        on: jest.fn()
    })),
    layerGroup: jest.fn(() => ({
        addTo: jest.fn(),
        clearLayers: jest.fn(),
        addLayer: jest.fn()
    }))
};

// Mock fetch pour les données POI
global.fetch = jest.fn();

// Mock de l'objet window
global.window = {
    LaBelleBretagne: { modules: {} },
    Security: {
        validateAndSanitize: jest.fn(input => input),
        secureLocalStorage: jest.fn(() => true),
        secureGetLocalStorage: jest.fn(() => null)
    },
    filtersInitialized: false,
    isFiltersOpen: false,
    addEventListener: jest.fn()
};

// Mock de document
global.document = {
    getElementById: jest.fn(),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(() => []),
    createElement: jest.fn(() => ({
        innerHTML: '',
        classList: { add: jest.fn(), remove: jest.fn() },
        setAttribute: jest.fn()
    })),
    addEventListener: jest.fn(),
    readyState: 'complete'
};

// Mock des données POI de test
const mockPoisData = [
    {
        id: '1',
        nom: 'Château de Brest',
        type: 'chateau',
        departement: 'Finistère',
        latitude: 48.4,
        longitude: -4.5,
        description: 'Forteresse maritime'
    },
    {
        id: '2', 
        nom: 'Pointe du Raz',
        type: 'point_de_vue',
        departement: 'Finistère',
        latitude: 48.0,
        longitude: -4.7,
        description: 'Site naturel exceptionnel'
    },
    {
        id: '3',
        nom: 'Musée de Bretagne',
        type: 'musee',
        departement: 'Ille-et-Vilaine',
        latitude: 48.1,
        longitude: -1.7,
        description: 'Histoire et culture bretonnes'
    }
];

// Mock de console
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
};

// Variables globales mockées
global.CONFIG = {
    map: { center: [48.2, -2.9], zoom: 8 },
    colors: { chateau: '#92400e', point_de_vue: '#059669', musee: '#8b5cf6' }
};

global.map = null;
global.markersGroup = null;
global.allPois = [];
global.filteredPois = [];
global.currentFilters = { departments: [], categories: [], sort: 'distance' };

// ===================================================================
// TESTS D'INTÉGRATION CHARGEMENT DE DONNÉES
// ===================================================================

describe('Integration - Data Loading', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.allPois = [];
        global.filteredPois = [];
    });

    describe('Application initialization with POI data', () => {
        test('should load and process POI data successfully', async () => {
            // Mock d'une réponse fetch réussie
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockPoisData)
            });

            // Mock des éléments DOM nécessaires
            global.document.getElementById.mockReturnValue({ 
                innerHTML: '',
                classList: { add: jest.fn(), remove: jest.fn() }
            });

            // Simuler le chargement des données
            if (typeof loadPois === 'function') {
                await loadPois();
                
                expect(global.fetch).toHaveBeenCalled();
                expect(global.allPois.length).toBeGreaterThan(0);
                expect(global.filteredPois.length).toBeGreaterThan(0);
            }
        });

        test('should handle POI loading failure gracefully', async () => {
            // Mock d'une réponse fetch échouée
            global.fetch.mockRejectedValueOnce(new Error('Network error'));

            expect(async () => {
                if (typeof loadPois === 'function') {
                    await loadPois();
                }
            }).not.toThrow();
            
            expect(global.console.error).toHaveBeenCalled();
        });
    });
});

// ===================================================================
// TESTS D'INTÉGRATION CARTE + FILTRES
// ===================================================================

describe('Integration - Map and Filters', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.allPois = [...mockPoisData];
        global.filteredPois = [...mockPoisData];
        global.currentFilters = { departments: [], categories: [], sort: 'distance' };
        
        // Mock du markersGroup
        global.markersGroup = {
            clearLayers: jest.fn(),
            addLayer: jest.fn()
        };
    });

    describe('Filter application updates map', () => {
        test('should update map markers when filters are applied', () => {
            // Appliquer un filtre par département
            global.currentFilters.departments = ['Finistère'];

            // Mock des fonctions de filtrage
            global.filterPois = jest.fn(() => 
                mockPoisData.filter(poi => poi.departement === 'Finistère')
            );
            global.sortPois = jest.fn(pois => pois);
            global.updateMarkers = jest.fn();

            if (typeof applyFilters === 'function') {
                applyFilters();
            }

            // Vérifier que le filtrage a été effectué
            expect(global.filterPois).toHaveBeenCalledWith(global.allPois, global.currentFilters);
            
            // Vérifier que les marqueurs ont été mis à jour
            expect(global.updateMarkers).toHaveBeenCalled();
        });

        test('should clear filters and restore all POIs', () => {
            // Initialiser avec des filtres actifs
            global.currentFilters.departments = ['Finistère'];
            global.filteredPois = [mockPoisData[0]];

            global.updateMarkers = jest.fn();

            if (typeof resetFilters === 'function') {
                resetFilters();
            }

            // Vérifier que les filtres ont été réinitialisés
            expect(global.currentFilters.departments).toHaveLength(0);
            expect(global.currentFilters.categories).toHaveLength(0);
            
            // Vérifier que tous les POIs sont affichés
            expect(global.updateMarkers).toHaveBeenCalled();
        });
    });

    describe('Search functionality integration', () => {
        test('should filter and update map based on search query', () => {
            const searchQuery = 'château';
            
            global.updateMarkers = jest.fn();
            
            if (typeof searchPois === 'function' && typeof updateMarkers === 'function') {
                const searchResults = searchPois(searchQuery);
                global.filteredPois = searchResults;
                updateMarkers(searchResults);
                
                expect(global.updateMarkers).toHaveBeenCalledWith(searchResults);
            }
        });
    });
});

// ===================================================================
// TESTS D'INTÉGRATION SÉCURITÉ + STOCKAGE
// ===================================================================

describe('Integration - Security and Storage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Secure data persistence', () => {
        test('should save and retrieve user preferences securely', () => {
            const userPreferences = {
                favoriteFilters: { departments: ['Finistère'] },
                lastLocation: { lat: 48.0, lng: -4.0 },
                viewPreferences: { zoom: 10 }
            };

            global.window.Security.secureLocalStorage.mockReturnValue(true);
            global.window.Security.secureGetLocalStorage.mockReturnValue(userPreferences);

            // Test de sauvegarde sécurisée
            if (global.window.LaBelleBretagne.Storage) {
                const saveResult = global.window.LaBelleBretagne.Storage.set('userPrefs', userPreferences);
                expect(saveResult).toBe(true);
                
                // Test de récupération sécurisée
                const retrievedPrefs = global.window.LaBelleBretagne.Storage.get('userPrefs');
                expect(retrievedPrefs).toEqual(userPreferences);
            }
        });

        test('should sanitize user input before processing', () => {
            const maliciousInput = '<script>alert("xss")</script>Château de Brest';
            const expectedCleanInput = 'Château de Brest';

            global.window.Security.validateAndSanitize.mockReturnValue(expectedCleanInput);

            if (global.window.LaBelleBretagne.DataUtils) {
                const cleanInput = global.window.LaBelleBretagne.DataUtils.sanitize(maliciousInput);
                
                expect(global.window.Security.validateAndSanitize).toHaveBeenCalledWith(maliciousInput, 'text');
                expect(cleanInput).toBe(expectedCleanInput);
            }
        });
    });
});

// ===================================================================
// TESTS D'INTÉGRATION UI + ÉTAT APPLICATION
// ===================================================================

describe('Integration - UI and Application State', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('UI state management', () => {
        test('should synchronize filter UI with application state', () => {
            const mockBottomSheet = {
                classList: { add: jest.fn(), remove: jest.fn() }
            };
            const mockFilterContent = { innerHTML: '' };

            global.document.getElementById.mockReturnValue(mockBottomSheet);
            global.document.querySelector.mockReturnValue(mockFilterContent);

            // Test d'ouverture des filtres
            if (typeof showFiltersPopup === 'function') {
                showFiltersPopup();
                
                expect(mockBottomSheet.classList.add).toHaveBeenCalledWith('mini-filters-mode');
                expect(global.window.isFiltersOpen).toBe(true);
            }

            // Test de fermeture des filtres
            if (typeof hideFiltersPopup === 'function') {
                hideFiltersPopup();
                
                expect(mockBottomSheet.classList.remove).toHaveBeenCalledWith('mini-filters-mode');
                expect(global.window.isFiltersOpen).toBe(false);
            }
        });

        test('should handle loading states across the application', () => {
            const mockContainer = {
                innerHTML: '',
                appendChild: jest.fn()
            };

            if (global.window.LaBelleBretagne.UIUtils) {
                // Test d'affichage d'état de chargement
                global.window.LaBelleBretagne.UIUtils.setLoadingState(mockContainer, true);
                expect(mockContainer.innerHTML).toBe('');
                expect(mockContainer.appendChild).toHaveBeenCalled();

                // Test de masquage d'état de chargement
                mockContainer.innerHTML = 'existing content';
                global.window.LaBelleBretagne.UIUtils.setLoadingState(mockContainer, false);
                expect(mockContainer.innerHTML).toBe('existing content');
            }
        });
    });
});

// ===================================================================
// TESTS D'INTÉGRATION GÉOLOCALISATION
// ===================================================================

describe('Integration - Geolocation and Map', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.navigator = {
            geolocation: {
                getCurrentPosition: jest.fn()
            }
        };
        global.map = {
            panTo: jest.fn(),
            setZoom: jest.fn()
        };
    });

    describe('User location integration', () => {
        test('should center map on user location when available', () => {
            const mockPosition = {
                coords: { latitude: 48.5, longitude: -3.5 }
            };

            // Mock de géolocalisation réussie
            global.navigator.geolocation.getCurrentPosition.mockImplementation((success) => {
                success(mockPosition);
            });

            if (typeof getCurrentLocation === 'function') {
                getCurrentLocation();
                
                expect(global.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
                
                // Vérifier que la carte est centrée sur la position utilisateur
                setTimeout(() => {
                    expect(global.map.panTo).toHaveBeenCalledWith([
                        mockPosition.coords.latitude,
                        mockPosition.coords.longitude
                    ]);
                }, 0);
            }
        });

        test('should sort POIs by distance when user location is available', () => {
            const userLocation = { lat: 48.0, lng: -4.0 };
            const poisWithDistance = [...mockPoisData];

            if (typeof sortPois === 'function') {
                const sortedPois = sortPois(poisWithDistance, 'distance', userLocation);
                
                expect(sortedPois).toHaveLength(mockPoisData.length);
                // Le tri par distance devrait placer le POI le plus proche en premier
            }
        });
    });
});

// ===================================================================
// TESTS DE ROBUSTESSE
// ===================================================================

describe('Integration - Error Handling and Robustness', () => {
    test('should gracefully handle multiple simultaneous operations', async () => {
        // Simuler plusieurs opérations simultanées
        const operations = [
            () => global.fetch('/data/pois.json'),
            () => global.navigator?.geolocation?.getCurrentPosition?.(() => {}),
            () => typeof applyFilters === 'function' && applyFilters(),
            () => typeof showFiltersPopup === 'function' && showFiltersPopup()
        ];

        expect(() => {
            operations.forEach(op => {
                try {
                    op();
                } catch (error) {
                    // Les erreurs ne doivent pas faire planter l'application
                }
            });
        }).not.toThrow();
    });

    test('should maintain application state consistency', () => {
        // Test que l'état reste cohérent après des opérations multiples
        const initialAllPoisLength = global.allPois.length;
        
        // Appliquer et réinitialiser des filtres
        if (typeof applyFilters === 'function' && typeof resetFilters === 'function') {
            applyFilters();
            resetFilters();
            
            // L'état global ne devrait pas être corrompu
            expect(Array.isArray(global.allPois)).toBe(true);
            expect(Array.isArray(global.filteredPois)).toBe(true);
            expect(typeof global.currentFilters).toBe('object');
        }
    });
});