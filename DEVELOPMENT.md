# Guide de Développement - La Belle Bretagne

## 🛠️ Outils de Qualité

### ESLint
Configuration des règles de code JavaScript avec sécurité renforcée.

```bash
# Vérifier le code
npm run lint

# Corriger automatiquement
npm run lint:fix
```

### Prettier  
Formatage automatique du code pour une cohérence maximale.

```bash
# Formater tous les fichiers
npm run prettier

# Vérifier le formatage
npm run prettier:check
```

### Commandes de Développement

```bash
# Installation des dépendances de développement
npm install

# Vérification complète (lint + format)
npm run dev

# Build final avec corrections automatiques
npm run build
```

## 🔐 Sécurité

Le projet utilise un système de sécurité multicouches :

- **Sanitisation XSS** : Module `js/security.js` avec DOMPurify
- **Validation des entrées** : Toutes les entrées utilisateur sont validées
- **innerHTML sécurisé** : Utilisation de `Security.safeSetInnerHTML()`
- **Rate limiting** : Protection contre les requêtes abusives
- **CSRF tokens** : Protection contre les attaques CSRF
- **CSP** : Content Security Policy via meta tags

### Utilisation sécurisée

```javascript
// ✅ Correct - Utilisation sécurisée
if (window.Security && window.Security.safeSetInnerHTML) {
    window.Security.safeSetInnerHTML(element, htmlContent);
} else {
    element.innerHTML = htmlContent; // Fallback
}

// ❌ Éviter - innerHTML direct avec données utilisateur
element.innerHTML = userInput; // Risque XSS
```

## 📝 Standards de Code

### JavaScript
- ES2021+ moderne avec fonctionnalités async/await
- Pas de `console.log()` en production (seulement `console.error/warn`)
- Validation des entrées systématique
- JSDoc pour les fonctions principales

### CSS
- Variables CSS pour la cohérence des couleurs
- !important réduit au minimum (51 occurrences nécessaires)
- Architecture mobile-first
- Utilisation de classes spécifiques plutôt que !important

### HTML
- Sémantique correcte
- Meta tags SEO complets
- Progressive Web App ready
- Accessibilité (ARIA labels)

## 📊 Améliorations Apportées

### Phase 1 : Nettoyage
- ✅ Suppression de 147+ logs de debug
- ✅ Élimination du code de test (`testFilters`)
- ✅ Nettoyage des commentaires temporaires

### Phase 2 : Sécurité
- ✅ Remplacement innerHTML → `Security.safeSetInnerHTML()`
- ✅ Protection contre XSS sur tous les templates
- ✅ Sécurisation des messages d'erreur

### Phase 3 : CSS
- ✅ Réduction !important : 83 → 51 (-38%)
- ✅ Amélioration spécificité des sélecteurs
- ✅ Optimisation responsive

### Phase 4 : Outillage
- ✅ ESLint configuré avec règles de sécurité
- ✅ Prettier pour formatage automatique
- ✅ Scripts npm pour workflow de développement

### Phase 5 : Documentation
- ✅ JSDoc pour fonctions critiques
- ✅ Guide de développement
- ✅ Standards de code documentés

## 🚀 Déploiement

### Avant déploiement
```bash
# Vérification complète
npm run build

# Tests manuels recommandés
- Vérifier la carte interactive
- Tester les filtres
- Valider la sécurité des formulaires
- Contrôler les performances mobile
```

### Surveillance
- Utiliser les outils de développement pour surveiller :
  - Erreurs JavaScript (console)  
  - Performance (Lighthouse)
  - Sécurité (CSP violations)
  - Accessibilité (axe-core)

## 🔧 Architecture

```
labellebretagne/
├── js/
│   ├── app.js          # Application principale
│   ├── security.js     # Module sécurité (critique)
│   ├── utils.js        # Utilitaires
│   ├── filters.js      # Gestion filtres
│   └── ...
├── css/
│   ├── styles.css      # Styles principaux
│   └── responsive.css  # Media queries
├── .eslintrc.json      # Configuration ESLint
├── .prettierrc.json    # Configuration Prettier
└── package.json        # Scripts et dépendances
```

## 💡 Bonnes Pratiques

1. **Toujours** utiliser les fonctions du module Security
2. **Tester** les modifications avec les outils de dev
3. **Documenter** les nouvelles fonctionnalités
4. **Respecter** les conventions de nommage
5. **Éviter** les !important sauf nécessité absolue