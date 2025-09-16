/**
 * SETTINGS - LA BELLE BRETAGNE
 * Gestion du menu des réglages avec mode sombre/clair
 */

class SettingsManager {
    constructor() {
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsMenu = document.getElementById('settingsMenu');
        this.themeToggle = document.getElementById('themeToggle');
        this.themeSwitch = document.getElementById('themeSwitch');
        this.themeIcon = document.getElementById('themeIcon');
        this.aboutBtn = document.getElementById('aboutBtn');
        this.contactBtn = document.getElementById('contactBtn');
        this.overlay = document.getElementById('overlay');
        
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.updateThemeUI();
    }
    
    setupEventListeners() {
        // Toggle settings menu
        if (this.settingsBtn) {
            this.settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }
        
        // Theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleTheme();
            });
        }
        
        // About button
        if (this.aboutBtn) {
            this.aboutBtn.addEventListener('click', () => {
                this.closeMenu();
                this.showAboutModal();
            });
        }
        
        // Contact button
        if (this.contactBtn) {
            this.contactBtn.addEventListener('click', () => {
                this.closeMenu();
                this.showContactModal();
            });
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.settingsMenu.contains(e.target) && 
                !this.settingsBtn.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Close menu on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isMenuOpen = true;
        this.settingsMenu.classList.add('open');
        this.settingsBtn.classList.add('active');
        
        // Ajouter l'overlay si disponible
        if (this.overlay) {
            this.overlay.style.display = 'block';
            this.overlay.style.opacity = '0.3';
        }
    }
    
    closeMenu() {
        this.isMenuOpen = false;
        this.settingsMenu.classList.remove('open');
        this.settingsBtn.classList.remove('active');
        
        // Masquer l'overlay
        if (this.overlay) {
            this.overlay.style.opacity = '0';
            setTimeout(() => {
                this.overlay.style.display = 'none';
            }, 300);
        }
    }
    
    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('darkMode', this.isDarkMode);
        this.applyTheme();
        this.updateThemeUI();
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
        if (!document.getElementById('dark-theme-styles')) {
            const darkStyles = document.createElement('style');
            darkStyles.id = 'dark-theme-styles';
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
                
                .dark-theme .settings-menu {
                    background: rgba(51, 65, 85, 0.95);
                    border-color: var(--border);
                }
                
                
                .dark-theme .leaflet-control-zoom a {
                    background-color: var(--surface-card) !important;
                    color: var(--text-primary) !important;
                    border-color: var(--border) !important;
                }
                
                .dark-theme .leaflet-control-attribution {
                    background-color: rgba(51, 65, 85, 0.8) !important;
                    color: var(--text-secondary) !important;
                }
                
                .dark-theme .leaflet-control-attribution a {
                    color: var(--primary-light) !important;
                }
                
                .dark-theme .location-btn {
                    background: var(--surface-card) !important;
                    border-color: var(--border) !important;
                    color: var(--text-primary) !important;
                }
                
                .dark-theme .map-toggle-btn {
                    background: var(--surface-card) !important;
                    border-color: var(--border) !important;
                    color: var(--text-primary) !important;
                }
                
                .dark-theme .map-toggle-btn i {
                    color: var(--text-secondary) !important;
                }
                
                .dark-theme .location-btn i {
                    color: var(--text-secondary) !important;
                }
                
                .dark-theme .map-toggle-btn.satellite {
                    background: var(--primary) !important;
                    border-color: var(--primary) !important;
                }
                
                .dark-theme .map-toggle-btn.satellite i {
                    color: white !important;
                }
                
                .dark-theme .custom-popup .leaflet-popup-content-wrapper {
                    background: var(--surface-card) !important;
                    color: var(--text-primary) !important;
                }
                
                .dark-theme .custom-popup .leaflet-popup-tip {
                    background: var(--surface-card) !important;
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
                
                /* Tables et listes */
                .dark-theme table {
                    background: var(--surface-card);
                    color: var(--text-primary);
                }
                
                .dark-theme thead {
                    background: var(--surface-elevated);
                }
                
                .dark-theme td, 
                .dark-theme th {
                    border-color: var(--border);
                }
                
                /* Modals */
                .dark-theme .modal,
                .dark-theme .popup {
                    background: var(--surface-card);
                    color: var(--text-primary);
                    border-color: var(--border);
                }
                
                /* Loading et états */
                .dark-theme .loading-state,
                .dark-theme .error-state {
                    background: var(--surface);
                    color: var(--text-primary);
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
        const darkStyles = document.getElementById('dark-theme-styles');
        if (darkStyles) {
            darkStyles.remove();
        }
    }
    
    
    updateThemeUI() {
        if (this.themeSwitch && this.themeIcon) {
            if (this.isDarkMode) {
                this.themeSwitch.classList.add('active');
                this.themeIcon.className = 'fas fa-sun';
            } else {
                this.themeSwitch.classList.remove('active');
                this.themeIcon.className = 'fas fa-moon';
            }
        }
    }
    
    showAboutModal() {
        // Créer le modal "Qui sommes-nous"
        const modal = this.createModal('about', {
            title: 'Qui sommes-nous ?',
            icon: 'fas fa-info-circle',
            content: `
                <div class="modal-content-text">
                    <h3>🌊 Votre guide authentique de Bretagne</h3>
                    <p>La Belle Bretagne est né de notre passion pour cette région exceptionnelle. Nous parcourons la Bretagne depuis des années pour vous faire découvrir ses trésors cachés et ses lieux emblématiques.</p>
                    
                    <h4>🎯 Notre mission</h4>
                    <ul>
                        <li>Vous faire découvrir les plus beaux lieux de Bretagne</li>
                        <li>Partager des recommandations authentiques et testées</li>
                        <li>Préserver et valoriser le patrimoine breton</li>
                        <li>Soutenir le tourisme local et responsable</li>
                    </ul>
                    
                    <h4>⭐ Notre engagement</h4>
                    <p>Chaque lieu recommandé sur notre plateforme a été personnellement visité et testé par notre équipe. Nous privilégions la qualité à la quantité pour vous offrir une expérience authentique de la Bretagne.</p>
                    
                    <h4>🤝 Rejoignez notre communauté</h4>
                    <p>Suivez-nous sur nos réseaux sociaux pour découvrir encore plus de merveilles bretonnes et partager vos propres découvertes !</p>
                </div>
            `
        });
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }
    
    showContactModal() {
        // Créer le modal "Contactez-nous"
        const modal = this.createModal('contact', {
            title: 'Contactez-nous',
            icon: 'fas fa-envelope',
            content: `
                <div class="modal-content-text">
                    <h3>💬 Une question ? Une suggestion ?</h3>
                    <p>Nous sommes à votre écoute ! N'hésitez pas à nous contacter pour toute question, suggestion ou partage de découverte.</p>
                    
                    <div class="contact-methods">
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <div>
                                <strong>Email</strong>
                                <a href="mailto:hello@labellebretagne.fr">hello@labellebretagne.fr</a>
                            </div>
                        </div>
                        
                        <div class="contact-item">
                            <i class="fab fa-instagram"></i>
                            <div>
                                <strong>Instagram</strong>
                                <a href="https://instagram.com/labellebretagne" target="_blank">@labellebretagne</a>
                            </div>
                        </div>
                        
                        <div class="contact-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div>
                                <strong>Basé en</strong>
                                <span>Bretagne, France</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="contact-note">
                        <i class="fas fa-heart"></i>
                        <p>Vous avez découvert un lieu exceptionnel en Bretagne ? Partagez-le nous ! Nous serions ravis de l'explorer et de le faire connaître à notre communauté.</p>
                    </div>
                </div>
            `
        });
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }
    
    createModal(type, config) {
        const modal = document.createElement('div');
        modal.className = `settings-modal ${type}-modal`;
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <div class="modal-title">
                        <i class="${config.icon}"></i>
                        <h2>${config.title}</h2>
                    </div>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${config.content}
                </div>
                <div class="modal-footer">
                    <button class="btn-modal-close">Fermer</button>
                </div>
            </div>
        `;
        
        // Event listeners for modal
        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.btn-modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
        
        // Close on escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        return modal;
    }
}

// Styles pour les modals
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .settings-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .settings-modal.show {
        opacity: 1;
        visibility: visible;
    }
    
    .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
    }
    
    .modal-container {
        position: relative;
        max-width: 600px;
        margin: 80px auto;
        background: var(--surface-card);
        border-radius: 16px;
        box-shadow: var(--shadow-xl);
        transform: translateY(20px) scale(0.95);
        transition: transform 0.3s ease;
        max-height: calc(100vh - 160px);
        overflow: hidden;
        margin-left: 20px;
        margin-right: 20px;
    }
    
    .settings-modal.show .modal-container {
        transform: translateY(0) scale(1);
    }
    
    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px 24px 16px;
        border-bottom: 1px solid var(--border-light);
    }
    
    .modal-title {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .modal-title i {
        color: var(--primary);
        font-size: 1.2rem;
    }
    
    .modal-title h2 {
        font-size: 1.3rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
    }
    
    .modal-close {
        width: 32px;
        height: 32px;
        border: none;
        background: var(--surface-elevated);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--text-secondary);
        transition: all 0.3s ease;
    }
    
    .modal-close:hover {
        background: var(--primary);
        color: white;
    }
    
    .modal-body {
        padding: 20px 24px;
        overflow-y: auto;
        max-height: calc(100vh - 320px);
    }
    
    .modal-content-text h3 {
        color: var(--text-primary);
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .modal-content-text h4 {
        color: var(--text-primary);
        font-size: 1rem;
        font-weight: 600;
        margin: 20px 0 8px;
    }
    
    .modal-content-text p {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 16px;
    }
    
    .modal-content-text ul {
        margin: 12px 0 20px 20px;
        color: var(--text-secondary);
    }
    
    .modal-content-text li {
        margin-bottom: 6px;
        line-height: 1.5;
    }
    
    .contact-methods {
        margin: 24px 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    
    .contact-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background: var(--surface-elevated);
        border-radius: 12px;
        transition: all 0.3s ease;
    }
    
    .contact-item:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
    
    .contact-item i {
        color: var(--primary);
        font-size: 1.2rem;
        width: 24px;
        text-align: center;
    }
    
    .contact-item strong {
        display: block;
        color: var(--text-primary);
        font-weight: 600;
        margin-bottom: 2px;
    }
    
    .contact-item a {
        color: var(--primary);
        text-decoration: none;
        transition: color 0.3s ease;
    }
    
    .contact-item a:hover {
        color: var(--primary-light);
    }
    
    .contact-note {
        background: var(--secondary);
        padding: 16px;
        border-radius: 12px;
        margin-top: 24px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
    }
    
    .contact-note i {
        color: var(--accent-warm);
        margin-top: 2px;
        flex-shrink: 0;
    }
    
    .contact-note p {
        margin: 0;
        color: var(--text-primary);
        font-size: 0.95rem;
        line-height: 1.5;
    }
    
    .modal-footer {
        padding: 16px 24px 24px;
        display: flex;
        justify-content: flex-end;
        border-top: 1px solid var(--border-light);
    }
    
    .btn-modal-close {
        background: var(--primary);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-modal-close:hover {
        background: var(--primary-dark);
        transform: translateY(-1px);
    }
    
    @media (max-width: 768px) {
        .modal-container {
            margin: 20px;
            max-height: calc(100vh - 40px);
        }
        
        .modal-header {
            padding: 20px 20px 12px;
        }
        
        .modal-body {
            padding: 16px 20px;
            max-height: calc(100vh - 200px);
        }
        
        .modal-title h2 {
            font-size: 1.2rem;
        }
        
        .contact-methods {
            gap: 12px;
        }
        
        .contact-item {
            padding: 12px;
        }
    }
`;
document.head.appendChild(modalStyles);

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new SettingsManager();
});