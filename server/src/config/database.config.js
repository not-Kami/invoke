import mongoose from "mongoose";
import env from "./dotenv.config.js";

const connectDatabase = () => {
    return mongoose.connect(env.MONGODB_URI);
};

export default connectDatabase;