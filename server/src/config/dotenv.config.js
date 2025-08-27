import dotenv from "dotenv";

dotenv.config();

console.log('ENV DEBUG - FRONTEND_URLS:', process.env.FRONTEND_URLS);
console.log('ENV DEBUG - JWT_SECRET:', process.env.JWT_SECRET ? 'Present' : 'Missing');
console.log('ENV DEBUG - MONGODB_URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');

const env = {
    FRONTEND_URLS: process.env.FRONTEND_URLS,
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGO_URI || process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET || "default-secret-key-change-in-production",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    NODE_ENV: process.env.NODE_ENV || "development",
    DISABLE_RATE_LIMIT: process.env.DISABLE_RATE_LIMIT === "true",
}

console.log('ENV DEBUG - Final JWT_SECRET:', env.JWT_SECRET ? 'Present' : 'Missing');

export default env;