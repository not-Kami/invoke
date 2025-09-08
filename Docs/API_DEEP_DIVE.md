# 🔧 API Deep Dive - Fonctionnement Détaillé

## 🏗️ **Architecture de l'API**

### **Structure des Routes**
```
/api/v1/
├── auth/              # Authentification
├── users/             # Gestion utilisateurs
├── games/             # Gestion jeux
├── sessions/          # Gestion sessions
├── campaigns/         # Gestion campagnes
├── characters/        # Gestion personnages
├── conversations/     # Système de chat
├── feedback/          # Système d'évaluation
├── upload/            # Upload d'images
└── tables/            # Gestion des tables
```

### **Pattern de Route Standard**
```javascript
// Structure typique d'une route
router.METHOD('/path', [middlewares], controller);

// Exemple concret
router.post('/', protect, validate(schema), controller.create);
router.get('/', validate(querySchema), controller.getAll);
router.get('/:id', validateParams(paramSchema), controller.getOne);
router.put('/:id', protect, validate(schema), controller.update);
router.delete('/:id', protect, restrictTo('admin'), controller.delete);
```

---

## 🔐 **Système d'Authentification JWT**

### **Génération du Token**
```javascript
// auth.controller.js - login()
const token = jwt.sign(
    { id: user._id },           // Payload
    process.env.JWT_SECRET,     // Secret
    { expiresIn: '7d' }         // Expiration
);

// Cookie HTTP-only sécurisé
res.cookie('token', token, {
    httpOnly: true,                                    // Pas accessible via JS
    secure: env.NODE_ENV !== 'development',           // HTTPS requis sauf dev
    sameSite: env.NODE_ENV === 'development' ? 'lax' : 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,                // 30 jours
    domain: env.COOKIE_DOMAIN || undefined
});
```

### **Middleware de Protection**
```javascript
// auth.middleware.js - protect()
export const protect = async (req, res, next) => {
    let token;
    
    // 1. Récupération du token (cookies prioritaire)
    if (req.cookies?.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
    
    try {
        // 2. Vérification et décodage du token
        const decoded = jwt.verify(token, env.JWT_SECRET);
        
        // 3. Récupération de l'utilisateur
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // 4. Ajout de l'utilisateur à la requête
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};
```

### **Middleware de Restriction par Rôle**
```javascript
// restrictTo.middleware.js
export function restrictTo(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'User role is not authorized to access this route'
            });
        }
        
        next();
    };
}

// Utilisation
router.delete('/:id', protect, restrictTo('admin'), controller.delete);
```

---

## ✅ **Système de Validation Joi**

### **Middleware de Validation**
```javascript
// validate.js
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,    // Retourner toutes les erreurs
            stripUnknown: true    // Supprimer les champs non définis
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                }))
            });
        }

        req.body = value; // Remplacer req.body par les données validées
        next();
    };
};
```

### **Schémas de Validation**
```javascript
// auth.validation.js
export const signupSchema = Joi.object({
    firstName: Joi.string().required().min(2).max(50),
    lastName: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .message('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
});

// session.validation.js
export const createSessionSchema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    description: Joi.string().required().min(10).max(1000),
    date: Joi.date().required().min('now'),
    sessionType: Joi.string().valid('online', 'offline').required(),
    isOneShot: Joi.boolean().default(false),
    game: Joi.string().required(),
    dm: Joi.string().required(),
    maxPlayers: Joi.number().min(1).max(20).default(6)
});
```

---

## 🚦 **Rate Limiting**

### **Configuration des Rate Limiters**
```javascript
// rateLimiter.middleware.js

// 1. Rate limiter global
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,    // 15 minutes
    max: 100,                     // 100 requêtes par IP
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,        // Headers de rate limit
    legacyHeaders: false
});

// 2. Rate limiter pour l'authentification
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,    // 15 minutes
    max: 5,                       // 5 tentatives de connexion
    message: {
        success: false,
        message: 'Too many login attempts, please try again later.'
    }
});

// 3. Rate limiter pour opérations sensibles
export const sensitiveOperationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,    // 1 heure
    max: 10,                      // 10 opérations sensibles
    message: {
        success: false,
        message: 'Too many sensitive operations, please try again later.'
    }
});
```

### **Application des Rate Limiters**
```javascript
// auth.route.js
authRouter.post("/login", authLimiter, validate(authValidation.loginSchema), authController.login);

// user.route.js
userRouter.delete("/:id", protect, restrictTo('admin'), sensitiveOperationLimiter, userController.deleteUser);
```

