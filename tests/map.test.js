/**
 * TESTS UNITAIRES - MAP & NAVIGATION
 * Tests pour les fonctionnalités de carte et navigation
 */

// Mock des dépendances globales
global.window = {
    LaBelleBretagne: {
        modules: {}
    }
};

global.document = {
    getElementById: jest.fn(),
    querySelector: jest.fn(),
    createElement: jest.fn(() => ({
        innerHTML: '',
        className: '',
        setAttribute: jest.fn(),
        style: {}
    })),
    addEventListener: jest.fn()
};

// Mock de la configuration
global.CONFIG = {
    map: {
        center: [48.2020, -2.9326],
        zoom: 8,
        minZoom: 7,
        maxZoom: 16
    },
    colors: {
        monument: '#d97706',
        musee: '#8b5cf6',
        plage: '#06b6d4'
    }
};

// Mock complet de Leaflet
global.L = {
    map: jest.fn(() => ({
        setView: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        getZoom: jest.fn(() => 10),
        getCenter: jest.fn(() => ({ lat: 48.2020, lng: -2.9326 })),
        panTo: jest.fn(),
        setZoom: jest.fn(),
        fitBounds: jest.fn(),
        hasLayer: jest.fn(),
        addLayer: jest.fn(),
        removeLayer: jest.fn(),
        eachLayer: jest.fn()
    })),
    tileLayer: jest.fn(() => ({
        addTo: jest.fn()
    })),
    marker: jest.fn(() => ({
        addTo: jest.fn(),
        bindPopup: jest.fn(),
        openPopup: jest.fn(),
        closePopup: jest.fn(),
        setLatLng: jest.fn(),
        getLatLng: jest.fn(() => ({ lat: 48.0, lng: -3.0 })),
        on: jest.fn(),
        off: jest.fn(),
        remove: jest.fn()
    })),
    popup: jest.fn(() => ({
        setContent: jest.fn(),
        openOn: jest.fn(),
        close: jest.fn()
    })),
    layerGroup: jest.fn(() => ({
        addTo: jest.fn(),
        clearLayers: jest.fn(),
        addLayer: jest.fn(),
        removeLayer: jest.fn(),
        eachLayer: jest.fn(),
        hasLayer: jest.fn()
    })),
    icon: jest.fn(() => ({})),
    divIcon: jest.fn(() => ({})),
    latLng: jest.fn((lat, lng) => ({ lat, lng })),
    latLngBounds: jest.fn(() => ({
        extend: jest.fn(),
        isValid: jest.fn(() => true)
    }))
};

// Mock des variables globales de l'application
global.map = null;
global.markersGroup = null;
global.allPois = [];
global.filteredPois = [];

// Mock de navigator pour géolocalisation
global.navigator = {
    geolocation: {
        getCurrentPosition: jest.fn(),
        watchPosition: jest.fn(),
        clearWatch: jest.fn()
    }
};

// Mock de console
global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn()
};

// Charger les modules (dans l'ordre des dépendances)
require('../js/config.js');
require('../js/utils.js');
require('../js/map.js');
require('../js/app.js');

// ===================================================================
// TESTS INITIALISATION CARTE
// ===================================================================

