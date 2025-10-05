/**
 * TESTS UNITAIRES - SECURITY
 * Tests complets pour toutes les fonctions de sécurité
 */

// Mock des dépendances globales
global.window = {
    open: jest.fn()
};

global.document = {
    createElement: jest.fn((tag) => ({
        tagName: tag.toUpperCase(),
        textContent: '',
        innerHTML: '',
        addEventListener: jest.fn()
    })),
    addEventListener: jest.fn(),
    readyState: 'loading'
};

global.localStorage = {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    keys: jest.fn(() => [])
};

global.crypto = {
    getRandomValues: jest.fn((array) => {
        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }
        return array;
    })
};

global.DOMPurify = {
    sanitize: jest.fn((content) => content.replace(/<script.*?<\/script>/gi, ''))
};

global.location = {
    hostname: 'labellebretagne.fr',
    origin: 'https://labellebretagne.fr'
};

global.URL = jest.fn().mockImplementation((url, base) => {
    const fullUrl = url.startsWith('http') ? url : base + url;
    const match = fullUrl.match(/^https?:\/\/([^\/]+)/);
    return {
        hostname: match ? match[1] : 'unknown',
        href: fullUrl
    };
});

// Mock de console pour éviter le spam
global.console = {
    ...console,
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

// Mock des timers pour les tests
jest.useFakeTimers();

// Charger le module security
require('../js/security.js');

// ===================================================================
// TESTS SANITISATION
// ===================================================================

describe('Security - Sanitisation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('sanitizeHTML', () => {
        test('should return empty string for non-string input', () => {
            expect(window.Security.sanitizeHTML(123)).toBe('');
            expect(window.Security.sanitizeHTML(null)).toBe('');
            expect(window.Security.sanitizeHTML(undefined)).toBe('');
        });

        test('should sanitize HTML by converting to text', () => {
            const mockElement = {
                textContent: '',
                innerHTML: ''
            };
            global.document.createElement.mockReturnValue(mockElement);
            
            window.Security.sanitizeHTML('<script>alert("xss")</script>');
            
            expect(mockElement.textContent).toBe('<script>alert("xss")</script>');
        });
    });

    describe('validateAndSanitize', () => {
        test('should return empty string for non-string input', () => {
            expect(window.Security.validateAndSanitize(123)).toBe('');
            expect(window.Security.validateAndSanitize(null)).toBe('');
        });

        test('should remove dangerous script tags', () => {
            const input = 'Hello <script>alert("xss")</script> World';
            const result = window.Security.validateAndSanitize(input);
            
            expect(result).toBe('Hello  World');
        });

        test('should remove iframe tags', () => {
            const input = '<iframe src="http://evil.com"></iframe>';
            const result = window.Security.validateAndSanitize(input);
            
            expect(result).toBe('');
        });

        test('should remove javascript: protocols', () => {
            const input = '<a href="javascript:alert(1)">Link</a>';
            const result = window.Security.validateAndSanitize(input);
            
            expect(result).not.toContain('javascript:');
        });

        test('should remove event handlers', () => {
            const input = '<div onclick="alert(1)">Click me</div>';
            const result = window.Security.validateAndSanitize(input);
            
            expect(result).not.toContain('onclick');
        });

        test('should handle search type validation', () => {
            const input = 'Recherche avec @@@ caractères spéciaux ###';
            const result = window.Security.validateAndSanitize(input, 'search');
            
            expect(result).toMatch(/^[\w\s\u00C0-\u00FF\-']*$/);
            expect(result.length).toBeLessThanOrEqual(100);
        });

        test('should validate URLs', () => {
            const validUrl = 'https://example.com';
            const invalidUrl = 'not-a-url';
            
            expect(window.Security.validateAndSanitize(validUrl, 'url')).toBe(validUrl);
            expect(window.Security.validateAndSanitize(invalidUrl, 'url')).toBe('');
        });

        test('should limit text length', () => {
            const longText = 'a'.repeat(600);
            const result = window.Security.validateAndSanitize(longText, 'text');
            
            expect(result.length).toBe(500);
        });

        test('should trim whitespace', () => {
            const input = '  text with spaces  ';
            const result = window.Security.validateAndSanitize(input);
            
            expect(result).toBe('text with spaces');
        });
    });

    describe('validateInput', () => {
        test('should return false for non-string input', () => {
            expect(window.Security.validateInput(123)).toBe(false);
            expect(window.Security.validateInput(null)).toBe(false);
        });

        test('should validate required fields', () => {
            expect(window.Security.validateInput('', { required: true })).toBe(false);
            expect(window.Security.validateInput('  ', { required: true })).toBe(false);
            expect(window.Security.validateInput('text', { required: true })).toBe(true);
        });

        test('should check length constraints', () => {
            const rules = { minLength: 5, maxLength: 10 };
            
            expect(window.Security.validateInput('abc', rules)).toBe(false);
            expect(window.Security.validateInput('abcdef', rules)).toBe(true);
            expect(window.Security.validateInput('abcdefghijk', rules)).toBe(false);
        });

        test('should validate allowed characters', () => {
            const rules = { allowedChars: /^[a-zA-Z]+$/ };
            
            expect(window.Security.validateInput('OnlyLetters', rules)).toBe(true);
            expect(window.Security.validateInput('With123Numbers', rules)).toBe(false);
        });

        test('should detect forbidden patterns', () => {
            expect(window.Security.validateInput('<script>alert(1)</script>')).toBe(false);
            expect(window.Security.validateInput('javascript:alert(1)')).toBe(false);
            expect(window.Security.validateInput('vbscript:msgbox(1)')).toBe(false);
            expect(window.Security.validateInput('data:text/html,<script>')).toBe(false);
            expect(window.Security.validateInput('<div onclick="alert(1)">')).toBe(false);
        });

        test('should pass valid input', () => {
            expect(window.Security.validateInput('This is valid text')).toBe(true);
        });
    });
});

