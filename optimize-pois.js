#!/usr/bin/env node

/**
 * Script d'optimisation du fichier pois.json
 * Objectif : réduire de 176KB à moins de 100KB
 */

const fs = require('fs');
const path = require('path');

// Mapping des clés pour réduction
const keyMapping = {
    'id': 'i',
    'title': 't',
    'slug': 's',
    'department': 'd',
    'categories': 'c',
    'lat': 'la',
    'lng': 'ln',
    'shortDescription': 'sd',
    'description': 'ds',
    'image': 'im',
    'images': 'ims',
    'tested': 'te',
    'coupDeCoeur': 'cc',
    'address': 'ad',
    'website': 'w',
    'phone': 'p',
    'tags': 'tg'
};

// Mapping des départements vers indices
const departmentMapping = {
    'Finistère': 0,
    'Morbihan': 1,
    'Ille-et-Vilaine': 2,
    'Côtes-d\'Armor': 3,
    'Loire-Atlantique': 4,
    'Bretagne': 5
};

// Fonction d'optimisation d'un POI
function optimizePoi(poi) {
    const optimized = {};

    for (const [oldKey, value] of Object.entries(poi)) {
        const newKey = keyMapping[oldKey] || oldKey;

        switch (oldKey) {
            case 'department':
                // Convertir département en indice
                optimized[newKey] = departmentMapping[value] !== undefined ? departmentMapping[value] : value;
                break;

            case 'categories':
                // Si c'est un array à un seul élément, stocker comme string
                if (Array.isArray(value) && value.length === 1) {
                    optimized[newKey] = value[0];
                } else {
                    optimized[newKey] = value;
                }
                break;

            case 'tested':
            case 'coupDeCoeur':
                // Convertir booléens en 0/1
                optimized[newKey] = value ? 1 : 0;
                break;

            case 'website':
            case 'phone':
                // Omettre les champs vides
                if (value && value.trim() !== '') {
                    optimized[newKey] = value;
                }
                break;

            case 'lat':
            case 'lng':
                // Arrondir les coordonnées à 4 décimales (précision d'~11m)
                optimized[newKey] = Math.round(value * 10000) / 10000;
                break;

            default:
                optimized[newKey] = value;
        }
    }

    return optimized;
}

// Fonction principale
function optimizePoiFile() {
    try {
        console.log('🔄 Chargement du fichier pois.json...');

        const inputFile = '/Users/yanncoadour/Documents/labellebretagne/data/pois.json';
        const outputFile = '/Users/yanncoadour/Documents/labellebretagne/data/pois.json';

        // Lire le fichier original
        const originalData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
        const originalSize = fs.statSync(inputFile).size;

        console.log(`📊 Taille originale : ${Math.round(originalSize / 1024)}KB`);
        console.log(`📝 Nombre de POIs : ${originalData.pois.length}`);

        // Optimiser chaque POI
        const optimizedPois = originalData.pois.map(optimizePoi);

        // Créer la structure optimisée
        const optimizedData = {
            pois: optimizedPois
        };

        // Sauvegarder avec compression maximale (pas d'espaces)
        const optimizedJson = JSON.stringify(optimizedData);
        fs.writeFileSync(outputFile, optimizedJson, 'utf8');

        const newSize = fs.statSync(outputFile).size;
        const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);

        console.log(`✅ Optimisation terminée !`);
        console.log(`📊 Nouvelle taille : ${Math.round(newSize / 1024)}KB`);
        console.log(`🎯 Réduction : ${reduction}% (${Math.round((originalSize - newSize) / 1024)}KB économisés)`);

        if (newSize < 100 * 1024) {
            console.log(`🎉 Objectif atteint ! Taille < 100KB`);
        } else {
            console.log(`⚠️  Objectif non atteint. Taille encore > 100KB`);
        }

        // Afficher le mapping pour référence
        console.log('\n📋 Mapping des clés créé :');
        console.log('const KEY_MAPPING = ' + JSON.stringify(keyMapping, null, 2) + ';');
        console.log('\n📋 Mapping des départements :');
        console.log('const DEPT_MAPPING = ' + JSON.stringify(departmentMapping, null, 2) + ';');

        return {
            originalSize,
            newSize,
            reduction: parseFloat(reduction),
            keyMapping,
            departmentMapping
        };

    } catch (error) {
        console.error('❌ Erreur lors de l\'optimisation :', error.message);
        process.exit(1);
    }
}

// Exécuter si appelé directement
if (require.main === module) {
    optimizePoiFile();
}

module.exports = { optimizePoiFile, keyMapping, departmentMapping };