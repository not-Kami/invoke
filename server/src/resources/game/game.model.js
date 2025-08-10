import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String, required: true },
    system: { type: String, required: true },
    image: { type: String, required: false }, // Nom du fichier uploadé
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const Game = mongoose.model("Game", gameSchema);

export default Game;