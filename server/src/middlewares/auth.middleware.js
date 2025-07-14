import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import env from '../config/dotenv.config.js';
import logger from '../config/logger.config.js';
import User from '../resources/user/user.model.js';

// Configuration des cookies
export const COOKIE_CONFIG = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: process.env.NODE_ENV === 'test' ? 'lax' : 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/'
};

// Middleware de protection (vérification du token)
export const protect = async (req, res, next) => {
    try {
        console.log('Header Cookie:', req.headers.cookie);
        console.log('req.cookies:', req.cookies);
        let token;

        // Vérifier si le token est dans les cookies (priorité)
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
            console.log('Using token from cookie');
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Sinon, vérifier si le token est dans les headers
            token = req.headers.authorization.split(' ')[1];
            console.log('Using token from header');
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

        // Vérifier si le token est dans les cookies (priorité)
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
            console.log('Using token from cookie (optionalAuth)');
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('Using token from header (optionalAuth)');
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
    console.log('JWT_SECRET used:', env.JWT_SECRET);
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