#!/usr/bin/env node

/**
 * Script d'optimisation des images pour PageSpeed
 * Convertit les JPG en WebP avec différentes tailles
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const IMAGES_DIR = './assets/img';
const OUTPUT_DIR = './assets/webp';
const SIZES = [400, 800, 1200]; // Tailles responsive

// Créer le dossier de sortie
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function optimizeImage(inputPath, filename) {
    const baseName = path.parse(filename).name;
    const ext = path.parse(filename).ext.toLowerCase();

    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
        return;
    }

    console.log(`🖼️  Optimisation de ${filename}...`);

    try {
        // Créer différentes tailles en WebP
        SIZES.forEach(size => {
            const outputPath = path.join(OUTPUT_DIR, `${baseName}-${size}w.webp`);

            // Commande cwebp avec optimisation
            const command = `/opt/homebrew/bin/cwebp -q 80 -resize ${size} 0 "${inputPath}" -o "${outputPath}"`;

            try {
                execSync(command, { stdio: 'pipe' });
                const originalSize = fs.statSync(inputPath).size;
                const newSize = fs.statSync(outputPath).size;
                const savings = Math.round((1 - newSize/originalSize) * 100);
                console.log(`  ✅ ${size}w: ${Math.round(newSize/1024)}KB (-${savings}%)`);
            } catch (err) {
                console.log(`  ❌ Erreur ${size}w: ${err.message}`);
            }
        });

        // Version optimisée originale
        const originalOutput = path.join(OUTPUT_DIR, `${baseName}.webp`);
        const originalCommand = `/opt/homebrew/bin/cwebp -q 85 "${inputPath}" -o "${originalOutput}"`;

        try {
            execSync(originalCommand, { stdio: 'pipe' });
            const originalSize = fs.statSync(inputPath).size;
            const newSize = fs.statSync(originalOutput).size;
            const savings = Math.round((1 - newSize/originalSize) * 100);
            console.log(`  ✅ Original: ${Math.round(newSize/1024)}KB (-${savings}%)`);
        } catch (err) {
            console.log(`  ❌ Erreur original: ${err.message}`);
        }

    } catch (error) {
        console.log(`❌ Erreur lors de l'optimisation de ${filename}: ${error.message}`);
    }
}

// Traiter toutes les images
console.log('🚀 Démarrage de l\'optimisation des images...');

const files = fs.readdirSync(IMAGES_DIR);
let processed = 0;

files.forEach(filename => {
    const inputPath = path.join(IMAGES_DIR, filename);
    const stat = fs.statSync(inputPath);

    if (stat.isFile()) {
        optimizeImage(inputPath, filename);
        processed++;
    }
});

console.log(`\n✨ Optimisation terminée ! ${processed} images traitées.`);
console.log(`📁 Images optimisées dans: ${OUTPUT_DIR}`);

// Générer le mapping pour le code
const mapping = {};
files.forEach(filename => {
    const baseName = path.parse(filename).name;
    const ext = path.parse(filename).ext.toLowerCase();

    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        mapping[filename] = {
            webp: `assets/webp/${baseName}.webp`,
            responsive: SIZES.map(size => ({
                src: `assets/webp/${baseName}-${size}w.webp`,
                width: size
            }))
        };
    }
});

fs.writeFileSync('./image-mapping.json', JSON.stringify(mapping, null, 2));
console.log('📋 Mapping généré dans image-mapping.json');