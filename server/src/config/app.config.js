import express from "express";
import env from "./dotenv.config.js";
import userRouter from "../resources/user/user.route.js";
import sessionRouter from "../resources/session/session.route.js";
import feedbackRouter from "../resources/feedback/feedback.route.js";
import gameRouter from "../resources/game/game.route.js";
import campaignRouter from "../resources/campaign/campaign.route.js";

const app = express();

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

// Routes

app.use('/api/v1/users', userRouter);
app.use('/api/v1/sessions', sessionRouter);
app.use('/api/v1/feedback', feedbackRouter);
app.use('/api/v1/games', gameRouter);
app.use('/api/v1/campaigns', campaignRouter);

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
    console.error('Error details:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message || 'Something went wrong'
    });
});

export default app;