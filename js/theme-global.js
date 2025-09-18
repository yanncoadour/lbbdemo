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
                
                /* Conteneurs principaux */
                .dark-theme .container,
                .dark-theme .container-fluid {
                    background: var(--surface);
                }
                
                .dark-theme .section {
                    background: var(--surface);
                }
                
                .dark-theme .content-section,
                .dark-theme .hero-section {
                    background: var(--surface);
                }
                
                /* Grid et colonnes */
                .dark-theme .grid,
                .dark-theme .places-grid,
                .dark-theme .festivals-grid,
                .dark-theme .logements-grid {
                    background: var(--surface);
                }
                
                /* Cards spécifiques */
                .dark-theme .place-card,
                .dark-theme .festival-card-item,
                .dark-theme .logement-item,
                .dark-theme .blog-item,
                .dark-theme .instagram-item {
                    background: var(--surface-card) !important;
                    border-color: var(--border) !important;
                    color: var(--text-primary) !important;
                }
                
                .dark-theme .place-card:hover,
                .dark-theme .festival-card-item:hover,
                .dark-theme .logement-item:hover,
                .dark-theme .blog-item:hover {
                    background: var(--surface-elevated) !important;
                }
                
                /* Textes et liens */
                .dark-theme h1, .dark-theme h2, .dark-theme h3, 
                .dark-theme h4, .dark-theme h5, .dark-theme h6 {
                    color: var(--text-primary) !important;
                }
                
                .dark-theme p, .dark-theme span, .dark-theme div {
                    color: var(--text-secondary) !important;
                }
                
                .dark-theme a {
                    color: var(--primary-light) !important;
                }
                
                .dark-theme a:hover {
                    color: var(--primary) !important;
                }
                
                /* Meta informations */
                .dark-theme .meta, .dark-theme .date, 
                .dark-theme .location, .dark-theme .price {
                    color: var(--text-muted) !important;
                    background: var(--surface-elevated) !important;
                }
                
                /* Badges et labels */
                .dark-theme .badge, .dark-theme .tag, 
                .dark-theme .label, .dark-theme .chip {
                    background: var(--surface-elevated) !important;
                    color: var(--text-primary) !important;
                    border-color: var(--border) !important;
                }
                
                .dark-theme .badge.primary, .dark-theme .tag.primary {
                    background: var(--primary) !important;
                    color: white !important;
                }
                
                /* Panels et sidebars */
                .dark-theme .panel, .dark-theme .sidebar,
                .dark-theme .widget, .dark-theme .box {
                    background: var(--surface-card) !important;
                    border-color: var(--border) !important;
                }
                
                /* Navigation et menus */
                .dark-theme .nav, .dark-theme .menu,
                .dark-theme .dropdown, .dark-theme .submenu {
                    background: var(--surface-card) !important;
                    border-color: var(--border) !important;
                }
                
                .dark-theme .nav-link, .dark-theme .menu-item {
                    color: var(--text-secondary) !important;
                }
                
                .dark-theme .nav-link:hover, .dark-theme .menu-item:hover {
                    background: var(--surface-elevated) !important;
                    color: var(--text-primary) !important;
                }
                
                .dark-theme .nav-link.active, .dark-theme .menu-item.active {
                    background: var(--primary) !important;
                    color: white !important;
                }
                
                /* Hero sections */
                .dark-theme .hero, .dark-theme .banner,
                .dark-theme .jumbotron {
                    background: var(--surface-elevated) !important;
                }
                
                .dark-theme .hero-title, .dark-theme .banner-title {
                    color: var(--text-primary) !important;
                }
                
                .dark-theme .hero-subtitle, .dark-theme .banner-subtitle {
                    color: var(--text-secondary) !important;
                }
                
                /* Lists */
                .dark-theme ul, .dark-theme ol, .dark-theme li {
                    color: var(--text-secondary) !important;
                }
                
                /* Borders génériques */
                .dark-theme .border, .dark-theme .border-top,
                .dark-theme .border-bottom, .dark-theme .border-left,
                .dark-theme .border-right {
                    border-color: var(--border) !important;
                }
                
                /* Backgrounds génériques */
                .dark-theme .bg-white {
                    background: var(--surface-card) !important;
                }
                
                .dark-theme .bg-light {
                    background: var(--surface-elevated) !important;
                }
                
                .dark-theme .bg-gray {
                    background: var(--surface-elevated) !important;
                }
                
                /* Text colors génériques */
                .dark-theme .text-dark {
                    color: var(--text-primary) !important;
                }
                
                .dark-theme .text-muted {
                    color: var(--text-muted) !important;
                }
                
                /* Images et media */
                .dark-theme .media, .dark-theme .thumbnail {
                    border-color: var(--border) !important;
                }
                
                /* Tables améliorées */
                .dark-theme table {
                    background: var(--surface-card) !important;
                    color: var(--text-primary) !important;
                    border-color: var(--border) !important;
                }
                
                .dark-theme thead th {
                    background: var(--surface-elevated) !important;
                    color: var(--text-primary) !important;
                    border-color: var(--border) !important;
                }
                
                .dark-theme tbody tr {
                    border-color: var(--border) !important;
                }
                
                .dark-theme tbody tr:nth-child(odd) {
                    background: var(--surface-elevated) !important;
                }
                
                .dark-theme tbody tr:hover {
                    background: var(--surface-card) !important;
                }
                
                .dark-theme td, .dark-theme th {
                    border-color: var(--border) !important;
                    color: var(--text-secondary) !important;
                }
                
                /* Formulaires améliorés */
                .dark-theme .form-group, .dark-theme .form-control,
                .dark-theme .input-group {
                    background: var(--surface-card) !important;
                }
                
                .dark-theme input:focus, .dark-theme textarea:focus,
                .dark-theme select:focus {
                    border-color: var(--primary) !important;
                    box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25) !important;
                }
                
                .dark-theme .form-label, .dark-theme label {
                    color: var(--text-primary) !important;
                }
                
                .dark-theme ::placeholder {
                    color: var(--text-muted) !important;
                }
                
                /* Alerts et notifications */
                .dark-theme .alert {
                    background: var(--surface-card) !important;
                    border-color: var(--border) !important;
                    color: var(--text-primary) !important;
                }
                
                .dark-theme .alert-info {
                    background: rgba(59, 130, 246, 0.1) !important;
                    border-color: var(--primary) !important;
                }
                
                .dark-theme .alert-success {
                    background: rgba(5, 150, 105, 0.1) !important;
                    border-color: var(--success) !important;
                }
                
                .dark-theme .alert-warning {
                    background: rgba(245, 158, 11, 0.1) !important;
                    border-color: var(--accent-warm) !important;
                }
                
                .dark-theme .alert-danger {
                    background: rgba(220, 38, 38, 0.1) !important;
                    border-color: var(--danger) !important;
                }
                
                /* Loading states */
                .dark-theme .loading, .dark-theme .spinner,
                .dark-theme .skeleton {
                    background: var(--surface-elevated) !important;
                }
                
                /* Pagination */
                .dark-theme .pagination {
                    background: var(--surface-card) !important;
                }
                
                .dark-theme .page-link {
                    background: var(--surface-card) !important;
                    border-color: var(--border) !important;
                    color: var(--text-secondary) !important;
                }
                
                .dark-theme .page-link:hover {
                    background: var(--surface-elevated) !important;
                    color: var(--text-primary) !important;
                }
                
                .dark-theme .page-item.active .page-link {
                    background: var(--primary) !important;
                    border-color: var(--primary) !important;
                    color: white !important;
                }
                
                /* Breadcrumbs */
                .dark-theme .breadcrumb {
                    background: var(--surface-elevated) !important;
                }
                
                .dark-theme .breadcrumb-item {
                    color: var(--text-secondary) !important;
                }
                
                .dark-theme .breadcrumb-item.active {
                    color: var(--text-primary) !important;
                }
                
                /* Tooltips et popovers */
                .dark-theme .tooltip, .dark-theme .popover {
                    background: var(--surface-card) !important;
                    color: var(--text-primary) !important;
                    border-color: var(--border) !important;
                }
                
                /* Scrollbars personnalisées pour le mode sombre */
                .dark-theme ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                .dark-theme ::-webkit-scrollbar-track {
                    background: var(--surface-elevated) !important;
                }
                
                .dark-theme ::-webkit-scrollbar-thumb {
                    background: var(--border) !important;
                    border-radius: 4px;
                }
                
                .dark-theme ::-webkit-scrollbar-thumb:hover {
                    background: var(--text-muted) !important;
                }
                
                /* Override pour les éléments récalcitrants */
                .dark-theme * {
                    scrollbar-color: var(--border) var(--surface-elevated) !important;
                    scrollbar-width: thin !important;
                }
                
                /* Force background sur éléments spécifiques */
                .dark-theme div[style*="background: white"],
                .dark-theme div[style*="background-color: white"],
                .dark-theme div[style*="background:#fff"],
                .dark-theme div[style*="background-color:#fff"] {
                    background: var(--surface-card) !important;
                }
                
                .dark-theme [class*="white"], .dark-theme [class*="light"] {
                    background: var(--surface-card) !important;
                    color: var(--text-primary) !important;
                }
                
                /* FESTIVALS - Corrections spécifiques */
                .dark-theme .festivals-filters {
                    background: var(--surface-elevated) !important;
                    border-bottom-color: var(--border) !important;
                }
                
                .dark-theme .festivals-filters .filter-chip {
                    background: var(--surface-card) !important;
                    border-color: var(--border) !important;
                    color: var(--text-secondary) !important;
                }
                
                .dark-theme .festivals-filters .filter-chip:hover {
                    background: var(--surface-elevated) !important;
                    border-color: var(--primary) !important;
                    color: var(--primary) !important;
                }
                
                .dark-theme .festivals-filters .filter-chip.active {
                    background: var(--primary) !important;
                    border-color: var(--primary) !important;
                    color: white !important;
                }
                
                .dark-theme .festivals-filters .filter-label {
                    color: var(--text-primary) !important;
                }
                
                .dark-theme .festivals-main,
                .dark-theme .festivals-hero {
                    background: var(--surface) !important;
                }
                
                .dark-theme .festivals-grid-section {
                    background: var(--surface) !important;
                }
                
                /* LOGEMENTS - Corrections spécifiques */
                .dark-theme .logements-filters,
                .dark-theme .logements-filter-section {
                    background: var(--surface-elevated) !important;
                    border-color: var(--border) !important;
                }
                
                .dark-theme .logements-main {
                    background: var(--surface) !important;
                }
                
                .dark-theme .logements-hero {
                    background: var(--surface) !important;
                }
                
                .dark-theme .logements-grid-section {
                    background: var(--surface) !important;
                }
                
                /* Filtres généraux - Force tous les éléments de filtres */
                .dark-theme .filter-section,
                .dark-theme .filters-container,
                .dark-theme .filters-wrapper {
                    background: var(--surface-elevated) !important;
                    border-color: var(--border) !important;
                }
                
                .dark-theme .filter-bar,
                .dark-theme .filter-panel,
                .dark-theme .filter-sidebar {
                    background: var(--surface-card) !important;
                    border-color: var(--border) !important;
                }
                
                /* Correction pour les chips de filtres génériques */
                .dark-theme .chip,
                .dark-theme .filter-item,
                .dark-theme .filter-option {
                    background: var(--surface-card) !important;
                    border-color: var(--border) !important;
                    color: var(--text-secondary) !important;
                }
                
                .dark-theme .chip:hover,
                .dark-theme .filter-item:hover,
                .dark-theme .filter-option:hover {
                    background: var(--surface-elevated) !important;
                    color: var(--text-primary) !important;
                }
                
                .dark-theme .chip.active,
                .dark-theme .filter-item.active,
                .dark-theme .filter-option.active {
                    background: var(--primary) !important;
                    color: white !important;
                }
                
                /* Sections principales des pages */
                .dark-theme .main,
                .dark-theme .main-content,
                .dark-theme .content-wrapper {
                    background: var(--surface) !important;
                }
                
                /* Corrections pour les Hero sections */
                .dark-theme .hero-content,
                .dark-theme .hero-text {
                    background: transparent !important;
                }
                
                .dark-theme .hero-title {
                    color: var(--text-primary) !important;
                }
                
                .dark-theme .hero-subtitle {
                    color: var(--text-secondary) !important;
                }
                
                /* Corrections pour les conteneurs de contenu */
                .dark-theme .content-container,
                .dark-theme .page-content,
                .dark-theme .section-content {
                    background: var(--surface) !important;
                }
                
                /* Corrections pour les backgrounds inline */
                .dark-theme [style*="background:white"],
                .dark-theme [style*="background: white"],
                .dark-theme [style*="background-color:white"],
                .dark-theme [style*="background-color: white"],
                .dark-theme [style*="background:#ffffff"],
                .dark-theme [style*="background: #ffffff"],
                .dark-theme [style*="background-color:#ffffff"],
                .dark-theme [style*="background-color: #ffffff"],
                .dark-theme [style*="background:#fff"],
                .dark-theme [style*="background: #fff"],
                .dark-theme [style*="background-color:#fff"],
                .dark-theme [style*="background-color: #fff"] {
                    background: var(--surface-card) !important;
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