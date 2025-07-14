import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import env from '../config/dotenv.config.js';
import logger from '../config/logger.config.js';
import User from '../resources/user/user.model.js';

// Middleware de protection (vérification du token)
export const protect = async (req, res, next) => {
    try {
        let token;

        // Vérifier si le token est dans les headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
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

// Middleware optionnel (ne bloque pas si pas de token)
export const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
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
    return jwt.sign({ id: userId }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN || '30d'
    });
};

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}; 