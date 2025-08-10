import mongoose from "mongoose";
import env from "./dotenv.config.js";

const connectDatabase = () => {
    console.log('🔗 Attempting database connection with URI:', env.MONGODB_URI ? 'Present' : 'Missing');
    return mongoose.connect(env.MONGODB_URI);
};

export default connectDatabase;