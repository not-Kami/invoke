import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    timezone: { type: String, default: 'UTC' },
    sessionType: { type: String, enum: ["online", "offline"], required: true },
    isOneShot: { type: Boolean, default: false },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    dm: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    players: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    maxPlayers: { type: Number, default: 6, min: 1 },
    status: { type: String, enum: ["open", "full", "finished", "cancelled"], default: "open" },
    featured: { type: Boolean, default: false },
    image: { type: String, default: null }, // URL de l'image
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const Session = mongoose.model("Session", sessionSchema);

export default Session;