// ===================================================================
// TESTS STOCKAGE SÉCURISÉ
// ===================================================================

describe('Security - Stockage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('secureLocalStorage', () => {
        test('should validate key parameter', () => {
            expect(window.Security.secureLocalStorage('', 'value')).toBe(false);
            expect(window.Security.secureLocalStorage(null, 'value')).toBe(false);
            expect(window.Security.secureLocalStorage(123, 'value')).toBe(false);
        });

        test('should reject oversized data', () => {
            const hugeValue = { data: 'x'.repeat(60000) };
            
            expect(window.Security.secureLocalStorage('key', hugeValue)).toBe(false);
            expect(global.console.warn).toHaveBeenCalledWith('Données trop volumineuses pour localStorage');
        });

        test('should store valid data', () => {
            const testData = { name: 'test', value: 123 };
            
            expect(window.Security.secureLocalStorage('test-key', testData)).toBe(true);
            expect(global.localStorage.setItem).toHaveBeenCalledWith(
                'test-key', 
                JSON.stringify(testData)
            );
        });

        test('should handle localStorage errors', () => {
            global.localStorage.setItem.mockImplementation(() => {
                throw new Error('Storage full');
            });
            
            const result = window.Security.secureLocalStorage('key', 'value');
            
            expect(result).toBe(false);
            expect(global.console.error).toHaveBeenCalled();
        });
    });

    describe('secureGetLocalStorage', () => {
        test('should return default value when item not found', () => {
            global.localStorage.getItem.mockReturnValue(null);
            
            const result = window.Security.secureGetLocalStorage('non-existent', 'default');
            
            expect(result).toBe('default');
        });

        test('should parse and return stored objects', () => {
            const testData = { name: 'test', value: 123 };
            global.localStorage.getItem.mockReturnValue(JSON.stringify(testData));
            
            const result = window.Security.secureGetLocalStorage('test-key');
            
            expect(result).toEqual(testData);
        });

        test('should return parsed primitives', () => {
            global.localStorage.getItem.mockReturnValue('"test-string"');
            
            const result = window.Security.secureGetLocalStorage('test-key');
            
            expect(result).toBe('test-string');
        });

        test('should handle JSON parse errors', () => {
            global.localStorage.getItem.mockReturnValue('invalid-json');
            
            const result = window.Security.secureGetLocalStorage('test-key', 'default');
            
            expect(result).toBe('default');
            expect(global.console.error).toHaveBeenCalled();
        });
    });
});

