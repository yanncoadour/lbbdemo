/**
 * SYSTÈME DE LOGGING - LA BELLE BRETAGNE
 * Gestion centralisée des logs avec niveaux et formatage
 */

// Configuration du logger
const LOG_CONFIG = {
    level: 'info', // debug, info, warn, error
    enableConsole: true,
    enableStorage: false,
    maxStoredLogs: 100,
    storageKey: 'lbb_logs'
};

// Niveaux de log avec priorités
const LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};

// Couleurs pour les logs console
const LOG_COLORS = {
    debug: '#6b7280', // Gris
    info: '#3b82f6', // Bleu
    warn: '#f59e0b', // Orange
    error: '#ef4444' // Rouge
};

// Storage pour les logs en mémoire
let logStorage = [];

/**
 * Classe Logger principale
 */
class Logger {
    constructor(context = 'APP') {
        this.context = context;
    }

    /**
     * Log de débogage (développement uniquement)
     */
    debug(message, data = null) {
        this._log('debug', message, data);
    }

    /**
     * Log d'information
     */
    info(message, data = null) {
        this._log('info', message, data);
    }

    /**
     * Log d'avertissement
     */
    warn(message, data = null) {
        this._log('warn', message, data);
    }

    /**
     * Log d'erreur
     */
    error(message, error = null) {
        const errorData = error ? {
            message: error.message,
            stack: error.stack,
            name: error.name
        } : null;

        this._log('error', message, errorData);
    }

    /**
     * Méthode privée pour logger
     */
    _log(level, message, data) {
        // Vérifier le niveau de log
        if (LOG_LEVELS[level] < LOG_LEVELS[LOG_CONFIG.level]) {
            return;
        }

        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            context: this.context,
            message,
            data
        };

        // Log console si activé
        if (LOG_CONFIG.enableConsole) {
            this._logToConsole(logEntry);
        }

        // Stockage si activé
        if (LOG_CONFIG.enableStorage) {
            this._logToStorage(logEntry);
        }
    }

    /**
     * Affichage console formaté
     */
    _logToConsole(entry) {
        const { timestamp, level, context, message, data } = entry;
        const color = LOG_COLORS[level];
        const time = new Date(timestamp).toLocaleTimeString();

        // Style pour le navigateur
        const styles = [
            `color: ${color}`,
            'font-weight: bold'
        ].join(';');

        // Format du message
        const prefix = `[${time}] ${level.toUpperCase()} [${context}]`;

        if (data) {
            console.group(`%c${prefix} ${message}`, styles);
            console.log('Data:', data);
            console.groupEnd();
        } else {
            console.log(`%c${prefix} ${message}`, styles);
        }
    }

    /**
     * Stockage des logs
     */
    _logToStorage(entry) {
        logStorage.push(entry);

        // Limiter la taille du stockage
        if (logStorage.length > LOG_CONFIG.maxStoredLogs) {
            logStorage = logStorage.slice(-LOG_CONFIG.maxStoredLogs);
        }

        // Sauvegarder en localStorage si possible
        try {
            if (window.Security && window.Security.secureLocalStorage) {
                window.Security.secureLocalStorage(LOG_CONFIG.storageKey, logStorage);
            }
        } catch (error) {
            // Ignorer les erreurs de stockage
        }
    }

    /**
     * Récupérer les logs stockés
     */
    static getLogs(level = null) {
        if (level) {
            return logStorage.filter(log => log.level === level);
        }
        return [...logStorage];
    }

    /**
     * Vider les logs
     */
    static clearLogs() {
        logStorage = [];
        try {
            if (window.Security && window.Security.secureLocalStorage) {
                localStorage.removeItem(LOG_CONFIG.storageKey);
            }
        } catch (error) {
            // Ignorer les erreurs
        }
    }

    /**
     * Configurer le logger
     */
    static configure(config) {
        Object.assign(LOG_CONFIG, config);
    }

    /**
     * Créer un logger avec contexte
     */
    static create(context) {
        return new Logger(context);
    }
}

// Loggers spécialisés prédéfinis
const loggers = {
    app: Logger.create('APP'),
    map: Logger.create('MAP'),
    api: Logger.create('API'),
    ui: Logger.create('UI'),
    security: Logger.create('SECURITY'),
    performance: Logger.create('PERF')
};

// Fonction utilitaire pour mesurer les performances
function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;

    loggers.performance.info(`${name} completed in ${duration.toFixed(2)}ms`);

    return result;
}

// Fonction utilitaire pour mesurer les performances async
async function measurePerformanceAsync(name, asyncFn) {
    const start = performance.now();
    const result = await asyncFn();
    const duration = performance.now() - start;

    loggers.performance.info(`${name} completed in ${duration.toFixed(2)}ms`);

    return result;
}

// Wrapper pour les erreurs non capturées
window.addEventListener('error', (event) => {
    loggers.app.error('Uncaught error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});

// Wrapper pour les promesses rejetées
window.addEventListener('unhandledrejection', (event) => {
    loggers.app.error('Unhandled promise rejection', {
        reason: event.reason
    });
});

// Exporter globalement
window.Logger = Logger;
window.loggers = loggers;
window.measurePerformance = measurePerformance;
window.measurePerformanceAsync = measurePerformanceAsync;

// Intégration avec LaBelleBretagne
if (window.LaBelleBretagne) {
    window.LaBelleBretagne.Logger = Logger;
    window.LaBelleBretagne.loggers = loggers;
}

// Log d'initialisation
loggers.app.info('🚀 Logger system initialized');