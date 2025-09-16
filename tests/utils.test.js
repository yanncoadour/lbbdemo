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

        test('should fallback to localStorage when Security unavailable', () => {
            const originalSecurity = global.window.Security;
            global.window.Security = null;
            
            Storage.set('test-key', { data: 'test' });
            
            expect(global.localStorage.setItem)
                .toHaveBeenCalledWith('test-key', '{"data":"test"}');
            
            global.window.Security = originalSecurity;
        });

        test('should handle localStorage errors gracefully', () => {
            global.window.Security = null;
            global.localStorage.setItem.mockImplementation(() => {
                throw new Error('Storage full');
            });
            
            const result = Storage.set('test-key', 'value');
            
            expect(result).toBe(false);
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

        test('should fallback to localStorage when Security unavailable', () => {
            global.window.Security = null;
            global.localStorage.getItem.mockReturnValue('{"data":"test"}');
            
            const result = Storage.get('test-key');
            
            expect(result).toEqual({ data: 'test' });
        });

        test('should return default value when item not found', () => {
            global.window.Security = null;
            global.localStorage.getItem.mockReturnValue(null);
            
            const result = Storage.get('non-existent', 'default-value');
            
            expect(result).toBe('default-value');
        });

        test('should handle JSON parse errors', () => {
            global.window.Security = null;
            global.localStorage.getItem.mockReturnValue('invalid-json');
            
            const result = Storage.get('test-key', 'default');
            
            expect(result).toBe('default');
        });
    });

    describe('remove', () => {
        test('should remove item from localStorage', () => {
            const result = Storage.remove('test-key');
            
            expect(global.localStorage.removeItem).toHaveBeenCalledWith('test-key');
            expect(result).toBe(true);
        });

        test('should handle remove errors gracefully', () => {
            global.localStorage.removeItem.mockImplementation(() => {
                throw new Error('Remove failed');
            });
            
            const result = Storage.remove('test-key');
            
            expect(result).toBe(false);
        });
    });
});

// ===================================================================
// TESTS DOM UTILS
// ===================================================================

