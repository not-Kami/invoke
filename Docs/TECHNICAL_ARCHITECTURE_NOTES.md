# 🔧 Notes Techniques - Architecture Invoke

## 🏗️ **Architecture Générale**

### **Pattern Architectural**
- **Frontend** : SPA (Single Page Application) avec React
- **Backend** : API REST avec Express.js
- **Base de données** : MongoDB (NoSQL)
- **Communication** : HTTP/HTTPS avec JWT
- **Déploiement** : Microservices sur Render

### **Séparation des responsabilités**
```
Frontend (React) ←→ Backend (Express) ←→ Database (MongoDB)
     ↓                    ↓                    ↓
  Cloudinary          JWT Auth            Mongoose ODM
```

---

## 🎨 **Frontend - React + TypeScript**

### **Structure des composants**
```
src/
├── components/          # Composants réutilisables
│   ├── admin/          # Panel d'administration
│   ├── auth/           # Authentification
│   ├── games/          # Gestion des jeux
│   ├── sessions/       # Gestion des sessions
│   └── ui/             # Composants UI de base
├── pages/              # Pages principales
├── hooks/              # Hooks personnalisés
├── contexts/           # Contextes React
├── lib/                # Utilitaires et API
└── types/              # Définitions TypeScript
```

### **Gestion d'état**
- **Context API** : AuthContext pour l'authentification
- **Hooks personnalisés** : useDashboardData, useFavoriteGames, etc.
- **État local** : useState/useReducer pour les composants

### **Routing**
- **React Router v6** : Navigation côté client
- **Routes protégées** : ProtectedRoute, AdminRoute
- **Lazy loading** : Chargement à la demande

### **Styling**
- **Tailwind CSS** : Utility-first CSS
- **Responsive design** : Mobile-first approach
- **Thème sombre** : Variables CSS personnalisées

---

## ⚙️ **Backend - Node.js + Express**

### **Structure modulaire**
```
src/
├── config/             # Configuration
│   ├── app.config.js   # Configuration Express
│   ├── database.config.js
│   ├── cloudinary.config.js
│   └── dotenv.config.js
├── middlewares/        # Middlewares Express
├── resources/          # Ressources métier
│   ├── auth/          # Authentification
│   ├── user/          # Gestion utilisateurs
│   ├── game/          # Gestion jeux
│   ├── session/       # Gestion sessions
│   └── upload/        # Upload d'images
└── utils/             # Utilitaires
```

### **Pattern MVC**
- **Models** : Schémas Mongoose
- **Controllers** : Logique métier
- **Routes** : Définition des endpoints
- **Middlewares** : Validation, auth, upload

### **Configuration Express**
```javascript
// CORS, parsing, static files, routes
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));
app.use('/api/v1', routes);
```

---

## 🗄️ **Base de données - MongoDB**

### **Modèles de données**
```javascript
// User Schema
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: Enum [USER, ADMIN],
  isDM: Boolean,
  favorite_games: [ObjectId],
  mastered_games: [ObjectId]
}

// Game Schema
{
  name: String,
  description: String,
  genre: String,
  system: String,
  images: {
    logo: String,
    portrait: String,
    banner: String
  },
  featured: Boolean
}

// Session Schema
{
  title: String,
  description: String,
  date: Date,
  sessionType: Enum [online, offline],
  game: ObjectId (ref: Game),
  dm: ObjectId (ref: User),
  players: [ObjectId],
  maxPlayers: Number,
  status: Enum [open, full, finished, cancelled]
}
```

### **Relations**
- **Références** : ObjectId entre collections
- **Population** : Mongoose populate() pour les jointures
- **Indexation** : Index sur email, createdAt, etc.

---

## 🔐 **Authentification et Sécurité**

### **JWT Implementation**
```javascript
// Génération du token
const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Middleware de vérification
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  // Vérification et décodage
};
```

### **Sécurité des mots de passe**
- **Hachage** : bcrypt avec salt rounds
- **Validation** : Joi pour les règles de mot de passe
- **Stockage** : Jamais en clair en base

### **CORS Configuration**
```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URLS?.split(',') || ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

---

## 📤 **Upload d'images - Cloudinary**

### **Architecture hybride**
- **Local** : Développement (uploads/ folder)
- **Cloudinary** : Production (CDN mondial)
- **Détection automatique** : URLs complètes vs fichiers locaux

### **Configuration Multer**
```javascript
// Stockage mémoire pour Cloudinary
const cloudinaryStorage = multer.memoryStorage();