// ===================================================================
// TESTS VALIDATION JSON
// ===================================================================

describe('Security - JSON Validation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('validateJSON', () => {
        test('should return false for non-string input', () => {
            expect(window.Security.validateJSON(123)).toBe(false);
            expect(window.Security.validateJSON(null)).toBe(false);
        });

        test('should return false for invalid JSON', () => {
            expect(window.Security.validateJSON('{ invalid json }')).toBe(false);
        });

        test('should detect suspicious script content', () => {
            const suspiciousJson = JSON.stringify({ 
                content: '<script>alert("xss")</script>' 
            });
            
            expect(window.Security.validateJSON(suspiciousJson)).toBe(false);
            expect(global.console.warn).toHaveBeenCalledWith('Contenu JSON suspect détecté');
        });

        test('should detect suspicious javascript content', () => {
            const suspiciousJson = JSON.stringify({ 
                onclick: 'javascript:alert(1)' 
            });
            
            expect(window.Security.validateJSON(suspiciousJson)).toBe(false);
        });

        test('should detect eval attempts', () => {
            const suspiciousJson = JSON.stringify({ 
                code: 'eval("malicious code")' 
            });
            
            expect(window.Security.validateJSON(suspiciousJson)).toBe(false);
        });

        test('should accept clean JSON', () => {
            const cleanJson = JSON.stringify({ 
                name: 'La Belle Bretagne',
                description: 'Site touristique',
                coordinates: { lat: 48.0, lng: -4.0 }
            });
            
            expect(window.Security.validateJSON(cleanJson)).toBe(true);
        });
    });
});

// ===================================================================
// TESTS RATE LIMITING
// ===================================================================

describe('Security - Rate Limiting', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Nettoyer les requêtes du rate limiter
        window.Security.rateLimiter.requests.clear();
    });

    describe('rateLimiter', () => {
        test('should allow requests within limits', () => {
            expect(window.Security.rateLimiter.isAllowed('user1', 5, 1000)).toBe(true);
            expect(window.Security.rateLimiter.isAllowed('user1', 5, 1000)).toBe(true);
        });

        test('should block requests exceeding limits', () => {
            // Faire 5 requêtes rapides (limite = 5)
            for (let i = 0; i < 5; i++) {
                expect(window.Security.rateLimiter.isAllowed('user2', 5, 1000)).toBe(true);
            }
            
            // La 6ème requête doit être bloquée
            expect(window.Security.rateLimiter.isAllowed('user2', 5, 1000)).toBe(false);
        });

        test('should reset after time window', () => {
            // Faire 5 requêtes
            for (let i = 0; i < 5; i++) {
                window.Security.rateLimiter.isAllowed('user3', 5, 1000);
            }
            
            // Avancer le temps au-delà de la fenêtre
            jest.advanceTimersByTime(1100);
            
            // Nouvelle requête doit être autorisée
            expect(window.Security.rateLimiter.isAllowed('user3', 5, 1000)).toBe(true);
        });

        test('should handle different users independently', () => {
            // User1 fait 5 requêtes
            for (let i = 0; i < 5; i++) {
                window.Security.rateLimiter.isAllowed('user1', 5, 1000);
            }
            
            // User2 doit pouvoir faire ses propres requêtes
            expect(window.Security.rateLimiter.isAllowed('user2', 5, 1000)).toBe(true);
        });
    });
});

// ===================================================================
// TESTS UTILITAIRES CRYPTO
// ===================================================================

