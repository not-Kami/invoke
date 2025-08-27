# 4. Backend

## 4.1 Architecture générale

### Stack technique
- **Node 18** : Runtime JavaScript moderne avec support ES modules
- **Express 4** : Framework web minimaliste et flexible
- **MongoDB Atlas** : Base de données NoSQL cloud avec haute disponibilité
- **Mongoose 8.14.0** : ODM pour MongoDB avec validation et middleware

### Architecture modulaire
- **Resources pattern** : Séparation des responsabilités par entité métier
- **Structure des dossiers** : `src/resources/[module]/` pour chaque module
- **Séparation des couches** : Routes → Contrôleurs → Services → Modèles
- **Injection de dépendances** : Architecture modulaire et testable

### Configuration centralisée
- **Middlewares globaux** : CORS, Helmet, rate limiting, logging
- **Gestion d'erreurs** : AppError custom avec codes HTTP appropriés
- **Logs Winston** : Système de logging avec rotation et niveaux configurables
- **Variables d'environnement** : Configuration sécurisée via dotenv

### Sécurité
- **Helmet** : Headers de sécurité HTTP (XSS, CSRF, etc.)
- **CORS** : Whitelisting des domaines autorisés
- **Rate limiting** : Protection contre les attaques par déni de service
- **JWT** : Tokens avec expiration et refresh automatique
- **Cookies sécurisés** : HttpOnly, Secure, SameSite

## 4.2 API REST – routes détaillées

### Utilisateurs
| Méthode | Route | Contrôleur | Validation |
|---------|-------|------------|------------|
| GET | /api/v1/users | userController.getAll | — |
| GET | /api/v1/users/:id | userController.getById | — |
| POST | /api/v1/users | userController.create | Joi.userSchema |
| PATCH | /api/v1/users/:id | userController.update | Joi.userUpdateSchema |
| DELETE | /api/v1/users/:id | userController.delete | — |
| POST | /api/v1/users/:id/avatar | userController.uploadAvatar | Multer + validation |

### Authentification
| Méthode | Route | Contrôleur | Note |
|---------|-------|------------|------|
| POST | /auth/signup | authController.signup | JWT issued + cookies |
| POST | /auth/login | authController.login | JWT + cookies sécurisés |
| POST | /auth/logout | authController.logout | Suppression cookies |
| GET | /auth/me | authController.getMe | Profil utilisateur connecté |

### Jeux
| Méthode | Route | Contrôleur | Validation |
|---------|-------|------------|------------|
| GET | /api/v1/games | gameController.getAll | — |
| GET | /api/v1/games/featured | gameController.getFeatured | — |
| GET | /api/v1/games/:id | gameController.getById | — |
| POST | /api/v1/games | gameController.create | Joi.gameSchema |
| PATCH | /api/v1/games/:id | gameController.update | Joi.gameUpdateSchema |
| DELETE | /api/v1/games/:id | gameController.delete | — |

### Sessions
| Méthode | Route | Contrôleur | Validation |
|---------|-------|------------|------------|
| GET | /api/v1/sessions | sessionController.getAll | — |
| GET | /api/v1/sessions/featured | sessionController.getFeatured | — |
| GET | /api/v1/sessions/:id | sessionController.getById | — |
| POST | /api/v1/sessions | sessionController.create | Joi.sessionSchema |
| PATCH | /api/v1/sessions/:id | sessionController.update | Joi.sessionUpdateSchema |
| DELETE | /api/v1/sessions/:id | sessionController.delete | — |

### Campagnes
| Méthode | Route | Contrôleur | Validation |
|---------|-------|------------|------------|
| GET | /api/v1/campaigns | campaignController.getAll | — |
| GET | /api/v1/campaigns/:id | campaignController.getById | — |
| POST | /api/v1/campaigns | campaignController.create | Joi.campaignSchema |
| PATCH | /api/v1/campaigns/:id | campaignController.update | Joi.campaignUpdateSchema |
| DELETE | /api/v1/campaigns/:id | campaignController.delete | — |

### Gestion des favoris et maîtrisés
| Méthode | Route | Contrôleur | Validation |
|---------|-------|------------|------------|
| GET | /api/v1/users/:id/favorites | userController.getFavoriteGames | — |
| POST | /api/v1/users/:id/favorites | userController.addFavoriteGame | Joi.gameIdSchema |
| DELETE | /api/v1/users/:id/favorites/:gameId | userController.removeFavoriteGame | — |
| GET | /api/v1/users/:id/mastered | userController.getMasteredGames | — |
| POST | /api/v1/users/:id/mastered | userController.addMasteredGame | Joi.gameIdSchema |
| DELETE | /api/v1/users/:id/mastered/:gameId | userController.removeMasteredGame | — |

