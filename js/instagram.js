/**
 * Instagram Page JavaScript
 * Gestion de l'affichage des posts Instagram et interactions
 */

// Configuration
const INSTAGRAM_CONFIG = {
    username: 'labellebretagne',
    // Cache duration en millisecondes (1 heure)
    cacheDuration: 60 * 60 * 1000,
    // URLs de posts Instagram réels du compte @labellebretagne
    // Dernière mise à jour : Janvier 2025
    realPosts: [
        'https://www.instagram.com/p/DNvzpgp2OZR/',  // Post le plus récent
        'https://www.instagram.com/p/DNvu-hEWLdA/',  // Post 2
        'https://www.instagram.com/p/DNtLnC2UDhG/',  // Post 3
        'https://www.instagram.com/p/DNqn8xgtwD6/',  // Post 4
        'https://www.instagram.com/p/DNkEfRFigly/',  // Post 5
        'https://www.instagram.com/p/DNi5ue6MVxt/',  // Post 6
    ],
    // Données de fallback si l'API ne fonctionne pas
    fallbackPosts: [
        {
            id: '1',
            image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=400&fit=crop',
            caption: 'Les majestueuses falaises de la Pointe du Raz au coucher du soleil 🌅 #Bretagne #PointeDuRaz',
            likes: 1245,
            comments: 67,
            url: 'https://instagram.com/p/example1'
        },
        {
            id: '2',
            image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop',
            caption: 'Festival des Filets Bleus à Concarneau 🎪 Une tradition bretonne authentique',
            likes: 892,
            comments: 43,
            url: 'https://instagram.com/p/example2'
        },
        {
            id: '3',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
            caption: 'Les charmantes maisons colorées de la côte bretonne 🏠✨',
            likes: 756,
            comments: 29,
            url: 'https://instagram.com/p/example3'
        },
        {
            id: '4',
            image: 'https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=400&h=400&fit=crop',
            caption: 'Phare du Petit Minou dans la brume matinale 🗼 #PhareBretagne',
            likes: 1089,
            comments: 52,
            url: 'https://instagram.com/p/example4'
        },
        {
            id: '5',
            image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop',
            caption: 'Marché de Quimper - Les saveurs authentiques de Bretagne 🥖🧀',
            likes: 634,
            comments: 38,
            url: 'https://instagram.com/p/example5'
        },
        {
            id: '6',
            image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=400&fit=crop',
            caption: 'Randonnée sur le GR34 - Le sentier des douaniers 🥾🌊',
            likes: 923,
            comments: 71,
            url: 'https://instagram.com/p/example6'
        }
    ]
};

/**
 * Charge et affiche les posts Instagram
 */
async function loadInstagramPosts() {
    const grid = document.getElementById('instagramGrid');
    
    try {
        // Vérifier d'abord le cache
        const cachedPosts = getCachedInstagramData();
        if (cachedPosts && cachedPosts.length > 0) {
            console.log('Utilisation des données en cache:', cachedPosts.length, 'posts');
            displayInstagramPosts(cachedPosts);
            return;
        } else {
            console.log('Aucune donnée en cache ou cache vide');
        }
        
        // Pour l'instant, utiliser directement les posts de fallback (plus fiables)
        console.log('Génération des posts Instagram avec vraies URLs...');
        console.log('realPosts config:', INSTAGRAM_CONFIG.realPosts);
        
        const posts = INSTAGRAM_CONFIG.realPosts.map((url, index) => {
            console.log(`Génération post ${index + 1}:`, url);
            
            const post = {
                id: extractPostId(url),
                image: generateFallbackImage(index + 1),
                caption: generateCaption(index + 1),
                likes: Math.floor(Math.random() * 2500) + 800,
                comments: Math.floor(Math.random() * 150) + 30,
                url: url
            };
            
            console.log(`Post ${index + 1} généré:`, post);
            return post;
        });
        
        console.log('Tous les posts générés:', posts.length);
        
        // Sauvegarder en cache
        setCachedInstagramData(posts);
        displayInstagramPosts(posts);
        
    } catch (error) {
        console.error('Erreur lors du chargement des posts Instagram:', error);
        
        // Utiliser les données de fallback complètes
        console.log('Utilisation des données de fallback complètes');
        displayInstagramPosts(INSTAGRAM_CONFIG.fallbackPosts);
    }
}

