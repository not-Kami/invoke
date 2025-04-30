import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    rating: { type: Number, required: true },
    comment: { type: String, default: null },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    target: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
