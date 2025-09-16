/**
 * MAP TOGGLE - LA BELLE BRETAGNE
 * Gestion du basculement entre carte normale et satellite
 */

class MapToggle {
    constructor() {
        this.toggleBtn = document.getElementById('mapToggleBtn');
        this.isSatellite = localStorage.getItem('mapSatellite') === 'true';
        this.currentTileLayer = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListener();
        // Attendre que la carte soit initialisée
        this.waitForMap();
    }
    
    setupEventListener() {
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => {
                this.toggleMapStyle();
            });
        }
    }
    
    waitForMap() {
        // Vérifier périodiquement si la carte est prête
        const checkMap = () => {
            if (typeof map !== 'undefined' && map) {
                this.setupInitialMap();
            } else {
                setTimeout(checkMap, 500);
            }
        };
        checkMap();
    }
    
    setupInitialMap() {
        console.log('Initialisation du map toggle...');
        
        // Sauvegarder la référence à la couche de tuiles actuelle
        if (typeof map !== 'undefined' && map) {
            // Chercher la couche de tuiles dans les layers de la carte
            map.eachLayer((layer) => {
                if (layer instanceof L.TileLayer) {
                    this.currentTileLayer = layer;
                    console.log('Couche de tuiles trouvée:', layer._url);
                }
            });
        }
        
        // Appliquer le mode sauvegardé
        if (this.isSatellite) {
            this.switchToSatellite();
        }
        
        this.updateButtonAppearance();
    }
    
    toggleMapStyle() {
        console.log('Toggle map style - Mode actuel:', this.isSatellite ? 'satellite' : 'normal');
        
        if (this.isSatellite) {
            this.switchToNormal();
        } else {
            this.switchToSatellite();
        }
        
        this.isSatellite = !this.isSatellite;
        localStorage.setItem('mapSatellite', this.isSatellite);
        this.updateButtonAppearance();
        
        console.log('Nouveau mode:', this.isSatellite ? 'satellite' : 'normal');
    }
    
    switchToSatellite() {
        console.log('Basculement vers satellite...');
        if (typeof map === 'undefined' || !map) {
            console.error('Carte non trouvée');
            return;
        }
        
        try {
            // Supprimer la couche actuelle
            if (this.currentTileLayer) {
                console.log('Suppression de la couche actuelle');
                map.removeLayer(this.currentTileLayer);
            }
            
            // Ajouter la couche satellite
            console.log('Ajout de la couche satellite');
            this.currentTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '&copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
                maxZoom: 18
            });
            
            this.currentTileLayer.addTo(map);
            console.log('Couche satellite ajoutée avec succès');
            
        } catch (error) {
            console.error('Erreur lors du passage en mode satellite:', error);
        }
    }
    
    switchToNormal() {
        console.log('Basculement vers normal...');
        if (typeof map === 'undefined' || !map) {
            console.error('Carte non trouvée');
            return;
        }
        
        try {
            // Supprimer la couche satellite
            if (this.currentTileLayer) {
                console.log('Suppression de la couche satellite');
                map.removeLayer(this.currentTileLayer);
            }
            
            // Remettre la couche normale OpenStreetMap
            console.log('Ajout de la couche normale');
            this.currentTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 20
            });
            
            this.currentTileLayer.addTo(map);
            console.log('Couche normale ajoutée avec succès');
            
        } catch (error) {
            console.error('Erreur lors du retour en mode normal:', error);
        }
    }
    
    updateButtonAppearance() {
        if (!this.toggleBtn) return;
        
        const icon = this.toggleBtn.querySelector('i');
        
        if (this.isSatellite) {
            this.toggleBtn.classList.add('satellite');
            this.toggleBtn.title = 'Revenir à la carte normale';
            if (icon) {
                icon.className = 'fas fa-globe-americas';
            }
        } else {
            this.toggleBtn.classList.remove('satellite');
            this.toggleBtn.title = 'Passer en vue satellite';
            if (icon) {
                icon.className = 'fas fa-layer-group';
            }
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new MapToggle();
});