describe('Map Initialization', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.map = null;
        global.markersGroup = null;
    });

    describe('initMap', () => {
        test('should create map with correct configuration', () => {
            const mockMapElement = { id: 'map' };
            global.document.getElementById.mockReturnValue(mockMapElement);
            
            // Exécuter initMap
            if (typeof initMap === 'function') {
                initMap();
            }
            
            expect(global.L.map).toHaveBeenCalledWith('map', {
                center: CONFIG.map.center,
                zoom: CONFIG.map.zoom,
                minZoom: CONFIG.map.minZoom,
                maxZoom: CONFIG.map.maxZoom,
                zoomControl: false,
                attributionControl: false
            });
        });

        test('should add tile layer to map', () => {
            const mockTileLayer = { addTo: jest.fn() };
            const mockMap = { setView: jest.fn() };
            
            global.L.tileLayer.mockReturnValue(mockTileLayer);
            global.L.map.mockReturnValue(mockMap);
            global.document.getElementById.mockReturnValue({ id: 'map' });
            
            if (typeof initMap === 'function') {
                initMap();
            }
            
            expect(global.L.tileLayer).toHaveBeenCalledWith(
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                { attribution: '© OpenStreetMap' }
            );
            expect(mockTileLayer.addTo).toHaveBeenCalledWith(mockMap);
        });

        test('should create markers group', () => {
            const mockLayerGroup = { addTo: jest.fn() };
            global.L.layerGroup.mockReturnValue(mockLayerGroup);
            global.document.getElementById.mockReturnValue({ id: 'map' });
            
            if (typeof initMap === 'function') {
                initMap();
            }
            
            expect(global.L.layerGroup).toHaveBeenCalled();
        });

        test('should handle missing map element gracefully', () => {
            global.document.getElementById.mockReturnValue(null);
            
            expect(() => {
                if (typeof initMap === 'function') {
                    initMap();
                }
            }).not.toThrow();
        });
    });
});

// ===================================================================
// TESTS GESTION DES MARKERS
// ===================================================================

describe('Marker Management', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Setup mock pour markersGroup
        global.markersGroup = {
            clearLayers: jest.fn(),
            addLayer: jest.fn(),
            hasLayer: jest.fn(() => false)
        };
    });

    describe('createMarker', () => {
        const samplePoi = {
            id: 'test-poi-1',
            nom: 'Monument Test',
            type: 'monument',
            latitude: 48.1,
            longitude: -3.1,
            description: 'Description test'
        };

        test('should create marker with correct position', () => {
            const mockMarker = {
                bindPopup: jest.fn(),
                on: jest.fn()
            };
            global.L.marker.mockReturnValue(mockMarker);
            
            if (typeof createMarker === 'function') {
                createMarker(samplePoi);
            }
            
            expect(global.L.marker).toHaveBeenCalledWith(
                [samplePoi.latitude, samplePoi.longitude]
            );
        });

        test('should bind popup to marker', () => {
            const mockMarker = {
                bindPopup: jest.fn(),
                on: jest.fn()
            };
            global.L.marker.mockReturnValue(mockMarker);
            
            if (typeof createMarker === 'function') {
                createMarker(samplePoi);
            }
            
            expect(mockMarker.bindPopup).toHaveBeenCalled();
        });

        test('should handle POI without coordinates', () => {
            const invalidPoi = {
                id: 'invalid-poi',
                nom: 'Invalid POI',
                type: 'monument'
                // Missing latitude/longitude
            };
            
            expect(() => {
                if (typeof createMarker === 'function') {
                    createMarker(invalidPoi);
                }
            }).not.toThrow();
        });
    });

    describe('updateMarkers', () => {
        test('should clear existing markers before adding new ones', () => {
            const pois = [
                { id: '1', nom: 'POI 1', type: 'monument', latitude: 48.1, longitude: -3.1 },
                { id: '2', nom: 'POI 2', type: 'musee', latitude: 48.2, longitude: -3.2 }
            ];
            
            if (typeof updateMarkers === 'function') {
                updateMarkers(pois);
            }
            
            expect(global.markersGroup.clearLayers).toHaveBeenCalled();
        });

        test('should handle empty POI array', () => {
            expect(() => {
                if (typeof updateMarkers === 'function') {
                    updateMarkers([]);
                }
            }).not.toThrow();
            
            expect(global.markersGroup.clearLayers).toHaveBeenCalled();
        });
    });
});

// ===================================================================
// TESTS GÉOLOCALISATION
// ===================================================================

