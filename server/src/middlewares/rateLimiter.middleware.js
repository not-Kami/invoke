import rateLimit from 'express-rate-limit';
import logger from '../config/logger.config.js';

// Rate limiter global pour l'API
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par fenêtre
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true, // Retourne rate limit info dans les headers
    legacyHeaders: false, // Désactive les headers legacy
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            path: req.path
        });
        res.status(429).json({
            success: false,
            message: 'Too many requests from this IP, please try again later.'
        });
    }
});

// Rate limiter spécifique pour l'authentification
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limite chaque IP à 5 tentatives de connexion par fenêtre
    message: {
        success: false,
        message: 'Too many login attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`, {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            path: req.path
        });
        res.status(429).json({
            success: false,
            message: 'Too many login attempts, please try again later.'
        });
    }
});

// Rate limiter pour les opérations sensibles (création, suppression)
export const sensitiveOperationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 10, // Limite chaque IP à 10 opérations sensibles par heure
    message: {
        success: false,
        message: 'Too many sensitive operations, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Sensitive operation rate limit exceeded for IP: ${req.ip}`, {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            path: req.path,
            method: req.method
        });
        res.status(429).json({
            success: false,
            message: 'Too many sensitive operations, please try again later.'
        });
    }
}); 