import express from "express";
import env from "./dotenv.config.js";
import userRouter from "../resources/user/user.route.js";
import sessionRouter from "../resources/session/session.route.js";
import feedbackRouter from "../resources/feedback/feedback.route.js";
import gameRouter from "../resources/game/game.route.js";

const app = express(env.PORT);

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.use('/api/v1/users', userRouter);
app.use('/api/v1/sessions', sessionRouter);
app.use('/api/v1/feedback', feedbackRouter);
app.use('/api/v1/games', gameRouter);

// Error handling

export default app;