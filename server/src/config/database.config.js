import mongoose from "mongoose";
import env from "./dotenv.config.js";

const databaseConnection = mongoose.connect(env.MONGO_URI);

export default databaseConnection;