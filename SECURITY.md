# 🔒 SÉCURITÉ - LA BELLE BRETAGNE

## Mesures de sécurité implémentées

### 1. **Headers de sécurité** (`.htaccess`)
- ✅ **Content Security Policy (CSP)** - Protection contre XSS
- ✅ **X-Frame-Options** - Protection contre clickjacking
- ✅ **X-Content-Type-Options** - Prévention du MIME sniffing
- ✅ **X-XSS-Protection** - Protection XSS pour anciens navigateurs
- ✅ **Referrer Policy** - Contrôle des informations de référence
- ✅ **Permissions Policy** - Restriction des APIs sensibles

### 2. **Protection contre les attaques** (`.htaccess`)
- ✅ **Blocage de fichiers sensibles** - .htaccess, .git, .env, etc.
- ✅ **Protection SQL injection/XSS** - Filtrage des paramètres URL
- ✅ **Blocage user agents malveillants** - Bots et scrapers
- ✅ **Limitation taille requêtes** - Prévention DoS (10MB max)
- ✅ **Désactivation index directories** - Pas de listing des dossiers

### 3. **Sécurité côté client** (`js/security.js`)
- ✅ **Sanitisation HTML** - Nettoyage des entrées utilisateur
- ✅ **Validation des données** - Types et formats contrôlés
- ✅ **localStorage sécurisé** - Stockage avec validation
- ✅ **Protection JSON** - Vérification intégrité des données
- ✅ **Rate limiting** - Limitation des requêtes (60/min)
- ✅ **CSRF tokens** - Protection contre les attaques cross-site
- ✅ **Contrôle window.open** - Blocage URLs non autorisées

### 4. **Sécurisation du code existant**
- ✅ **Favoris sécurisés** - Utilisation du module de sécurité
- ✅ **Validation des entrées** - Toutes les données utilisateur
- ✅ **Scripts chargés** - Module security.js sur toutes les pages

## Configuration recommandée

### Serveur Web (Apache)
```apache
# Activer mod_security si disponible
<IfModule mod_security.c>
    SecRuleEngine On
    SecRequestBodyAccess On
    SecResponseBodyAccess Off
</IfModule>

# Headers additionnels pour HTTPS
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
```

### HTTPS (Recommandé en production)
```bash
# Obtenir un certificat SSL/TLS gratuit avec Let's Encrypt
sudo certbot --apache -d votre-domaine.com
```

## Bonnes pratiques

### ✅ **À faire**
- Maintenir les dépendances à jour (Leaflet, Font Awesome)
- Monitorer les logs d'accès pour détecter les attaques
- Sauvegarder régulièrement les données
- Tester la sécurité avec des outils comme OWASP ZAP
- Utiliser HTTPS en production

### ❌ **À éviter**
- Jamais de données sensibles dans le code client
- Ne pas désactiver les mesures de sécurité
- Éviter les CDN non fiables
- Ne pas stocker de mots de passe en localStorage

## Monitoring et alertes

### Logs à surveiller
```bash
# Erreurs 403/404 fréquentes
tail -f /var/log/apache2/access.log | grep "403\|404"

# Tentatives d'injection
tail -f /var/log/apache2/access.log | grep -i "script\|select\|union"
```

### Tests de sécurité automatiques
- **CSP Validator** : https://csp-evaluator.withgoogle.com/
- **Security Headers** : https://securityheaders.com/
- **SSL Test** : https://www.ssllabs.com/ssltest/

## Incident Response

### En cas d'attaque détectée
1. **Isoler** - Bloquer l'IP attaquante
2. **Analyser** - Examiner les logs
3. **Nettoyer** - Supprimer tout code malveillant
4. **Renforcer** - Ajouter des règles de protection
5. **Documenter** - Enregistrer l'incident

### Contacts d'urgence
- **Hébergeur** : Support technique
- **CNIL** : Si données personnelles compromises
- **ANSSI** : Pour les attaques importantes

## Audit de sécurité

### Checklist mensuelle
- [ ] Vérifier les logs d'accès
- [ ] Tester les formulaires contre XSS
- [ ] Vérifier les headers de sécurité
- [ ] Contrôler les permissions fichiers
- [ ] Mettre à jour les dépendances

### Tools d'audit recommandés
- **Nmap** - Scan des ports
- **Nikto** - Scan vulnérabilités web
- **OWASP ZAP** - Test de pénétration
- **Wapiti** - Détection XSS/SQL injection

## Conformité RGPD

### Données collectées
- ✅ **Favoris utilisateur** - localStorage, révocable
- ✅ **Préférences carte** - localStorage, révocable
- ✅ **Géolocalisation** - Demande permission explicite

### Droits utilisateur
- **Accès** - Via localStorage du navigateur
- **Rectification** - Modification directe possible
- **Suppression** - Vidage localStorage
- **Portabilité** - Export JSON possible

---

*Dernière mise à jour : 27 août 2025*
*Version : 1.0*