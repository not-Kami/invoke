import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import env from '../config/dotenv.config.js';
import logger from '../config/logger.config.js';
import User from '../resources/user/user.model.js';

// Middleware de protection (vérification du token)
export const protect = async (req, res, next) => {
    try {
        let token;

        // Vérifier si le token est dans les cookies (priorité) ou headers
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Vérifier le token
            const decoded = jwt.verify(token, env.JWT_SECRET);
            
            // Récupérer l'utilisateur
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Ajouter l'utilisateur à la requête
            req.user = user;
            next();
        } catch (error) {
            logger.error('JWT verification failed:', error);
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
    } catch (error) {
        logger.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Middleware de restriction par rôle
export const restrictTo = (...roles) => {
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
};

// Middleware pour vérifier que l'utilisateur peut modifier son propre profil
export const canModifyUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    const userId = req.params.id;
    
    // L'utilisateur peut modifier son propre profil
    if (req.user._id.toString() === userId) {
        return next();
    }
    
    // Les admins peuvent modifier n'importe quel profil
    if (req.user.role === 'admin') {
        return next();
    }
    
    // Sinon, accès refusé
    return res.status(403).json({
        success: false,
        message: 'You can only modify your own profile'
    });
};

// Middleware pour vérifier que l'utilisateur peut gérer ses jeux favoris
export const canManageFavoriteGames = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    const userId = req.params.id;
    
    // L'utilisateur peut gérer ses propres jeux favoris
    if (req.user._id.toString() === userId) {
        return next();
    }
    
    // Les admins peuvent gérer les jeux favoris de n'importe qui
    if (req.user.role === 'admin') {
        return next();
    }
    
    // Sinon, accès refusé
    return res.status(403).json({
        success: false,
        message: 'You can only manage your own favorite games'
    });
};

// Middleware pour vérifier que l'utilisateur peut gérer ses jeux maîtrisés
export const canManageMasteredGames = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    const userId = req.params.id;
    
    // L'utilisateur doit être un DM pour gérer ses jeux maîtrisés
    if (req.user._id.toString() === userId && req.user.isDM) {
        return next();
    }
    
    // Les admins peuvent gérer les jeux maîtrisés de n'importe qui
    if (req.user.role === 'admin') {
        return next();
    }
    
    // Sinon, accès refusé
    return res.status(403).json({
        success: false,
        message: 'Only DMs can manage mastered games'
    });
};

// Middleware pour vérifier que l'utilisateur peut modifier son profil de base
export const canUpdateProfile = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    const userId = req.params.id;
    
    // L'utilisateur peut modifier son propre profil de base
    if (req.user._id.toString() === userId) {
        // Vérifier que les champs modifiés sont autorisés
        const allowedFields = ['firstName', 'lastName', 'nickname', 'bio', 'avatar'];
        const modifiedFields = Object.keys(req.body);
        
        const hasUnauthorizedFields = modifiedFields.some(field => !allowedFields.includes(field));
        
        if (hasUnauthorizedFields) {
            return res.status(400).json({
                success: false,
                message: 'You can only update basic profile fields. Use specific endpoints for games and other data.'
            });
        }
        
        return next();
    }
    
    // Les admins peuvent modifier n'importe quel profil
    if (req.user.role === 'admin') {
        return next();
    }
    
    // Sinon, accès refusé
    return res.status(403).json({
        success: false,
        message: 'You can only modify your own profile'
    });
};

// Middleware optionnel (ne bloque pas si pas de token)
export const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            try {
                const decoded = jwt.verify(token, env.JWT_SECRET);
                const user = await User.findById(decoded.id).select('-password');
                if (user) {
                    req.user = user;
                }
            } catch (error) {
                // Token invalide, mais on continue sans authentification
                logger.warn('Invalid token in optional auth:', error.message);
            }
        }

        next();
    } catch (error) {
        logger.error('Optional auth middleware error:', error);
        next();
    }
};

// Utilitaires pour l'authentification
export const generateToken = (userId) => {
    const token = jwt.sign({ id: userId }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN || '30d'
    });
    
    return token;
};

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}; 