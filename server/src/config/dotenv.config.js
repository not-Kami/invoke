import dotenv from "dotenv";

dotenv.config();

console.log('ENV DEBUG:', process.env.FRONTEND_URLS);

const env = {
    FRONTEND_URLS: process.env.FRONTEND_URLS,
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGO_URI || process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET || "default-secret-key-change-in-production",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
}

export default env;