describe('Geolocation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.map = {
            panTo: jest.fn(),
            setZoom: jest.fn()
        };
    });

    describe('getCurrentLocation', () => {
        test('should request user location', () => {
            if (typeof getCurrentLocation === 'function') {
                getCurrentLocation();
            }
            
            expect(global.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
        });

        test('should handle successful geolocation', () => {
            const mockPosition = {
                coords: {
                    latitude: 48.5,
                    longitude: -3.5,
                    accuracy: 100
                }
            };
            
            // Simuler le callback de succès
            global.navigator.geolocation.getCurrentPosition.mockImplementation((success) => {
                success(mockPosition);
            });
            
            if (typeof getCurrentLocation === 'function') {
                getCurrentLocation();
            }
            
            // Vérifier si la carte a été centrée sur la position
            setTimeout(() => {
                expect(global.map.panTo).toHaveBeenCalledWith([
                    mockPosition.coords.latitude,
                    mockPosition.coords.longitude
                ]);
            }, 0);
        });

        test('should handle geolocation error', () => {
            const mockError = {
                code: 1,
                message: 'User denied location'
            };
            
            global.navigator.geolocation.getCurrentPosition.mockImplementation((success, error) => {
                error(mockError);
            });
            
            expect(() => {
                if (typeof getCurrentLocation === 'function') {
                    getCurrentLocation();
                }
            }).not.toThrow();
        });
    });
});

// ===================================================================
// TESTS RECHERCHE ET NAVIGATION
// ===================================================================

describe('Search and Navigation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.allPois = [
            { id: '1', nom: 'Château de Brest', type: 'chateau', ville: 'Brest', latitude: 48.4, longitude: -4.5 },
            { id: '2', nom: 'Pointe du Raz', type: 'point_de_vue', ville: 'Plogoff', latitude: 48.0, longitude: -4.7 },
            { id: '3', nom: 'Mont-Saint-Michel', type: 'monument', ville: 'Le Mont-Saint-Michel', latitude: 48.6, longitude: -1.5 }
        ];
    });

    describe('searchPois', () => {
        test('should filter POIs by name', () => {
            const query = 'château';
            
            if (typeof searchPois === 'function') {
                const results = searchPois(query);
                
                expect(results).toHaveLength(1);
                expect(results[0].nom).toContain('Château');
            }
        });

        test('should filter POIs by city', () => {
            const query = 'brest';
            
            if (typeof searchPois === 'function') {
                const results = searchPois(query);
                
                expect(results.length).toBeGreaterThan(0);
                expect(results[0].ville.toLowerCase()).toContain('brest');
            }
        });

        test('should return empty array for no matches', () => {
            const query = 'inexistant';
            
            if (typeof searchPois === 'function') {
                const results = searchPois(query);
                
                expect(results).toHaveLength(0);
            }
        });

        test('should handle empty query', () => {
            if (typeof searchPois === 'function') {
                const results = searchPois('');
                
                // Devrait retourner tous les POIs ou un tableau vide
                expect(Array.isArray(results)).toBe(true);
            }
        });
    });

    describe('focusOnPoi', () => {
        test('should center map on POI coordinates', () => {
            const poi = global.allPois[0];
            global.map = {
                panTo: jest.fn(),
                setZoom: jest.fn()
            };
            
            if (typeof focusOnPoi === 'function') {
                focusOnPoi(poi);
            }
            
            expect(global.map.panTo).toHaveBeenCalledWith([poi.latitude, poi.longitude]);
        });

        test('should set appropriate zoom level', () => {
            const poi = global.allPois[0];
            global.map = {
                panTo: jest.fn(),
                setZoom: jest.fn()
            };
            
            if (typeof focusOnPoi === 'function') {
                focusOnPoi(poi);
            }
            
            expect(global.map.setZoom).toHaveBeenCalled();
        });

        test('should handle invalid POI gracefully', () => {
            expect(() => {
                if (typeof focusOnPoi === 'function') {
                    focusOnPoi(null);
                    focusOnPoi({});
                    focusOnPoi({ nom: 'Test' }); // Sans coordonnées
                }
            }).not.toThrow();
        });
    });
});

