# 🌍 GUIDE DE TRADUCTION MULTILINGUE - La Belle Bretagne

Ce guide explique comment déployer le système de traduction sur **toutes les pages** du site.

## 📋 Table des matières

1. [Langues supportées](#langues-supportées)
2. [Fichiers du système](#fichiers-du-système)
3. [Installation sur une nouvelle page](#installation-sur-une-nouvelle-page)
4. [Ajouter des traductions](#ajouter-des-traductions)
5. [Exemples pratiques](#exemples-pratiques)

---

## 🌐 Langues supportées

Le système supporte **9 langues** :

| Langue | Code | Drapeau |
|--------|------|---------|
| Français | `fr` | 🇫🇷 |
| English | `en` | 🇬🇧 |
| Deutsch | `de` | 🇩🇪 |
| Español | `es` | 🇪🇸 |
| Italiano | `it` | 🇮🇹 |
| Nederlands | `nl` | 🇳🇱 |
| Português | `pt` | 🇵🇹 |
| 中文 | `zh` | 🇨🇳 |
| 日本語 | `ja` | 🇯🇵 |

---

## 📁 Fichiers du système

### Fichiers créés :

```
labellebretagne/
├── css/
│   └── language-selector.css          # Styles du sélecteur de langue
├── js/
│   ├── translations.js                # Dictionnaire de traductions
│   └── language-selector.js           # Logique du sélecteur
└── components/
    └── language-selector.html         # Composant HTML à copier
```

### Fichiers à inclure dans **chaque page** :

```html
<head>
    <!-- ... autres CSS ... -->
    <link rel="stylesheet" href="css/language-selector.css">
</head>

<body>
    <!-- ... contenu ... -->

    <!-- AVANT la fermeture </body> -->
    <script src="js/translations.js"></script>
    <script src="js/language-selector.js"></script>
</body>
```

---

## 🚀 Installation sur une nouvelle page

### **Étape 1 : Ajouter les CSS**

Dans le `<head>` de votre page :

```html
<link rel="stylesheet" href="css/language-selector.css">
```

### **Étape 2 : Ajouter le sélecteur de langue**

Dans le `<nav>` du header, **AVANT le bouton hamburger** :

```html
<!-- Copier le contenu de components/language-selector.html -->
<div class="language-selector">
    <button class="language-btn" id="languageBtn" onclick="toggleLanguageDropdown()">
        <span class="flag" id="currentFlag">🇫🇷</span>
        <span id="currentLang">FR</span>
        <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
    </button>
    <div class="language-dropdown" id="languageDropdown">
        <!-- ... options de langues ... -->
    </div>
</div>
```

### **Étape 3 : Ajouter les scripts**

**AVANT** la fermeture `</body>` :

```html
<!-- IMPORTANT: Dans cet ordre -->
<script src="js/translations.js"></script>
<script src="js/language-selector.js"></script>
```

### **Étape 4 : Ajouter des attributs de traduction**

Sur **tous les éléments** à traduire, ajoutez l'attribut `data-translate` :

```html
<!-- Liens de navigation -->
<a href="index.html" data-translate="nav.home">Accueil</a>
<a href="carte.html" data-translate="nav.map">Carte</a>

<!-- Titres -->
<h1 data-translate="hero.title">Découvrez la Bretagne</h1>

<!-- Boutons -->
<button data-translate="buttons.discoverMore">En savoir plus</button>

<!-- Placeholders (pour les inputs) -->
<input type="text" placeholder="Rechercher..." data-translate="search.placeholder">
```

---

## ➕ Ajouter des traductions

### **1. Ouvrir `js/translations.js`**

### **2. Ajouter une nouvelle clé de traduction**

Exemple : Ajouter "Bienvenue"

```javascript
const translations = {
    // ... autres traductions ...

    welcome: {
        title: {
            fr: 'Bienvenue en Bretagne',
            en: 'Welcome to Brittany',
            de: 'Willkommen in der Bretagne',
            es: 'Bienvenido a Bretaña',
            it: 'Benvenuto in Bretagna',
            nl: 'Welkom in Bretagne',
            pt: 'Bem-vindo à Bretanha',
            zh: '欢迎来到布列塔尼',
            ja: 'ブルターニュへようこそ'
        }
    }
};
```

### **3. Utiliser dans le HTML**

```html
<h2 data-translate="welcome.title">Bienvenue en Bretagne</h2>
```

---

## 📝 Exemples pratiques

### **Exemple 1 : Traduire un menu**

```html
<nav>
    <ul>
        <li><a href="index.html" data-translate="nav.home">Accueil</a></li>
        <li><a href="carte.html" data-translate="nav.map">Carte</a></li>
        <li><a href="logements.html" data-translate="nav.accommodations">Hébergements</a></li>
        <li><a href="festivals.html" data-translate="nav.festivals">Festivals</a></li>
    </ul>
</nav>
```

### **Exemple 2 : Traduire un formulaire**

```html
<form>
    <input type="text" placeholder="Votre nom" data-translate="forms.name">
    <input type="email" placeholder="Votre email" data-translate="forms.email">
    <textarea placeholder="Votre message" data-translate="forms.message"></textarea>
    <button type="submit" data-translate="forms.send">Envoyer</button>
</form>
```

### **Exemple 3 : Traduire un bouton dynamique**

```html
<button data-translate="buttons.book">Réserver</button>
```

### **Exemple 4 : Traduire du contenu complexe**

```html
<section>
    <h2 data-translate="sections.popularPlaces">Lieux populaires</h2>
    <p data-translate="descriptions.brittany">
        La Bretagne est une région magnifique...
    </p>
    <a href="#" data-translate="buttons.seeAll">Voir tout</a>
</section>
```

---

## 🎯 Traductions déjà disponibles

### **Navigation**
- `nav.home` → Accueil
- `nav.map` → Carte
- `nav.accommodations` → Hébergements
- `nav.festivals` → Festivals
- `nav.blog` → Blog
- `nav.instagram` → Instagram

### **Recherche**
- `search.placeholder` → Rechercher un lieu...
- `search.searchBtn` → Rechercher
- `search.myLocation` → Ma position
- `search.filters` → Filtres

### **Catégories**
- `categories.monument` → Monument
- `categories.beach` → Plage
- `categories.village` → Village
- `categories.castle` → Château
- `categories.hotel` → Hôtel
- `categories.unusualAccommodation` → Logement Insolite
- ... (voir `translations.js` pour la liste complète)

### **Boutons**
- `buttons.discoverMore` → En savoir plus
- `buttons.discover` → Découvrir
- `buttons.book` → Réserver
- `buttons.close` → Fermer
- `buttons.seeAll` → Voir tout

### **Messages**
- `messages.tested` → Testé par La Belle Bretagne
- `messages.noResults` → Aucun résultat trouvé
- `messages.loading` → Chargement...

### **Footer**
- `footer.madeWith` → Made with ❤️ en Bretagne
- `footer.copyright` → Guide touristique de Bretagne
- `footer.contact` → Nous contacter
- `footer.about` → Qui sommes-nous
- ... (voir `translations.js` pour la liste complète)

---

## ⚡ Fonctionnement

1. **L'utilisateur change de langue** → Clic sur le sélecteur
2. **La langue est sauvegardée** → localStorage
3. **La fonction `translatePage(langCode)` est appelée**
4. **Tous les éléments avec `data-translate` sont traduits**
5. **Au prochain chargement** → La langue sauvegardée est restaurée

---

## 🔧 Configuration avancée

### **Traduction programmatique**

Vous pouvez aussi traduire du contenu en JavaScript :

```javascript
// Obtenir une traduction
const translation = getTranslation('nav.home', 'en'); // "Home"

// Traduire toute la page
translatePage('de'); // Traduit tout en allemand
```

### **Ajouter une nouvelle langue**

1. Ouvrir `js/language-selector.js`
2. Ajouter la langue dans l'objet `languages`
3. Ajouter l'option dans `components/language-selector.html`
4. Ajouter les traductions dans `js/translations.js`

---

## ✅ Checklist de déploiement

Pour déployer sur une nouvelle page :

- [ ] Ajouter `<link rel="stylesheet" href="css/language-selector.css">` dans le `<head>`
- [ ] Copier le composant sélecteur de langue dans le `<nav>`
- [ ] Ajouter `<script src="js/translations.js"></script>` avant `</body>`
- [ ] Ajouter `<script src="js/language-selector.js"></script>` après translations.js
- [ ] Ajouter l'attribut `data-translate` sur tous les éléments à traduire
- [ ] Tester en changeant de langue dans le navigateur

---

## 🎉 C'est prêt !

Votre site est maintenant **multilingue** et accessible à un public international ! 🌍

Pour toute question, consultez les fichiers d'exemples dans `components/` ou la page `carte.html` qui est déjà entièrement configurée.
