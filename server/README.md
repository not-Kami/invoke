# 🚀 INVOKE Backend - API REST Node.js + Express + MongoDB

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.14.0-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](../LICENSE)

**Backend robuste et sécurisé** pour la plateforme INVOKE, construite avec Node.js, Express et MongoDB. API REST complète pour la gestion de communautés de jeux de rôle sur table avec authentification JWT, gestion des rôles et système de permissions granulaires.

## 🚀 Démo Live

- **URL API** : [http://localhost:3000](http://localhost:3000)
- **Base API** : `http://localhost:3000/api/v1`
- **Documentation** : [Insomnia Collection](./insomnia_collection_complete.json)
- **Logs** : [server.log](./server.log)

## ✨ Fonctionnalités Backend

### 🔐 Authentification & Sécurité
- **JWT (JSON Web Tokens)** avec cookies sécurisés
- **Système de rôles** (Admin, User, DM) avec permissions granulaires
- **Middleware de sécurité** : Helmet, CORS, Rate Limiting
- **Validation des données** avec Joi
- **Gestion des sessions** avec expiration automatique

### 👥 Gestion des Utilisateurs
- **CRUD complet** des profils utilisateurs
- **Upload d'avatars** avec Multer
- **Gestion des rôles** et permissions
- **Système de favoris** et jeux maîtrisés
- **Profils personnalisables** avec informations RPG

### 🎲 Gestion des Jeux
- **Catalogue RPG complet** avec genres et systèmes
- **Recherche et filtrage** avancés
- **Gestion des métadonnées** (éditeurs, années, etc.)
- **Interface d'administration** pour les modérateurs

### 📅 Sessions et Campagnes
- **Planification de sessions** avec gestion des places
- **Gestion des campagnes** long terme
- **Système de réservation** et notifications
- **Historique des sessions** et statistiques

### 🔍 Système de Recherche
- **Recherche textuelle** avancée
- **Filtres multiples** (genre, système, année, etc.)
- **Pagination** et tri des résultats
- **Recherche en temps réel**

## 🛠️ Stack Technique

### **Runtime & Framework**
- **Node.js 18+** - Runtime JavaScript moderne
- **Express.js 4.18.2** - Framework web minimaliste et flexible
- **ES Modules** - Syntaxe moderne JavaScript

### **Base de Données**
- **MongoDB Atlas** - Base de données NoSQL cloud
- **Mongoose 8.14.0** - ODM (Object Document Mapper)
- **Indexation** optimisée pour les performances

### **Sécurité & Validation**
- **Helmet 8.1.0** - Sécurité des en-têtes HTTP
- **CORS 2.8.5** - Gestion des origines croisées
- **Rate Limiting** - Protection contre les attaques DDoS
- **Joi 17.13.3** - Validation des schémas de données
- **bcryptjs 3.0.2** - Hachage sécurisé des mots de passe

### **Authentification**
- **JSON Web Tokens (JWT)** - Authentification stateless
- **cookie-parser 1.4.7** - Gestion des cookies sécurisés
- **Sessions** avec expiration et renouvellement

### **Gestion des Fichiers**
- **Multer 2.0.1** - Middleware pour upload de fichiers
- **Validation des types** et tailles de fichiers
- **Stockage sécurisé** des uploads

### **Logging & Monitoring**
- **Winston 3.17.0** - Système de logging avancé
- **Rotation des logs** avec winston-daily-rotate-file
- **Niveaux de log** configurables par environnement

## 🚀 Installation et Configuration

### Prérequis
- **Node.js 18+** 
- **MongoDB Atlas** compte
- **npm** ou **yarn**

### 1. Installation des dépendances
```bash
cd server
npm install
```

### 2. Configuration de l'environnement
```bash
# Créer le fichier .env
cp .env.example .env

# Éditer avec vos paramètres
nano .env
```

### 3. Variables d'environnement requises
```env
# Configuration du serveur
PORT=3000
NODE_ENV=development

# Base de données MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/invoke_db?retryWrites=true&w=majority

# Configuration JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Configuration de sécurité
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Configuration des logs
LOG_LEVEL=info
LOG_DIR=./logs
```

### 4. Démarrage du serveur
```bash
# Mode développement avec nodemon
npm run dev

# Mode production
npm start

# Build des dépendances
npm run build
```

## 📁 Architecture du Projet

```
server/
├── 📁 src/
│   ├── 📁 config/              # Configuration de l'application
│   │   ├── app.config.js       # Configuration Express
│   │   ├── database.config.js  # Connexion MongoDB
│   │   └── dotenv.config.js    # Variables d'environnement
│   ├── 📁 middlewares/         # Middlewares Express
│   │   ├── auth.middleware.js  # Authentification JWT
│   │   ├── role.middleware.js  # Vérification des rôles
│   │   ├── validate.js         # Validation Joi
│   │   ├── upload.middleware.js # Gestion des uploads
│   │   ├── rateLimit.middleware.js # Limitation de débit
│   │   └── logger.middleware.js # Logging des requêtes
│   ├── 📁 resources/           # Ressources API (pattern MVC)
│   │   ├── 📁 user/            # Gestion des utilisateurs
│   │   │   ├── user.controller.js
│   │   │   ├── user.model.js
│   │   │   ├── user.route.js
│   │   │   ├── user.validation.js
│   │   │   └── user.enum.js
│   │   ├── 📁 game/            # Gestion des jeux
│   │   ├── 📁 session/         # Gestion des sessions
│   │   ├── 📁 campaign/        # Gestion des campagnes
│   │   ├── 📁 feedback/        # Système de feedback
│   │   └── 📁 auth/            # Authentification
│   ├── 📁 seeders/             # Données de test
│   │   ├── index.js            # Point d'entrée des seeders
│   │   ├── userSeeder.js       # Utilisateurs de test
│   │   ├── gameSeeder.js       # Jeux de test
│   │   ├── sessionSeeder.js    # Sessions de test
│   │   ├── campaignSeeder.js   # Campagnes de test
│   │   └── feedbackSeeder.js   # Feedback de test
│   ├── 📁 utils/               # Utilitaires
│   │   ├── logger.js           # Configuration Winston
│   │   ├── database.js         # Utilitaires base de données
│   │   └── helpers.js          # Fonctions utilitaires
│   └── app.js                  # Point d'entrée de l'application
├── 📁 uploads/                 # Fichiers uploadés
├── 📁 logs/                    # Fichiers de logs
├── 📁 docs/                    # Documentation serveur
├── package.json                # Dépendances et scripts
├── server.log                  # Logs du serveur
└── insomnia_collection_complete.json # Collection API Insomnia
```

## 🌐 API Endpoints

### **Base URL** : `http://localhost:3000/api/v1`

### 🔐 Authentification
```http
POST   /auth/register          # Inscription utilisateur
POST   /auth/login             # Connexion utilisateur
POST   /auth/logout            # Déconnexion
POST   /auth/refresh           # Renouvellement du token
GET    /auth/me                # Profil utilisateur connecté
```

### 👥 Utilisateurs
```http
GET    /users                  # Liste des utilisateurs
POST   /users                  # Créer un utilisateur
GET    /users/:id              # Récupérer un utilisateur
PUT    /users/:id              # Modifier un utilisateur
DELETE /users/:id              # Supprimer un utilisateur
PUT    /users/:id/avatar       # Upload avatar
GET    /users/:id/favorites    # Jeux favoris
PUT    /users/:id/favorites    # Ajouter/retirer favori
GET    /users/:id/mastered     # Jeux maîtrisés
PUT    /users/:id/mastered     # Ajouter/retirer maîtrise
```

### 🎲 Jeux
```http
GET    /games                  # Liste des jeux
POST   /games                  # Créer un jeu (Admin)
GET    /games/:id              # Récupérer un jeu
PUT    /games/:id              # Modifier un jeu (Admin)
DELETE /games/:id              # Supprimer un jeu (Admin)
GET    /games/search           # Recherche de jeux
GET    /games/genres           # Liste des genres
GET    /games/systems          # Liste des systèmes
```

### 📅 Sessions
```http
GET    /sessions               # Liste des sessions
POST   /sessions               # Créer une session
GET    /sessions/:id           # Récupérer une session
PUT    /sessions/:id           # Modifier une session
DELETE /sessions/:id           # Supprimer une session
POST   /sessions/:id/join      # Rejoindre une session
POST   /sessions/:id/leave     # Quitter une session
GET    /sessions/user/:userId  # Sessions d'un utilisateur
```

### 🏰 Campagnes
```http
GET    /campaigns              # Liste des campagnes
POST   /campaigns              # Créer une campagne
GET    /campaigns/:id          # Récupérer une campagne
PUT    /campaigns/:id          # Modifier une campagne
DELETE /campaigns/:id          # Supprimer une campagne
POST   /campaigns/:id/join     # Rejoindre une campagne
POST   /campaigns/:id/leave    # Quitter une campagne
GET    /campaigns/dm/:dmId     # Campagnes d'un DM
```

### ⭐ Feedback
```http
GET    /feedback               # Liste des feedbacks
POST   /feedback               # Créer un feedback
GET    /feedback/:id           # Récupérer un feedback
PUT    /feedback/:id           # Modifier un feedback
DELETE /feedback/:id           # Supprimer un feedback
GET    /feedback/session/:id   # Feedback d'une session
GET    /feedback/dm/:dmId      # Feedback d'un DM
```

## 🔒 Sécurité et Authentification

### **Middleware de Sécurité**
```javascript
// Helmet - Sécurité des en-têtes HTTP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

// CORS - Contrôle des origines
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true
}))

// Rate Limiting - Protection DDoS
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par fenêtre
}))
```

### **Authentification JWT**
```javascript
// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ message: 'Token manquant' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' })
    req.user = user
    next()
  })
}
```

### **Gestion des Rôles**
```javascript
// Middleware de vérification des rôles
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' })
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé' })
    }
    
    next()
  }
}

// Utilisation
app.post('/games', authenticateToken, requireRole(['admin']), gameController.create)
```

## 🗄️ Base de Données

### **Modèles Mongoose**

#### **User Model**
```javascript
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'dm', 'admin'], default: 'user' },
  avatar: { type: String },
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    experience: String,
    preferences: [String]
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  mastered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  createdAt: { type: Date, default: Date.now }
})
```

#### **Game Model**
```javascript
const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  system: { type: String, required: true },
  publisher: String,
  year: Number,
  description: String,
  image: String,
  tags: [String],
  rating: { type: Number, min: 1, max: 5, default: 0 },
  ratingCount: { type: Number, default: 0 }
})
```

### **Indexation et Performance**
```javascript
// Index pour les performances de recherche
userSchema.index({ username: 1, email: 1 })
userSchema.index({ role: 1 })
gameSchema.index({ title: 'text', genre: 1, system: 1 })
gameSchema.index({ rating: -1, ratingCount: -1 })
```

## 🧪 Tests et Développement

### **Scripts Disponibles**
```bash
npm run dev          # Démarrage avec nodemon
npm start            # Démarrage production
npm run seed         # Peupler la base de données
npm run test         # Exécuter les tests (à implémenter)
npm run build        # Installer les dépendances
```

### **Base de Données de Test**
```bash
# Peupler avec des données de test
npm run seed
```

Cela créera :
- **5 utilisateurs** (1 admin, 2 DM, 2 utilisateurs)
- **10 jeux RPG** populaires
- **8 sessions** de jeu
- **5 campagnes** long terme
- **15 feedbacks** d'utilisateurs

### **Collection Insomnia**
Importez le fichier `insomnia_collection_complete.json` dans Insomnia pour tester facilement tous les endpoints de l'API.

## 📊 Logging et Monitoring

### **Configuration Winston**
```javascript
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})
```

### **Rotation des Logs**
```javascript
// Rotation quotidienne des logs
new winston.transports.DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d'
})
```

## 🚨 Gestion des Erreurs

### **Middleware d'Erreur Global**
```javascript
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    user: req.user?.id
  })

  res.status(err.status || 500).json({
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Erreur interne du serveur' 
        : err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  })
})
```

### **Validation des Données**
```javascript
// Middleware de validation Joi
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({
        message: 'Données invalides',
        details: error.details.map(detail => detail.message)
      })
    }
    next()
  }
}

// Utilisation
app.post('/users', validate(userValidation.create), userController.create)
```

## 🔧 Configuration Avancée

### **Variables d'Environnement Complètes**
```env
# Configuration du serveur
PORT=3000
NODE_ENV=development
HOST=localhost

# Base de données
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/invoke_db
MONGODB_OPTIONS=retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Sécurité
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif
UPLOAD_DIR=./uploads

# Logs
LOG_LEVEL=info
LOG_DIR=./logs
LOG_MAX_SIZE=20m
LOG_MAX_FILES=14d
```

### **Configuration Express Avancée**
```javascript
// Configuration de sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}))

// Configuration des uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Type de fichier non autorisé'), false)
    }
  }
})
```

## 🐛 Dépannage

### **Problèmes Courants**

1. **Erreur de connexion MongoDB**
   ```bash
   # Vérifier l'URI de connexion
   echo $MONGODB_URI
   
   # Tester la connexion
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/invoke_db"
   ```

2. **Port déjà utilisé**
   ```bash
   # Vérifier les processus sur le port 3000
   lsof -i :3000
   
   # Tuer le processus
   kill -9 <PID>
   ```

3. **Erreurs de validation**
   ```bash
   # Vérifier les logs
   tail -f logs/combined.log
   
   # Mode debug
   NODE_ENV=development npm run dev
   ```

### **Mode Debug**
```bash
# Activer les logs détaillés
LOG_LEVEL=debug npm run dev

# Vérifier les variables d'environnement
node -e "console.log(process.env)"
```

## 📚 Documentation API

### **Collection Insomnia**
Le fichier `insomnia_collection_complete.json` contient tous les endpoints de l'API avec des exemples de requêtes et de réponses.

### **Documentation Swagger (à implémenter)**
```bash
# Installation de Swagger
npm install swagger-jsdoc swagger-ui-express

# Configuration dans app.js
const swaggerSpec = swaggerJsdoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
```

## 🚀 Déploiement

### **Variables de Production**
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://prod-user:prod-pass@prod-cluster.mongodb.net/invoke_prod
JWT_SECRET=production-super-secret-key
CORS_ORIGIN=https://invoke-app.com
LOG_LEVEL=warn
```

### **Process Manager (PM2)**
```bash
# Installation
npm install -g pm2

# Démarrage
pm2 start src/app.js --name "invoke-backend"

# Monitoring
pm2 monit
pm2 logs invoke-backend
```

## 📅 Roadmap Backend

### **Phase 1 : Fondations** ✅
- [x] Architecture Express + MongoDB
- [x] API REST complète
- [x] Authentification JWT
- [x] Gestion des rôles

### **Phase 2 : Fonctionnalités** ✅
- [x] CRUD complet des entités
- [x] Upload de fichiers
- [x] Système de recherche
- [x] Validation des données

### **Phase 3 : Sécurité** 🔄
- [ ] Tests de sécurité complets
- [ ] Audit des vulnérabilités
- [ ] Tests d'intrusion
- [ ] Validation des middlewares

### **Phase 4 : Tests** ⏳
- [ ] Tests unitaires Jest
- [ ] Tests d'intégration
- [ ] Tests de performance
- [ ] Couverture de code 80%+

## 🤝 Contribution

### **Standards de Code**
- **ESLint** configuré pour Node.js
- **Prettier** pour le formatage
- **Conventional Commits** pour les messages
- **Tests** obligatoires pour les nouvelles fonctionnalités

### **Workflow de Développement**
1. **Fork** le projet
2. **Créer** une branche feature
3. **Développer** avec tests
4. **Linter** et formater le code
5. **Commit** avec message conventionnel
6. **Push** et créer une Pull Request

## 📄 Licence

Ce projet est sous licence **ISC**. Voir le fichier [LICENSE](../LICENSE) pour plus de détails.

## 🆘 Support

- **Issues** : [Créer une issue](../../issues)
- **Documentation** : [📖 Docs](../docs/)
- **Sécurité** : [🔒 Security Guide](../client/SECURITY.md)

---

## 🎯 Prochaines Étapes

1. **🔒 Tests de Sécurité** - Validation des vulnérabilités identifiées
2. **🧪 Tests d'Intégration** - Validation complète de l'API
3. **📚 Documentation Swagger** - Documentation API interactive
4. **🚀 Déploiement** - Mise en production après validation sécurité

---

**Backend INVOKE - Construit avec Node.js, Express et MongoDB**

*Où l'API rencontre la sécurité* 🚀🔒
