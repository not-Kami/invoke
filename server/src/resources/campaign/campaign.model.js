import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    dm: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    players: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    sessions: { type: [mongoose.Schema.Types.ObjectId], ref: "Session", default: [] },
    image: {
        data: { type: Buffer },
        contentType: { type: String }
    },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
    feedback: { type: [mongoose.Schema.Types.ObjectId], ref: "Feedback", default: [] }
});

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;
