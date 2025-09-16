/**
 * CONFIGURATION DES TESTS
 * Setup global pour Jest
 */

// Mock console pour éviter le spam dans les tests
global.console = {
    ...console,
    // Garder les erreurs importantes
    error: console.error,
    warn: console.warn,
    // Ignorer les logs de développement
    log: jest.fn(),
    info: jest.fn()
};

// Mock des APIs navigateur
global.crypto = {
    getRandomValues: (array) => {
        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }
        return array;
    }
};

// Mock de Leaflet si utilisé
global.L = {
    map: jest.fn(),
    marker: jest.fn(),
    popup: jest.fn(),
    layerGroup: jest.fn()
};