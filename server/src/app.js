import app from "./config/app.config.js";
import env from "./config/dotenv.config.js";
import databaseConnection from "./config/database.config.js";
import helmet from "helmet";
import loggerMiddleware from "./middlewares/logger.middleware.js";

// Apply middleware
app.use(helmet());
app.use(loggerMiddleware);

// Start server
app.listen(env.PORT || 3000, async () => {
    try {
        // await databaseConnection;
        console.log(`🚀 Server is running on port ${env.PORT || 3000}`);
        console.log(`✅ Database connected successfully`);
    } catch (error) {
        console.error(`❌ Server startup failed:`, error.message);
        process.exit(1);
    }
});

