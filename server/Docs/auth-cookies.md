# Authentification avec Cookies

## Vue d'ensemble

L'application utilise maintenant un système d'authentification basé sur les cookies HTTP-only pour une sécurité renforcée, tout en maintenant la compatibilité avec l'authentification par token Bearer.

## Fonctionnalités

### 🔐 Sécurité renforcée
- **Cookies HTTP-only** : Les tokens JWT ne sont plus accessibles via JavaScript côté client
- **SameSite=Strict** : Protection contre les attaques CSRF
- **Secure en production** : Les cookies ne sont transmis que via HTTPS en production

### 🔄 Compatibilité
- **Rétrocompatibilité** : Les tokens Bearer dans les headers fonctionnent toujours
- **Priorité aux cookies** : Si un cookie et un header sont présents, le cookie est utilisé
- **Fallback automatique** : Si pas de cookie, le système vérifie les headers

## Configuration des cookies

```javascript
const COOKIE_CONFIG = {
    httpOnly: true,                    // Non accessible via JavaScript
    secure: process.env.NODE_ENV === 'production', // HTTPS en production
    sameSite: 'strict',                // Protection CSRF
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
    path: '/'                          // Disponible sur tout le site
};
```

## Endpoints d'authentification

### POST /api/v1/auth/signup
- **Fonction** : Créer un nouveau compte utilisateur
- **Cookie** : Définit automatiquement le cookie `token`
- **Réponse** : Retourne les données utilisateur (sans le token)

### POST /api/v1/auth/login
- **Fonction** : Se connecter avec email/mot de passe
- **Cookie** : Définit automatiquement le cookie `token`
- **Réponse** : Retourne les données utilisateur (sans le token)

### POST /api/v1/auth/logout
- **Fonction** : Se déconnecter
- **Cookie** : Supprime le cookie `token`
- **Réponse** : Message de confirmation

### GET /api/v1/auth/me
- **Fonction** : Récupérer les informations de l'utilisateur connecté
- **Authentification** : Requise (cookie ou header Bearer)

## Utilisation côté client

### Authentification automatique
Les cookies sont automatiquement envoyés avec chaque requête vers le serveur, donc aucune configuration spéciale n'est nécessaire côté client.

### Exemple avec fetch
```javascript
// Login - le cookie sera automatiquement défini
const loginResponse = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});

// Requêtes authentifiées - le cookie sera automatiquement envoyé
const userData = await fetch('/api/v1/auth/me', {
    method: 'GET'
});

// Logout - le cookie sera automatiquement supprimé
await fetch('/api/v1/auth/logout', {
    method: 'POST'
});
```

### Compatibilité avec les headers Bearer
Si vous devez utiliser les tokens dans les headers (pour les API externes par exemple) :

```javascript
// Extraire le token du cookie (si nécessaire)
const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

// Utiliser dans un header
const response = await fetch('/api/v1/auth/me', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
```

## Tests

### Exécuter les tests
```bash
npm test                    # Tous les tests
npm run test:watch         # Tests en mode watch
npm run test:coverage      # Tests avec couverture
```

### Tests d'authentification
- `auth.cookies.test.js` : Tests complets du système de cookies
- `auth.compatibility.test.js` : Tests de compatibilité avec les headers Bearer

### Scénarios testés
- ✅ Création de compte avec cookie
- ✅ Connexion avec cookie
- ✅ Déconnexion avec suppression de cookie
- ✅ Accès aux routes protégées avec cookie
- ✅ Compatibilité avec les headers Bearer
- ✅ Priorité cookie > header
- ✅ Gestion des tokens invalides
- ✅ Sécurité des cookies (HttpOnly, SameSite)

## Migration depuis l'ancien système

### Côté serveur
Aucune modification nécessaire - le système est rétrocompatible.

### Côté client
1. **Supprimer** la gestion manuelle des tokens dans le localStorage/sessionStorage
2. **Supprimer** l'envoi manuel des headers `Authorization`
3. **Les cookies sont automatiques** - aucune configuration requise

### Exemple de migration
```javascript
// AVANT (ancien système)
const token = localStorage.getItem('token');
const response = await fetch('/api/v1/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
});

// APRÈS (nouveau système)
const response = await fetch('/api/v1/auth/me'); // Cookie automatique
```

## Sécurité

### Avantages des cookies HTTP-only
- ✅ **Protection XSS** : Les tokens ne sont pas accessibles via JavaScript
- ✅ **Protection CSRF** : SameSite=Strict empêche les requêtes cross-site
- ✅ **Automatique** : Pas de gestion manuelle côté client
- ✅ **Expiration** : Gestion automatique de l'expiration

### Bonnes pratiques
- ✅ Utiliser HTTPS en production
- ✅ Configurer correctement les domaines
- ✅ Surveiller les tentatives d'accès non autorisées
- ✅ Implémenter une rotation des tokens si nécessaire

## Dépannage

### Problèmes courants

#### Cookie non défini
- Vérifier que `cookie-parser` est installé et configuré
- Vérifier les paramètres CORS pour les domaines
- Vérifier que le client envoie les cookies

#### Authentification échoue
- Vérifier que le cookie `token` est présent
- Vérifier la validité du token JWT
- Vérifier que l'utilisateur existe toujours en base

#### Problèmes CORS
- Configurer `credentials: 'include'` côté client
- Vérifier la configuration CORS côté serveur
- S'assurer que les domaines correspondent

### Debug
```javascript
// Vérifier les cookies côté serveur
console.log('Cookies:', req.cookies);

// Vérifier les headers
console.log('Authorization:', req.headers.authorization);
``` 