// Imports packages
import express from "express";
import helmet from "helmet";
import cors from "cors";
// Imports config
import env from "./dotenv.config.js";
import databaseConnection from "./database.config.js";
// Imports routes
import userRouter from "../resources/user/user.route.js";
import sessionRouter from "../resources/session/session.route.js";
import feedbackRouter from "../resources/feedback/feedback.route.js";
import gameRouter from "../resources/game/game.route.js";
// Imports middlewares
import errorHandler from "../middlewares/error.middleware.js";
import loggerMiddleware from "../middlewares/logger.middleware.js";
import {uploads} from "../middlewares/upload.middleware.js";

const app = express(env.PORT);
databaseConnection
    .then(() => {
        console.log("Connecté à la base de données");
    })
    .catch((error) => {
        console.error("Connexion à la base de données échouée:", error);
        process.exit(1);
    });

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(loggerMiddleware);
app.use(uploads);
app.use(cors());

// Routes

app.use('/api/v1/users', userRouter);
app.use('/api/v1/sessions', sessionRouter);
app.use('/api/v1/feedback', feedbackRouter);
app.use('/api/v1/games', gameRouter);

// Error handling
app.use(errorHandler);

export default app;