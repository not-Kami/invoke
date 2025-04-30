import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String, required: true },
    system: { type: String, required: true },
    logo: {
        data: { type: Buffer },
        contentType: { type: String }
    },
    banner: {
        data: { type: Buffer },
        contentType: { type: String }
    },
    images: [{
        data: { type: Buffer },
        contentType: { type: String },
        caption: { type: String }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Game = mongoose.model("Game", gameSchema);

export default Game;