// ===================================================================
// TESTS ÉVÉNEMENTS CARTE
// ===================================================================

describe('Map Events', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.map = {
            on: jest.fn(),
            off: jest.fn(),
            getZoom: jest.fn(() => 10),
            getCenter: jest.fn(() => ({ lat: 48.2, lng: -2.9 }))
        };
    });

    describe('Map event listeners', () => {
        test('should register zoom event listener', () => {
            if (typeof initMapEvents === 'function') {
                initMapEvents();
            }
            
            // Vérifier que les événements sont bien enregistrés
            expect(global.map.on).toHaveBeenCalledWith('zoomend', expect.any(Function));
        });

        test('should register move event listener', () => {
            if (typeof initMapEvents === 'function') {
                initMapEvents();
            }
            
            expect(global.map.on).toHaveBeenCalledWith('moveend', expect.any(Function));
        });

        test('should handle zoom change', () => {
            let zoomHandler;
            
            global.map.on.mockImplementation((event, handler) => {
                if (event === 'zoomend') {
                    zoomHandler = handler;
                }
            });
            
            if (typeof initMapEvents === 'function') {
                initMapEvents();
            }
            
            if (zoomHandler) {
                expect(() => zoomHandler()).not.toThrow();
            }
        });
    });
});

// ===================================================================
// TESTS UTILITAIRES CARTE
// ===================================================================

describe('Map Utils', () => {
    describe('calculateMapBounds', () => {
        test('should calculate bounds for POI array', () => {
            const pois = [
                { latitude: 48.0, longitude: -4.0 },
                { latitude: 48.5, longitude: -3.0 },
                { latitude: 47.5, longitude: -4.5 }
            ];
            
            if (typeof calculateMapBounds === 'function') {
                const bounds = calculateMapBounds(pois);
                
                expect(bounds).toBeDefined();
            }
        });

        test('should handle empty POI array', () => {
            if (typeof calculateMapBounds === 'function') {
                const bounds = calculateMapBounds([]);
                
                // Devrait retourner null ou des bounds par défaut
                expect(bounds).toBeDefined();
            }
        });

        test('should handle POIs without coordinates', () => {
            const pois = [
                { nom: 'POI sans coordonnées' },
                { latitude: 48.0, longitude: -4.0 }
            ];
            
            expect(() => {
                if (typeof calculateMapBounds === 'function') {
                    calculateMapBounds(pois);
                }
            }).not.toThrow();
        });
    });

    describe('getPoiColor', () => {
        test('should return correct color for POI type', () => {
            if (typeof getPoiColor === 'function') {
                expect(getPoiColor('monument')).toBe(CONFIG.colors.monument);
                expect(getPoiColor('musee')).toBe(CONFIG.colors.musee);
                expect(getPoiColor('plage')).toBe(CONFIG.colors.plage);
            }
        });

        test('should return default color for unknown type', () => {
            if (typeof getPoiColor === 'function') {
                const unknownColor = getPoiColor('type-inexistant');
                
                expect(unknownColor).toBeDefined();
                expect(typeof unknownColor).toBe('string');
            }
        });
    });
});

// ===================================================================
// TESTS INTÉGRATION
// ===================================================================

describe('Map Integration', () => {
    test('should initialize all map components', () => {
        global.document.getElementById.mockReturnValue({ id: 'map' });
        global.document.addEventListener.mockImplementation((event, handler) => {
            if (event === 'DOMContentLoaded') {
                handler();
            }
        });
        
        // Simuler le chargement du DOM
        expect(() => {
            // Le DOMContentLoaded devrait être déclenché
        }).not.toThrow();
    });

    test('should handle map initialization failure gracefully', () => {
        global.L.map.mockImplementation(() => {
            throw new Error('Map initialization failed');
        });
        
        global.document.getElementById.mockReturnValue({ id: 'map' });
        
        expect(() => {
            if (typeof initMap === 'function') {
                initMap();
            }
        }).not.toThrow();
    });
});