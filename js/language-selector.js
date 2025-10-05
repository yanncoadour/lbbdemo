/**
 * SÉLECTEUR DE LANGUE GLOBAL
 * Utilise localStorage pour sauvegarder la préférence de langue
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
 * Récupère la langue courante depuis localStorage
 */
function getCurrentLanguage() {
    return localStorage.getItem('preferredLanguage') || 'fr';
}

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
 * Changer de langue - Sauvegarde dans localStorage et recharge la page
 */
function changeLanguage(langCode) {
    console.log('🌍 Changement de langue vers:', langCode);

    const language = languages[langCode];
    if (!language) {
        console.error('Langue non supportée:', langCode);
        return;
    }

    // Sauvegarder la préférence
    localStorage.setItem('preferredLanguage', langCode);

    // Recharger la page pour appliquer les traductions
    window.location.reload();
}

/**
 * Initialiser le sélecteur de langue
 */
function initLanguageSelector() {
    const currentLang = getCurrentLanguage();
    const language = languages[currentLang];

    // Mettre à jour l'affichage du bouton
    const currentFlag = document.getElementById('currentFlag');
    const currentLangText = document.getElementById('currentLang');

    if (language) {
        if (currentFlag) currentFlag.textContent = language.flag;
        if (currentLangText) currentLangText.textContent = language.code;
    }

    // Mettre à jour les options actives dans le dropdown
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.lang === currentLang) {
            option.classList.add('active');
        }
    });

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

    console.log('✅ Langue courante:', language.name, '(' + currentLang + ')');
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
window.getCurrentLanguage = getCurrentLanguage;
window.languages = languages;
