#!/bin/bash

# Script d'optimisation des images pour La Belle Bretagne
# Ce script nécessite ImageMagick ou sips (macOS)

echo "🖼️  Optimisation des images..."

# Fonction pour vérifier les outils disponibles
check_tools() {
    if command -v magick &> /dev/null; then
        echo "✅ ImageMagick trouvé"
        TOOL="magick"
        return 0
    elif command -v sips &> /dev/null; then
        echo "✅ sips (macOS) trouvé"
        TOOL="sips"
        return 0
    else
        echo "❌ Aucun outil d'optimisation trouvé"
        echo "Installez ImageMagick: brew install imagemagick"
        return 1
    fi
}

# Optimiser le logo
optimize_logo() {
    echo ""
    echo "📐 Redimensionnement du logo (1080x1080 → 192x192)..."

    if [ "$TOOL" = "magick" ]; then
        magick assets/images/logo.webp \
            -resize 192x192 \
            -quality 85 \
            assets/images/logo-small.webp
    elif [ "$TOOL" = "sips" ]; then
        # Créer une copie temporaire
        cp assets/images/logo.webp assets/images/logo-small.webp
        sips -Z 192 assets/images/logo-small.webp
    fi

    if [ -f assets/images/logo-small.webp ]; then
        SIZE_BEFORE=$(ls -lh assets/images/logo.webp | awk '{print $5}')
        SIZE_AFTER=$(ls -lh assets/images/logo-small.webp | awk '{print $5}')
        echo "✅ Logo optimisé: $SIZE_BEFORE → $SIZE_AFTER"
    fi
}

# Optimiser l'image hero
optimize_hero() {
    echo ""
    echo "🎨 Conversion de photo_acceuil.jpg en WebP..."

    if [ "$TOOL" = "magick" ]; then
        # Version optimisée pour mobile (800px de large)
        magick assets/img/photo_acceuil.jpg \
            -resize 800x \
            -quality 75 \
            assets/img/photo_acceuil-mobile.webp

        # Version optimisée pour desktop (1280px de large)
        magick assets/img/photo_acceuil.jpg \
            -quality 80 \
            assets/img/photo_acceuil.webp

        echo "✅ Images hero créées:"
        echo "  - photo_acceuil-mobile.webp (800px)"
        echo "  - photo_acceuil.webp (1280px)"
    elif [ "$TOOL" = "sips" ]; then
        # sips ne supporte pas WebP, mais peut optimiser le JPEG
        sips -s format jpeg \
             -s formatOptions high \
             assets/img/photo_acceuil.jpg \
             --out assets/img/photo_acceuil-optimized.jpg

        echo "⚠️  sips ne supporte pas WebP"
        echo "    Utilisez un outil en ligne: https://squoosh.app"
        echo "    Ou installez ImageMagick: brew install imagemagick"
    fi
}

# Afficher les statistiques
show_stats() {
    echo ""
    echo "📊 Statistiques d'optimisation:"
    echo ""

    if [ -f assets/images/logo.webp ] && [ -f assets/images/logo-small.webp ]; then
        echo "Logo:"
        echo "  Avant: $(ls -lh assets/images/logo.webp | awk '{print $5}')"
        echo "  Après: $(ls -lh assets/images/logo-small.webp | awk '{print $5}')"
    fi

    if [ -f assets/img/photo_acceuil.jpg ]; then
        echo ""
        echo "Image hero:"
        echo "  Original JPG: $(ls -lh assets/img/photo_acceuil.jpg | awk '{print $5}')"
        [ -f assets/img/photo_acceuil.webp ] && \
            echo "  WebP desktop: $(ls -lh assets/img/photo_acceuil.webp | awk '{print $5}')"
        [ -f assets/img/photo_acceuil-mobile.webp ] && \
            echo "  WebP mobile: $(ls -lh assets/img/photo_acceuil-mobile.webp | awk '{print $5}')"
    fi
}

# Exécution principale
main() {
    if ! check_tools; then
        exit 1
    fi

    optimize_logo
    optimize_hero
    show_stats

    echo ""
    echo "✨ Optimisation terminée!"
    echo ""
    echo "📝 Prochaines étapes:"
    echo "  1. Mettez à jour index.html pour utiliser logo-small.webp"
    echo "  2. Utilisez <picture> avec srcset pour l'image hero"
    echo "  3. Relancez Lighthouse pour voir les améliorations"
}

main