// Middleware d'upload
const uploadToCloudinaryMiddleware = async (req, res, next) => {
  const result = await uploadToCloudinary(req.file, {
    folder: `invoke/${type}`,
    public_id: generatePublicId(type, id, imageType),
    transformation: { quality: 'auto', fetch_format: 'auto' }
  });
  req.cloudinaryResult = result;
  next();
};
```

### **Gestion des URLs**
```javascript
// Détection automatique Cloudinary vs local
export const getGameImageUrl = (gameId, imageType, filename) => {
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename; // URL Cloudinary
  }
  return `${baseUrl}/uploads/game/${gameId}/${filename}`; // Local
};
```

---

## 🚀 **API REST - Endpoints**

### **Structure des routes**
```
/api/v1/
├── auth/              # Authentification
│   ├── POST /login
│   ├── POST /register
│   ├── POST /logout
│   └── GET /me
├── users/             # Gestion utilisateurs
│   ├── GET /
│   ├── GET /:id
│   ├── PUT /:id
│   └── DELETE /:id
├── games/             # Gestion jeux
│   ├── GET /
│   ├── POST /
│   ├── PUT /:id
│   └── DELETE /:id
├── sessions/          # Gestion sessions
│   ├── GET /
│   ├── POST /
│   ├── PUT /:id
│   └── DELETE /:id
└── upload/            # Upload d'images
    ├── POST /cloudinary/game/:gameId/:imageType
    └── DELETE /cloudinary/:publicId
```

### **Validation des données**
```javascript
// Joi schemas
const gameValidation = Joi.object({
  name: Joi.string().required().min(2).max(100),
  description: Joi.string().required().min(10).max(1000),
  genre: Joi.string().required(),
  system: Joi.string().required()
});
```

---

## 🔄 **Gestion des erreurs**

### **Middleware global**
```javascript
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});
```

### **Logging**
- **Winston** : Logs structurés
- **Rotation** : Fichiers par jour
- **Niveaux** : error, warn, info, debug

---

## ⚡ **Performance et Optimisation**

### **Frontend**
- **Code splitting** : Lazy loading des composants
- **Memoization** : React.memo, useMemo, useCallback
- **Image optimization** : Cloudinary transformations
- **Bundle size** : Vite pour le build optimisé

### **Backend**
- **Rate limiting** : Protection contre les abus
- **Caching** : Headers de cache pour les images
- **Database indexing** : Index sur les champs fréquents
- **Pagination** : Limitation des résultats

### **Base de données**
```javascript
// Index pour les requêtes fréquentes
userSchema.index({ email: 1 });
sessionSchema.index({ date: 1, status: 1 });
gameSchema.index({ featured: 1, genre: 1 });
```

---

## 🧪 **Tests et Qualité**

### **Frontend**
- **TypeScript** : Typage statique
- **ESLint** : Linting du code
- **Prettier** : Formatage automatique

### **Backend**
- **Validation** : Joi pour les données
- **Error handling** : Gestion centralisée
- **Logging** : Traçabilité complète

---

## 🚀 **Déploiement - Render**

### **Configuration**
```yaml
# Frontend (Vite)
Build Command: npm run build
Publish Directory: dist
Node Version: 18

# Backend (Express)
Build Command: npm install
Start Command: npm run dev
Node Version: 18
```

### **Variables d'environnement**
```bash
# Base de données
MONGODB_URI=mongodb+srv://...

# Authentification
JWT_SECRET=your-secret-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
FRONTEND_URLS=https://your-frontend.onrender.com
```

---

## 🔧 **Outils de développement**

### **Frontend**
- **Vite** : Build tool rapide
- **Hot reload** : Rechargement automatique
- **Dev tools** : React DevTools

### **Backend**
- **Nodemon** : Redémarrage automatique
- **Winston** : Logging avancé
- **Insomnia** : Tests d'API

### **Base de données**
- **MongoDB Compass** : Interface graphique
- **Atlas** : Base de données cloud

---

## 📊 **Monitoring et Métriques**

### **Logs**
- **Application** : Logs d'application
- **Error** : Logs d'erreurs
- **Rotation** : Archivage automatique

### **Métriques**
- **Performance** : Temps de réponse
- **Erreurs** : Taux d'erreur
- **Utilisation** : CPU, mémoire, disque

---

## 🛠️ **Choix techniques justifiés**

### **Pourquoi React ?**
- **Écosystème** : Large communauté
- **Performance** : Virtual DOM
- **Flexibilité** : Composants réutilisables

### **Pourquoi Express ?**
- **Simplicité** : Framework minimaliste
- **Middleware** : Architecture modulaire
- **Performance** : Léger et rapide

### **Pourquoi MongoDB ?**
- **Flexibilité** : Schémas dynamiques
- **Scalabilité** : Horizontal scaling
- **JSON** : Intégration naturelle avec JavaScript

### **Pourquoi Cloudinary ?**
- **CDN** : Distribution mondiale
- **Optimisation** : Compression automatique
- **Transformations** : Redimensionnement à la volée

---

*Ces notes techniques sont mises à jour selon l'évolution de l'architecture.*
