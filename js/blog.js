/**
 * BLOG - LA BELLE BRETAGNE
 * Gestion des articles et interactions avec pagination et filtres
 */

// ===================================================================
// CONFIGURATION
// ===================================================================

const ARTICLES_PER_PAGE = 12;
let currentPage = 1;
let currentFilter = 'all';
let currentSearch = '';
let allArticles = [];

// ===================================================================
// GESTION DES ARTICLES
// ===================================================================

/**
 * Initialise la page blog
 */
function initBlog() {
    // Charger tous les articles depuis le DOM
    loadArticlesFromDOM();

    // Initialiser les contrôles
    initSearchBar();
    initFilters();
    initLoadMore();

    // Initialiser le lazy loading pour les images des articles complets
    initLazyLoading();

    // Gérer les boutons de partage social
    initSocialSharing();

    // Gérer la newsletter
    initNewsletter();

    // Afficher les articles initiaux
    displayArticles();
}

/**
 * Charge les articles existants depuis le DOM
 */
function loadArticlesFromDOM() {
    const articlesGrid = document.getElementById('articlesGrid');
    if (!articlesGrid) return;

    const cards = articlesGrid.querySelectorAll('.blog-card');

    cards.forEach((card, index) => {
        const categoryElement = card.querySelector('.article-category span');
        const titleElement = card.querySelector('.article-title a');
        const excerptElement = card.querySelector('.article-excerpt');
        const dateElement = card.querySelector('time');
        const readTimeElement = card.querySelector('.article-reading-time');
        const imageElement = card.querySelector('.article-image img');

        const article = {
            id: index + 1,
            category: categoryElement ? categoryElement.textContent.trim().toLowerCase() : '',
            title: titleElement ? titleElement.textContent.trim() : '',
            excerpt: excerptElement ? excerptElement.textContent.trim() : '',
            date: dateElement ? dateElement.getAttribute('datetime') : '',
            readTime: readTimeElement ? readTimeElement.textContent.trim() : '',
            image: imageElement ? imageElement.getAttribute('src') : '',
            imageAlt: imageElement ? imageElement.getAttribute('alt') : '',
            element: card.cloneNode(true)
        };

        allArticles.push(article);
    });
}

/**
 * Initialise la barre de recherche
 */
function initSearchBar() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentSearch = e.target.value.toLowerCase().trim();
            currentPage = 1;
            displayArticles();
        }, 300);
    });
}

/**
 * Initialise les filtres de catégorie
 */
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            filterBtns.forEach(b => b.classList.remove('active'));

            // Ajouter la classe active au bouton cliqué
            btn.classList.add('active');

            // Mettre à jour le filtre
            currentFilter = btn.getAttribute('data-category');
            currentPage = 1;

            // Afficher les articles filtrés
            displayArticles();
        });
    });
}

/**
 * Initialise le bouton "Charger plus"
 */
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', () => {
        loadMoreBtn.classList.add('loading');
        const icon = loadMoreBtn.querySelector('i');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-spinner', 'fa-spin');

        // Simuler un chargement
        setTimeout(() => {
            currentPage++;
            displayArticles(true);

            loadMoreBtn.classList.remove('loading');
            icon.classList.remove('fa-spinner', 'fa-spin');
            icon.classList.add('fa-chevron-down');
        }, 500);
    });
}

/**
 * Filtre les articles selon les critères actifs
 */
function getFilteredArticles() {
    return allArticles.filter(article => {
        // Filtre par catégorie
        const matchCategory = currentFilter === 'all' || article.category === currentFilter;

        // Filtre par recherche
        const matchSearch = !currentSearch ||
            article.title.toLowerCase().includes(currentSearch) ||
            article.excerpt.toLowerCase().includes(currentSearch);

        return matchCategory && matchSearch;
    });
}

/**
 * Affiche les articles avec pagination
 */
