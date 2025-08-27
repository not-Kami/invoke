import { httpLogger } from "../config/logger.config.js";

const loggerMiddleware = (req, res, next) => {
    const start = Date.now();
    
    // Log de la requête entrante
    httpLogger.info('Incoming request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });
    
    // Intercepter la réponse pour logger les détails
    const originalSend = res.send;
    res.send = function(data) {
        const duration = Date.now() - start;
        
        httpLogger.info('Outgoing response', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            timestamp: new Date().toISOString()
        });
        
        originalSend.call(this, data);
    };
    
    next();
};

export default loggerMiddleware;