/**
 * SYSTÈME DE TRADUCTIONS MULTILINGUE
 * Contient toutes les traductions pour les 9 langues supportées
 */

const translations = {
    // FRANÇAIS (langue par défaut)
    fr: {
        // Navigation
        'nav.home': 'Accueil',
        'nav.map': 'Carte',
        'nav.accommodations': 'Hébergements',
        'nav.festivals': 'Festivals',
        'nav.blog': 'Blog',
        'nav.instagram': 'Instagram',

        // Logo
        'logo.title': 'La Belle Bretagne',
        'logo.subtitle.home': 'Accueil',
        'logo.subtitle.map': 'Carte',
        'logo.subtitle.accommodations': 'Hébergements',
        'logo.subtitle.festivals': 'Festivals',
        'logo.subtitle.blog': 'Blog',
        'logo.subtitle.instagram': 'Instagram',

        // Page d'accueil
        'home.hero.title': 'Découvrez La Belle Bretagne',
        'home.hero.subtitle': 'Explorez les trésors cachés et les incontournables de Bretagne. Des lieux authentiques, des hébergements de charme et des expériences inoubliables vous attendent.',
        'home.hero.btn.map': 'Explorer la carte',
        'home.hero.btn.accommodations': 'Hébergements',
        'home.services.title': 'Votre guide complet de la Bretagne',
        'home.service1.title': 'Carte Interactive',
        'home.service1.desc': 'Explorez la Bretagne avec notre carte interactive. Découvrez des points d\'intérêt géolocalisés, des hébergements et des événements.',
        'home.service1.btn': 'Découvrir',
        'home.service2.title': 'Hébergements',
        'home.service2.desc': 'Trouvez l\'hébergement parfait : hôtels de charme, gîtes authentiques, campings en bord de mer.',
        'home.service2.btn': 'Réserver',
        'home.service3.title': 'Festivals & Événements',
        'home.service3.desc': 'Ne manquez aucun événement breton : festivals traditionnels, fêtes locales et animations culturelles.',
        'home.service3.btn': 'Voir les événements',

        // Carte
        'map.hero.title': 'Carte Interactive de Bretagne',
        'map.hero.subtitle': 'Explorez tous les lieux incontournables de Bretagne sur notre carte interactive. Filtrez par catégorie, département et découvrez des endroits authentiques à visiter.',
        'map.search.placeholder': '🔍 Rechercher un lieu, une plage, un monument...',
        'map.filters.btn': 'Filtres',
        'map.filters.title': 'Filtres',
        'map.filters.sort': 'Trier par',
        'map.filters.sort.distance': 'Distance',
        'map.filters.sort.recent': 'Récents',
        'map.filters.sort.rating': 'Populaires',
        'map.filters.departments': 'Départements',
        'map.filters.categories': 'Catégories',
        'map.filters.results': 'résultats trouvés',
        'map.filters.apply': 'Appliquer',
        'map.filters.reset': 'Réinitialiser',

        // Hébergements
        'accommodations.hero.title': 'Hébergements en Bretagne',
        'accommodations.hero.subtitle': 'Découvrez notre sélection d\'hébergements de qualité en Bretagne : hôtels de charme, gîtes traditionnels, campings en bord de mer et logements insolites.',

        // Festivals
        'festivals.hero.title': 'Festivals & Événements',
        'festivals.hero.subtitle': 'Découvrez les festivals et événements traditionnels bretons. Musique, danse, culture et festivités tout au long de l\'année.',

        // Blog
        'blog.hero.title': 'Blog de Bretagne',
        'blog.hero.subtitle': 'Découvrez nos articles, guides et conseils pour explorer la Bretagne authentique.',
        'blog.search.placeholder': 'Rechercher un article...',
        'blog.filter.all': 'Tous',
        'blog.filter.discoveries': 'Découvertes',
        'blog.filter.guides': 'Guides',
        'blog.filter.culture': 'Culture',
        'blog.filter.gastronomy': 'Gastronomie',
        'blog.results': 'articles',
        'blog.loadmore': 'Charger plus d\'articles',

        // Instagram
        'instagram.hero.title': 'Notre Instagram',
        'instagram.hero.subtitle': 'Suivez-nous sur Instagram pour découvrir la Bretagne en images.',

        // Footer
        'footer.sitemap': 'Plan du site',
        'footer.information': 'Informations',
        'footer.legal': 'Mentions légales',
        'footer.contact': 'Nous contacter',
        'footer.about': 'Qui sommes-nous',
        'footer.follow': 'Suivez-nous',
        'footer.newsletter': 'Newsletter',
        'footer.newsletter.desc': 'Recevez nos dernières découvertes bretonnes',
        'footer.newsletter.placeholder': 'Votre email',
        'footer.newsletter.btn': 'S\'abonner',
        'footer.copyright': '© 2025 La Belle Bretagne - Guide touristique de Bretagne',
        'footer.made': 'Made with ❤️ en Bretagne',

        // Boutons
        'btn.discover': 'Découvrir',
        'btn.book': 'Réserver',
        'btn.readmore': 'Lire la suite',
        'btn.back': 'Retour',
    },

    // ENGLISH
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.map': 'Map',
        'nav.accommodations': 'Accommodations',
        'nav.festivals': 'Festivals',
        'nav.blog': 'Blog',
        'nav.instagram': 'Instagram',

        // Logo
        'logo.title': 'Beautiful Brittany',
        'logo.subtitle.home': 'Home',
        'logo.subtitle.map': 'Map',
        'logo.subtitle.accommodations': 'Accommodations',
        'logo.subtitle.festivals': 'Festivals',
        'logo.subtitle.blog': 'Blog',
        'logo.subtitle.instagram': 'Instagram',

        // Page d'accueil
        'home.hero.title': 'Discover Beautiful Brittany',
        'home.hero.subtitle': 'Explore the hidden treasures and must-sees of Brittany. Authentic places, charming accommodations and unforgettable experiences await you.',
        'home.hero.btn.map': 'Explore the map',
        'home.hero.btn.accommodations': 'Accommodations',
        'home.services.title': 'Your complete guide to Brittany',
        'home.service1.title': 'Interactive Map',
        'home.service1.desc': 'Explore Brittany with our interactive map. Discover geolocated points of interest, accommodations and events.',
        'home.service1.btn': 'Discover',
        'home.service2.title': 'Accommodations',
        'home.service2.desc': 'Find the perfect accommodation: charming hotels, authentic cottages, seaside campsites.',
        'home.service2.btn': 'Book now',
        'home.service3.title': 'Festivals & Events',
        'home.service3.desc': 'Don\'t miss any Breton event: traditional festivals, local celebrations and cultural activities.',
        'home.service3.btn': 'See events',

        // Carte
        'map.hero.title': 'Interactive Map of Brittany',
        'map.hero.subtitle': 'Explore all the must-see places in Brittany on our interactive map. Filter by category, department and discover authentic places to visit.',
        'map.search.placeholder': '🔍 Search for a place, beach, monument...',
        'map.filters.btn': 'Filters',
        'map.filters.title': 'Filters',
        'map.filters.sort': 'Sort by',
        'map.filters.sort.distance': 'Distance',
        'map.filters.sort.recent': 'Recent',
        'map.filters.sort.rating': 'Popular',
        'map.filters.departments': 'Departments',
        'map.filters.categories': 'Categories',
        'map.filters.results': 'results found',
        'map.filters.apply': 'Apply',
        'map.filters.reset': 'Reset',

        // Hébergements
        'accommodations.hero.title': 'Accommodations in Brittany',
        'accommodations.hero.subtitle': 'Discover our selection of quality accommodations in Brittany: charming hotels, traditional cottages, seaside campsites and unusual lodgings.',

        // Festivals
        'festivals.hero.title': 'Festivals & Events',
        'festivals.hero.subtitle': 'Discover traditional Breton festivals and events. Music, dance, culture and festivities all year round.',

        // Blog
        'blog.hero.title': 'Brittany Blog',
        'blog.hero.subtitle': 'Discover our articles, guides and tips to explore authentic Brittany.',
        'blog.search.placeholder': 'Search for an article...',
        'blog.filter.all': 'All',
        'blog.filter.discoveries': 'Discoveries',
        'blog.filter.guides': 'Guides',
        'blog.filter.culture': 'Culture',
        'blog.filter.gastronomy': 'Gastronomy',
        'blog.results': 'articles',
        'blog.loadmore': 'Load more articles',

        // Instagram
        'instagram.hero.title': 'Our Instagram',
        'instagram.hero.subtitle': 'Follow us on Instagram to discover Brittany in pictures.',

        // Footer
        'footer.sitemap': 'Sitemap',
        'footer.information': 'Information',
        'footer.legal': 'Legal Notice',
        'footer.contact': 'Contact us',
        'footer.about': 'About us',
        'footer.follow': 'Follow us',
        'footer.newsletter': 'Newsletter',
        'footer.newsletter.desc': 'Receive our latest Breton discoveries',
        'footer.newsletter.placeholder': 'Your email',
        'footer.newsletter.btn': 'Subscribe',
        'footer.copyright': '© 2025 Beautiful Brittany - Tourist Guide of Brittany',
        'footer.made': 'Made with ❤️ in Brittany',

        // Boutons
        'btn.discover': 'Discover',
        'btn.book': 'Book',
        'btn.readmore': 'Read more',
        'btn.back': 'Back',
    },

    // DEUTSCH
    de: {
        // Navigation
        'nav.home': 'Startseite',
        'nav.map': 'Karte',
        'nav.accommodations': 'Unterkünfte',
        'nav.festivals': 'Festivals',
        'nav.blog': 'Blog',
        'nav.instagram': 'Instagram',

        // Logo
        'logo.title': 'Schöne Bretagne',
        'logo.subtitle.home': 'Startseite',
        'logo.subtitle.map': 'Karte',
        'logo.subtitle.accommodations': 'Unterkünfte',
        'logo.subtitle.festivals': 'Festivals',
        'logo.subtitle.blog': 'Blog',
        'logo.subtitle.instagram': 'Instagram',

        // Page d'accueil
        'home.hero.title': 'Entdecken Sie die Schöne Bretagne',
        'home.hero.subtitle': 'Erkunden Sie die verborgenen Schätze und Highlights der Bretagne. Authentische Orte, charmante Unterkünfte und unvergessliche Erlebnisse erwarten Sie.',
        'home.hero.btn.map': 'Karte erkunden',
        'home.hero.btn.accommodations': 'Unterkünfte',
        'home.services.title': 'Ihr kompletter Reiseführer für die Bretagne',
        'home.service1.title': 'Interaktive Karte',
        'home.service1.desc': 'Erkunden Sie die Bretagne mit unserer interaktiven Karte. Entdecken Sie georeferenzierte Sehenswürdigkeiten, Unterkünfte und Veranstaltungen.',
        'home.service1.btn': 'Entdecken',
        'home.service2.title': 'Unterkünfte',
        'home.service2.desc': 'Finden Sie die perfekte Unterkunft: charmante Hotels, authentische Ferienhäuser, Campingplätze am Meer.',
        'home.service2.btn': 'Jetzt buchen',
        'home.service3.title': 'Festivals & Veranstaltungen',
        'home.service3.desc': 'Verpassen Sie keine bretonische Veranstaltung: traditionelle Festivals, lokale Feste und kulturelle Aktivitäten.',
        'home.service3.btn': 'Veranstaltungen ansehen',

        // Carte
        'map.hero.title': 'Interaktive Karte der Bretagne',
        'map.hero.subtitle': 'Erkunden Sie alle Sehenswürdigkeiten der Bretagne auf unserer interaktiven Karte. Filtern Sie nach Kategorie, Département und entdecken Sie authentische Orte.',
        'map.search.placeholder': '🔍 Suchen Sie einen Ort, Strand, Denkmal...',
        'map.filters.btn': 'Filter',
        'map.filters.title': 'Filter',
        'map.filters.sort': 'Sortieren nach',
        'map.filters.sort.distance': 'Entfernung',
        'map.filters.sort.recent': 'Neueste',
        'map.filters.sort.rating': 'Beliebt',
        'map.filters.departments': 'Départements',
        'map.filters.categories': 'Kategorien',
        'map.filters.results': 'Ergebnisse gefunden',
        'map.filters.apply': 'Anwenden',
        'map.filters.reset': 'Zurücksetzen',

        // Hébergements
        'accommodations.hero.title': 'Unterkünfte in der Bretagne',
        'accommodations.hero.subtitle': 'Entdecken Sie unsere Auswahl an hochwertigen Unterkünften in der Bretagne: charmante Hotels, traditionelle Ferienhäuser, Campingplätze am Meer und außergewöhnliche Unterkünfte.',

        // Festivals
        'festivals.hero.title': 'Festivals & Veranstaltungen',
        'festivals.hero.subtitle': 'Entdecken Sie traditionelle bretonische Festivals und Veranstaltungen. Musik, Tanz, Kultur und Festlichkeiten das ganze Jahr über.',

        // Blog
        'blog.hero.title': 'Bretagne Blog',
        'blog.hero.subtitle': 'Entdecken Sie unsere Artikel, Reiseführer und Tipps zur Erkundung der authentischen Bretagne.',
        'blog.search.placeholder': 'Artikel suchen...',
        'blog.filter.all': 'Alle',
        'blog.filter.discoveries': 'Entdeckungen',
        'blog.filter.guides': 'Reiseführer',
        'blog.filter.culture': 'Kultur',
        'blog.filter.gastronomy': 'Gastronomie',
        'blog.results': 'Artikel',
        'blog.loadmore': 'Mehr Artikel laden',

        // Instagram
        'instagram.hero.title': 'Unser Instagram',
        'instagram.hero.subtitle': 'Folgen Sie uns auf Instagram, um die Bretagne in Bildern zu entdecken.',

        // Footer
        'footer.sitemap': 'Sitemap',
        'footer.information': 'Informationen',
        'footer.legal': 'Impressum',
        'footer.contact': 'Kontakt',
        'footer.about': 'Über uns',
        'footer.follow': 'Folgen Sie uns',
        'footer.newsletter': 'Newsletter',
        'footer.newsletter.desc': 'Erhalten Sie unsere neuesten bretonischen Entdeckungen',
        'footer.newsletter.placeholder': 'Ihre E-Mail',
        'footer.newsletter.btn': 'Abonnieren',
        'footer.copyright': '© 2025 Schöne Bretagne - Reiseführer für die Bretagne',
        'footer.made': 'Made with ❤️ in der Bretagne',

        // Boutons
        'btn.discover': 'Entdecken',
        'btn.book': 'Buchen',
        'btn.readmore': 'Weiterlesen',
        'btn.back': 'Zurück',
    },

    // ESPAÑOL
    es: {
        // Navigation
        'nav.home': 'Inicio',
        'nav.map': 'Mapa',
        'nav.accommodations': 'Alojamientos',
        'nav.festivals': 'Festivales',
        'nav.blog': 'Blog',
        'nav.instagram': 'Instagram',

        // Logo
        'logo.title': 'Hermosa Bretaña',
        'logo.subtitle.home': 'Inicio',
        'logo.subtitle.map': 'Mapa',
        'logo.subtitle.accommodations': 'Alojamientos',
        'logo.subtitle.festivals': 'Festivales',
        'logo.subtitle.blog': 'Blog',
        'logo.subtitle.instagram': 'Instagram',

        // Page d'accueil
        'home.hero.title': 'Descubre la Hermosa Bretaña',
        'home.hero.subtitle': 'Explora los tesoros escondidos y lugares imprescindibles de Bretaña. Lugares auténticos, alojamientos con encanto y experiencias inolvidables te esperan.',
        'home.hero.btn.map': 'Explorar el mapa',
        'home.hero.btn.accommodations': 'Alojamientos',
        'home.services.title': 'Su guía completa de Bretaña',
        'home.service1.title': 'Mapa Interactivo',
        'home.service1.desc': 'Explora Bretaña con nuestro mapa interactivo. Descubre puntos de interés geolocalizados, alojamientos y eventos.',
        'home.service1.btn': 'Descubrir',
        'home.service2.title': 'Alojamientos',
        'home.service2.desc': 'Encuentra el alojamiento perfecto: hoteles con encanto, casas rurales auténticas, campings junto al mar.',
        'home.service2.btn': 'Reservar ahora',
        'home.service3.title': 'Festivales y Eventos',
        'home.service3.desc': 'No te pierdas ningún evento bretón: festivales tradicionales, fiestas locales y actividades culturales.',
        'home.service3.btn': 'Ver eventos',

        // Carte
        'map.hero.title': 'Mapa Interactivo de Bretaña',
        'map.hero.subtitle': 'Explora todos los lugares imprescindibles de Bretaña en nuestro mapa interactivo. Filtra por categoría, departamento y descubre lugares auténticos para visitar.',
        'map.search.placeholder': '🔍 Buscar un lugar, playa, monumento...',
        'map.filters.btn': 'Filtros',
        'map.filters.title': 'Filtros',
        'map.filters.sort': 'Ordenar por',
        'map.filters.sort.distance': 'Distancia',
        'map.filters.sort.recent': 'Recientes',
        'map.filters.sort.rating': 'Populares',
        'map.filters.departments': 'Departamentos',
        'map.filters.categories': 'Categorías',
        'map.filters.results': 'resultados encontrados',
        'map.filters.apply': 'Aplicar',
        'map.filters.reset': 'Restablecer',

        // Hébergements
        'accommodations.hero.title': 'Alojamientos en Bretaña',
        'accommodations.hero.subtitle': 'Descubre nuestra selección de alojamientos de calidad en Bretaña: hoteles con encanto, casas rurales tradicionales, campings junto al mar y alojamientos insólitos.',

        // Festivals
        'festivals.hero.title': 'Festivales y Eventos',
        'festivals.hero.subtitle': 'Descubre los festivales y eventos tradicionales bretones. Música, danza, cultura y festividades durante todo el año.',

        // Blog
        'blog.hero.title': 'Blog de Bretaña',
        'blog.hero.subtitle': 'Descubre nuestros artículos, guías y consejos para explorar la auténtica Bretaña.',
        'blog.search.placeholder': 'Buscar un artículo...',
        'blog.filter.all': 'Todos',
        'blog.filter.discoveries': 'Descubrimientos',
        'blog.filter.guides': 'Guías',
        'blog.filter.culture': 'Cultura',
        'blog.filter.gastronomy': 'Gastronomía',
        'blog.results': 'artículos',
        'blog.loadmore': 'Cargar más artículos',

        // Instagram
        'instagram.hero.title': 'Nuestro Instagram',
        'instagram.hero.subtitle': 'Síguenos en Instagram para descubrir Bretaña en imágenes.',

        // Footer
        'footer.sitemap': 'Mapa del sitio',
        'footer.information': 'Información',
        'footer.legal': 'Aviso legal',
        'footer.contact': 'Contáctenos',
        'footer.about': 'Sobre nosotros',
        'footer.follow': 'Síguenos',
        'footer.newsletter': 'Boletín',
        'footer.newsletter.desc': 'Recibe nuestros últimos descubrimientos bretones',
        'footer.newsletter.placeholder': 'Tu correo electrónico',
        'footer.newsletter.btn': 'Suscribirse',
        'footer.copyright': '© 2025 Hermosa Bretaña - Guía turística de Bretaña',
        'footer.made': 'Hecho con ❤️ en Bretaña',

        // Boutons
        'btn.discover': 'Descubrir',
        'btn.book': 'Reservar',
        'btn.readmore': 'Leer más',
        'btn.back': 'Volver',
    },

    // ITALIANO
    it: {
        // Navigation
        'nav.home': 'Home',
        'nav.map': 'Mappa',
        'nav.accommodations': 'Alloggi',
        'nav.festivals': 'Festival',
        'nav.blog': 'Blog',
        'nav.instagram': 'Instagram',

        // Logo
        'logo.title': 'Bella Bretagna',
        'logo.subtitle.home': 'Home',
        'logo.subtitle.map': 'Mappa',
        'logo.subtitle.accommodations': 'Alloggi',
        'logo.subtitle.festivals': 'Festival',
        'logo.subtitle.blog': 'Blog',
        'logo.subtitle.instagram': 'Instagram',

        // Page d'accueil
        'home.hero.title': 'Scopri la Bella Bretagna',
        'home.hero.subtitle': 'Esplora i tesori nascosti e i luoghi imperdibili della Bretagna. Luoghi autentici, alloggi di charme e esperienze indimenticabili ti aspettano.',
        'home.hero.btn.map': 'Esplora la mappa',
        'home.hero.btn.accommodations': 'Alloggi',
        'home.services.title': 'La tua guida completa della Bretagna',
        'home.service1.title': 'Mappa Interattiva',
        'home.service1.desc': 'Esplora la Bretagna con la nostra mappa interattiva. Scopri punti di interesse geolocalizzati, alloggi ed eventi.',
        'home.service1.btn': 'Scopri',
        'home.service2.title': 'Alloggi',
        'home.service2.desc': 'Trova l\'alloggio perfetto: hotel di charme, case autentiche, campeggi in riva al mare.',
        'home.service2.btn': 'Prenota ora',
        'home.service3.title': 'Festival ed Eventi',
        'home.service3.desc': 'Non perdere nessun evento bretone: festival tradizionali, feste locali e attività culturali.',
        'home.service3.btn': 'Vedi eventi',

        // Carte
        'map.hero.title': 'Mappa Interattiva della Bretagna',
        'map.hero.subtitle': 'Esplora tutti i luoghi imperdibili della Bretagna sulla nostra mappa interattiva. Filtra per categoria, dipartimento e scopri luoghi autentici da visitare.',
        'map.search.placeholder': '🔍 Cerca un luogo, spiaggia, monumento...',
        'map.filters.btn': 'Filtri',
        'map.filters.title': 'Filtri',
        'map.filters.sort': 'Ordina per',
        'map.filters.sort.distance': 'Distanza',
        'map.filters.sort.recent': 'Recenti',
        'map.filters.sort.rating': 'Popolari',
        'map.filters.departments': 'Dipartimenti',
        'map.filters.categories': 'Categorie',
        'map.filters.results': 'risultati trovati',
        'map.filters.apply': 'Applica',
        'map.filters.reset': 'Ripristina',

        // Hébergements
        'accommodations.hero.title': 'Alloggi in Bretagna',
        'accommodations.hero.subtitle': 'Scopri la nostra selezione di alloggi di qualità in Bretagna: hotel di charme, case tradizionali, campeggi in riva al mare e alloggi insoliti.',

        // Festivals
        'festivals.hero.title': 'Festival ed Eventi',
        'festivals.hero.subtitle': 'Scopri i festival e gli eventi tradizionali bretoni. Musica, danza, cultura e festività tutto l\'anno.',

        // Blog
        'blog.hero.title': 'Blog della Bretagna',
        'blog.hero.subtitle': 'Scopri i nostri articoli, guide e consigli per esplorare l\'autentica Bretagna.',
        'blog.search.placeholder': 'Cerca un articolo...',
        'blog.filter.all': 'Tutti',
        'blog.filter.discoveries': 'Scoperte',
        'blog.filter.guides': 'Guide',
        'blog.filter.culture': 'Cultura',
        'blog.filter.gastronomy': 'Gastronomia',
        'blog.results': 'articoli',
        'blog.loadmore': 'Carica altri articoli',

        // Instagram
        'instagram.hero.title': 'Il nostro Instagram',
        'instagram.hero.subtitle': 'Seguici su Instagram per scoprire la Bretagna in immagini.',

        // Footer
        'footer.sitemap': 'Mappa del sito',
        'footer.information': 'Informazioni',
        'footer.legal': 'Note legali',
        'footer.contact': 'Contattaci',
        'footer.about': 'Chi siamo',
        'footer.follow': 'Seguici',
        'footer.newsletter': 'Newsletter',
        'footer.newsletter.desc': 'Ricevi le nostre ultime scoperte bretoni',
        'footer.newsletter.placeholder': 'La tua email',
        'footer.newsletter.btn': 'Iscriviti',
        'footer.copyright': '© 2025 Bella Bretagna - Guida turistica della Bretagna',
        'footer.made': 'Fatto con ❤️ in Bretagna',

        // Boutons
        'btn.discover': 'Scopri',
        'btn.book': 'Prenota',
        'btn.readmore': 'Leggi di più',
        'btn.back': 'Indietro',
    },

    // NEDERLANDS
    nl: {
        // Navigation
        'nav.home': 'Home',
        'nav.map': 'Kaart',
        'nav.accommodations': 'Accommodaties',
        'nav.festivals': 'Festivals',
        'nav.blog': 'Blog',
        'nav.instagram': 'Instagram',

        // Logo
        'logo.title': 'Mooi Bretagne',
        'logo.subtitle.home': 'Home',
        'logo.subtitle.map': 'Kaart',
        'logo.subtitle.accommodations': 'Accommodaties',
        'logo.subtitle.festivals': 'Festivals',
        'logo.subtitle.blog': 'Blog',
        'logo.subtitle.instagram': 'Instagram',

        // Page d'accueil
        'home.hero.title': 'Ontdek Mooi Bretagne',
        'home.hero.subtitle': 'Verken de verborgen schatten en hoogtepunten van Bretagne. Authentieke plaatsen, charmante accommodaties en onvergetelijke ervaringen wachten op u.',
        'home.hero.btn.map': 'Verken de kaart',
        'home.hero.btn.accommodations': 'Accommodaties',
        'home.services.title': 'Uw complete gids voor Bretagne',
        'home.service1.title': 'Interactieve Kaart',
        'home.service1.desc': 'Verken Bretagne met onze interactieve kaart. Ontdek geografisch gelokaliseerde bezienswaardigheden, accommodaties en evenementen.',
        'home.service1.btn': 'Ontdekken',
        'home.service2.title': 'Accommodaties',
        'home.service2.desc': 'Vind de perfecte accommodatie: charmante hotels, authentieke vakantiehuizen, campings aan zee.',
        'home.service2.btn': 'Nu boeken',
        'home.service3.title': 'Festivals & Evenementen',
        'home.service3.desc': 'Mis geen enkel Bretons evenement: traditionele festivals, lokale feesten en culturele activiteiten.',
        'home.service3.btn': 'Bekijk evenementen',

        // Carte
        'map.hero.title': 'Interactieve Kaart van Bretagne',
        'map.hero.subtitle': 'Verken alle hoogtepunten van Bretagne op onze interactieve kaart. Filter op categorie, departement en ontdek authentieke plaatsen om te bezoeken.',
        'map.search.placeholder': '🔍 Zoek een plaats, strand, monument...',
        'map.filters.btn': 'Filters',
        'map.filters.title': 'Filters',
        'map.filters.sort': 'Sorteren op',
        'map.filters.sort.distance': 'Afstand',
        'map.filters.sort.recent': 'Recent',
        'map.filters.sort.rating': 'Populair',
        'map.filters.departments': 'Departementen',
        'map.filters.categories': 'Categorieën',
        'map.filters.results': 'resultaten gevonden',
        'map.filters.apply': 'Toepassen',
        'map.filters.reset': 'Resetten',

        // Hébergements
        'accommodations.hero.title': 'Accommodaties in Bretagne',
        'accommodations.hero.subtitle': 'Ontdek onze selectie van kwaliteitsaccommodaties in Bretagne: charmante hotels, traditionele vakantiehuizen, campings aan zee en bijzondere accommodaties.',

        // Festivals
        'festivals.hero.title': 'Festivals & Evenementen',
        'festivals.hero.subtitle': 'Ontdek traditionele Bretonse festivals en evenementen. Muziek, dans, cultuur en festiviteiten het hele jaar door.',

        // Blog
        'blog.hero.title': 'Bretagne Blog',
        'blog.hero.subtitle': 'Ontdek onze artikelen, gidsen en tips om authentiek Bretagne te verkennen.',
        'blog.search.placeholder': 'Zoek een artikel...',
        'blog.filter.all': 'Alle',
        'blog.filter.discoveries': 'Ontdekkingen',
        'blog.filter.guides': 'Gidsen',
        'blog.filter.culture': 'Cultuur',
        'blog.filter.gastronomy': 'Gastronomie',
        'blog.results': 'artikelen',
        'blog.loadmore': 'Meer artikelen laden',

        // Instagram
        'instagram.hero.title': 'Onze Instagram',
        'instagram.hero.subtitle': 'Volg ons op Instagram om Bretagne in beelden te ontdekken.',

        // Footer
        'footer.sitemap': 'Sitemap',
        'footer.information': 'Informatie',
        'footer.legal': 'Juridische kennisgeving',
        'footer.contact': 'Neem contact op',
        'footer.about': 'Over ons',
        'footer.follow': 'Volg ons',
        'footer.newsletter': 'Nieuwsbrief',
        'footer.newsletter.desc': 'Ontvang onze laatste Bretonse ontdekkingen',
        'footer.newsletter.placeholder': 'Uw e-mail',
        'footer.newsletter.btn': 'Abonneren',
        'footer.copyright': '© 2025 Mooi Bretagne - Toeristische gids van Bretagne',
        'footer.made': 'Gemaakt met ❤️ in Bretagne',

        // Boutons
        'btn.discover': 'Ontdekken',
        'btn.book': 'Boeken',
        'btn.readmore': 'Lees meer',
        'btn.back': 'Terug',
    },

    // PORTUGUÊS
    pt: {
        // Navigation
        'nav.home': 'Início',
        'nav.map': 'Mapa',
        'nav.accommodations': 'Alojamentos',
        'nav.festivals': 'Festivais',
        'nav.blog': 'Blog',
        'nav.instagram': 'Instagram',

        // Logo
        'logo.title': 'Bela Bretanha',
        'logo.subtitle.home': 'Início',
        'logo.subtitle.map': 'Mapa',
        'logo.subtitle.accommodations': 'Alojamentos',
        'logo.subtitle.festivals': 'Festivais',
        'logo.subtitle.blog': 'Blog',
        'logo.subtitle.instagram': 'Instagram',

        // Page d'accueil
        'home.hero.title': 'Descubra a Bela Bretanha',
        'home.hero.subtitle': 'Explore os tesouros escondidos e os locais imperdíveis da Bretanha. Lugares autênticos, alojamentos encantadores e experiências inesquecíveis esperam por si.',
        'home.hero.btn.map': 'Explorar o mapa',
        'home.hero.btn.accommodations': 'Alojamentos',
        'home.services.title': 'O seu guia completo da Bretanha',
        'home.service1.title': 'Mapa Interativo',
        'home.service1.desc': 'Explore a Bretanha com o nosso mapa interativo. Descubra pontos de interesse geolocalizados, alojamentos e eventos.',
        'home.service1.btn': 'Descobrir',
        'home.service2.title': 'Alojamentos',
        'home.service2.desc': 'Encontre o alojamento perfeito: hotéis de charme, casas autênticas, parques de campismo à beira-mar.',
        'home.service2.btn': 'Reservar agora',
        'home.service3.title': 'Festivais e Eventos',
        'home.service3.desc': 'Não perca nenhum evento bretão: festivais tradicionais, festas locais e atividades culturais.',
        'home.service3.btn': 'Ver eventos',

        // Carte
        'map.hero.title': 'Mapa Interativo da Bretanha',
        'map.hero.subtitle': 'Explore todos os locais imperdíveis da Bretanha no nosso mapa interativo. Filtre por categoria, departamento e descubra lugares autênticos para visitar.',
        'map.search.placeholder': '🔍 Procurar um local, praia, monumento...',
        'map.filters.btn': 'Filtros',
        'map.filters.title': 'Filtros',
        'map.filters.sort': 'Ordenar por',
        'map.filters.sort.distance': 'Distância',
        'map.filters.sort.recent': 'Recentes',
        'map.filters.sort.rating': 'Populares',
        'map.filters.departments': 'Departamentos',
        'map.filters.categories': 'Categorias',
        'map.filters.results': 'resultados encontrados',
        'map.filters.apply': 'Aplicar',
        'map.filters.reset': 'Repor',

        // Hébergements
        'accommodations.hero.title': 'Alojamentos na Bretanha',
        'accommodations.hero.subtitle': 'Descubra a nossa seleção de alojamentos de qualidade na Bretanha: hotéis de charme, casas tradicionais, parques de campismo à beira-mar e alojamentos incomuns.',

        // Festivals
        'festivals.hero.title': 'Festivais e Eventos',
        'festivals.hero.subtitle': 'Descubra festivais e eventos tradicionais bretões. Música, dança, cultura e festividades durante todo o ano.',

        // Blog
        'blog.hero.title': 'Blog da Bretanha',
        'blog.hero.subtitle': 'Descubra os nossos artigos, guias e dicas para explorar a autêntica Bretanha.',
        'blog.search.placeholder': 'Procurar um artigo...',
        'blog.filter.all': 'Todos',
        'blog.filter.discoveries': 'Descobertas',
        'blog.filter.guides': 'Guias',
        'blog.filter.culture': 'Cultura',
        'blog.filter.gastronomy': 'Gastronomia',
        'blog.results': 'artigos',
        'blog.loadmore': 'Carregar mais artigos',

        // Instagram
        'instagram.hero.title': 'O nosso Instagram',
        'instagram.hero.subtitle': 'Siga-nos no Instagram para descobrir a Bretanha em imagens.',

        // Footer
        'footer.sitemap': 'Mapa do site',
        'footer.information': 'Informações',
        'footer.legal': 'Aviso legal',
        'footer.contact': 'Contacte-nos',
        'footer.about': 'Sobre nós',
        'footer.follow': 'Siga-nos',
        'footer.newsletter': 'Newsletter',
        'footer.newsletter.desc': 'Receba as nossas últimas descobertas bretãs',
        'footer.newsletter.placeholder': 'O seu email',
        'footer.newsletter.btn': 'Subscrever',
        'footer.copyright': '© 2025 Bela Bretanha - Guia turístico da Bretanha',
        'footer.made': 'Feito com ❤️ na Bretanha',

        // Boutons
        'btn.discover': 'Descobrir',
        'btn.book': 'Reservar',
        'btn.readmore': 'Ler mais',
        'btn.back': 'Voltar',
    },

    // 中文 (CHINESE)
    zh: {
        // Navigation
        'nav.home': '首页',
        'nav.map': '地图',
        'nav.accommodations': '住宿',
        'nav.festivals': '节日',
        'nav.blog': '博客',
        'nav.instagram': 'Instagram',

        // Logo
        'logo.title': '美丽的布列塔尼',
        'logo.subtitle.home': '首页',
        'logo.subtitle.map': '地图',
        'logo.subtitle.accommodations': '住宿',
        'logo.subtitle.festivals': '节日',
        'logo.subtitle.blog': '博客',
        'logo.subtitle.instagram': 'Instagram',

        // Page d'accueil
        'home.hero.title': '探索美丽的布列塔尼',
        'home.hero.subtitle': '探索布列塔尼的隐藏宝藏和必游景点。正宗的地方、迷人的住宿和难忘的体验等待着您。',
        'home.hero.btn.map': '探索地图',
        'home.hero.btn.accommodations': '住宿',
        'home.services.title': '您的布列塔尼完整指南',
        'home.service1.title': '互动地图',
        'home.service1.desc': '通过我们的互动地图探索布列塔尼。发现地理定位的景点、住宿和活动。',
        'home.service1.btn': '发现',
        'home.service2.title': '住宿',
        'home.service2.desc': '找到完美的住宿：迷人的酒店、正宗的小屋、海边露营地。',
        'home.service2.btn': '立即预订',
        'home.service3.title': '节日和活动',
        'home.service3.desc': '不要错过任何布列塔尼活动：传统节日、当地庆祝活动和文化活动。',
        'home.service3.btn': '查看活动',

        // Carte
        'map.hero.title': '布列塔尼互动地图',
        'map.hero.subtitle': '在我们的互动地图上探索布列塔尼的所有必游景点。按类别、部门筛选，发现值得参观的正宗地方。',
        'map.search.placeholder': '🔍 搜索地点、海滩、纪念碑...',
        'map.filters.btn': '筛选',
        'map.filters.title': '筛选',
        'map.filters.sort': '排序方式',
        'map.filters.sort.distance': '距离',
        'map.filters.sort.recent': '最近',
        'map.filters.sort.rating': '热门',
        'map.filters.departments': '部门',
        'map.filters.categories': '类别',
        'map.filters.results': '找到结果',
        'map.filters.apply': '应用',
        'map.filters.reset': '重置',

        // Hébergements
        'accommodations.hero.title': '布列塔尼住宿',
        'accommodations.hero.subtitle': '发现我们在布列塔尼的优质住宿选择：迷人的酒店、传统小屋、海边露营地和独特的住宿。',

        // Festivals
        'festivals.hero.title': '节日和活动',
        'festivals.hero.subtitle': '发现传统的布列塔尼节日和活动。全年音乐、舞蹈、文化和庆祝活动。',

        // Blog
        'blog.hero.title': '布列塔尼博客',
        'blog.hero.subtitle': '发现我们的文章、指南和探索正宗布列塔尼的技巧。',
        'blog.search.placeholder': '搜索文章...',
        'blog.filter.all': '全部',
        'blog.filter.discoveries': '发现',
        'blog.filter.guides': '指南',
        'blog.filter.culture': '文化',
        'blog.filter.gastronomy': '美食',
        'blog.results': '文章',
        'blog.loadmore': '加载更多文章',

        // Instagram
        'instagram.hero.title': '我们的Instagram',
        'instagram.hero.subtitle': '在Instagram上关注我们，通过图片发现布列塔尼。',

        // Footer
        'footer.sitemap': '网站地图',
        'footer.information': '信息',
        'footer.legal': '法律声明',
        'footer.contact': '联系我们',
        'footer.about': '关于我们',
        'footer.follow': '关注我们',
        'footer.newsletter': '通讯',
        'footer.newsletter.desc': '接收我们最新的布列塔尼发现',
        'footer.newsletter.placeholder': '您的电子邮件',
        'footer.newsletter.btn': '订阅',
        'footer.copyright': '© 2025 美丽的布列塔尼 - 布列塔尼旅游指南',
        'footer.made': '在布列塔尼用 ❤️ 制作',

        // Boutons
        'btn.discover': '发现',
        'btn.book': '预订',
        'btn.readmore': '阅读更多',
        'btn.back': '返回',
    },

    // 日本語 (JAPANESE)
    ja: {
        // Navigation
        'nav.home': 'ホーム',
        'nav.map': '地図',
        'nav.accommodations': '宿泊施設',
        'nav.festivals': 'フェスティバル',
        'nav.blog': 'ブログ',
        'nav.instagram': 'Instagram',

        // Logo
        'logo.title': '美しいブルターニュ',
        'logo.subtitle.home': 'ホーム',
        'logo.subtitle.map': '地図',
        'logo.subtitle.accommodations': '宿泊施設',
        'logo.subtitle.festivals': 'フェスティバル',
        'logo.subtitle.blog': 'ブログ',
        'logo.subtitle.instagram': 'Instagram',

        // Page d'accueil
        'home.hero.title': '美しいブルターニュを発見',
        'home.hero.subtitle': 'ブルターニュの隠れた宝物と必見スポットを探索してください。本格的な場所、魅力的な宿泊施設、忘れられない体験があなたを待っています。',
        'home.hero.btn.map': '地図を探索',
        'home.hero.btn.accommodations': '宿泊施設',
        'home.services.title': 'ブルターニュの完全ガイド',
        'home.service1.title': 'インタラクティブマップ',
        'home.service1.desc': 'インタラクティブマップでブルターニュを探索。地理的に位置する観光スポット、宿泊施設、イベントを発見。',
        'home.service1.btn': '発見',
        'home.service2.title': '宿泊施設',
        'home.service2.desc': '完璧な宿泊施設を見つける：魅力的なホテル、本格的なコテージ、海辺のキャンプ場。',
        'home.service2.btn': '今すぐ予約',
        'home.service3.title': 'フェスティバル＆イベント',
        'home.service3.desc': 'ブルトンのイベントをお見逃しなく：伝統的なフェスティバル、地元のお祝い、文化活動。',
        'home.service3.btn': 'イベントを見る',

        // Carte
        'map.hero.title': 'ブルターニュのインタラクティブマップ',
        'map.hero.subtitle': 'インタラクティブマップでブルターニュのすべての必見スポットを探索。カテゴリー、県でフィルタリングし、訪れるべき本格的な場所を発見。',
        'map.search.placeholder': '🔍 場所、ビーチ、記念碑を検索...',
        'map.filters.btn': 'フィルター',
        'map.filters.title': 'フィルター',
        'map.filters.sort': '並べ替え',
        'map.filters.sort.distance': '距離',
        'map.filters.sort.recent': '最近',
        'map.filters.sort.rating': '人気',
        'map.filters.departments': '県',
        'map.filters.categories': 'カテゴリー',
        'map.filters.results': '件の結果',
        'map.filters.apply': '適用',
        'map.filters.reset': 'リセット',

        // Hébergements
        'accommodations.hero.title': 'ブルターニュの宿泊施設',
        'accommodations.hero.subtitle': 'ブルターニュの高品質な宿泊施設の選択を発見：魅力的なホテル、伝統的なコテージ、海辺のキャンプ場、ユニークな宿泊施設。',

        // Festivals
        'festivals.hero.title': 'フェスティバル＆イベント',
        'festivals.hero.subtitle': '伝統的なブルトンのフェスティバルとイベントを発見。一年中音楽、ダンス、文化、お祝い。',

        // Blog
        'blog.hero.title': 'ブルターニュブログ',
        'blog.hero.subtitle': '本格的なブルターニュを探索するための記事、ガイド、ヒントを発見。',
        'blog.search.placeholder': '記事を検索...',
        'blog.filter.all': 'すべて',
        'blog.filter.discoveries': '発見',
        'blog.filter.guides': 'ガイド',
        'blog.filter.culture': '文化',
        'blog.filter.gastronomy': '美食',
        'blog.results': '記事',
        'blog.loadmore': 'もっと記事を読み込む',

        // Instagram
        'instagram.hero.title': '私たちのInstagram',
        'instagram.hero.subtitle': 'Instagramで私たちをフォローして、写真でブルターニュを発見してください。',

        // Footer
        'footer.sitemap': 'サイトマップ',
        'footer.information': '情報',
        'footer.legal': '法的通知',
        'footer.contact': 'お問い合わせ',
        'footer.about': '私たちについて',
        'footer.follow': 'フォローする',
        'footer.newsletter': 'ニュースレター',
        'footer.newsletter.desc': '最新のブルトンの発見を受け取る',
        'footer.newsletter.placeholder': 'メールアドレス',
        'footer.newsletter.btn': '購読',
        'footer.copyright': '© 2025 美しいブルターニュ - ブルターニュ観光ガイド',
        'footer.made': 'ブルターニュで ❤️ を込めて作成',

        // Boutons
        'btn.discover': '発見',
        'btn.book': '予約',
        'btn.readmore': '続きを読む',
        'btn.back': '戻る',
    }
};

/**
 * Applique les traductions à la page selon la langue sélectionnée
 */
function applyTranslations() {
    const currentLang = getCurrentLanguage();
    const langTranslations = translations[currentLang] || translations.fr;

    // Traduire tous les éléments avec data-translate
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (langTranslations[key]) {
            element.textContent = langTranslations[key];
        }
    });

    // Traduire les placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (langTranslations[key]) {
            element.placeholder = langTranslations[key];
        }
    });

    console.log('✅ Traductions appliquées:', currentLang);
}

// Appliquer les traductions au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTranslations);
} else {
    applyTranslations();
}

// Rendre les fonctions accessibles globalement
window.applyTranslations = applyTranslations;
window.translations = translations;