function displayArticles(append = false) {
    const articlesGrid = document.getElementById('articlesGrid');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const searchResultsInfo = document.querySelector('.search-results-info');
    const resultsCount = document.getElementById('resultsCount');

    if (!articlesGrid) return;

    const filteredArticles = getFilteredArticles();
    const totalArticles = filteredArticles.length;
    const articlesToShow = filteredArticles.slice(0, currentPage * ARTICLES_PER_PAGE);

    // Si on n'ajoute pas, on vide la grille
    if (!append) {
        articlesGrid.innerHTML = '';
    }

    // Afficher les articles
    articlesToShow.forEach((article, index) => {
        if (append && index < (currentPage - 1) * ARTICLES_PER_PAGE) {
            return; // Skip articles already displayed
        }
        const clonedElement = article.element.cloneNode(true);
        articlesGrid.appendChild(clonedElement);

        // Lazy load des images
        const img = clonedElement.querySelector('.article-image img');
        if (img) {
            lazyLoadImage(img);
        }
    });

    // Mettre à jour le compteur
    updateArticlesCount(articlesToShow.length, totalArticles);

    // Afficher/masquer le bouton "Charger plus"
    if (articlesToShow.length < totalArticles) {
        loadMoreContainer.style.display = 'block';
    } else {
        loadMoreContainer.style.display = 'none';
    }

    // Afficher les résultats de recherche
    if (currentSearch) {
        searchResultsInfo.style.display = 'flex';
        resultsCount.textContent = `${totalArticles} article${totalArticles > 1 ? 's' : ''} trouvé${totalArticles > 1 ? 's' : ''}`;
    } else {
        searchResultsInfo.style.display = 'none';
    }

    // Si aucun article, afficher un message
    if (totalArticles === 0) {
        articlesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-12);">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--color-gray-400); margin-bottom: var(--spacing-4);"></i>
                <h3 style="color: var(--color-gray-600); margin-bottom: var(--spacing-2);">Aucun article trouvé</h3>
                <p style="color: var(--color-gray-500);">Essayez avec d'autres mots-clés ou filtres</p>
            </div>
        `;
    }
}

/**
 * Met à jour le compteur d'articles
 */
function updateArticlesCount(current, total) {
    const currentCount = document.getElementById('currentCount');
    const totalCount = document.getElementById('totalCount');

    if (currentCount) currentCount.textContent = current;
    if (totalCount) totalCount.textContent = total;
}

/**
 * Efface la recherche
 */
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        currentSearch = '';
        currentPage = 1;
        displayArticles();
    }
}

// ===================================================================
// LAZY LOADING DES IMAGES
// ===================================================================

/**
 * Lazy loading d'une image avec Intersection Observer
 */
function lazyLoadImage(img) {
    // Si l'image est déjà chargée, on sort
    if (img.classList.contains('loaded')) {
        return;
    }

    // Créer un Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                const src = image.getAttribute('src') || image.getAttribute('data-src');

                if (src) {
                    // Créer une nouvelle image pour précharger
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        image.src = src;
                        image.classList.add('loaded');
                    };
                    tempImg.onerror = () => {
                        // En cas d'erreur, essayer le placeholder
                        const placeholder = 'assets/img/placeholder.jpg';
                        image.src = placeholder;
                        image.classList.add('loaded');
                    };
                    tempImg.src = src;

                    // Arrêter d'observer cette image
                    observer.unobserve(image);
                }
            }
        });
    }, {
        rootMargin: '50px',
        threshold: 0.01
    });

    observer.observe(img);
}

/**
 * Initialise le lazy loading pour toutes les images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('.article-image img, .article-image-full img, .article-image-inline img');

    images.forEach(img => {
        lazyLoadImage(img);
    });
}

/**
 * Affiche un article complet spécifique
 * @param {string} articleId - ID de l'article à afficher
 */
function showArticle(articleId) {
    const articlesGrid = document.querySelector('.articles-grid');
    const newsletterSection = document.querySelector('.newsletter-section');
    const allFullArticles = document.querySelectorAll('.full-article');
    const targetArticle = document.getElementById(`article-${articleId}`);

    // Masquer la grille d'articles et la newsletter
    if (articlesGrid) {
        articlesGrid.style.display = 'none';
    }
    if (newsletterSection) {
        newsletterSection.style.display = 'none';
    }

    // Masquer tous les articles complets
    allFullArticles.forEach(article => {
        article.style.display = 'none';
    });

    // Afficher l'article ciblé
    if (targetArticle) {
        targetArticle.style.display = 'block';

        // Scroll vers le haut avec animation
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

/**
 * Affiche l'article complet (pour compatibilité avec l'ancien code)
 */
function showFullArticle() {
    showArticle('lancement');
}

/**
 * Masque l'article complet et revient à la vue liste
 */
function hideFullArticle() {
    const articlesGrid = document.querySelector('.articles-grid');
    const allFullArticles = document.querySelectorAll('.full-article');
    const newsletterSection = document.querySelector('.newsletter-section');

    // Masquer tous les articles complets
    allFullArticles.forEach(article => {
        article.style.display = 'none';
    });

    // Réafficher la grille d'articles et la newsletter
    if (articlesGrid) {
        articlesGrid.style.display = 'grid';
    }
    if (newsletterSection) {
        newsletterSection.style.display = 'block';
    }

    // Scroll vers le haut avec animation
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
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
}

/**
 * Partage sur Twitter
 */
function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Découvrez La Belle Bretagne, le nouveau guide incontournable pour explorer la Bretagne ! 🌊🏰');

    const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;

    window.open(shareUrl, 'twitter-share', 'width=580,height=400');
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

    if (!emailInput || !submitBtn) {
        return;
    }

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

// Exporter les fonctions globalement pour utilisation dans le HTML
window.showArticle = showArticle;
window.showFullArticle = showFullArticle;
window.hideFullArticle = hideFullArticle;
window.shareOnFacebook = shareOnFacebook;
window.shareOnTwitter = shareOnTwitter;
window.shareByEmail = shareByEmail;
window.clearSearch = clearSearch;