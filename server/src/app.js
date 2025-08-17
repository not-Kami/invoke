import env from "./config/dotenv.config.js";
import app from "./config/app.config.js";
import connectDatabase from "./config/database.config.js";
import helmet from "helmet";
import loggerMiddleware from "./middlewares/logger.middleware.js";

// Apply middleware
app.use(helmet());
app.use(loggerMiddleware);

// Start server
app.listen(env.PORT || 3000, async () => {
    try {
        await connectDatabase();
        // Database connected successfully
        // Server is running
        // Health check available
    } catch (error) {
        console.error(`Database connection failed:`, error.message);
        process.exit(1);
    }
});