---

## 🎮 **Contrôleurs - Logique Métier**

### **Structure d'un Contrôleur**
```javascript
// game.controller.js
const gameController = {
    // CREATE - Création d'une ressource
    createGame: async (req, res) => {
        try {
            const game = await Game.create(req.body);
            res.status(201).json({
                success: true,
                data: game,
                message: 'Game created successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create game',
                error: error.message
            });
        }
    },

    // READ - Récupération avec filtres et pagination
    getGames: async (req, res) => {
        try {
            const { q, system, genre, page = 1, limit = 10, sort } = req.query;
            
            // Construction du filtre
            const filter = {};
            if (q) {
                filter.$or = [
                    { name: { $regex: q, $options: 'i' } },
                    { description: { $regex: q, $options: 'i' } }
                ];
            }
            if (system) filter.system = system;
            if (genre) filter.genre = genre;

            // Configuration du tri
            const sortOption = sort ? 
                (sort.startsWith('-') ? { [sort.slice(1)]: -1 } : { [sort]: 1 }) : 
                { createdAt: -1 };

            // Pagination
            const skip = (parseInt(page) - 1) * parseInt(limit);
            
            // Requête avec population
            const games = await Game.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(parseInt(limit))
                .select('name description genre system images featured createdAt')
                .lean();

            const total = await Game.countDocuments(filter);
            
            res.status(200).json({
                success: true,
                data: games,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch games',
                error: error.message
            });
        }
    },

    // UPDATE - Mise à jour d'une ressource
    updateGame: async (req, res) => {
        try {
            const game = await Game.findByIdAndUpdate(
                req.params.id, 
                req.body, 
                { 
                    new: true,           // Retourner le document mis à jour
                    runValidators: true  // Exécuter les validateurs Mongoose
                }
            );
            
            if (!game) {
                return res.status(404).json({
                    success: false,
                    message: 'Game not found'
                });
            }
            
            res.status(200).json({
                success: true,
                data: game,
                message: 'Game updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update game',
                error: error.message
            });
        }
    },

    // DELETE - Suppression d'une ressource
    deleteGame: async (req, res) => {
        try {
            const game = await Game.findByIdAndDelete(req.params.id);
            
            if (!game) {
                return res.status(404).json({
                    success: false,
                    message: 'Game not found'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Game deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete game',
                error: error.message
            });
        }
    }
};
```

---

## 🔄 **Gestion des Erreurs**

### **Middleware Global d'Erreur**
```javascript
// app.config.js
app.use((err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log de l'erreur
    logger.error('Error:', err);

    // Erreur Mongoose - ObjectId invalide
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new AppError(message, 404);
    }

    // Erreur Mongoose - Duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new AppError(message, 400);
    }

    // Erreur Mongoose - Validation
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new AppError(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error'
    });
});
```

### **Classe AppError Personnalisée**
```javascript
// utils/appError.js
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
```

### **Wrapper catchAsync**
```javascript
// utils/catchAsync.js
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

export default catchAsync;

// Utilisation dans les contrôleurs
export const createUser = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(201).json({
        success: true,
        data: user
    });
});
```

---

## 📤 **Système d'Upload d'Images**

### **Configuration Multer**
```javascript
// upload.middleware.js

// Stockage local (développement)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = `uploads/${req.params.type || 'general'}`;
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Stockage mémoire (Cloudinary)
const cloudinaryStorage = multer.memoryStorage();

// Filtre de fichiers
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// Configuration Multer
const upload = multer({
    storage: cloudinaryStorage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});
```

### **Middleware d'Upload vers Cloudinary**
```javascript
export const uploadToCloudinaryMiddleware = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }

        // Extraction des paramètres de route
        let type, id, imageType;
        if (req.params.gameId) {
            type = 'game';
            id = req.params.gameId;
            imageType = req.params.imageType;
        } else if (req.params.id) {
            type = req.params.type || 'user';
            id = req.params.id;
            imageType = req.params.imageType;
        } else {
            throw new Error('Paramètres de route invalides');
        }

        // Génération du public_id
        const publicId = generatePublicId(type, id, imageType);

        // Upload vers Cloudinary
        const result = await uploadToCloudinary(req.file, {
            folder: `invoke/${type}`,
            public_id: publicId,
            transformation: {
                quality: 'auto',
                fetch_format: 'auto'
            }
        });

        // Stockage du résultat dans la requête
        req.cloudinaryResult = {
            public_id: result.public_id,
            secure_url: result.secure_url,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
            format: result.format
        };

        next();
    } catch (error) {
        logger.error('Erreur upload Cloudinary middleware:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload de l\'image'
        });
    }
};
```

