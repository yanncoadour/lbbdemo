/**
 * BLOG - LA BELLE BRETAGNE
 * Gestion des articles et interactions
 */

// ===================================================================
// GESTION DES ARTICLES
// ===================================================================

/**
 * Initialise la page blog
 */
function initBlog() {
    console.log('📝 Initialisation de la page blog...');
    
    // Gérer l'affichage de l'article complet
    const readMoreBtn = document.querySelector('.read-more-btn');
    const featuredArticle = document.querySelector('.featured-article');
    const fullArticle = document.querySelector('.full-article');
    const backToBlogBtn = document.querySelector('.back-to-blog');
    const newsletterSection = document.querySelector('.newsletter-section');
    
    if (readMoreBtn && featuredArticle && fullArticle) {
        readMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showFullArticle();
        });
    }
    
    if (backToBlogBtn) {
        backToBlogBtn.addEventListener('click', () => {
            hideFullArticle();
        });
    }
    
    // Gérer les boutons de partage social
    initSocialSharing();
    
    // Gérer la newsletter
    initNewsletter();
    
    console.log('✅ Page blog initialisée');
}

/**
 * Affiche l'article complet
 */
function showFullArticle() {
    const featuredArticle = document.querySelector('.featured-article');
    const fullArticle = document.querySelector('.full-article');
    const newsletterSection = document.querySelector('.newsletter-section');
    
    // Masquer l'article featured et la newsletter
    if (featuredArticle) {
        featuredArticle.style.display = 'none';
    }
    if (newsletterSection) {
        newsletterSection.style.display = 'none';
    }
    
    // Afficher l'article complet
    if (fullArticle) {
        fullArticle.style.display = 'block';
        
        // Scroll vers le haut avec animation
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    console.log('📖 Article complet affiché');
}

/**
 * Masque l'article complet et revient à la vue liste
 */
function hideFullArticle() {
    const featuredArticle = document.querySelector('.featured-article');
    const fullArticle = document.querySelector('.full-article');
    const newsletterSection = document.querySelector('.newsletter-section');
    
    // Masquer l'article complet
    if (fullArticle) {
        fullArticle.style.display = 'none';
    }
    
    // Réafficher l'article featured et la newsletter
    if (featuredArticle) {
        featuredArticle.style.display = 'block';
    }
    if (newsletterSection) {
        newsletterSection.style.display = 'block';
    }
    
    // Scroll vers l'article avec animation
    if (featuredArticle) {
        featuredArticle.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    console.log('📝 Retour à la liste des articles');
}

// ===================================================================
// PARTAGE SOCIAL
// ===================================================================

/**
 * Initialise les boutons de partage social
 */
function initSocialSharing() {
    const socialBtns = document.querySelectorAll('.social-btn');
    
    socialBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const icon = btn.querySelector('i');
            
            if (icon.classList.contains('fa-facebook-f')) {
                shareOnFacebook();
            } else if (icon.classList.contains('fa-twitter')) {
                shareOnTwitter();
            } else if (icon.classList.contains('fa-envelope')) {
                shareByEmail();
            }
        });
    });
}

/**
 * Partage sur Facebook
 */
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Bienvenue sur La Belle Bretagne : votre nouveau guide incontournable !');
    
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    
    window.open(shareUrl, 'facebook-share', 'width=580,height=400');
    console.log('📱 Partage Facebook');
}

/**
 * Partage sur Twitter
 */
function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Découvrez La Belle Bretagne, le nouveau guide incontournable pour explorer la Bretagne ! 🌊🏰');
    
    const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    
    window.open(shareUrl, 'twitter-share', 'width=580,height=400');
    console.log('🐦 Partage Twitter');
}

/**
 * Partage par email
 */
function shareByEmail() {
    const subject = encodeURIComponent('Découvrez La Belle Bretagne !');
    const body = encodeURIComponent(`Bonjour,

Je voulais partager avec vous ce nouveau site super intéressant pour découvrir la Bretagne : La Belle Bretagne !

C'est un guide interactif avec une carte, des logements sélectionnés et plein de bonnes adresses.

Jetez-y un œil : ${window.location.href}

Bonne découverte !`);
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    console.log('✉️ Partage par email');
}

// ===================================================================
// NEWSLETTER
// ===================================================================

/**
 * Initialise la newsletter
 */
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleNewsletterSubmit();
        });
    }
}

/**
 * Gère la soumission de la newsletter
 */
function handleNewsletterSubmit() {
    const emailInput = document.querySelector('.newsletter-input');
    const submitBtn = document.querySelector('.newsletter-btn');
    
    if (!emailInput || !submitBtn) return;
    
    const email = emailInput.value.trim();
    
    // Validation simple de l'email
    if (!isValidEmail(email)) {
        showNewsletterMessage('Veuillez saisir une adresse email valide.', 'error');
        return;
    }
    
    // Animation du bouton pendant l'envoi
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inscription...';
    submitBtn.disabled = true;
    
    // Simuler l'envoi (à remplacer par un vrai service)
    setTimeout(() => {
        // Succès
        showNewsletterMessage('Merci ! Vous recevrez bientôt nos dernières actualités 🎉', 'success');
        emailInput.value = '';
        
        // Restaurer le bouton
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
        
        console.log('📧 Inscription newsletter:', email);
    }, 2000);
}

/**
 * Valide une adresse email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Affiche un message pour la newsletter
 */
function showNewsletterMessage(message, type = 'info') {
    const disclaimer = document.querySelector('.newsletter-disclaimer');
    
    if (disclaimer) {
        const originalText = disclaimer.textContent;
        disclaimer.textContent = message;
        disclaimer.style.color = type === 'error' ? '#ef4444' : '#22c55e';
        disclaimer.style.fontWeight = '600';
        
        // Restaurer après 5 secondes
        setTimeout(() => {
            disclaimer.textContent = originalText;
            disclaimer.style.color = '';
            disclaimer.style.fontWeight = '';
        }, 5000);
    }
}

// ===================================================================
// INITIALISATION
// ===================================================================

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlog);
} else {
    initBlog();
}

// Exporter pour utilisation globale
window.BlogApp = {
    showFullArticle,
    hideFullArticle,
    shareOnFacebook,
    shareOnTwitter,
    shareByEmail
};