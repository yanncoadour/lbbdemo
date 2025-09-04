/**
 * LOGEMENTS - LA BELLE BRETAGNE
 * Gestion des hébergements et système de filtres
 */

// ===================================================================
// DONNÉES DES LOGEMENTS
// ===================================================================

const logementsData = [
    // VILLAS
    {
        id: 'villa-presquile-crozon',
        name: 'Villa Presqu\'île de Crozon',
        category: 'villa',
        location: 'Crozon, Finistère',
        description: 'Villa moderne avec vue panoramique sur la mer, idéale pour 8 personnes',
        capacity: 8,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InZpbGxhIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNjM2NmYxIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjOGI1Y2Y2Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN2aWxsYSkiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPjxpIGNsYXNzPSJmYXMgZmEtaG9tZSI+PC9pPiBWaWxsYSBQcmVzcXUnw65sZTwvdGV4dD48L3N2Zz4=',
        features: ['Piscine privée', 'Jardin', 'Vue mer', 'Parking', 'Wifi'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Crozon%2C+France&checkin=2024-07-01&checkout=2024-07-08',
        rating: 4.8,
        coords: [48.2467, -4.4897]
    },
    {
        id: 'villa-saint-malo',
        name: 'Villa des Remparts',
        category: 'villa',
        location: 'Saint-Malo, Ille-et-Vilaine',
        description: 'Villa historique à 300m des remparts, parfait pour découvrir la cité corsaire',
        capacity: 6,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InZpbGxhMiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzM3NzNmNSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzA5MWE3YSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjdmlsbGEyKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+PGkgY2xhc3M9ImZhcyBmYS1jYXN0bGUiPjwvaT4gVmlsbGEgU2FpbnQtTWFsbzwvdGV4dD48L3N2Zz4=',
        features: ['Centre historique', 'Terrasse', 'Cheminée', 'Parking privé'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Saint-Malo%2C+France&checkin=2024-07-01&checkout=2024-07-08',
        rating: 4.6,
        coords: [48.6482, -2.0255]
    },
    {
        id: 'villa-quiberon',
        name: 'Villa Côte Sauvage',
        category: 'villa',
        location: 'Quiberon, Morbihan',
        description: 'Villa contemporaine face à la Côte Sauvage avec accès direct à la plage',
        capacity: 10,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InZpbGxhMyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzEwYjk4MSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzA1OWY2ZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjdmlsbGEzKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+PGkgY2xhc3M9ImZhcyBmYS13YXRlciI+PC9pPiBWaWxsYSBRdWliZXJvbjwvdGV4dD48L3N2Zz4=',
        features: ['Accès plage', 'Spa privatif', 'Grande terrasse', 'Vue océan'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Quiberon%2C+France&checkin=2024-07-01&checkout=2024-07-08',
        rating: 4.9,
        coords: [47.4848, -3.1194]
    },

    // HÔTELS 4-5 ÉTOILES
    {
        id: 'hotel-barriere-dinard',
        name: 'Hôtel Barrière Le Grand Hôtel',
        category: 'hotel',
        location: 'Dinard, Ille-et-Vilaine',
        description: 'Palace 5★ face à la mer avec spa, restaurant gastronomique et vue exceptionnelle',
        capacity: 2,
        stars: 5,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImhvdGVsIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZjU5ZTBiIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZWE1ODA2Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNob3RlbCkiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPjxpIGNsYXNzPSJmYXMgZmEtY3Jvd24iPjwvaT4gSMO0dGVsIERpbmFyZCA1wrM8L3RleHQ+PC9zdmc+',
        features: ['Spa luxe', 'Restaurant étoilé', 'Vue mer', 'Concierge', 'Plage privée'],
        bookingUrl: 'https://www.booking.com/hotel/fr/grand-dinard.html',
        rating: 4.7,
        coords: [48.6274, -2.0579]
    },
    {
        id: 'hotel-negresco-brest',
        name: 'Hôtel Oceania Le Continental',
        category: 'hotel',
        location: 'Brest, Finistère',
        description: 'Hôtel 4★ au cœur de Brest, élégant et moderne avec vue sur le port',
        capacity: 2,
        stars: 4,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImhvdGVsMiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzE0YjhhNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzA1OWY2ZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjaG90ZWwyKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+PGkgY2xhc3M9ImZhcyBmYS1idWlsZGluZyI+PC9pPiBIw7R0ZWwgQnJlc3QgNMKzPC90ZXh0Pjwvc3ZnPg==',
        features: ['Centre ville', 'Business center', 'Parking', 'Restaurant', 'Fitness'],
        bookingUrl: 'https://www.booking.com/hotel/fr/oceania-le-continental-brest.html',
        rating: 4.5,
        coords: [48.3905, -4.4861]
    },
    {
        id: 'hotel-sofitel-quiberon',
        name: 'Sofitel Quiberon Thalassa',
        category: 'hotel',
        location: 'Quiberon, Morbihan',
        description: 'Hôtel 5★ avec centre de thalassothérapie, spa et vue panoramique sur l\'océan',
        capacity: 2,
        stars: 5,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImhvdGVsMyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzg5MWRmNCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzU1NTVmNCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjaG90ZWwzKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+PGkgY2xhc3M9ImZhcyBmYS13YXRlciI+PC9pPiBTb2ZpdGVsIDXCszwvdGV4dD48L3N2Zz4=',
        features: ['Thalasso', 'Spa premium', 'Restaurant gastronomique', 'Vue océan', 'Piscine'],
        bookingUrl: 'https://www.booking.com/hotel/fr/sofitel-quiberon-thalassa.html',
        rating: 4.8,
        coords: [47.4848, -3.1194]
    },
    {
        id: 'hotel-relais-chateaux-pleneuf',
        name: 'Hôtel des Bains',
        category: 'hotel',
        location: 'Pléneuf-Val-André, Côtes-d\'Armor',
        description: 'Relais & Châteaux 4★ face à la mer, alliance parfaite du charme et du raffinement',
        capacity: 2,
        stars: 4,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImhvdGVsNCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzA2YjZkNCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzA4OTFhNSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjaG90ZWw0KSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+PGkgY2xhc3M9ImZhcyBmYS11bWJyZWxsYS1iZWFjaCI+PC9pPiBIw7R0ZWwgZGVzIEJhaW5zIDTCszwvdGV4dD48L3N2Zz4=',
        features: ['Vue mer directe', 'Restaurant gastronomique', 'Terrasse', 'Plage à 50m'],
        bookingUrl: 'https://www.booking.com/hotel/fr/des-bains-pleneuf-val-andre.html',
        rating: 4.6,
        coords: [48.5947, -2.5469]
    },

    // LOGEMENTS INSOLITES
    {
        id: 'cabane-arbres-broceliande',
        name: 'Cabanes dans les Arbres',
        category: 'insolite',
        location: 'Brocéliande, Morbihan',
        description: 'Cabanes perchées dans la forêt mythique de Brocéliande, expérience magique garantie',
        capacity: 4,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Imluc29saXRlIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMTVhZjVhIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDU5NjJkIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNpbnNvbGl0ZSkiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPjxpIGNsYXNzPSJmYXMgZmEtdHJlZSI+PC9pPiBDYWJhbmVzIEJyb2PpbGlhbmRlPC90ZXh0Pjwvc3ZnPg==',
        features: ['Forêt de Brocéliande', 'Perchées à 6m', 'Petit-déjeuner inclus', 'Expérience unique'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Paimpont%2C+France&checkin=2024-07-01&checkout=2024-07-02',
        rating: 4.7,
        coords: [48.0275, -2.1847]
    },
    {
        id: 'phare-plouer',
        name: 'Phare de Plouër-sur-Rance',
        category: 'insolite',
        location: 'Plouër-sur-Rance, Côtes-d\'Armor',
        description: 'Dormez dans un phare authentique avec vue à 360° sur la Rance et la mer',
        capacity: 2,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Imluc29saXRlMiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzNjODJmNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzFkNGVkOCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjaW5zb2xpdGUyKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+PGkgY2xhc3M9ImZhcyBmYS1saWdodGhvdXNlIj48L2k+IFBoYXJlIGRlIFBsb3XDqnI8L3RleHQ+PC9zdmc+',
        features: ['Vue panoramique', 'Phare authentique', 'Expérience maritime', 'Coucher de soleil unique'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Plou%C3%ABr-sur-Rance%2C+France&checkin=2024-07-01&checkout=2024-07-02',
        rating: 4.9,
        coords: [48.5269, -2.0019]
    },
    {
        id: 'tipi-guerande',
        name: 'Village de Tipis',
        category: 'insolite',
        location: 'Guérande, Loire-Atlantique',
        description: 'Village authentique de tipis avec feu de camp et immersion totale dans la nature',
        capacity: 6,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Imluc29saXRlMyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2VhNTgyYyIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2RjMmYyNiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjaW5zb2xpdGUzKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+PGkgY2xhc3M9ImZhcyBmYS1jYW1wZ3JvdW5kIj48L2k+IFRpcGlzIEd1w6lyYW5kZTwvdGV4dD48L3N2Zz4=',
        features: ['Expérience authentique', 'Feu de camp', 'Activités nature', 'Nuit sous les étoiles'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Gu%C3%A9rande%2C+France&checkin=2024-07-01&checkout=2024-07-02',
        rating: 4.4,
        coords: [47.3275, -2.4292]
    },
    {
        id: 'bulles-transparentes-carnac',
        name: 'Bulles Transparentes de Carnac',
        category: 'insolite',
        location: 'Carnac, Morbihan',
        description: 'Bulles transparentes chauffées pour dormir sous les étoiles près des menhirs',
        capacity: 2,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Imluc29saXRlNCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZiYmYyNCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2Y1OWUwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjaW5zb2xpdGU0KSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+PGkgY2xhc3M9ImZhcyBmYS1jaXJjbGUiPjwvaT4gQnVsbGVzIENhcm5hYzwvdGV4dD48L3N2Zz4=',
        features: ['Vue étoiles', 'Chauffage', 'Proche menhirs', 'Expérience magique'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Carnac%2C+France&checkin=2024-07-01&checkout=2024-07-02',
        rating: 4.8,
        coords: [47.5825, -3.0789]
    },
    {
        id: 'roulotte-gitane-concarneau',
        name: 'Roulottes Gitanes',
        category: 'insolite',
        location: 'Concarneau, Finistère',
        description: 'Roulottes gitanes authentiques dans un cadre bohème près de la ville close',
        capacity: 4,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Imluc29saXRlNSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzk5M2YxYSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzdjMmQxMiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjaW5zb2xpdGU1KSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+PGkgY2xhc3M9ImZhcyBmYS10cnVjayI+PC9pPiBSb3Vsb3R0ZXMgQ29uY2FybmVhdTwvdGV4dD48L3N2Zz4=',
        features: ['Décoration authentique', 'Ambiance bohème', 'Proche ville close', 'Terrasse privée'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Concarneau%2C+France&checkin=2024-07-01&checkout=2024-07-02',
        rating: 4.5,
        coords: [47.8719, -3.9147]
    }
];

// ===================================================================
// VARIABLES GLOBALES
// ===================================================================

let currentFilter = 'all';
let filteredLogements = [...logementsData];

// ===================================================================
// FONCTIONS D'AFFICHAGE
// ===================================================================

/**
 * Met à jour le titre et le compteur des résultats
 * @param {string} category - Catégorie sélectionnée
 * @param {number} count - Nombre de résultats
 */
function updateResultsHeader(category, count) {
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsCount = document.getElementById('resultsCount');
    
    const titles = {
        'all': 'Tous nos hébergements',
        'villa': 'Villas de charme',
        'hotel': 'Hôtels 4-5 étoiles',
        'insolite': 'Logements insolites'
    };
    
    if (resultsTitle) {
        resultsTitle.textContent = titles[category] || 'Hébergements';
    }
    
    if (resultsCount) {
        const logementText = count <= 1 ? 'hébergement trouvé' : 'hébergements trouvés';
        resultsCount.textContent = `${count} ${logementText}`;
    }
}

/**
 * Génère une carte de logement
 * @param {Object} logement - Données du logement
 * @returns {string} - HTML de la carte
 */
function generateLogementCard(logement) {
    const starsHtml = logement.stars ? 
        `<div class="hotel-stars">
            ${Array.from({length: logement.stars}, () => '<i class="fas fa-star"></i>').join('')}
        </div>` : '';
    
    const featuresHtml = logement.features
        .slice(0, 3)
        .map(feature => `<span class="logement-feature"><i class="fas fa-check"></i> ${feature}</span>`)
        .join('');
    
    const categoryInfo = {
        'villa': { icon: 'fas fa-home', label: 'Villa' },
        'hotel': { icon: 'fas fa-hotel', label: 'Hôtel' },
        'insolite': { icon: 'fas fa-campground', label: 'Insolite' }
    };
    
    const category = categoryInfo[logement.category];
    
    return `
        <div class="logement-card" data-category="${logement.category}">
            <div class="logement-image">
                <img src="${logement.image}" alt="${logement.name}" loading="lazy">
                <div class="logement-category">
                    <i class="${category.icon}"></i>
                    <span>${category.label}</span>
                </div>
                <div class="logement-rating">
                    <i class="fas fa-star"></i>
                    <span>${logement.rating}</span>
                </div>
            </div>
            
            <div class="logement-content">
                <div class="logement-header">
                    <h3 class="logement-name">${logement.name}</h3>
                    ${starsHtml}
                </div>
                
                <div class="logement-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${logement.location}</span>
                </div>
                
                <p class="logement-description">${logement.description}</p>
                
                <div class="logement-capacity">
                    <i class="fas fa-users"></i>
                    <span>Jusqu'à ${logement.capacity} personnes</span>
                </div>
                
                <div class="logement-features">
                    ${featuresHtml}
                </div>
                
                <div class="logement-actions">
                    <button class="logement-details-btn" onclick="showLogementDetails('${logement.id}')">
                        <i class="fas fa-info-circle"></i>
                        <span>Voir détails</span>
                    </button>
                    <a href="${logement.bookingUrl}" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       class="booking-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>Réserver</span>
                    </a>
                </div>
            </div>
        </div>
    `;
}

/**
 * Affiche les logements dans la grille
 * @param {Array} logements - Liste des logements à afficher
 */
function displayLogements(logements) {
    const grid = document.getElementById('logementsGrid');
    
    if (!grid) return;
    
    if (logements.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>Aucun hébergement trouvé</h3>
                <p>Essayez de modifier vos critères de recherche</p>
                <button class="reset-filters-btn" onclick="resetFilters()">
                    <i class="fas fa-redo"></i>
                    <span>Voir tous les hébergements</span>
                </button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = logements.map(logement => generateLogementCard(logement)).join('');
}

// ===================================================================
// FONCTIONS DE FILTRAGE
// ===================================================================

/**
 * Filtre les logements par catégorie
 * @param {string} category - Catégorie à filtrer
 */
function filterByCategory(category) {
    currentFilter = category;
    
    // Mettre à jour les boutons actifs
    document.querySelectorAll('.category-filter').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`[data-category="${category}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Filtrer les données
    if (category === 'all') {
        filteredLogements = [...logementsData];
    } else {
        filteredLogements = logementsData.filter(logement => logement.category === category);
    }
    
    // Mettre à jour l'affichage
    updateResultsHeader(category, filteredLogements.length);
    displayLogements(filteredLogements);
    
    console.log(`🏠 Filtre appliqué: ${category} (${filteredLogements.length} résultats)`);
}

/**
 * Remet à zéro tous les filtres
 */
function resetFilters() {
    filterByCategory('all');
}

/**
 * Affiche les détails d'un logement (modal ou redirection)
 * @param {string} logementId - ID du logement
 */
function showLogementDetails(logementId) {
    const logement = logementsData.find(l => l.id === logementId);
    
    if (!logement) return;
    
    // Pour l'instant, simple alert avec les détails
    // Plus tard, on pourrait créer une modal ou une page détail
    const details = `
🏠 ${logement.name}
📍 ${logement.location}
👥 Capacité: ${logement.capacity} personnes
⭐ Note: ${logement.rating}/5

📝 Description:
${logement.description}

✨ Équipements:
• ${logement.features.join('\n• ')}
    `;
    
    if (confirm(`${details}\n\nVoulez-vous être redirigé vers Booking.com pour réserver ?`)) {
        window.open(logement.bookingUrl, '_blank', 'noopener,noreferrer');
    }
}

// ===================================================================
// ÉVÉNEMENTS ET INITIALISATION
// ===================================================================

/**
 * Initialise la page des logements
 */
function initLogements() {
    console.log('🏠 Initialisation de la page logements...');
    
    // Attacher les événements aux boutons de filtre
    document.querySelectorAll('.category-filter').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterByCategory(category);
        });
    });
    
    // Affichage initial
    filterByCategory('all');
    
    console.log('✅ Page logements initialisée avec', logementsData.length, 'hébergements');
}

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLogements);
} else {
    initLogements();
}

// Exporter les fonctions pour utilisation globale
window.LogementsApp = {
    filterByCategory,
    resetFilters,
    showLogementDetails,
    data: logementsData
};