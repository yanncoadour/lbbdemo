/**
 * SÉCURITÉ - LA BELLE BRETAGNE
 * Fonctions de sécurité côté client
 */

// ===================================================================
// SANITISATION DES DONNÉES
// ===================================================================

/**
 * Sanitise une chaîne HTML pour prévenir les attaques XSS
 * @param {string} str - La chaîne à sanitiser
 * @returns {string} - La chaîne sanitisée
 */
function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

/**
 * Validation et sanitisation des entrées utilisateur
 * @param {string} input - L'entrée à valider
 * @param {string} type - Le type de validation (text, email, url, etc.)
 * @returns {string} - L'entrée sanitisée
 */
function validateAndSanitize(input, type = 'text') {
    if (typeof input !== 'string') return '';
    
    // Suppression des caractères dangereux de base
    let sanitized = input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    
    switch (type) {
        case 'search':
            // Pour les recherches, garder uniquement alphanumérique, espaces et accents
            sanitized = sanitized.replace(/[^\w\sÀ-ÿ\-']/g, '').substring(0, 100);
            break;
        case 'url':
            // Validation basique d'URL
            const urlPattern = /^https?:\/\/.+/i;
            sanitized = urlPattern.test(sanitized) ? sanitized : '';
            break;
        case 'text':
        default:
            // Sanitisation générale
            sanitized = sanitized.substring(0, 500);
            break;
    }
    
    return sanitized.trim();
}

/**
 * Utilisation sécurisée d'innerHTML avec sanitisation
 * @param {HTMLElement} element - L'élément cible
 * @param {string} content - Le contenu à insérer
 */
function safeSetInnerHTML(element, content) {
    if (!element || typeof content !== 'string') return;
    
    // Créer un DocumentFragment pour parser le HTML de manière sécurisée
    const fragment = document.createRange().createContextualFragment(
        sanitizeHTML(content)
    );
    
    element.innerHTML = '';
    element.appendChild(fragment);
}

// ===================================================================
// PROTECTION DES DONNÉES LOCALES
// ===================================================================

/**
 * Stockage sécurisé dans localStorage avec validation
 * @param {string} key - La clé de stockage
 * @param {any} value - La valeur à stocker
 */
function secureLocalStorage(key, value) {
    try {
        // Validation de la clé
        if (typeof key !== 'string' || key.length === 0) {
            console.warn('Clé localStorage invalide');
            return false;
        }
        
        // Validation et serialisation sécurisée
        const sanitizedValue = JSON.stringify(value);
        if (sanitizedValue.length > 50000) { // Limite de 50KB
            console.warn('Données trop volumineuses pour localStorage');
            return false;
        }
        
        localStorage.setItem(key, sanitizedValue);
        return true;
    } catch (error) {
        console.error('Erreur localStorage:', error);
        return false;
    }
}

/**
 * Lecture sécurisée du localStorage avec validation
 * @param {string} key - La clé à lire
 * @param {any} defaultValue - Valeur par défaut si erreur
 * @returns {any} - La valeur lue ou la valeur par défaut
 */
function secureGetLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        
        const parsed = JSON.parse(item);
        
        // Validation basique du contenu
        if (typeof parsed === 'object' && parsed !== null) {
            return parsed;
        }
        
        return parsed;
    } catch (error) {
        console.error('Erreur lecture localStorage:', error);
        return defaultValue;
    }
}

// ===================================================================
// PROTECTION CONTRE LES ATTAQUES
// ===================================================================

/**
 * Vérification de l'intégrité des données JSON
 * @param {string} jsonString - La chaîne JSON à vérifier
 * @returns {boolean} - True si les données semblent sûres
 */
