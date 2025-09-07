import dotenv from "dotenv";

dotenv.config();

console.log('ENV DEBUG - NODE_ENV:', process.env.NODE_ENV);
console.log('ENV DEBUG - FRONTEND_URLS:', process.env.FRONTEND_URLS);
console.log('ENV DEBUG - COOKIE_DOMAIN:', process.env.COOKIE_DOMAIN);
console.log('ENV DEBUG - JWT_SECRET:', process.env.JWT_SECRET ? 'Present' : 'Missing');
console.log('ENV DEBUG - MONGODB_URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');

const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGO_URI || process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET || "default-secret-key-change-in-production",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    FRONTEND_URLS: process.env.FRONTEND_URLS,
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
    DISABLE_RATE_LIMIT: process.env.DISABLE_RATE_LIMIT === "true",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
}

console.log('ENV DEBUG - Final config:', {
    NODE_ENV: env.NODE_ENV,
    FRONTEND_URLS: env.FRONTEND_URLS,
    COOKIE_DOMAIN: env.COOKIE_DOMAIN
});

export default env;