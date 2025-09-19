// Festival detail page JavaScript
let currentFestival = null;

/**
 * Initialize the festival detail page
 */
document.addEventListener('DOMContentLoaded', function() {
    loadFestivalDetail();
});

/**
 * Load festival details based on URL parameter
 */
async function loadFestivalDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const festivalId = urlParams.get('id');

    // Validation stricte du paramètre festivalId
    if (!festivalId) {
        showError('Festival non spécifié');
        return;
    }

    // Validation de sécurité pour le festivalId
    if (typeof window.Security !== 'undefined' && window.Security.validateInput) {
        if (!window.Security.validateInput(festivalId, {
            maxLength: 100,
            allowedChars: /^[a-z0-9\-_]+$/i,
            required: true
        })) {
            showError('Identifiant de festival invalide');
            return;
        }
    } else {
        // Fallback de validation basique
        if (!/^[a-z0-9\-_]{1,100}$/i.test(festivalId)) {
            showError('Identifiant de festival invalide');
            return;
        }
    }

    try {
        showLoading(true);

        // Load festival data
        const response = await fetch(`data/pois.json?${Date.now()}`);
        const data = await response.json();

        // Find the specific festival
        const festival = data.pois.find(poi =>
            poi.slug === festivalId && poi.categories.includes('festival')
        );

        if (!festival) {
            showError('Festival non trouvé');
            return;
        }

        currentFestival = festival;
        displayFestivalDetail(festival);

    } catch (error) {
        console.error('Erreur lors du chargement du festival:', error);
        showError('Erreur lors du chargement du festival');
    } finally {
        showLoading(false);
    }
}

/**
 * Display festival details in the page
 */
function displayFestivalDetail(festival) {
    // Update page title
    document.title = `${festival.title} - La Belle Bretagne`;

    // Update hero section
    document.getElementById('festivalImage').src = festival.image;
    document.getElementById('festivalImage').alt = festival.title;
    document.getElementById('festivalTitle').textContent = festival.title;

    // Location
    const locationElement = document.getElementById('festivalLocation').querySelector('span');
    locationElement.textContent = festival.address;

    // Dates
    const datesElement = document.getElementById('festivalDates').querySelector('span');
    const dateDisplay = festival.dates !== 'dates à définir' ? festival.dates : 'Dates à venir';
    datesElement.textContent = dateDisplay;

    // Description
    document.getElementById('festivalDescription').textContent = festival.description;

    // Tags
    const tagsContainer = document.getElementById('festivalTags');
    tagsContainer.innerHTML = '';
    festival.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'festival-tag';
        tagElement.textContent = `#${tag}`;
        tagsContainer.appendChild(tagElement);
    });

    // Website link
    const websiteBtn = document.getElementById('festivalWebsite');
    if (festival.website) {
        websiteBtn.href = festival.website;
        websiteBtn.style.display = 'flex';
    } else {
        websiteBtn.style.display = 'none';
    }

    // Map button
    const mapBtn = document.getElementById('festivalMap');
    mapBtn.onclick = () => showOnMap(festival.lat, festival.lng, festival.title);

    // Practical info
    document.getElementById('festivalAddress').textContent = festival.address;
    document.getElementById('festivalDatesFull').textContent = dateDisplay;
    document.getElementById('festivalDepartment').textContent = festival.department;

    // Update header tagline with festival name
    const tagline = document.querySelector('.brand-tagline');
    if (tagline) {
        tagline.textContent = festival.title;
    }
}

/**
 * Show festival location on map
 */
function showOnMap(lat, lng, title) {
    // Store location data for the map page
    localStorage.setItem('mapFocus', JSON.stringify({
        lat: lat,
        lng: lng,
        title: title,
        fromPage: 'festival',
        filterCategory: 'festival'
    }));

    // Navigate to map page
    window.location.href = 'index.html';
}

/**
 * Share festival
 */
function shareFestival() {
    if (!currentFestival) {
        return;
    }

    if (navigator.share) {
        // Use native sharing if available
        navigator.share({
            title: currentFestival.title,
            text: currentFestival.shortDescription,
            url: window.location.href
        }).catch(error => {
            fallbackShare();
        });
    } else {
        // Fallback sharing
        fallbackShare();
    }
}

/**
 * Fallback sharing method
 */
function fallbackShare() {
    if (!currentFestival) {
        return;
    }

    const shareText = `${currentFestival.title} - ${currentFestival.shortDescription}\\n\\n${window.location.href}`;

    // Copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Lien copié dans le presse-papier !');
        }).catch(() => {
            showNotification('Impossible de copier le lien');
        });
    } else {
        // Old browser fallback
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Lien copié dans le presse-papier !');
        } catch (err) {
            showNotification('Impossible de copier le lien');
        }
        document.body.removeChild(textArea);
    }
}

/**
 * Show notification message
 */
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Show loading state
 */
function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }
}

/**
 * Show error message
 */
function showError(message) {
    const main = document.getElementById('festivalMain');
    const errorHTML = `
        <div class="error-container">
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Erreur</h2>
                <p>${message}</p>
                <a href="festivals.html" class="btn-back">
                    <i class="fas fa-arrow-left"></i>
                    Retour aux festivals
                </a>
            </div>
        </div>
    `;

    if (window.Security && window.Security.safeSetInnerHTML) {
        window.Security.safeSetInnerHTML(main, errorHTML);
    } else {
        main.innerHTML = errorHTML;
    }
}