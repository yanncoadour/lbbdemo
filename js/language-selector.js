/**
 * SÉLECTEUR DE LANGUE GLOBAL
 * À inclure sur toutes les pages du site
 */

// Configuration des langues disponibles
const languages = {
    fr: { flag: '🇫🇷', name: 'Français', code: 'FR' },
    en: { flag: '🇬🇧', name: 'English', code: 'EN' },
    de: { flag: '🇩🇪', name: 'Deutsch', code: 'DE' },
    es: { flag: '🇪🇸', name: 'Español', code: 'ES' },
    it: { flag: '🇮🇹', name: 'Italiano', code: 'IT' },
    nl: { flag: '🇳🇱', name: 'Nederlands', code: 'NL' },
    pt: { flag: '🇵🇹', name: 'Português', code: 'PT' },
    zh: { flag: '🇨🇳', name: '中文', code: 'ZH' },
    ja: { flag: '🇯🇵', name: '日本語', code: 'JA' }
};

/**
 * Basculer l'affichage du dropdown
 */
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

/**
 * Changer la langue
 */
function changeLanguage(langCode) {
    console.log('🌍 Changement de langue vers:', langCode);

    // Sauvegarder la langue dans localStorage
    localStorage.setItem('selectedLanguage', langCode);

    // Mettre à jour le bouton
    const currentFlag = document.getElementById('currentFlag');
    const currentLang = document.getElementById('currentLang');
    const language = languages[langCode];

    if (language) {
        if (currentFlag) currentFlag.textContent = language.flag;
        if (currentLang) currentLang.textContent = language.code;
    }

    // Mettre à jour les options actives
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.lang === langCode) {
            option.classList.add('active');
        }
    });

    // Fermer le dropdown
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }

    // Appliquer la traduction à la page
    console.log('✅ Langue changée vers:', language.name);

    // Traduire la page si la fonction existe
    if (typeof translatePage === 'function') {
        translatePage(langCode);
    }
}

/**
 * Initialiser le sélecteur de langue
 */
function initLanguageSelector() {
    // Charger la langue sauvegardée
    const savedLang = localStorage.getItem('selectedLanguage') || 'fr';

    // Mettre à jour l'affichage du bouton
    const currentFlag = document.getElementById('currentFlag');
    const currentLang = document.getElementById('currentLang');
    const language = languages[savedLang];

    if (language) {
        if (currentFlag) currentFlag.textContent = language.flag;
        if (currentLang) currentLang.textContent = language.code;
    }

    // Mettre à jour les options actives
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.lang === savedLang) {
            option.classList.add('active');
        }
    });

    // Appliquer la traduction
    if (typeof translatePage === 'function') {
        translatePage(savedLang);
    }

    // Fermer le dropdown si on clique en dehors
    document.addEventListener('click', (e) => {
        const languageSelector = document.querySelector('.language-selector');
        const dropdown = document.getElementById('languageDropdown');

        if (languageSelector && dropdown &&
            !languageSelector.contains(e.target) &&
            dropdown.classList.contains('active')) {
            dropdown.classList.remove('active');
        }
    });
}

// Initialiser au chargement de la page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSelector);
} else {
    initLanguageSelector();
}

// Rendre les fonctions accessibles globalement
window.toggleLanguageDropdown = toggleLanguageDropdown;
window.changeLanguage = changeLanguage;
window.initLanguageSelector = initLanguageSelector;
window.languages = languages;