---

## 🔍 **Requêtes MongoDB Avancées**

### **Requêtes avec Population**
```javascript
// Récupération des sessions avec les données liées
const sessions = await Session.find(filter)
    .populate('game', 'name system genre')
    .populate('dm', 'firstName lastName email')
    .populate('players', 'firstName lastName')
    .sort({ date: 1 })
    .lean();
```

### **Agrégation MongoDB**
```javascript
// Statistiques des jeux par genre
const gameStats = await Game.aggregate([
    {
        $group: {
            _id: '$genre',
            count: { $sum: 1 },
            avgRating: { $avg: '$rating' }
        }
    },
    {
        $sort: { count: -1 }
    }
]);
```

### **Requêtes avec Index**
```javascript
// Index pour optimiser les requêtes
gameSchema.index({ name: 'text', description: 'text' }); // Recherche textuelle
gameSchema.index({ genre: 1, system: 1 });              // Filtres composés
gameSchema.index({ featured: 1, createdAt: -1 });       // Tri et filtrage
```

---

## 📊 **Logging et Monitoring**

### **Configuration Winston**
```javascript
// logger.config.js
import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/application.log' }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

export default logger;
```

### **Logging des Requêtes**
```javascript
// logger.middleware.js
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('HTTP Request', {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
    });
    
    next();
};
```

---

## 🚀 **Optimisations de Performance**

### **Pagination Efficace**
```javascript
// Utilisation de cursor-based pagination pour de gros datasets
const getGamesCursor = async (req, res) => {
    const { cursor, limit = 10 } = req.query;
    const filter = cursor ? { _id: { $gt: cursor } } : {};
    
    const games = await Game.find(filter)
        .sort({ _id: 1 })
        .limit(parseInt(limit) + 1);
    
    const hasNextPage = games.length > parseInt(limit);
    if (hasNextPage) games.pop();
    
    const nextCursor = hasNextPage ? games[games.length - 1]._id : null;
    
    res.json({
        success: true,
        data: games,
        pagination: {
            hasNextPage,
            nextCursor
        }
    });
};
```

### **Cache avec Redis (futur)**
```javascript
// Cache des jeux mis en avant
const getFeaturedGames = async (req, res) => {
    const cacheKey = 'featured:games';
    let games = await redis.get(cacheKey);
    
    if (!games) {
        games = await Game.find({ featured: true }).limit(4);
        await redis.setex(cacheKey, 300, JSON.stringify(games)); // 5 min
    } else {
        games = JSON.parse(games);
    }
    
    res.json({ success: true, data: games });
};
```

---

## 🔒 **Sécurité Avancée**

### **Sanitisation des Données**
```javascript
// Middleware de sanitisation
export const sanitizeInput = (req, res, next) => {
    // Supprimer les caractères dangereux
    const sanitize = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            }
        }
    };
    
    sanitize(req.body);
    sanitize(req.query);
    next();
};
```

### **Validation des Permissions**
```javascript
// Middleware de vérification des permissions
export const checkPermission = (resource, action) => {
    return (req, res, next) => {
        const user = req.user;
        const resourceId = req.params.id;
        
        // Admin peut tout faire
        if (user.role === 'admin') {
            return next();
        }
        
        // Vérifier si l'utilisateur peut modifier sa propre ressource
        if (action === 'update' && user._id.toString() === resourceId) {
            return next();
        }
        
        return res.status(403).json({
            success: false,
            message: 'Insufficient permissions'
        });
    };
};
```

---

## 📈 **Métriques et Analytics**

### **Middleware de Métriques**
```javascript
// metrics.middleware.js
export const metricsMiddleware = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        
        // Envoyer les métriques à un service de monitoring
        metrics.increment('api.requests', {
            method: req.method,
            route: req.route?.path,
            status: res.statusCode
        });
        
        metrics.timing('api.response_time', duration, {
            method: req.method,
            route: req.route?.path
        });
    });
    
    next();
};
```

---

*Ces notes techniques détaillées couvrent tous les aspects de l'API Invoke, de l'authentification aux optimisations de performance.*
