import express from "express";
import env from "./dotenv.config.js";
import corsMiddleware from "../middlewares/cors.middleware.js";
import { globalLimiter, sensitiveOperationLimiter } from "../middlewares/rateLimiter.middleware.js";
import logger from "./logger.config.js";
import userRouter from "../resources/user/user.route.js";
import sessionRouter from "../resources/session/session.route.js";
import feedbackRouter from "../resources/feedback/feedback.route.js";
import gameRouter from "../resources/game/game.route.js";
import campaignRouter from "../resources/campaign/campaign.route.js";
import authRouter from "../resources/auth/auth.route.js";
import characterRouter from "../resources/character/character.route.js";
import tableRouter from "../resources/table/table.route.js";

const app = express();

// Middleware de sécurité et logging
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting global
app.use('/api/v1', globalLimiter);

// Routes avec rate limiting pour opérations sensibles
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', sensitiveOperationLimiter, userRouter);
app.use('/api/v1/sessions', sensitiveOperationLimiter, sessionRouter);
app.use('/api/v1/feedback', sensitiveOperationLimiter, feedbackRouter);
app.use('/api/v1/games', sensitiveOperationLimiter, gameRouter);
app.use('/api/v1/campaigns', sensitiveOperationLimiter, campaignRouter);
app.use('/api/v1/characters', characterRouter);
app.use('/api/v1/tables', sensitiveOperationLimiter, tableRouter);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
    });
    
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

export default app;