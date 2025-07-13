import mongoose from "mongoose";
import UserRole from "./user.enum.js";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    isDM: { type: Boolean, default: false },
    avatar: { type: String, default: null },
    bio: { type: String, default: null },
    favorite_games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    evaluations: { type: [mongoose.Schema.Types.ObjectId], ref: "Evaluation", default: [] },
    sessionsCreated: { type: [mongoose.Schema.Types.ObjectId], ref: "Session", default: [] },
    sessionsJoined: { type: [mongoose.Schema.Types.ObjectId], ref: "Session", default: [] },
    deletedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    nickname: { type: String, unique: true, sparse: true }, // sparse pour permettre null
});

const User = mongoose.model("User", userSchema);

export default User;
