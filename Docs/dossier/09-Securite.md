# 9. Sécurité et protection des données

## 9.1 Gestion des accès et rôles (RBAC)

### Modèle RBAC implémenté
- **Rôles principaux** : `user`, `admin`
- **Attributs dynamiques** : `isDM` pour les maîtres de jeu
- **Permissions granulaires** : Accès par ressource et opération
- **Évolution des rôles** : Promotion DM avec validation

### Hiérarchie des permissions
```
Admin (role: 'admin')
├── Accès complet à toutes les ressources
├── Gestion des utilisateurs et contenus
├── Configuration système
└── Modération et support

Maître de Jeu (isDM: true)
├── Création de sessions et campagnes
├── Gestion des joueurs
├── Modification de ses contenus
└── Accès aux outils DM

Utilisateur standard (role: 'user', isDM: false)
├── Lecture des contenus publics
├── Participation aux sessions
├── Gestion de son profil
└── Gestion de ses favoris
```

### Middlewares de sécurité
- **`protect`** : Vérification de l'authentification
- **`restrictTo`** : Contrôle des rôles
- **`canUpdateProfile`** : Modification de profil autorisée
- **`canManageFavoriteGames`** : Gestion des jeux favoris
- **`canManageMasteredGames`** : Gestion des jeux maîtrisés

## 9.2 Chiffrement, HTTPS et HSTS

### Chiffrement des données
- **Mots de passe** : Hachage bcrypt avec salt
- **JWT** : Signature avec clé secrète forte
- **Cookies** : Chiffrement des données sensibles
- **Base de données** : Connexion TLS vers MongoDB Atlas

### Configuration HTTPS
- **Certificats SSL** : Let's Encrypt ou fournisseur d'hébergement
- **Redirection HSTS** : HTTP → HTTPS automatique
- **Headers de sécurité** : Helmet.js pour la protection
- **Mixed content** : Blocage des ressources non sécurisées

### Headers de sécurité HTTP
```javascript
// Configuration Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## 9.3 Conformité RGPD et stockage des données utilisateur

### Principes RGPD appliqués
- **Minimisation** : Collecte limitée aux données nécessaires
- **Transparence** : Politique de confidentialité claire
- **Consentement** : Acceptation explicite des conditions
- **Droit à l'oubli** : Suppression des données sur demande

### Données personnelles collectées
- **Identifiants** : Email, nom, prénom, pseudo
- **Préférences** : Jeux favoris et maîtrisés
- **Activité** : Historique des sessions et participations
- **Métadonnées** : Timestamps, IP (pour la sécurité)

### Gestion des droits utilisateur
- **Accès** : Consultation de ses données personnelles
- **Rectification** : Modification des informations
- **Portabilité** : Export des données (perspectives)
- **Suppression** : Compte et données supprimés

### Politique de rétention
- **Données actives** : Conservées tant que le compte est actif
- **Données supprimées** : Suppression définitive après 30 jours
- **Logs de sécurité** : Conservation 1 an pour audit
- **Backups** : Chiffrement et rotation automatique

## 9.4 Plan de récupération et sauvegardes

### Stratégie de sauvegarde
- **Base de données** : MongoDB Atlas avec sauvegarde automatique
- **Fichiers uploadés** : Synchronisation vers stockage cloud
- **Configuration** : Versioning Git avec tags de release
- **Fréquence** : Sauvegarde quotidienne avec rétention 30 jours

### Plan de récupération
- **RTO (Recovery Time Objective)** : 4 heures maximum
- **RPO (Recovery Point Objective)** : 24 heures maximum
- **Procédures** : Documentation détaillée des étapes
- **Tests** : Validation trimestrielle des procédures

### Gestion des incidents
- **Détection** : Monitoring automatique et alertes
- **Escalade** : Procédure de notification des équipes
- **Communication** : Plan de communication utilisateurs
- **Post-mortem** : Analyse et amélioration des processus

## 9.5 Sécurité de l'API

### Protection contre les attaques
- **Rate limiting** : Limitation des requêtes par IP
- **CORS** : Whitelisting des domaines autorisés
- **Validation** : Sanitisation des entrées avec Joi
- **Injection** : Protection contre NoSQL injection

### Configuration du rate limiting
```javascript
// Rate limiting par route
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite par IP
  message: 'Trop de requêtes depuis cette IP',
  standardHeaders: true,
  legacyHeaders: false,
});

// Application aux routes sensibles
app.use('/api/v1/auth', limiter);
app.use('/api/v1/users', limiter);
```

### Monitoring de sécurité
- **Logs d'accès** : Traçabilité des requêtes API
- **Détection d'anomalies** : Alertes sur comportements suspects
- **Métriques** : Nombre de tentatives d'accès, taux d'erreur
- **Audit** : Revue régulière des logs de sécurité

## 9.6 Sécurité frontend

### Protection côté client
- **Validation** : Double validation client/serveur
- **Sanitisation** : Échappement des données utilisateur
- **XSS** : Protection contre les attaques cross-site scripting
- **CSRF** : Tokens de protection contre la falsification

### Gestion des sessions
- **JWT sécurisés** : Expiration et rotation automatique
- **Cookies sécurisés** : HttpOnly, Secure, SameSite
- **Déconnexion** : Invalidation immédiate des tokens
- **Multi-device** : Gestion des connexions multiples

---

*[Retour au sommaire](./README.md)*