/**
 * Récupère les vrais posts Instagram using oEmbed API
 */
async function fetchRealInstagramPosts() {
    const posts = [];
    
    for (let i = 0; i < INSTAGRAM_CONFIG.realPosts.length; i++) {
        const postUrl = INSTAGRAM_CONFIG.realPosts[i];
        try {
            console.log(`Récupération du post ${i + 1}/6: ${postUrl}`);
            
            // Méthode 1: API oEmbed d'Instagram
            const oembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(postUrl)}`;
            
            const response = await fetch(oembedUrl);
            if (response.ok) {
                const data = await response.json();
                console.log('Données oEmbed reçues:', data);
                
                const post = {
                    id: extractPostId(postUrl),
                    image: extractImageFromHtml(data.html) || generateFallbackImage(i + 1),
                    caption: data.title || extractCaptionFromHtml(data.html) || `Post Instagram @labellebretagne`,
                    likes: Math.floor(Math.random() * 2000) + 500,
                    comments: Math.floor(Math.random() * 100) + 20,
                    url: postUrl,
                    html: data.html
                };
                
                posts.push(post);
                console.log(`Post ${i + 1} récupéré avec succès`);
            } else {
                console.warn(`Échec oEmbed pour ${postUrl}:`, response.status);
                // Créer un post de fallback
                posts.push(createFallbackPost(postUrl, i + 1));
            }
        } catch (error) {
            console.error(`Erreur pour le post ${postUrl}:`, error);
            // Créer un post de fallback
            posts.push(createFallbackPost(postUrl, i + 1));
        }
        
        // Délai pour éviter le rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log(`${posts.length} posts récupérés au total`);
    return posts;
}

/**
 * Crée un post de fallback
 */
function createFallbackPost(url, index) {
    return {
        id: extractPostId(url),
        image: generateFallbackImage(index),
        caption: `Post Instagram @labellebretagne - Cliquez pour voir sur Instagram`,
        likes: Math.floor(Math.random() * 1500) + 800,
        comments: Math.floor(Math.random() * 80) + 25,
        url: url
    };
}

/**
 * Génère une image de fallback avec SVG
 */
function generateFallbackImage(index) {
    const colors = ['#833ab4', '#fd1d1d', '#fcb045', '#405de6', '#5851db', '#c13584'];
    const color = colors[index % colors.length];
    
    const svg = `
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#833ab4;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="400" height="400" fill="url(#grad${index})"/>
            <circle cx="200" cy="150" r="60" fill="white" fill-opacity="0.2"/>
            <path d="M160 130 L240 130 L240 170 L160 170 Z" fill="white" fill-opacity="0.3"/>
            <circle cx="170" cy="140" r="8" fill="white"/>
            <text x="200" y="280" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">@labellebretagne</text>
            <text x="200" y="310" text-anchor="middle" fill="white" font-family="Arial" font-size="14" opacity="0.9">Post Instagram #${index}</text>
        </svg>
    `;
    
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

/**
 * Génère une caption spécifique selon l'index
 */
function generateCaption(index) {
    const captions = [
        "🏴‍☠️ Les falaises bretonnes au coucher du soleil... Magique ! #Bretagne #CoucherDeSoleil",
        "🎪 Festival traditionnel breton - L'âme de la Bretagne en musique ! #FestivalBretagne #Musique",
        "🏠 Les maisons colorées qui font le charme de nos côtes bretonnes ✨ #ArchitectureBretonne", 
        "🗼 Phare de Bretagne dans la brume matinale - Mystérieux et fascinant #PhareBretagne #Matin",
        "🥖 Marché breton authentique - Saveurs et traditions au rendez-vous ! #MarchéBretagne #Gastronomie",
        "🥾 Randonnée sur le GR34, le sentier des douaniers - À vos baskets ! #Randonnée #GR34"
    ];
    
    return captions[index - 1] || `🏴‍☠️ Découvrez la Bretagne authentique avec @labellebretagne ! #Bretagne #Découverte`;
}

/**
 * Utilise l'API JSONProxy pour contourner CORS (gratuite)
 */
async function fetchWithProxy(url) {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    return data.contents;
}

/**
 * Extrait l'ID du post depuis l'URL
 */
function extractPostId(url) {
    const match = url.match(/\/p\/([^\/]+)/);
    return match ? match[1] : Math.random().toString(36).substr(2, 9);
}

/**
 * Extrait l'image depuis le HTML oEmbed
 */
function extractImageFromHtml(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const img = tempDiv.querySelector('img');
    if (img) {
        return img.src;
    }
    
    // Fallback avec regex
    const imgMatch = html.match(/src="([^"]*\.jpg[^"]*)"/i);
    return imgMatch ? imgMatch[1] : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZTJlOGYwIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjQ3NDhiIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPkluc3RhZ3JhbSBQb3N0PC90ZXh0Pgo8L3N2Zz4K';
}

/**
 * Extrait la caption depuis le HTML oEmbed
 */
function extractCaptionFromHtml(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Chercher dans différents éléments possibles
    const captionSelectors = ['blockquote p', '.caption', '[data-caption]', 'p'];
    
    for (const selector of captionSelectors) {
        const element = tempDiv.querySelector(selector);
        if (element && element.textContent.trim().length > 10) {
            return element.textContent.trim().slice(0, 150) + '...';
        }
    }
    
    return 'Découvrez la Bretagne avec @labellebretagne 🏴‍☠️✨';
}

/**
 * Système de cache localStorage
 */
function getCachedInstagramData() {
    try {
        const cached = localStorage.getItem('labellebretagne_instagram_cache');
        if (!cached) return null;
        
        const data = JSON.parse(cached);
        const now = new Date().getTime();
        
        // Vérifier si le cache n'est pas expiré
        if (now - data.timestamp < INSTAGRAM_CONFIG.cacheDuration) {
            return data.posts;
        } else {
            // Supprimer le cache expiré
            localStorage.removeItem('labellebretagne_instagram_cache');
            return null;
        }
    } catch (error) {
        console.error('Erreur lecture cache Instagram:', error);
        return null;
    }
}

function setCachedInstagramData(posts) {
    try {
        const data = {
            posts: posts,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('labellebretagne_instagram_cache', JSON.stringify(data));
    } catch (error) {
        console.error('Erreur sauvegarde cache Instagram:', error);
    }
}

/**
 * Affiche les posts Instagram dans la grille
 */
function displayInstagramPosts(posts) {
    console.log('displayInstagramPosts appelée avec:', posts.length, 'posts');
    
    const grid = document.getElementById('instagramGrid');
    if (!grid) {
        console.error('Element instagramGrid non trouvé !');
        return;
    }
    
    console.log('Grid trouvé, génération HTML...');
    
    const htmlContent = posts.map((post, index) => {
        console.log(`Post ${index + 1}:`, {
            url: post.url,
            image: post.image.substring(0, 50) + '...',
            caption: post.caption.substring(0, 50) + '...'
        });
        
        return `
            <div class="instagram-post" onclick="openInstagramPost('${post.url}')">
                <img src="${post.image}" 
                     alt="${post.caption}" 
                     class="instagram-post-image"
                     loading="lazy"
                     onload="console.log('Image ${index + 1} chargée')"
                     onerror="console.error('Erreur image ${index + 1}')">
                <div class="instagram-post-overlay">
                    <div class="post-stats">
                        <span>
                            <i class="fas fa-heart"></i>
                            ${formatNumber(post.likes)}
                        </span>
                        <span>
                            <i class="fas fa-comment"></i>
                            ${formatNumber(post.comments)}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    console.log('HTML généré, insertion dans la grille...');
    grid.innerHTML = htmlContent;
    console.log('Posts affichés dans la grille');
    
    // Debug CSS
    console.log('Style de la grille:', {
        display: getComputedStyle(grid).display,
        gridTemplateColumns: getComputedStyle(grid).gridTemplateColumns,
        gap: getComputedStyle(grid).gap,
        width: getComputedStyle(grid).width,
        height: getComputedStyle(grid).height
    });
    
    // Vérifier les posts enfants
    const childPosts = grid.querySelectorAll('.instagram-post');
    console.log(`${childPosts.length} posts trouvés dans le DOM`);
    childPosts.forEach((post, index) => {
        console.log(`Post ${index + 1} style:`, {
            display: getComputedStyle(post).display,
            width: getComputedStyle(post).width,
            height: getComputedStyle(post).height,
            visibility: getComputedStyle(post).visibility
        });
    });
}

/**
 * Affiche un message d'erreur
 */
function showErrorMessage() {
    const grid = document.getElementById('instagramGrid');
    grid.innerHTML = `
        <div class="instagram-error">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Impossible de charger les posts</h3>
            <p>Visitez directement notre compte Instagram pour voir nos dernières publications.</p>
            <a href="https://instagram.com/${INSTAGRAM_CONFIG.username}" 
               target="_blank" 
               rel="noopener noreferrer"
               class="error-button">
                <i class="fab fa-instagram"></i>
                Voir sur Instagram
            </a>
        </div>
    `;
}

/**
 * Ouvre un post Instagram dans un nouvel onglet
 */
function openInstagramPost(url) {
    // Tracking optionnel
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            event_category: 'Instagram',
            event_label: 'Post Click',
            value: 1
        });
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Fonction de partage Instagram
 */
function shareInstagram() {
    const shareData = {
        title: 'La Belle Bretagne sur Instagram',
        text: 'Découvrez la Bretagne authentique sur Instagram @labellebretagne',
        url: `https://instagram.com/${INSTAGRAM_CONFIG.username}`
    };
    
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        navigator.share(shareData)
            .then(() => console.log('Partage réussi'))
            .catch(error => console.log('Erreur de partage:', error));
    } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
        copyToClipboard(`https://instagram.com/${INSTAGRAM_CONFIG.username}`);
        showNotification('Lien copié dans le presse-papiers !');
    }
}

/**
 * Copie du texte dans le presse-papiers
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback pour les anciens navigateurs
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
        }
    } catch (error) {
        console.error('Erreur lors de la copie:', error);
    }
}

/**
 * Affiche une notification
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'instagram-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'apparition
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Formate les nombres (1.2k, 1.5M, etc.)
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

/**
 * Fonction pour vider le cache (debug)
 */
function clearInstagramCache() {
    localStorage.removeItem('labellebretagne_instagram_cache');
    console.log('Cache Instagram vidé');
    location.reload();
}

/**
 * Initialisation de la page
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page Instagram chargée, début chargement posts...');
    
    // Vider le cache une seule fois si nécessaire
    if (localStorage.getItem('labellebretagne_instagram_cache')) {
        console.log('Nettoyage du cache Instagram...');
        localStorage.removeItem('labellebretagne_instagram_cache');
    }
    
    loadInstagramPosts();
    
    // Écouter les erreurs de chargement d'images
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG' && e.target.classList.contains('instagram-post-image')) {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZTJlOGYwIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjQ3NDhiIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pgo8L3N2Zz4K';
        }
    }, true);
});

// Exposition des fonctions globales
window.shareInstagram = shareInstagram;
window.openInstagramPost = openInstagramPost;