describe('Security - Crypto Utils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('generateNonce', () => {
        test('should generate unique nonces', () => {
            const nonce1 = window.Security.generateNonce();
            const nonce2 = window.Security.generateNonce();
            
            expect(nonce1).not.toBe(nonce2);
            expect(nonce1).toMatch(/^[0-9a-f]{32}$/);
            expect(nonce2).toMatch(/^[0-9a-f]{32}$/);
        });

        test('should use crypto.getRandomValues', () => {
            window.Security.generateNonce();
            
            expect(global.crypto.getRandomValues).toHaveBeenCalled();
        });
    });

    describe('CSRF Token', () => {
        test('should generate and store CSRF token', () => {
            global.localStorage.getItem.mockReturnValue(null); // No existing token
            
            const token = window.Security.getCSRFToken();
            
            expect(token).toMatch(/^[0-9a-f]{32}$/);
            expect(global.localStorage.setItem).toHaveBeenCalledWith(
                'csrf_token',
                expect.any(String)
            );
        });

        test('should reuse existing CSRF token', () => {
            const existingToken = 'existing-token-123';
            global.localStorage.getItem.mockReturnValue(`"${existingToken}"`);
            
            const token = window.Security.getCSRFToken();
            
            expect(token).toBe(existingToken);
        });

        test('should validate CSRF tokens correctly', () => {
            const validToken = 'valid-token-123';
            global.localStorage.getItem.mockReturnValue(`"${validToken}"`);
            
            expect(window.Security.validateCSRFToken(validToken)).toBe(true);
            expect(window.Security.validateCSRFToken('invalid-token')).toBe(false);
        });

        test('should handle missing stored token', () => {
            global.localStorage.getItem.mockReturnValue(null);
            
            expect(window.Security.validateCSRFToken('any-token')).toBe(false);
        });
    });
});

// ===================================================================
// TESTS SAFE INNER HTML
// ===================================================================

describe('Security - Safe innerHTML', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('safeSetInnerHTML', () => {
        test('should not process invalid element', () => {
            window.Security.safeSetInnerHTML(null, '<p>test</p>');
            window.Security.safeSetInnerHTML(undefined, '<p>test</p>');
            
            // Ne devrait pas appeler DOMPurify
            expect(global.DOMPurify.sanitize).not.toHaveBeenCalled();
        });

        test('should not process non-string content', () => {
            const mockElement = { innerHTML: '' };
            
            window.Security.safeSetInnerHTML(mockElement, 123);
            window.Security.safeSetInnerHTML(mockElement, null);
            
            expect(global.DOMPurify.sanitize).not.toHaveBeenCalled();
        });

        test('should use DOMPurify when available', () => {
            const mockElement = { innerHTML: '' };
            const content = '<p>Safe content</p><script>alert("xss")</script>';
            const sanitizedContent = '<p>Safe content</p>';
            
            global.DOMPurify.sanitize.mockReturnValue(sanitizedContent);
            
            window.Security.safeSetInnerHTML(mockElement, content);
            
            expect(global.DOMPurify.sanitize).toHaveBeenCalledWith(content, expect.any(Object));
            expect(mockElement.innerHTML).toBe(sanitizedContent);
        });

        test('should handle missing DOMPurify gracefully', () => {
            const originalDOMPurify = global.DOMPurify;
            global.DOMPurify = undefined;
            
            const mockElement = { textContent: '' };
            
            window.Security.safeSetInnerHTML(mockElement, '<p>test</p>');
            
            expect(global.console.error).toHaveBeenCalledWith(
                expect.stringContaining('DOMPurify n\'est pas disponible')
            );
            expect(mockElement.textContent).toBe('Erreur de sécurité: contenu non affiché');
            
            global.DOMPurify = originalDOMPurify;
        });

        test('should use custom DOMPurify config', () => {
            const mockElement = { innerHTML: '' };
            const customConfig = { ALLOWED_TAGS: ['p'] };
            
            window.Security.safeSetInnerHTML(mockElement, '<p>test</p>', customConfig);
            
            expect(global.DOMPurify.sanitize).toHaveBeenCalledWith(
                '<p>test</p>',
                expect.objectContaining(customConfig)
            );
        });
    });
});

// Nettoyer les timers après tous les tests
afterAll(() => {
    jest.useRealTimers();
});