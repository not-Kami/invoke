import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    sessionType: { type: String, enum: ["online", "offline"], required: true },
    isOneShot: { type: Boolean, default: false },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    dm: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    players: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    status: { type: String, enum: ["open", "full", "finished", "cancelled"], default: "open" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const Session = mongoose.model("Session", sessionSchema);

export default Session;
