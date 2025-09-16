/**
 * THEME GLOBAL - LA BELLE BRETAGNE
 * Gestion globale du thème sombre/clair sur toutes les pages
 */

class GlobalThemeManager {
    constructor() {
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.init();
    }
    
    init() {
        this.applyTheme();
        this.addThemeToggleToAllPages();
    }
    
    applyTheme() {
        const html = document.documentElement;
        
        if (this.isDarkMode) {
            html.classList.add('dark-theme');
            this.addDarkModeStyles();
        } else {
            html.classList.remove('dark-theme');
            this.removeDarkModeStyles();
        }
    }
    
    addDarkModeStyles() {
        if (!document.getElementById('global-dark-theme-styles')) {
            const darkStyles = document.createElement('style');
            darkStyles.id = 'global-dark-theme-styles';
            darkStyles.textContent = `
                :root.dark-theme {
                    --primary: #3b82f6;
                    --primary-light: #60a5fa;
                    --primary-dark: #2563eb;
                    --secondary: #1e293b;
                    --accent: #06b6d4;
                    --accent-warm: #f59e0b;
                    --text-primary: #f8fafc;
                    --text-secondary: #cbd5e1;
                    --text-muted: #94a3b8;
                    --surface: #0f172a;
                    --surface-elevated: #1e293b;
                    --surface-card: #334155;
                    --border: #475569;
                    --border-light: #64748b;
                }
                
                .dark-theme .modern-header {
                    background: rgba(15, 23, 42, 0.95);
                    border-bottom-color: rgba(71, 85, 105, 0.3);
                }
                
                .dark-theme .bottom-nav {
                    background: rgba(15, 23, 42, 0.95);
                    border-top-color: rgba(71, 85, 105, 0.3);
                }
                
                .dark-theme .bottom-sheet {
                    background: var(--surface-elevated);
                    border-color: var(--border);
                }
                
                /* Pages complètes */
                .dark-theme body {
                    background: var(--surface);
                    color: var(--text-primary);
                }
                
                .dark-theme .page-container,
                .dark-theme .main-content {
                    background: var(--surface);
                }
                
                /* Cards et conteneurs */
                .dark-theme .card,
                .dark-theme .poi-card,
                .dark-theme .festival-card,
                .dark-theme .logement-card,
                .dark-theme .blog-card {
                    background: var(--surface-card);
                    border-color: var(--border);
                }
                
                /* Sections POI */
                .dark-theme .poi-section,
                .dark-theme .poi-section-modern {
                    background: var(--surface);
                }
                
                .dark-theme .description-card,
                .dark-theme .practical-info-card,
                .dark-theme .location-card-modern,
                .dark-theme .nearby-card {
                    background: var(--surface-card);
                    border-color: var(--border);
                }
                
                /* Boutons */
                .dark-theme .btn,
                .dark-theme .btn-modern {
                    border-color: var(--border);
                }
                
                .dark-theme .btn-primary,
                .dark-theme .btn-primary-modern {
                    background: var(--primary);
                    color: white;
                }
                
                .dark-theme .btn-secondary,
                .dark-theme .btn-secondary-modern {
                    background: var(--surface-card);
                    color: var(--text-primary);
                    border-color: var(--border);
                }
                
                /* Formulaires */
                .dark-theme input,
                .dark-theme textarea,
                .dark-theme select {
                    background: var(--surface-card);
                    color: var(--text-primary);
                    border-color: var(--border);
                }
                
                .dark-theme .search-input,
                .dark-theme .search-autocomplete {
                    background: var(--surface-card);
                    color: var(--text-primary);
                }
                
                .dark-theme .search-bar {
                    background: var(--surface-card);
                    border-color: var(--border);
                }
                
                /* Filtres */
                .dark-theme .filters-panel {
                    background: var(--surface-card);
                }
                
                .dark-theme .option-pill,
                .dark-theme .option-card {
                    background: var(--surface-elevated);
                    border-color: var(--border);
                    color: var(--text-primary);
                }
                
                .dark-theme .option-pill:has(input:checked),
                .dark-theme .option-card:has(input:checked) {
                    background: var(--primary);
                    color: white;
                }
                
                /* Footer */
                .dark-theme .simple-footer {
                    background: var(--surface-elevated) !important;
                    color: var(--text-secondary) !important;
                    border-color: var(--border) !important;
                }
                
                .dark-theme .simple-footer a {
                    color: var(--primary-light) !important;
                }
                
                /* Galeries et images */
                .dark-theme .poi-gallery-section,
                .dark-theme .festival-gallery {
                    background: var(--surface-elevated);
                }
                
                /* Mentions légales */
                .dark-theme .legal-content {
                    background: var(--surface-card);
                    color: var(--text-primary);
                }
                
                .dark-theme .legal-section {
                    border-color: var(--border);
                }
                
                /* Blog */
                .dark-theme .blog-content,
                .dark-theme .article-content {
                    background: var(--surface-card);
                    color: var(--text-primary);
                }
                
                .dark-theme .blog-meta {
                    color: var(--text-secondary);
                }
                
                /* Instagram */
                .dark-theme .instagram-grid {
                    background: var(--surface);
                }
                
                .dark-theme .instagram-post {
                    background: var(--surface-card);
                    border-color: var(--border);
                }
                
                /* Festivals */
                .dark-theme .festival-content,
                .dark-theme .festival-hero {
                    background: var(--surface);
                }
                
                .dark-theme .festival-card {
                    background: var(--surface-card);
                    border-color: var(--border);
                }
                
                .dark-theme .festival-meta span {
                    background: var(--surface-elevated);
                    color: var(--text-secondary);
                }
                
                /* Logements */
                .dark-theme .logement-content {
                    background: var(--surface);
                }
                
                .dark-theme .logement-hero {
                    background: var(--surface-elevated);
                }
                
                .dark-theme .logement-card {
                    background: var(--surface-card);
                    border-color: var(--border);
                }
                
                /* Scrollbars personnalisées pour le mode sombre */
                .dark-theme ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                .dark-theme ::-webkit-scrollbar-track {
                    background: var(--surface-elevated);
                }
                
                .dark-theme ::-webkit-scrollbar-thumb {
                    background: var(--border);
                    border-radius: 4px;
                }
                
                .dark-theme ::-webkit-scrollbar-thumb:hover {
                    background: var(--text-muted);
                }
            `;
            document.head.appendChild(darkStyles);
        }
    }
    
    removeDarkModeStyles() {
        const darkStyles = document.getElementById('global-dark-theme-styles');
        if (darkStyles) {
            darkStyles.remove();
        }
    }
    
    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('darkMode', this.isDarkMode);
        this.applyTheme();
        
        // Notifier les autres composants du changement de thème
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { isDarkMode: this.isDarkMode } 
        }));
    }
    
    addThemeToggleToAllPages() {
        // Ne pas ajouter de bouton toggle sur les pages qui n'ont pas de header avec settings
        // Le toggle sera disponible via le menu settings sur index.html
        // et on peut ajouter un bouton simple sur les autres pages si nécessaire
        
        // Écouter les changements de thème depuis d'autres pages
        window.addEventListener('themeChanged', (e) => {
            this.isDarkMode = e.detail.isDarkMode;
            this.applyTheme();
        });
    }
}

// Initialiser le gestionnaire de thème global dès le chargement
const globalThemeManager = new GlobalThemeManager();

// Exposer globalement pour que d'autres scripts puissent l'utiliser
window.GlobalThemeManager = globalThemeManager;