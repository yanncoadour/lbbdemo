/**
 * SYSTÈME DE TRADUCTION MULTILINGUE
 * Fichier contenant toutes les traductions pour le site La Belle Bretagne
 *
 * Langues supportées :
 * - FR (Français)
 * - EN (English)
 * - DE (Deutsch)
 * - ES (Español)
 * - IT (Italiano)
 * - NL (Nederlands)
 * - PT (Português)
 * - ZH (中文)
 * - JA (日本語)
 */

const translations = {
    // ========================================
    // NAVIGATION & HEADER
    // ========================================
    nav: {
        home: {
            fr: 'Accueil',
            en: 'Home',
            de: 'Startseite',
            es: 'Inicio',
            it: 'Home',
            nl: 'Home',
            pt: 'Início',
            zh: '首页',
            ja: 'ホーム'
        },
        map: {
            fr: 'Carte',
            en: 'Map',
            de: 'Karte',
            es: 'Mapa',
            it: 'Mappa',
            nl: 'Kaart',
            pt: 'Mapa',
            zh: '地图',
            ja: '地図'
        },
        accommodations: {
            fr: 'Hébergements',
            en: 'Accommodations',
            de: 'Unterkünfte',
            es: 'Alojamientos',
            it: 'Alloggi',
            nl: 'Accommodaties',
            pt: 'Alojamentos',
            zh: '住宿',
            ja: '宿泊施設'
        },
        festivals: {
            fr: 'Festivals',
            en: 'Festivals',
            de: 'Festivals',
            es: 'Festivales',
            it: 'Festival',
            nl: 'Festivals',
            pt: 'Festivais',
            zh: '节日',
            ja: 'フェスティバル'
        },
        blog: {
            fr: 'Blog',
            en: 'Blog',
            de: 'Blog',
            es: 'Blog',
            it: 'Blog',
            nl: 'Blog',
            pt: 'Blog',
            zh: '博客',
            ja: 'ブログ'
        },
        instagram: {
            fr: 'Instagram',
            en: 'Instagram',
            de: 'Instagram',
            es: 'Instagram',
            it: 'Instagram',
            nl: 'Instagram',
            pt: 'Instagram',
            zh: 'Instagram',
            ja: 'Instagram'
        }
    },

    // ========================================
    // INTERFACE DE RECHERCHE
    // ========================================
    search: {
        placeholder: {
            fr: 'Rechercher un lieu, une ville...',
            en: 'Search for a place, a city...',
            de: 'Suchen Sie einen Ort, eine Stadt...',
            es: 'Buscar un lugar, una ciudad...',
            it: 'Cerca un luogo, una città...',
            nl: 'Zoek naar een plaats, een stad...',
            pt: 'Procurar um lugar, uma cidade...',
            zh: '搜索地点、城市...',
            ja: '場所、都市を検索...'
        },
        searchBtn: {
            fr: 'Rechercher',
            en: 'Search',
            de: 'Suchen',
            es: 'Buscar',
            it: 'Cerca',
            nl: 'Zoeken',
            pt: 'Procurar',
            zh: '搜索',
            ja: '検索'
        },
        myLocation: {
            fr: 'Ma position',
            en: 'My location',
            de: 'Mein Standort',
            es: 'Mi ubicación',
            it: 'La mia posizione',
            nl: 'Mijn locatie',
            pt: 'Minha localização',
            zh: '我的位置',
            ja: '現在地'
        },
        filters: {
            fr: 'Filtres',
            en: 'Filters',
            de: 'Filter',
            es: 'Filtros',
            it: 'Filtri',
            nl: 'Filters',
            pt: 'Filtros',
            zh: '过滤器',
            ja: 'フィルター'
        }
    },

    // ========================================
    // CATÉGORIES DE POI
    // ========================================
    categories: {
        monument: {
            fr: 'Monument',
            en: 'Monument',
            de: 'Denkmal',
            es: 'Monumento',
            it: 'Monumento',
            nl: 'Monument',
            pt: 'Monumento',
            zh: '纪念碑',
            ja: '記念碑'
        },
        museum: {
            fr: 'Musée',
            en: 'Museum',
            de: 'Museum',
            es: 'Museo',
            it: 'Museo',
            nl: 'Museum',
            pt: 'Museu',
            zh: '博物馆',
            ja: '博物館'
        },
        beach: {
            fr: 'Plage',
            en: 'Beach',
            de: 'Strand',
            es: 'Playa',
            it: 'Spiaggia',
            nl: 'Strand',
            pt: 'Praia',
            zh: '海滩',
            ja: 'ビーチ'
        },
        village: {
            fr: 'Village',
            en: 'Village',
            de: 'Dorf',
            es: 'Pueblo',
            it: 'Villaggio',
            nl: 'Dorp',
            pt: 'Vila',
            zh: '村庄',
            ja: '村'
        },
        castle: {
            fr: 'Château',
            en: 'Castle',
            de: 'Schloss',
            es: 'Castillo',
            it: 'Castello',
            nl: 'Kasteel',
            pt: 'Castelo',
            zh: '城堡',
            ja: '城'
        },
        festival: {
            fr: 'Festival',
            en: 'Festival',
            de: 'Festival',
            es: 'Festival',
            it: 'Festival',
            nl: 'Festival',
            pt: 'Festival',
            zh: '节日',
            ja: 'フェスティバル'
        },
        leisure: {
            fr: 'Loisirs',
            en: 'Leisure',
            de: 'Freizeit',
            es: 'Ocio',
            it: 'Svago',
            nl: 'Vrije tijd',
            pt: 'Lazer',
            zh: '休闲',
            ja: 'レジャー'
        },
        hotel: {
            fr: 'Hôtel',
            en: 'Hotel',
            de: 'Hotel',
            es: 'Hotel',
            it: 'Hotel',
            nl: 'Hotel',
            pt: 'Hotel',
            zh: '酒店',
            ja: 'ホテル'
        },
        unusualAccommodation: {
            fr: 'Logement Insolite',
            en: 'Unusual Accommodation',
            de: 'Außergewöhnliche Unterkunft',
            es: 'Alojamiento Insólito',
            it: 'Alloggio Insolito',
            nl: 'Bijzondere Accommodatie',
            pt: 'Alojamento Insólito',
            zh: '独特住宿',
            ja: 'ユニークな宿泊施設'
        },
        camping: {
            fr: 'Camping',
            en: 'Camping',
            de: 'Camping',
            es: 'Camping',
            it: 'Campeggio',
            nl: 'Camping',
            pt: 'Campismo',
            zh: '露营',
            ja: 'キャンプ'
        },
        panorama: {
            fr: 'Panorama',
            en: 'Panorama',
            de: 'Panorama',
            es: 'Panorama',
            it: 'Panorama',
            nl: 'Panorama',
            pt: 'Panorama',
            zh: '全景',
            ja: 'パノラマ'
        },
        hiking: {
            fr: 'Randonnée',
            en: 'Hiking',
            de: 'Wandern',
            es: 'Senderismo',
            it: 'Escursionismo',
            nl: 'Wandelen',
            pt: 'Caminhada',
            zh: '徒步',
            ja: 'ハイキング'
        }
    },

    // ========================================
    // BOUTONS & ACTIONS
    // ========================================
    buttons: {
        discoverMore: {
            fr: 'En savoir plus',
            en: 'Learn more',
            de: 'Mehr erfahren',
            es: 'Saber más',
            it: 'Scopri di più',
            nl: 'Meer weten',
            pt: 'Saber mais',
            zh: '了解更多',
            ja: '詳しく見る'
        },
        discover: {
            fr: 'Découvrir',
            en: 'Discover',
            de: 'Entdecken',
            es: 'Descubrir',
            it: 'Scoprire',
            nl: 'Ontdekken',
            pt: 'Descobrir',
            zh: '发现',
            ja: '発見する'
        },
        book: {
            fr: 'Réserver',
            en: 'Book',
            de: 'Buchen',
            es: 'Reservar',
            it: 'Prenota',
            nl: 'Boeken',
            pt: 'Reservar',
            zh: '预订',
            ja: '予約する'
        },
        booking: {
            fr: 'Réservation',
            en: 'Booking',
            de: 'Buchung',
            es: 'Reservación',
            it: 'Prenotazione',
            nl: 'Boeking',
            pt: 'Reserva',
            zh: '预订',
            ja: '予約'
        },
        close: {
            fr: 'Fermer',
            en: 'Close',
            de: 'Schließen',
            es: 'Cerrar',
            it: 'Chiudi',
            nl: 'Sluiten',
            pt: 'Fechar',
            zh: '关闭',
            ja: '閉じる'
        },
        seeAll: {
            fr: 'Voir tout',
            en: 'See all',
            de: 'Alle ansehen',
            es: 'Ver todo',
            it: 'Vedi tutto',
            nl: 'Alles bekijken',
            pt: 'Ver tudo',
            zh: '查看全部',
            ja: 'すべて見る'
        }
    },

    // ========================================
    // MESSAGES & NOTIFICATIONS
    // ========================================
    messages: {
        tested: {
            fr: 'Testé par La Belle Bretagne',
            en: 'Tested by La Belle Bretagne',
            de: 'Getestet von La Belle Bretagne',
            es: 'Probado por La Belle Bretagne',
            it: 'Testato da La Belle Bretagne',
            nl: 'Getest door La Belle Bretagne',
            pt: 'Testado por La Belle Bretagne',
            zh: 'La Belle Bretagne 测试',
            ja: 'La Belle Bretagneがテスト済み'
        },
        noResults: {
            fr: 'Aucun résultat trouvé',
            en: 'No results found',
            de: 'Keine Ergebnisse gefunden',
            es: 'No se encontraron resultados',
            it: 'Nessun risultato trovato',
            nl: 'Geen resultaten gevonden',
            pt: 'Nenhum resultado encontrado',
            zh: '未找到结果',
            ja: '結果が見つかりません'
        },
        loading: {
            fr: 'Chargement...',
            en: 'Loading...',
            de: 'Wird geladen...',
            es: 'Cargando...',
            it: 'Caricamento...',
            nl: 'Laden...',
            pt: 'Carregando...',
            zh: '加载中...',
            ja: '読み込み中...'
        }
    },

    // ========================================
    // FOOTER
    // ========================================
    footer: {
        madeWith: {
            fr: 'Made with ❤️ en Bretagne',
            en: 'Made with ❤️ in Brittany',
            de: 'Mit ❤️ in der Bretagne erstellt',
            es: 'Hecho con ❤️ en Bretaña',
            it: 'Fatto con ❤️ in Bretagna',
            nl: 'Gemaakt met ❤️ in Bretagne',
            pt: 'Feito com ❤️ na Bretanha',
            zh: '在布列塔尼用 ❤️ 制作',
            ja: 'ブルターニュで ❤️ を込めて作成'
        },
        copyright: {
            fr: '© 2025 La Belle Bretagne - Guide touristique de Bretagne',
            en: '© 2025 La Belle Bretagne - Tourist guide to Brittany',
            de: '© 2025 La Belle Bretagne - Touristenführer für die Bretagne',
            es: '© 2025 La Belle Bretagne - Guía turística de Bretaña',
            it: '© 2025 La Belle Bretagne - Guida turistica della Bretagna',
            nl: '© 2025 La Belle Bretagne - Toeristische gids van Bretagne',
            pt: '© 2025 La Belle Bretagne - Guia turístico da Bretanha',
            zh: '© 2025 La Belle Bretagne - 布列塔尼旅游指南',
            ja: '© 2025 La Belle Bretagne - ブルターニュ観光ガイド'
        },
        sitemap: {
            fr: 'Plan du site',
            en: 'Sitemap',
            de: 'Sitemap',
            es: 'Mapa del sitio',
            it: 'Mappa del sito',
            nl: 'Sitemap',
            pt: 'Mapa do site',
            zh: '网站地图',
            ja: 'サイトマップ'
        },
        information: {
            fr: 'Informations',
            en: 'Information',
            de: 'Informationen',
            es: 'Información',
            it: 'Informazioni',
            nl: 'Informatie',
            pt: 'Informação',
            zh: '信息',
            ja: '情報'
        },
        followUs: {
            fr: 'Suivez-nous',
            en: 'Follow us',
            de: 'Folgen Sie uns',
            es: 'Síguenos',
            it: 'Seguici',
            nl: 'Volg ons',
            pt: 'Siga-nos',
            zh: '关注我们',
            ja: 'フォローする'
        },
        newsletter: {
            fr: 'Newsletter',
            en: 'Newsletter',
            de: 'Newsletter',
            es: 'Boletín',
            it: 'Newsletter',
            nl: 'Nieuwsbrief',
            pt: 'Newsletter',
            zh: '通讯',
            ja: 'ニュースレター'
        },
        newsletterDesc: {
            fr: 'Recevez nos dernières découvertes bretonnes',
            en: 'Receive our latest Breton discoveries',
            de: 'Erhalten Sie unsere neuesten bretonischen Entdeckungen',
            es: 'Reciba nuestros últimos descubrimientos bretones',
            it: 'Ricevi le nostre ultime scoperte bretoni',
            nl: 'Ontvang onze nieuwste Bretonse ontdekkingen',
            pt: 'Receba as nossas últimas descobertas bretãs',
            zh: '接收我们最新的布列塔尼发现',
            ja: '最新のブルターニュの発見を受け取る'
        },
        subscribe: {
            fr: 'S\'abonner',
            en: 'Subscribe',
            de: 'Abonnieren',
            es: 'Suscribirse',
            it: 'Iscriviti',
            nl: 'Abonneren',
            pt: 'Subscrever',
            zh: '订阅',
            ja: '購読する'
        },
        legalNotice: {
            fr: 'Mentions légales',
            en: 'Legal notice',
            de: 'Impressum',
            es: 'Aviso legal',
            it: 'Note legali',
            nl: 'Wettelijke kennisgeving',
            pt: 'Aviso legal',
            zh: '法律声明',
            ja: '法的通知'
        },
        contact: {
            fr: 'Nous contacter',
            en: 'Contact us',
            de: 'Kontaktieren Sie uns',
            es: 'Contáctenos',
            it: 'Contattaci',
            nl: 'Neem contact op',
            pt: 'Contacte-nos',
            zh: '联系我们',
            ja: 'お問い合わせ'
        },
        about: {
            fr: 'Qui sommes-nous',
            en: 'About us',
            de: 'Über uns',
            es: 'Quiénes somos',
            it: 'Chi siamo',
            nl: 'Over ons',
            pt: 'Quem somos',
            zh: '关于我们',
            ja: '私たちについて'
        },
        interactiveMap: {
            fr: 'Carte interactive',
            en: 'Interactive map',
            de: 'Interaktive Karte',
            es: 'Mapa interactivo',
            it: 'Mappa interattiva',
            nl: 'Interactieve kaart',
            pt: 'Mapa interativo',
            zh: '互动地图',
            ja: 'インタラクティブマップ'
        },
        emailPlaceholder: {
            fr: 'Votre email',
            en: 'Your email',
            de: 'Ihre E-Mail',
            es: 'Tu email',
            it: 'La tua email',
            nl: 'Uw e-mail',
            pt: 'O seu email',
            zh: '您的电子邮件',
            ja: 'あなたのメール'
        }
    },

    // ========================================
    // PAGE D'ACCUEIL / HERO
    // ========================================
    hero: {
        title: {
            fr: 'Découvrez la Belle Bretagne',
            en: 'Discover Beautiful Brittany',
            de: 'Entdecken Sie die schöne Bretagne',
            es: 'Descubre la hermosa Bretaña',
            it: 'Scopri la bella Bretagna',
            nl: 'Ontdek het mooie Bretagne',
            pt: 'Descubra a bela Bretanha',
            zh: '探索美丽的布列塔尼',
            ja: '美しいブルターニュを発見'
        },
        subtitle: {
            fr: 'Explorez les trésors cachés et les incontournables de la Bretagne. Lieux authentiques, hébergements de charme et expériences inoubliables vous attendent.',
            en: 'Explore the hidden treasures and must-sees of Brittany. Authentic places, charming accommodations and unforgettable experiences await you.',
            de: 'Erkunden Sie die verborgenen Schätze und Sehenswürdigkeiten der Bretagne. Authentische Orte, charmante Unterkünfte und unvergessliche Erlebnisse erwarten Sie.',
            es: 'Explora los tesoros escondidos y lugares imprescindibles de Bretaña. Lugares auténticos, alojamientos con encanto y experiencias inolvidables te esperan.',
            it: 'Esplora i tesori nascosti e le attrazioni imperdibili della Bretagna. Luoghi autentici, alloggi di charme ed esperienze indimenticabili ti aspettano.',
            nl: 'Verken de verborgen schatten en hoogtepunten van Bretagne. Authentieke plaatsen, charmante accommodaties en onvergetelijke ervaringen wachten op u.',
            pt: 'Explore os tesouros escondidos e locais imperdíveis da Bretanha. Lugares autênticos, alojamentos de charme e experiências inesquecíveis aguardam por si.',
            zh: '探索布列塔尼的隐藏宝藏和必看景点。真实的地方、迷人的住宿和难忘的体验等待着您。',
            ja: 'ブルターニュの隠された宝物と必見スポットを探索。本格的な場所、魅力的な宿泊施設、忘れられない体験があなたを待っています。'
        },
        exploreBtn: {
            fr: 'Explorer la carte',
            en: 'Explore the map',
            de: 'Karte erkunden',
            es: 'Explorar el mapa',
            it: 'Esplora la mappa',
            nl: 'Verken de kaart',
            pt: 'Explorar o mapa',
            zh: '探索地图',
            ja: '地図を探索'
        },
        accommodationsBtn: {
            fr: 'Hébergements',
            en: 'Accommodations',
            de: 'Unterkünfte',
            es: 'Alojamientos',
            it: 'Alloggi',
            nl: 'Accommodaties',
            pt: 'Alojamentos',
            zh: '住宿',
            ja: '宿泊施設'
        }
    },

    // ========================================
    // SECTIONS
    // ========================================
    sections: {
        completeGuide: {
            fr: 'Votre guide complet de la Bretagne',
            en: 'Your complete guide to Brittany',
            de: 'Ihr vollständiger Führer für die Bretagne',
            es: 'Tu guía completa de Bretaña',
            it: 'La tua guida completa della Bretagna',
            nl: 'Uw complete gids van Bretagne',
            pt: 'O seu guia completo da Bretanha',
            zh: '您的布列塔尼完整指南',
            ja: 'ブルターニュの完全ガイド'
        },
        interactiveMap: {
            fr: 'Carte interactive',
            en: 'Interactive map',
            de: 'Interaktive Karte',
            es: 'Mapa interactivo',
            it: 'Mappa interattiva',
            nl: 'Interactieve kaart',
            pt: 'Mapa interativo',
            zh: '互动地图',
            ja: 'インタラクティブマップ'
        },
        interactiveMapDesc: {
            fr: 'Explorez la Bretagne avec notre carte interactive. Découvrez les lieux d\'intérêt, hébergements et événements géolocalisés.',
            en: 'Explore Brittany with our interactive map. Discover points of interest, accommodations and geolocated events.',
            de: 'Erkunden Sie die Bretagne mit unserer interaktiven Karte. Entdecken Sie Sehenswürdigkeiten, Unterkünfte und geolokalisierte Veranstaltungen.',
            es: 'Explora Bretaña con nuestro mapa interactivo. Descubre puntos de interés, alojamientos y eventos geolocalizados.',
            it: 'Esplora la Bretagna con la nostra mappa interattiva. Scopri punti di interesse, alloggi ed eventi geolocalizzati.',
            nl: 'Verken Bretagne met onze interactieve kaart. Ontdek bezienswaardigheden, accommodaties en gelokaliseerde evenementen.',
            pt: 'Explore a Bretanha com o nosso mapa interativo. Descubra pontos de interesse, alojamentos e eventos geolocalizados.',
            zh: '使用我们的互动地图探索布列塔尼。发现兴趣点、住宿和地理定位事件。',
            ja: 'インタラクティブマップでブルターニュを探索。観光スポット、宿泊施設、地理的位置のイベントを発見。'
        },
        accommodationsService: {
            fr: 'Hébergements',
            en: 'Accommodations',
            de: 'Unterkünfte',
            es: 'Alojamientos',
            it: 'Alloggi',
            nl: 'Accommodaties',
            pt: 'Alojamentos',
            zh: '住宿',
            ja: '宿泊施設'
        },
        accommodationsServiceDesc: {
            fr: 'Trouvez l\'hébergement parfait : hôtels de charme, gîtes authentiques, campings au bord de mer.',
            en: 'Find the perfect accommodation: charming hotels, authentic cottages, seaside campsites.',
            de: 'Finden Sie die perfekte Unterkunft: charmante Hotels, authentische Ferienhäuser, Campingplätze am Meer.',
            es: 'Encuentra el alojamiento perfecto: hoteles con encanto, casas rurales auténticas, campings junto al mar.',
            it: 'Trova l\'alloggio perfetto: hotel di charme, cottage autentici, campeggi sul mare.',
            nl: 'Vind de perfecte accommodatie: charmante hotels, authentieke gîtes, campings aan zee.',
            pt: 'Encontre o alojamento perfeito: hotéis de charme, casas rurais autênticas, campings à beira-mar.',
            zh: '找到完美的住宿：迷人的酒店、正宗的乡村小屋、海边露营地。',
            ja: '完璧な宿泊施設を見つけましょう：魅力的なホテル、本格的なコテージ、海辺のキャンプ場。'
        },
        festivalsEvents: {
            fr: 'Festivals & Événements',
            en: 'Festivals & Events',
            de: 'Festivals & Veranstaltungen',
            es: 'Festivales y Eventos',
            it: 'Festival ed Eventi',
            nl: 'Festivals & Evenementen',
            pt: 'Festivais e Eventos',
            zh: '节日与活动',
            ja: 'フェスティバル＆イベント'
        },
        festivalsEventsDesc: {
            fr: 'Ne manquez aucun événement breton : festivals traditionnels, fêtes locales et animations culturelles.',
            en: 'Don\'t miss any Breton event: traditional festivals, local celebrations and cultural activities.',
            de: 'Verpassen Sie kein bretonisches Ereignis: traditionelle Festivals, lokale Feste und kulturelle Aktivitäten.',
            es: 'No te pierdas ningún evento bretón: festivales tradicionales, fiestas locales y actividades culturales.',
            it: 'Non perdere nessun evento bretone: festival tradizionali, feste locali e attività culturali.',
            nl: 'Mis geen enkel Bretons evenement: traditionele festivals, lokale feesten en culturele activiteiten.',
            pt: 'Não perca nenhum evento bretão: festivais tradicionais, festas locais e atividades culturais.',
            zh: '不要错过任何布列塔尼活动：传统节日、当地庆祝活动和文化活动。',
            ja: 'ブルターニュのイベントをお見逃しなく：伝統的なフェスティバル、地元の祭り、文化活動。'
        },
        seeEvents: {
            fr: 'Voir les événements',
            en: 'See events',
            de: 'Veranstaltungen ansehen',
            es: 'Ver eventos',
            it: 'Vedi eventi',
            nl: 'Evenementen bekijken',
            pt: 'Ver eventos',
            zh: '查看活动',
            ja: 'イベントを見る'
        },
        featuredAccommodations: {
            fr: 'Hébergements à la une',
            en: 'Featured accommodations',
            de: 'Empfohlene Unterkünfte',
            es: 'Alojamientos destacados',
            it: 'Alloggi in evidenza',
            nl: 'Uitgelichte accommodaties',
            pt: 'Alojamentos em destaque',
            zh: '精选住宿',
            ja: '注目の宿泊施設'
        },
        featuredAccommodationsDesc: {
            fr: 'Découvrez notre sélection d\'hébergements d\'exception',
            en: 'Discover our selection of exceptional accommodations',
            de: 'Entdecken Sie unsere Auswahl an außergewöhnlichen Unterkünften',
            es: 'Descubre nuestra selección de alojamientos excepcionales',
            it: 'Scopri la nostra selezione di alloggi eccezionali',
            nl: 'Ontdek onze selectie van uitzonderlijke accommodaties',
            pt: 'Descubra a nossa seleção de alojamentos excecionais',
            zh: '发现我们精选的特殊住宿',
            ja: '特別な宿泊施設のセレクションを発見'
        },
        popularPlaces: {
            fr: 'Lieux populaires',
            en: 'Popular places',
            de: 'Beliebte Orte',
            es: 'Lugares populares',
            it: 'Luoghi popolari',
            nl: 'Populaire plaatsen',
            pt: 'Lugares populares',
            zh: '热门地点',
            ja: '人気の場所'
        },
        recentArticles: {
            fr: 'Articles récents',
            en: 'Recent articles',
            de: 'Neueste Artikel',
            es: 'Artículos recientes',
            it: 'Articoli recenti',
            nl: 'Recente artikelen',
            pt: 'Artigos recentes',
            zh: '最新文章',
            ja: '最近の記事'
        },
        upcomingFestivals: {
            fr: 'Festivals à venir',
            en: 'Upcoming festivals',
            de: 'Kommende Festivals',
            es: 'Próximos festivales',
            it: 'Festival in arrivo',
            nl: 'Aankomende festivals',
            pt: 'Próximos festivais',
            zh: '即将举行的节日',
            ja: '今後のフェスティバル'
        },
        bestAccommodations: {
            fr: 'Meilleurs hébergements',
            en: 'Best accommodations',
            de: 'Beste Unterkünfte',
            es: 'Mejores alojamientos',
            it: 'Migliori alloggi',
            nl: 'Beste accommodaties',
            pt: 'Melhores alojamentos',
            zh: '最佳住宿',
            ja: '最高の宿泊施設'
        },
        discoverBestAccommodations: {
            fr: 'Découvrir les meilleurs hébergements en Bretagne',
            en: 'Discover the best accommodations in Brittany',
            de: 'Entdecken Sie die besten Unterkünfte in der Bretagne',
            es: 'Descubre los mejores alojamientos en Bretaña',
            it: 'Scopri i migliori alloggi in Bretagna',
            nl: 'Ontdek de beste accommodaties in Bretagne',
            pt: 'Descubra os melhores alojamentos na Bretanha',
            zh: '发现布列塔尼最好的住宿',
            ja: 'ブルターニュの最高の宿泊施設を発見'
        }
    },

    // ========================================
    // HÉBERGEMENTS (Accommodations)
    // ========================================
    accommodations: {
        agapaHotel: {
            title: {
                fr: 'L\'Agapa Hotel',
                en: 'L\'Agapa Hotel',
                de: 'L\'Agapa Hotel',
                es: 'L\'Agapa Hotel',
                it: 'L\'Agapa Hotel',
                nl: 'L\'Agapa Hotel',
                pt: 'L\'Agapa Hotel',
                zh: 'L\'Agapa酒店',
                ja: 'L\'Agapaホテル'
            },
            description: {
                fr: 'Hôtel de luxe face à la mer avec spa et vue panoramique sur l\'archipel des Sept-Îles.',
                en: 'Luxury hotel facing the sea with spa and panoramic view of the Seven Islands archipelago.',
                de: 'Luxushotel am Meer mit Spa und Panoramablick auf den Sept-Îles-Archipel.',
                es: 'Hotel de lujo frente al mar con spa y vista panorámica del archipiélago de las Siete Islas.',
                it: 'Hotel di lusso di fronte al mare con spa e vista panoramica sull\'arcipelago delle Sette Isole.',
                nl: 'Luxe hotel met uitzicht op zee, spa en panoramisch uitzicht op de archipel van Zeven Eilanden.',
                pt: 'Hotel de luxo à beira-mar com spa e vista panorâmica do arquipélago das Sete Ilhas.',
                zh: '豪华海景酒店，设有水疗中心，可欣赏七岛群岛全景。',
                ja: '海に面した高級ホテル、スパ付き、七島群島のパノラマビュー。'
            },
            location: {
                fr: 'Perros-Guirec, Côtes-d\'Armor',
                en: 'Perros-Guirec, Côtes-d\'Armor',
                de: 'Perros-Guirec, Côtes-d\'Armor',
                es: 'Perros-Guirec, Côtes-d\'Armor',
                it: 'Perros-Guirec, Côtes-d\'Armor',
                nl: 'Perros-Guirec, Côtes-d\'Armor',
                pt: 'Perros-Guirec, Côtes-d\'Armor',
                zh: '佩罗斯-吉雷克，阿摩尔滨海省',
                ja: 'ペロス＝ギレック、コート＝ダルモール'
            }
        },
        valleePratmeur: {
            title: {
                fr: 'Vallée de Pratmeur',
                en: 'Vallée de Pratmeur',
                de: 'Vallée de Pratmeur',
                es: 'Vallée de Pratmeur',
                it: 'Vallée de Pratmeur',
                nl: 'Vallée de Pratmeur',
                pt: 'Vallée de Pratmeur',
                zh: 'Pratmeur山谷',
                ja: 'プラトムール渓谷'
            },
            description: {
                fr: 'Logement insolite au cœur de la nature bretonne pour une expérience unique et authentique.',
                en: 'Unusual accommodation in the heart of Breton nature for a unique and authentic experience.',
                de: 'Außergewöhnliche Unterkunft im Herzen der bretonischen Natur für ein einzigartiges und authentisches Erlebnis.',
                es: 'Alojamiento insólito en el corazón de la naturaleza bretona para una experiencia única y auténtica.',
                it: 'Alloggio insolito nel cuore della natura bretone per un\'esperienza unica e autentica.',
                nl: 'Ongewone accommodatie in het hart van de Bretoense natuur voor een unieke en authentieke ervaring.',
                pt: 'Alojamento insólito no coração da natureza bretã para uma experiência única e autêntica.',
                zh: '布列塔尼自然中心的特色住宿，享受独特真实的体验。',
                ja: 'ブルターニュの自然の中心にあるユニークな宿泊施設で、本格的な体験。'
            },
            location: {
                fr: 'Finistère',
                en: 'Finistère',
                de: 'Finistère',
                es: 'Finistère',
                it: 'Finistère',
                nl: 'Finistère',
                pt: 'Finistère',
                zh: '菲尼斯泰尔省',
                ja: 'フィニステール'
            }
        },
        villaLilySpa: {
            title: {
                fr: 'Villa Lily Spa',
                en: 'Villa Lily Spa',
                de: 'Villa Lily Spa',
                es: 'Villa Lily Spa',
                it: 'Villa Lily Spa',
                nl: 'Villa Lily Spa',
                pt: 'Villa Lily Spa',
                zh: 'Villa Lily Spa',
                ja: 'ヴィラ・リリー・スパ'
            },
            description: {
                fr: 'Logement insolite d\'exception avec spa privatif pour un séjour détente et bien-être en Bretagne.',
                en: 'Exceptional unusual accommodation with private spa for a relaxing and wellness stay in Brittany.',
                de: 'Außergewöhnliche Unterkunft mit privatem Spa für einen entspannenden Wellness-Aufenthalt in der Bretagne.',
                es: 'Alojamiento insólito excepcional con spa privado para una estancia de relax y bienestar en Bretaña.',
                it: 'Alloggio insolito eccezionale con spa privata per un soggiorno rilassante e benessere in Bretagna.',
                nl: 'Uitzonderlijke ongewone accommodatie met privé spa voor een ontspannend wellness verblijf in Bretagne.',
                pt: 'Alojamento insólito excecional com spa privado para uma estadia relaxante e bem-estar na Bretanha.',
                zh: '特殊豪华住宿，配有私人水疗中心，在布列塔尼享受放松养生。',
                ja: 'プライベートスパ付きの特別なユニークな宿泊施設で、ブルターニュでのリラックスとウェルネス滞在。'
            },
            location: {
                fr: 'Morbihan',
                en: 'Morbihan',
                de: 'Morbihan',
                es: 'Morbihan',
                it: 'Morbihan',
                nl: 'Morbihan',
                pt: 'Morbihan',
                zh: '莫尔比昂省',
                ja: 'モルビアン'
            }
        }
    },

    // ========================================
    // BLOG
    // ========================================
    blog: {
        latestArticles: {
            fr: 'Derniers articles du blog',
            en: 'Latest blog articles',
            de: 'Neueste Blog-Artikel',
            es: 'Últimos artículos del blog',
            it: 'Ultimi articoli del blog',
            nl: 'Nieuwste blogartikelen',
            pt: 'Últimos artigos do blog',
            zh: '最新博客文章',
            ja: '最新のブログ記事'
        },
        seeAllArticles: {
            fr: 'Voir tous les articles',
            en: 'See all articles',
            de: 'Alle Artikel anzeigen',
            es: 'Ver todos los artículos',
            it: 'Vedi tutti gli articoli',
            nl: 'Bekijk alle artikelen',
            pt: 'Ver todos os artigos',
            zh: '查看所有文章',
            ja: 'すべての記事を見る'
        },
        article1: {
            title: {
                fr: 'Les plus beaux phares de Bretagne',
                en: 'The most beautiful lighthouses of Brittany',
                de: 'Die schönsten Leuchttürme der Bretagne',
                es: 'Los faros más hermosos de Bretaña',
                it: 'I fari più belli della Bretagna',
                nl: 'De mooiste vuurtorens van Bretagne',
                pt: 'Os faróis mais bonitos da Bretanha',
                zh: '布列塔尼最美丽的灯塔',
                ja: 'ブルターニュの最も美しい灯台'
            },
            excerpt: {
                fr: 'Découvrez ces sentinelles de la mer qui veillent sur nos côtes depuis des siècles...',
                en: 'Discover these sentinels of the sea that have watched over our coasts for centuries...',
                de: 'Entdecken Sie diese Wächter des Meeres, die seit Jahrhunderten über unsere Küsten wachen...',
                es: 'Descubre estos centinelas del mar que vigilan nuestras costas desde hace siglos...',
                it: 'Scopri queste sentinelle del mare che vigilano sulle nostre coste da secoli...',
                nl: 'Ontdek deze wachters van de zee die al eeuwenlang over onze kusten waken...',
                pt: 'Descubra estes sentinelas do mar que vigiam as nossas costas há séculos...',
                zh: '发现这些几个世纪以来守护着我们海岸的海洋哨兵...',
                ja: '何世紀にもわたって私たちの海岸を見守ってきた海の番人を発見...'
            },
            date: {
                fr: '15 Mars 2024',
                en: 'March 15, 2024',
                de: '15. März 2024',
                es: '15 de marzo de 2024',
                it: '15 marzo 2024',
                nl: '15 maart 2024',
                pt: '15 de março de 2024',
                zh: '2024年3月15日',
                ja: '2024年3月15日'
            },
            readTime: {
                fr: '5 min de lecture',
                en: '5 min read',
                de: '5 Min. Lesezeit',
                es: '5 min de lectura',
                it: '5 min di lettura',
                nl: '5 min lezen',
                pt: '5 min de leitura',
                zh: '5分钟阅读',
                ja: '5分で読める'
            }
        },
        article2: {
            title: {
                fr: 'Guide de la gastronomie bretonne',
                en: 'Guide to Breton gastronomy',
                de: 'Leitfaden zur bretonischen Gastronomie',
                es: 'Guía de la gastronomía bretona',
                it: 'Guida alla gastronomia bretone',
                nl: 'Gids voor de Bretoense gastronomie',
                pt: 'Guia da gastronomia bretã',
                zh: '布列塔尼美食指南',
                ja: 'ブルターニュ料理ガイド'
            },
            excerpt: {
                fr: 'Crêpes, galettes, cidre et fruits de mer : un voyage culinaire au cœur de la Bretagne...',
                en: 'Crêpes, galettes, cider and seafood: a culinary journey to the heart of Brittany...',
                de: 'Crêpes, Galettes, Cidre und Meeresfrüchte: eine kulinarische Reise ins Herz der Bretagne...',
                es: 'Crêpes, galettes, sidra y mariscos: un viaje culinario al corazón de Bretaña...',
                it: 'Crêpes, galettes, sidro e frutti di mare: un viaggio culinario nel cuore della Bretagna...',
                nl: 'Crêpes, galettes, cider en zeevruchten: een culinaire reis naar het hart van Bretagne...',
                pt: 'Crêpes, galettes, cidra e frutos do mar: uma viagem culinária ao coração da Bretanha...',
                zh: '可丽饼、煎饼、苹果酒和海鲜：布列塔尼美食之旅...',
                ja: 'クレープ、ガレット、シードル、シーフード：ブルターニュの中心への料理の旅...'
            },
            date: {
                fr: '10 Mars 2024',
                en: 'March 10, 2024',
                de: '10. März 2024',
                es: '10 de marzo de 2024',
                it: '10 marzo 2024',
                nl: '10 maart 2024',
                pt: '10 de março de 2024',
                zh: '2024年3月10日',
                ja: '2024年3月10日'
            },
            readTime: {
                fr: '7 min de lecture',
                en: '7 min read',
                de: '7 Min. Lesezeit',
                es: '7 min de lectura',
                it: '7 min di lettura',
                nl: '7 min lezen',
                pt: '7 min de leitura',
                zh: '7分钟阅读',
                ja: '7分で読める'
            }
        },
        article3: {
            title: {
                fr: 'Top 10 des randonnées bretonnes',
                en: 'Top 10 hikes in Brittany',
                de: 'Top 10 Wanderungen in der Bretagne',
                es: 'Top 10 de senderismo en Bretaña',
                it: 'Top 10 escursioni in Bretagna',
                nl: 'Top 10 wandelingen in Bretagne',
                pt: 'Top 10 caminhadas na Bretanha',
                zh: '布列塔尼十大远足路线',
                ja: 'ブルターニュのハイキングトップ10'
            },
            excerpt: {
                fr: 'Sentiers côtiers, forêts mystérieuses et chemins de campagne : nos coups de cœur...',
                en: 'Coastal paths, mysterious forests and country lanes: our favorites...',
                de: 'Küstenpfade, geheimnisvolle Wälder und Landwege: unsere Favoriten...',
                es: 'Senderos costeros, bosques misteriosos y caminos rurales: nuestros favoritos...',
                it: 'Sentieri costieri, foreste misteriose e strade di campagna: i nostri preferiti...',
                nl: 'Kustpaden, mysterieuze bossen en landwegen: onze favorieten...',
                pt: 'Trilhos costeiros, florestas misteriosas e caminhos rurais: os nossos favoritos...',
                zh: '海岸小径、神秘森林和乡村小路：我们的最爱...',
                ja: '海岸の道、神秘的な森、田舎道：私たちのお気に入り...'
            },
            date: {
                fr: '5 Mars 2024',
                en: 'March 5, 2024',
                de: '5. März 2024',
                es: '5 de marzo de 2024',
                it: '5 marzo 2024',
                nl: '5 maart 2024',
                pt: '5 de março de 2024',
                zh: '2024年3月5日',
                ja: '2024年3月5日'
            },
            readTime: {
                fr: '6 min de lecture',
                en: '6 min read',
                de: '6 Min. Lesezeit',
                es: '6 min de lectura',
                it: '6 min di lettura',
                nl: '6 min lezen',
                pt: '6 min de leitura',
                zh: '6分钟阅读',
                ja: '6分で読める'
            }
        }
    },

    // ========================================
    // DESCRIPTIONS GÉNÉRIQUES
    // ========================================
    descriptions: {
        brittany: {
            fr: 'La Bretagne est une région magnifique située dans le nord-ouest de la France, connue pour ses côtes spectaculaires, ses villages pittoresques et son riche patrimoine culturel.',
            en: 'Brittany is a beautiful region in northwestern France, known for its spectacular coastlines, picturesque villages and rich cultural heritage.',
            de: 'Die Bretagne ist eine wunderschöne Region im Nordwesten Frankreichs, bekannt für ihre spektakulären Küsten, malerischen Dörfer und ihr reiches kulturelles Erbe.',
            es: 'Bretaña es una hermosa región del noroeste de Francia, conocida por sus espectaculares costas, pueblos pintorescos y rico patrimonio cultural.',
            it: 'La Bretagna è una bellissima regione nella Francia nord-occidentale, nota per le sue coste spettacolari, i villaggi pittoreschi e il ricco patrimonio culturale.',
            nl: 'Bretagne is een prachtige regio in het noordwesten van Frankrijk, bekend om zijn spectaculaire kustlijnen, pittoreske dorpjes en rijke cultureel erfgoed.',
            pt: 'A Bretanha é uma bela região no noroeste da França, conhecida pelas suas costas espetaculares, aldeias pitorescas e rico património cultural.',
            zh: '布列塔尼是法国西北部的一个美丽地区，以其壮观的海岸线、风景如画的村庄和丰富的文化遗产而闻名。',
            ja: 'ブルターニュはフランス北西部の美しい地域で、壮大な海岸線、絵のように美しい村々、豊かな文化遺産で知られています。'
        }
    },

    // ========================================
    // FORMULAIRES
    // ========================================
    forms: {
        email: {
            fr: 'Votre email',
            en: 'Your email',
            de: 'Ihre E-Mail',
            es: 'Tu email',
            it: 'La tua email',
            nl: 'Uw e-mail',
            pt: 'O seu email',
            zh: '您的电子邮件',
            ja: 'あなたのメール'
        },
        name: {
            fr: 'Votre nom',
            en: 'Your name',
            de: 'Ihr Name',
            es: 'Tu nombre',
            it: 'Il tuo nome',
            nl: 'Uw naam',
            pt: 'O seu nome',
            zh: '您的姓名',
            ja: 'あなたの名前'
        },
        message: {
            fr: 'Votre message',
            en: 'Your message',
            de: 'Ihre Nachricht',
            es: 'Tu mensaje',
            it: 'Il tuo messaggio',
            nl: 'Uw bericht',
            pt: 'A sua mensagem',
            zh: '您的留言',
            ja: 'あなたのメッセージ'
        },
        send: {
            fr: 'Envoyer',
            en: 'Send',
            de: 'Senden',
            es: 'Enviar',
            it: 'Invia',
            nl: 'Verzenden',
            pt: 'Enviar',
            zh: '发送',
            ja: '送信'
        }
    },

    // ========================================
    // CARTE INTERACTIVE
    // ========================================
    map: {
        title: {
            fr: 'Carte interactive de Bretagne',
            en: 'Interactive map of Brittany',
            de: 'Interaktive Karte der Bretagne',
            es: 'Mapa interactivo de Bretaña',
            it: 'Mappa interattiva della Bretagna',
            nl: 'Interactieve kaart van Bretagne',
            pt: 'Mapa interativo da Bretanha',
            zh: '布列塔尼互动地图',
            ja: 'ブルターニュのインタラクティブマップ'
        },
        poiCount: {
            fr: 'points d\'intérêt',
            en: 'points of interest',
            de: 'Sehenswürdigkeiten',
            es: 'puntos de interés',
            it: 'punti di interesse',
            nl: 'bezienswaardigheden',
            pt: 'pontos de interesse',
            zh: '兴趣点',
            ja: '興味のあるポイント'
        }
    }
};

