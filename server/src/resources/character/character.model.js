import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  avatar: { type: String, default: null },
  meta: { type: Object, default: {} }, // Attributs dynamiques
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Character = mongoose.model("Character", characterSchema);
export default Character; 