function validateJSON(jsonString) {
    if (typeof jsonString !== 'string') return false;
    
    try {
        const parsed = JSON.parse(jsonString);
        
        // Vérification de patterns suspects
        const suspicious = [
            '<script',
            'javascript:',
            'eval(',
            'Function(',
            'setTimeout(',
            'setInterval('
        ];
        
        const stringified = JSON.stringify(parsed).toLowerCase();
        
        for (const pattern of suspicious) {
            if (stringified.includes(pattern.toLowerCase())) {
                console.warn('Contenu JSON suspect détecté');
                return false;
            }
        }
        
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Rate limiting simple pour les requêtes
 */
const rateLimiter = {
    requests: new Map(),
    
    isAllowed(identifier, maxRequests = 60, timeWindow = 60000) {
        const now = Date.now();
        const key = identifier;
        
        if (!this.requests.has(key)) {
            this.requests.set(key, []);
        }
        
        const requests = this.requests.get(key);
        
        // Nettoyer les anciennes requêtes
        const validRequests = requests.filter(time => now - time < timeWindow);
        
        if (validRequests.length >= maxRequests) {
            return false;
        }
        
        validRequests.push(now);
        this.requests.set(key, validRequests);
        
        return true;
    }
};

// ===================================================================
// UTILITAIRES DE SÉCURITÉ
// ===================================================================

/**
 * Génération d'un nonce sécurisé
 * @returns {string} - Nonce généré
 */
function generateNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Vérification CSRF simple (à utiliser si formulaires ajoutés)
 * @returns {string} - Token CSRF
 */
function getCSRFToken() {
    let token = secureGetLocalStorage('csrf_token');
    
    if (!token) {
        token = generateNonce();
        secureLocalStorage('csrf_token', token);
    }
    
    return token;
}

/**
 * Validation d'un token CSRF
 * @param {string} token - Token à valider
 * @returns {boolean} - True si valide
 */
function validateCSRFToken(token) {
    const storedToken = secureGetLocalStorage('csrf_token');
    return storedToken && token === storedToken;
}

// ===================================================================
// INITIALISATION DE LA SÉCURITÉ
// ===================================================================

/**
 * Initialisation des mesures de sécurité au chargement
 */
function initSecurity() {
    // Protection contre le dragover malveillant
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
    }, false);
    
    document.addEventListener('drop', (e) => {
        e.preventDefault();
    }, false);
    
    // Protection contre l'ouverture de nouvelles fenêtres non autorisées
    const originalOpen = window.open;
    window.open = function(...args) {
        // Vérifier si l'URL est sûre (domaines autorisés)
        const url = args[0];
        if (url && typeof url === 'string') {
            const allowedDomains = [
                location.hostname,
                'www.openstreetmap.org',
                'carto.com',
                'fonts.googleapis.com',
                'cdnjs.cloudflare.com',
                'instagram.com',
                'www.instagram.com'
            ];
            
            try {
                const urlObj = new URL(url, location.origin);
                const isAllowed = allowedDomains.some(domain => 
                    urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
                );
                
                if (isAllowed) {
                    return originalOpen.apply(this, args);
                } else {
                    console.warn('Tentative d\'ouverture d\'URL non autorisée:', url);
                    return null;
                }
            } catch (error) {
                console.warn('URL invalide détectée:', url);
                return null;
            }
        }
        
        return originalOpen.apply(this, args);
    };
    
    // Nettoyer localStorage périodiquement
    setInterval(() => {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('temp_') || key.startsWith('cache_')) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Erreur nettoyage localStorage:', error);
        }
    }, 300000); // Toutes les 5 minutes
    
    console.log('🔒 Système de sécurité initialisé');
}

// Initialiser la sécurité au chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSecurity);
} else {
    initSecurity();
}

// Exporter les fonctions pour utilisation globale
window.Security = {
    sanitizeHTML,
    validateAndSanitize,
    safeSetInnerHTML,
    secureLocalStorage,
    secureGetLocalStorage,
    validateJSON,
    rateLimiter,
    generateNonce,
    getCSRFToken,
    validateCSRFToken
};