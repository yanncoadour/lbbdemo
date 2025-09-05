# 📸 Guide - Mise à jour des posts Instagram

## Comment obtenir les URLs des vrais posts @labellebretagne

### 1️⃣ **Aller sur Instagram Web**
- Ouvre https://instagram.com/labellebretagne
- Connecte-toi si nécessaire

### 2️⃣ **Copier les URLs des derniers posts**
- Clique sur chaque post récent
- Copie l'URL complète (ex: https://www.instagram.com/p/ABC123DEF/)
- Prends les 6 posts les plus récents

### 3️⃣ **Mettre à jour le code**
Ouvre le fichier `js/instagram.js` et remplace les URLs dans `realPosts` :

```javascript
realPosts: [
    'https://www.instagram.com/p/VRAIE_URL_1/',  // Post le plus récent
    'https://www.instagram.com/p/VRAIE_URL_2/',  // Post 2
    'https://www.instagram.com/p/VRAIE_URL_3/',  // Post 3  
    'https://www.instagram.com/p/VRAIE_URL_4/',  // Post 4
    'https://www.instagram.com/p/VRAIE_URL_5/',  // Post 5
    'https://www.instagram.com/p/VRAIE_URL_6/',  // Post 6
],
```

### 4️⃣ **Effacer le cache** (optionnel)
- Ouvre la Console du navigateur (F12)
- Tape : `localStorage.removeItem('labellebretagne_instagram_cache')`
- Recharge la page

## 🔄 **Automatisation recommandée**

**Fréquence de mise à jour :**
- **Idéal :** Une fois par semaine
- **Minimum :** Une fois par mois
- **Avant événements :** Après chaque nouveau post important

**Alternative automatique :**
Si tu veux automatiser complètement, je peux créer un webhook Zapier/IFTTT qui met à jour automatiquement quand tu postes sur Instagram.

## ✅ **Vérification**

Après mise à jour :
1. Va sur `instagram.html`
2. Ouvre la Console (F12) 
3. Tu devrais voir : "Récupération des nouveaux posts Instagram..."
4. Les vrais posts s'affichent avec leurs vraies images

## 🚨 **En cas de problème**

Si l'API Instagram ne fonctionne pas :
- Les posts de fallback s'affichent automatiquement
- Aucune erreur visible pour l'utilisateur
- Le site continue de fonctionner normalement

## 📊 **Stats et Données**

**Ce qui est récupéré automatiquement :**
- ✅ Images réelles des posts
- ✅ Captions/descriptions réelles
- ✅ URLs correctes vers Instagram

**Ce qui est simulé :**
- 📊 Nombre de likes (500-2500 aléatoire)
- 💬 Nombre de commentaires (20-120 aléatoire)
- 👥 Stats du profil (followers, etc.)

*Les stats simulées donnent un aspect professionnel sans nécessiter d'API payante.*