### Gestion des rôles
| Méthode | Route | Contrôleur | Validation |
|---------|-------|------------|------------|
| PATCH | /api/v1/users/:id/role | userController.updateRole | Joi.roleUpdateSchema |

## 4.3 Modèles (Mongoose)

### User
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  nickname: String,
  avatar: String (URL image),
  role: String (enum: 'user', 'admin'),
  isDM: Boolean (default: false),
  favorite_games: [ObjectId ref: 'Game'],
  mastered_games: [ObjectId ref: 'Game'],
  bio: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Game
```javascript
{
  name: String (unique, required),
  system: String (required),
  genre: String,
  complexity: String (enum: 'Beginner', 'Intermediate', 'Expert'),
  description: String,
  image: String (URL),
  featured: Boolean (default: false),
  sessions: [ObjectId ref: 'Session'],
  createdAt: Date,
  updatedAt: Date
}
```

### Session
```javascript
{
  title: String (required),
  game: ObjectId ref: 'Game' (required),
  dm: ObjectId ref: 'User' (required),
  date: Date (required),
  time: String (required),
  timezone: String (default: 'UTC+1'),
  maxPlayers: Number (default: 6),
  players: [ObjectId ref: 'User'],
  status: String (enum: 'open', 'full', 'closed', 'finished', 'cancelled'),
  description: String,
  image: String (URL),
  featured: Boolean (default: false),
  campaign: ObjectId ref: 'Campaign'),
  createdAt: Date,
  updatedAt: Date
}
```

### Campaign
```javascript
{
  title: String (required),
  game: ObjectId ref: 'Game' (required),
  dm: ObjectId ref: 'User' (required),
  description: String,
  players: [ObjectId ref: 'User'],
  sessions: [ObjectId ref: 'Session'],
  status: String (enum: 'active', 'paused', 'finished'),
  featured: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## 4.4 Contrôleurs – logique métier

### Architecture
- **catchAsync** → validation → service → response helper
- **Gestion d'erreurs** : AppError custom avec codes HTTP appropriés
- **Validation** : Joi schemas pour chaque entrée utilisateur
- **Permissions** : Middlewares spécialisés par type d'opération

### Middlewares spécialisés
- **`canUpdateProfile`** : Vérification des permissions de modification de profil
- **`canManageFavoriteGames`** : Gestion des jeux favoris
- **`canManageMasteredGames`** : Gestion des jeux maîtrisés
- **`canUpdateRole`** : Modification des rôles utilisateur

### Gestion des erreurs
- **AppError** : Classe d'erreur personnalisée avec codes HTTP
- **catchAsync** : Wrapper pour la gestion automatique des erreurs async
- **Validation** : Erreurs de validation Joi avec messages clairs
- **Logs** : Enregistrement des erreurs avec Winston

## 4.5 Sécurité & performances

### Helmet
- **Headers de sécurité** : XSS, CSRF, clickjacking, etc.
- **Configuration** : Paramètres optimisés pour la sécurité
- **Mise à jour** : Version la plus récente avec patches de sécurité

### CORS
- **Whitelisting** : Domaines autorisés configurés
- **Options** : Méthodes HTTP et headers autorisés
- **Credentials** : Support des cookies et authentification

### Rate limiting
- **Express-rate-limit** : Limitation par IP et par route
- **Configuration** : Windows de temps et limites configurables
- **Gestion** : Headers de quota et messages d'erreur

### JWT
- **Tokens** : Signature avec clé secrète sécurisée
- **Expiration** : TTL configurable avec refresh automatique
- **Cookies** : Stockage sécurisé avec flags appropriés

### Logs Winston
- **Rotation quotidienne** : Fichiers organisés par date
- **Niveaux configurables** : Error, Warn, Info, Debug
- **Formats** : JSON structuré pour l'analyse
- **Performance** : Logging asynchrone non-bloquant

## 4.6 Tests & CI

### Framework
- **Jest** : Framework de test JavaScript moderne
- **Supertest** : Tests d'intégration des routes API
- **Couverture visée** : 80% minimum du code

### Tests unitaires
- **Contrôleurs** : Logique métier et gestion d'erreurs
- **Services** : Fonctions utilitaires et helpers
- **Modèles** : Validation des schémas Mongoose

### Tests d'intégration
- **Routes API** : End-to-end des endpoints
- **Base de données** : Opérations CRUD complètes
- **Authentification** : JWT et permissions

### CI/CD
- **Pipeline automatisé** : Tests et déploiement
- **Qualité du code** : Linting et formatage
- **Sécurité** : Audit des dépendances

---

*[Retour au sommaire](./README.md)*
