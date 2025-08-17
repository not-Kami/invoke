import dotenv from "dotenv";

dotenv.config();

const env = {
    FRONTEND_URLS: process.env.FRONTEND_URLS,
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGO_URI || process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET || "default-secret-key-change-in-production",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    NODE_ENV: process.env.NODE_ENV || "development",
    DISABLE_RATE_LIMIT: process.env.DISABLE_RATE_LIMIT === "true",
}

export default env;