/**
 * Fonction pour obtenir une traduction
 * @param {string} key - Clé de traduction (ex: 'nav.home')
 * @param {string} lang - Code langue (ex: 'en')
 * @returns {string} - Texte traduit
 */
function getTranslation(key, lang = 'fr') {
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
        value = value[k];
        if (!value) return key; // Retourne la clé si traduction non trouvée
    }

    return value[lang] || value['fr'] || key;
}

/**
 * Fonction pour traduire toute la page
 * @param {string} lang - Code langue
 */
function translatePage(lang) {
    console.log('🌍 Traduction de la page en:', lang);

    let translatedCount = 0;
    let errorCount = 0;

    // Traduire tous les éléments avec l'attribut data-translate
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = getTranslation(key, lang);

        // Debug: vérifier si la traduction a été trouvée
        if (translation === key) {
            console.warn(`⚠️ Traduction non trouvée pour: ${key}`);
            errorCount++;
        } else {
            translatedCount++;
        }

        // Gérer les différents types d'éléments
        if (element.tagName === 'INPUT') {
            if (element.type === 'text' || element.type === 'email') {
                element.placeholder = translation;
            }
        } else if (element.children.length === 0) {
            // Si l'élément n'a pas d'enfants, on peut directement remplacer le texte
            element.textContent = translation;
        } else {
            // Si l'élément a des enfants, on remplace seulement les nœuds de texte
            // En parcourant les childNodes et en remplaçant les Text nodes
            let textReplaced = false;
            element.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                    node.textContent = translation;
                    textReplaced = true;
                }
            });
            // Si aucun nœud texte n'a été trouvé, remplacer tout le textContent
            if (!textReplaced) {
                element.textContent = translation;
            }
        }
    });

    console.log(`✅ Traduction terminée: ${translatedCount} éléments traduits, ${errorCount} erreurs`);
}

// Rendre les fonctions accessibles globalement
window.getTranslation = getTranslation;
window.translatePage = translatePage;
window.translations = translations;