describe('DOM', () => {
    const { DOM } = global.Utils;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('$', () => {
        test('should call document.querySelector', () => {
            const mockElement = { id: 'test' };
            global.document.querySelector.mockReturnValue(mockElement);
            
            const result = DOM.$('#test');
            
            expect(global.document.querySelector).toHaveBeenCalledWith('#test');
            expect(result).toBe(mockElement);
        });
    });

    describe('$$', () => {
        test('should call document.querySelectorAll', () => {
            const mockElements = [{ id: 'test1' }, { id: 'test2' }];
            global.document.querySelectorAll.mockReturnValue(mockElements);
            
            const result = DOM.$$('.test-class');
            
            expect(global.document.querySelectorAll).toHaveBeenCalledWith('.test-class');
            expect(result).toBe(mockElements);
        });
    });

    describe('create', () => {
        test('should create element with basic attributes', () => {
            const element = DOM.create('div', { id: 'test', class: 'test-class' });
            
            expect(global.document.createElement).toHaveBeenCalledWith('div');
            expect(element.setAttribute).toHaveBeenCalledWith('id', 'test');
            expect(element.setAttribute).toHaveBeenCalledWith('class', 'test-class');
        });

        test('should handle className attribute specially', () => {
            const element = DOM.create('div', { className: 'test-class' });
            
            expect(element.className).toBe('test-class');
        });

        test('should handle innerHTML attribute specially', () => {
            const element = DOM.create('div', { innerHTML: '<span>test</span>' });
            
            expect(element.innerHTML).toBe('<span>test</span>');
        });

        test('should set text content', () => {
            const element = DOM.create('div', {}, 'Test content');
            
            expect(element.textContent).toBe('Test content');
        });
    });

    describe('animate', () => {
        test('should add and remove class with timeout', () => {
            const mockElement = {
                classList: {
                    add: jest.fn(),
                    remove: jest.fn()
                }
            };
            
            DOM.animate(mockElement, 'fade-in', 500);
            
            expect(mockElement.classList.add).toHaveBeenCalledWith('fade-in');
            
            jest.advanceTimersByTime(500);
            expect(mockElement.classList.remove).toHaveBeenCalledWith('fade-in');
        });
    });

    describe('toggle', () => {
        test('should toggle element visibility', () => {
            const mockElement = {
                style: { display: 'none' }
            };
            
            const result = DOM.toggle(mockElement);
            
            expect(mockElement.style.display).toBe('block');
            expect(result).toBe(true);
        });

        test('should respect explicit show parameter', () => {
            const mockElement = {
                style: { display: 'block' }
            };
            
            DOM.toggle(mockElement, false);
            
            expect(mockElement.style.display).toBe('none');
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

    describe('sanitize', () => {
        test('should use Security module when available', () => {
            global.window.Security.validateAndSanitize.mockReturnValue('cleaned-input');
            
            const result = DataUtils.sanitize('<script>alert("xss")</script>', 'html');
            
            expect(global.window.Security.validateAndSanitize)
                .toHaveBeenCalledWith('<script>alert("xss")</script>', 'html');
            expect(result).toBe('cleaned-input');
        });

        test('should use basic sanitization when Security unavailable', () => {
            global.window.Security = null;
            
            const result = DataUtils.sanitize('<script>alert("test")</script>text');
            
            expect(result).toBe('scriptalert("test")/scripttext');
        });

        test('should handle non-string input', () => {
            global.window.Security = null;
            
            const result = DataUtils.sanitize(123);
            
            expect(result).toBe('');
        });

        test('should limit string length', () => {
            global.window.Security = null;
            const longString = 'a'.repeat(600);
            
            const result = DataUtils.sanitize(longString);
            
            expect(result.length).toBe(500);
        });
    });

    describe('generateId', () => {
        test('should generate unique IDs', () => {
            const id1 = DataUtils.generateId();
            const id2 = DataUtils.generateId();
            
            expect(id1).not.toBe(id2);
            expect(id1).toMatch(/^id_\d+_[a-z0-9]+$/);
        });

        test('should use custom prefix', () => {
            const id = DataUtils.generateId('custom');
            
            expect(id).toMatch(/^custom_\d+_[a-z0-9]+$/);
        });
    });

    describe('debounce', () => {
        test('should delay function execution', () => {
            const mockFn = jest.fn();
            const debouncedFn = DataUtils.debounce(mockFn, 100);
            
            debouncedFn('arg1', 'arg2');
            expect(mockFn).not.toHaveBeenCalled();
            
            jest.advanceTimersByTime(100);
            expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
        });

        test('should reset delay on multiple calls', () => {
            const mockFn = jest.fn();
            const debouncedFn = DataUtils.debounce(mockFn, 100);
            
            debouncedFn();
            jest.advanceTimersByTime(50);
            debouncedFn();
            jest.advanceTimersByTime(50);
            
            expect(mockFn).not.toHaveBeenCalled();
            
            jest.advanceTimersByTime(50);
            expect(mockFn).toHaveBeenCalledTimes(1);
        });
    });
});

// ===================================================================
// TESTS UI UTILS
// ===================================================================

describe('UIUtils', () => {
    const { UIUtils } = global.Utils;

    beforeEach(() => {
        jest.clearAllMocks();
        global.document.body.appendChild.mockClear();
    });

    describe('getNotificationIcon', () => {
        test('should return correct icons for known types', () => {
            expect(UIUtils.getNotificationIcon('success')).toBe('check-circle');
            expect(UIUtils.getNotificationIcon('error')).toBe('exclamation-circle');
            expect(UIUtils.getNotificationIcon('warning')).toBe('exclamation-triangle');
            expect(UIUtils.getNotificationIcon('info')).toBe('info-circle');
        });

        test('should return default icon for unknown types', () => {
            expect(UIUtils.getNotificationIcon('unknown')).toBe('info-circle');
        });
    });

    describe('createLoader', () => {
        test('should create loading element with default text', () => {
            const loader = UIUtils.createLoader();
            
            expect(global.document.createElement).toHaveBeenCalledWith('div');
            expect(loader.className).toBe('loading-state');
            expect(loader.innerHTML).toContain('Chargement...');
        });

        test('should create loading element with custom text', () => {
            const loader = UIUtils.createLoader('Custom loading...');
            
            expect(loader.innerHTML).toContain('Custom loading...');
        });
    });

    describe('setLoadingState', () => {
        test('should set loading state on container', () => {
            const mockContainer = {
                innerHTML: 'existing content',
                appendChild: jest.fn()
            };
            
            UIUtils.setLoadingState(mockContainer, true);
            
            expect(mockContainer.innerHTML).toBe('');
            expect(mockContainer.appendChild).toHaveBeenCalled();
        });

        test('should not modify container when not loading', () => {
            const mockContainer = {
                innerHTML: 'existing content',
                appendChild: jest.fn()
            };
            
            UIUtils.setLoadingState(mockContainer, false);
            
            expect(mockContainer.innerHTML).toBe('existing content');
            expect(mockContainer.appendChild).not.toHaveBeenCalled();
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

    describe('deg2rad', () => {
        test('should convert degrees to radians', () => {
            expect(GeoUtils.deg2rad(0)).toBe(0);
            expect(GeoUtils.deg2rad(180)).toBeCloseTo(Math.PI);
            expect(GeoUtils.deg2rad(90)).toBeCloseTo(Math.PI / 2);
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

        test('should reject non-numeric coordinates', () => {
            expect(GeoUtils.isValidCoords('48.8566', 2.3522)).toBe(false);
            expect(GeoUtils.isValidCoords(48.8566, '2.3522')).toBe(false);
            expect(GeoUtils.isValidCoords(null, 2.3522)).toBe(false);
        });
    });
});

// ===================================================================
// TESTS EVENT MANAGER
// ===================================================================

describe('EventManager', () => {
    const { EventManager } = global.Utils;

    beforeEach(() => {
        // Nettoyer tous les listeners avant chaque test
        EventManager.listeners.clear();
    });

    describe('on', () => {
        test('should register event listener', () => {
            const callback = jest.fn();
            
            EventManager.on('test-event', callback);
            
            expect(EventManager.listeners.has('global')).toBe(true);
            expect(EventManager.listeners.get('global').has('test-event')).toBe(true);
        });

        test('should register event listener with custom namespace', () => {
            const callback = jest.fn();
            
            EventManager.on('test-event', callback, 'custom');
            
            expect(EventManager.listeners.has('custom')).toBe(true);
            expect(EventManager.listeners.get('custom').has('test-event')).toBe(true);
        });

        test('should allow multiple listeners for same event', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();
            
            EventManager.on('test-event', callback1);
            EventManager.on('test-event', callback2);
            
            const listeners = EventManager.listeners.get('global').get('test-event');
            expect(listeners).toHaveLength(2);
        });
    });

    describe('emit', () => {
        test('should call registered listeners', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();
            
            EventManager.on('test-event', callback1);
            EventManager.on('test-event', callback2);
            
            EventManager.emit('test-event', { data: 'test' });
            
            expect(callback1).toHaveBeenCalledWith({ data: 'test' });
            expect(callback2).toHaveBeenCalledWith({ data: 'test' });
        });

        test('should handle namespace-specific events', () => {
            const globalCallback = jest.fn();
            const customCallback = jest.fn();
            
            EventManager.on('test-event', globalCallback, 'global');
            EventManager.on('test-event', customCallback, 'custom');
            
            EventManager.emit('test-event', null, 'custom');
            
            expect(globalCallback).not.toHaveBeenCalled();
            expect(customCallback).toHaveBeenCalled();
        });

        test('should handle listener errors gracefully', () => {
            const errorCallback = jest.fn(() => {
                throw new Error('Listener error');
            });
            const workingCallback = jest.fn();
            
            EventManager.on('test-event', errorCallback);
            EventManager.on('test-event', workingCallback);
            
            expect(() => {
                EventManager.emit('test-event');
            }).not.toThrow();
            
            expect(workingCallback).toHaveBeenCalled();
        });
    });

    describe('off', () => {
        test('should remove all listeners from namespace', () => {
            const callback = jest.fn();
            
            EventManager.on('test-event', callback, 'test-namespace');
            expect(EventManager.listeners.has('test-namespace')).toBe(true);
            
            EventManager.off('test-namespace');
            expect(EventManager.listeners.has('test-namespace')).toBe(false);
        });
    });
});

// Nettoyer les timers après tous les tests
afterAll(() => {
    jest.useRealTimers();
});

        test('should handle innerHTML attribute specially', () => {
            const element = DOM.create('div', { innerHTML: '<span>test</span>' });
            
            expect(element.innerHTML).toBe('<span>test</span>');
        });

        test('should set text content', () => {
            const element = DOM.create('div', {}, 'Test content');
            
            expect(element.textContent).toBe('Test content');
        });
    });

    describe('animate', () => {
        test('should add and remove class with timeout', () => {
            const mockElement = {
                classList: {
                    add: jest.fn(),
                    remove: jest.fn()
                }
            };
            
            DOM.animate(mockElement, 'fade-in', 500);
            
            expect(mockElement.classList.add).toHaveBeenCalledWith('fade-in');
            
            jest.advanceTimersByTime(500);
            expect(mockElement.classList.remove).toHaveBeenCalledWith('fade-in');
        });
    });

    describe('toggle', () => {
        test('should toggle element visibility', () => {
            const mockElement = {
                style: { display: 'none' }
            };
            
            const result = DOM.toggle(mockElement);
            
            expect(mockElement.style.display).toBe('block');
            expect(result).toBe(true);
        });

        test('should respect explicit show parameter', () => {
            const mockElement = {
                style: { display: 'block' }
            };
            
            DOM.toggle(mockElement, false);
            
            expect(mockElement.style.display).toBe('none');
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

    describe('generateId', () => {
        test('should generate unique IDs with default prefix', () => {
            const id1 = DataUtils.generateId();
            const id2 = DataUtils.generateId();
            
            expect(id1).toMatch(/^id_\d+_[a-z0-9]+$/);
            expect(id2).toMatch(/^id_\d+_[a-z0-9]+$/);
            expect(id1).not.toBe(id2);
        });

        test('should generate IDs with custom prefix', () => {
            const id = DataUtils.generateId('custom');
            expect(id).toMatch(/^custom_\d+_[a-z0-9]+$/);
        });
    });

    describe('debounce', () => {
        jest.useFakeTimers();

        test('should delay function execution', () => {
            const mockFn = jest.fn();
            const debouncedFn = DataUtils.debounce(mockFn, 100);

            debouncedFn('test');
            expect(mockFn).not.toHaveBeenCalled();

            jest.advanceTimersByTime(100);
            expect(mockFn).toHaveBeenCalledWith('test');
        });

        test('should cancel previous calls', () => {
            const mockFn = jest.fn();
            const debouncedFn = DataUtils.debounce(mockFn, 100);

            debouncedFn('first');
            debouncedFn('second');
            
            jest.advanceTimersByTime(100);
            
            expect(mockFn).toHaveBeenCalledTimes(1);
            expect(mockFn).toHaveBeenCalledWith('second');
        });
    });
});

describe('GeoUtils', () => {
    const { GeoUtils } = global.Utils;

    describe('isValidCoords', () => {
        test('should validate correct coordinates', () => {
            expect(GeoUtils.isValidCoords(48.2020, -2.9326)).toBe(true);
            expect(GeoUtils.isValidCoords(0, 0)).toBe(true);
            expect(GeoUtils.isValidCoords(-90, -180)).toBe(true);
            expect(GeoUtils.isValidCoords(90, 180)).toBe(true);
        });

        test('should reject invalid coordinates', () => {
            expect(GeoUtils.isValidCoords(91, 0)).toBe(false);
            expect(GeoUtils.isValidCoords(-91, 0)).toBe(false);
            expect(GeoUtils.isValidCoords(0, 181)).toBe(false);
            expect(GeoUtils.isValidCoords(0, -181)).toBe(false);
            expect(GeoUtils.isValidCoords('invalid', 0)).toBe(false);
        });
    });

    describe('calculateDistance', () => {
        test('should calculate distance between two points', () => {
            // Distance entre Rennes et Brest (environ 240km)
            const distance = GeoUtils.calculateDistance(48.1173, -1.6778, 48.3905, -4.4861);
            expect(distance).toBeGreaterThan(230000); // Plus de 230km
            expect(distance).toBeLessThan(250000);    // Moins de 250km
        });

        test('should return 0 for identical coordinates', () => {
            const distance = GeoUtils.calculateDistance(48.2020, -2.9326, 48.2020, -2.9326);
            expect(distance).toBe(0);
        });
    });
});

describe('StorageUtils', () => {
    const { Storage } = global.Utils;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('fallbackSet', () => {
        test('should store data in localStorage', () => {
            const result = Storage.fallbackSet('test', { data: 'value' });
            
            expect(localStorage.setItem).toHaveBeenCalledWith('test', '{"data":"value"}');
            expect(result).toBe(true);
        });

        test('should handle localStorage errors', () => {
            localStorage.setItem.mockImplementation(() => {
                throw new Error('Storage full');
            });
            
            const result = Storage.fallbackSet('test', 'value');
            expect(result).toBe(false);
        });
    });

    describe('fallbackGet', () => {
        test('should retrieve and parse data', () => {
            localStorage.getItem.mockReturnValue('{"data":"value"}');
            
            const result = Storage.fallbackGet('test');
            expect(result).toEqual({ data: 'value' });
        });

        test('should return default value for non-existent keys', () => {
            localStorage.getItem.mockReturnValue(null);
            
            const result = Storage.fallbackGet('nonexistent', 'default');
            expect(result).toBe('default');
        });

        test('should handle JSON parsing errors', () => {
            localStorage.getItem.mockReturnValue('invalid json');
            
            const result = Storage.fallbackGet('test', 'default');
            expect(result).toBe('default');
        });
    });
});