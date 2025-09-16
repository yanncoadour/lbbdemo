/**
 * TESTS UNITAIRES COMPLETS - UTILS
 * Tests complets pour toutes les fonctions utilitaires
 */

// Mock des dépendances globales
global.window = {
    Security: {
        secureLocalStorage: jest.fn(),
        secureGetLocalStorage: jest.fn(),
        validateAndSanitize: jest.fn()
    },
    LaBelleBretagne: {
        modules: {}
    }
};

// Mock document plus complet
global.document = {
    createElement: jest.fn((tag) => ({
        tagName: tag.toUpperCase(),
        className: '',
        innerHTML: '',
        textContent: '',
        style: {},
        setAttribute: jest.fn(),
        classList: {
            add: jest.fn(),
            remove: jest.fn()
        }
    })),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(() => []),
    body: {
        appendChild: jest.fn()
    }
};

global.localStorage = {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn()
};

// Mock de setTimeout pour les tests
jest.useFakeTimers();

// Charger les utilitaires
require('../js/utils.js');

// ===================================================================
// TESTS STORAGE UTILS
// ===================================================================

describe('StorageUtils', () => {
    const { Storage } = global.Utils;
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('set', () => {
        test('should use Security module when available', () => {
            global.window.Security.secureLocalStorage.mockReturnValue(true);
            
            const result = Storage.set('test-key', 'test-value');
            
            expect(global.window.Security.secureLocalStorage)
                .toHaveBeenCalledWith('test-key', 'test-value');
            expect(result).toBe(true);
        });
    });

    describe('get', () => {
        test('should use Security module when available', () => {
            global.window.Security.secureGetLocalStorage.mockReturnValue('secure-value');
            
            const result = Storage.get('test-key', 'default');
            
            expect(global.window.Security.secureGetLocalStorage)
                .toHaveBeenCalledWith('test-key', 'default');
            expect(result).toBe('secure-value');
        });
    });
});

// ===================================================================
// TESTS DATA UTILS
// ===================================================================

describe('DataUtils', () => {
    const { DataUtils } = global.Utils;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('formatDistance', () => {
        test('should format distances under 1000m in meters', () => {
            expect(DataUtils.formatDistance(500)).toBe('500m');
            expect(DataUtils.formatDistance(999)).toBe('999m');
        });

        test('should format distances over 1000m in kilometers', () => {
            expect(DataUtils.formatDistance(1000)).toBe('1.0km');
            expect(DataUtils.formatDistance(2500)).toBe('2.5km');
            expect(DataUtils.formatDistance(10000)).toBe('10.0km');
        });
    });
});

// ===================================================================
// TESTS GEO UTILS
// ===================================================================

describe('GeoUtils', () => {
    const { GeoUtils } = global.Utils;

    describe('calculateDistance', () => {
        test('should calculate distance between two points', () => {
            // Distance entre Paris et Lyon (approximative)
            const distance = GeoUtils.calculateDistance(
                48.8566, 2.3522,  // Paris
                45.7640, 4.8357   // Lyon
            );
            
            // Distance approximative : ~390km
            expect(distance).toBeGreaterThan(380000);
            expect(distance).toBeLessThan(410000);
        });

        test('should return 0 for same coordinates', () => {
            const distance = GeoUtils.calculateDistance(
                48.8566, 2.3522,
                48.8566, 2.3522
            );
            
            expect(distance).toBe(0);
        });
    });

    describe('isValidCoords', () => {
        test('should validate correct coordinates', () => {
            expect(GeoUtils.isValidCoords(48.8566, 2.3522)).toBe(true);
            expect(GeoUtils.isValidCoords(-90, -180)).toBe(true);
            expect(GeoUtils.isValidCoords(90, 180)).toBe(true);
        });

        test('should reject invalid coordinates', () => {
            expect(GeoUtils.isValidCoords(91, 0)).toBe(false);
            expect(GeoUtils.isValidCoords(-91, 0)).toBe(false);
            expect(GeoUtils.isValidCoords(0, 181)).toBe(false);
            expect(GeoUtils.isValidCoords(0, -181)).toBe(false);
        });
    });
});

// Nettoyer les timers après tous les tests
afterAll(() => {
    jest.useRealTimers();
});