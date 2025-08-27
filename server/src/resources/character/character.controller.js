import Character from "./character.model.js";
import path from "path";

const characterController = {
  // Créer un personnage
  createCharacter: async (req, res) => {
    try {
      const { name, meta, sessions } = req.body;
      if (!name) return res.status(400).json({ success: false, message: "Name is required" });
      const character = await Character.create({
        user: req.user._id,
        name,
        meta: meta || {},
        sessions: sessions || []
      });
      res.status(201).json({ success: true, character });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Lister les personnages de l'utilisateur connecté
  getMyCharacters: async (req, res) => {
    try {
      const characters = await Character.find({ user: req.user._id });
      res.status(200).json({ success: true, characters });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Voir un personnage (si owner)
  getCharacter: async (req, res) => {
    try {
      const character = await Character.findById(req.params.id);
      if (!character) return res.status(404).json({ success: false, message: "Character not found" });
      if (String(character.user) !== String(req.user._id)) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      res.status(200).json({ success: true, character });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Modifier un personnage (si owner)
  updateCharacter: async (req, res) => {
    try {
      const character = await Character.findById(req.params.id);
      if (!character) return res.status(404).json({ success: false, message: "Character not found" });
      if (String(character.user) !== String(req.user._id)) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      // Champs libres
      if (req.body.name) character.name = req.body.name;
      if (req.body.meta) character.meta = req.body.meta;
      if (req.body.sessions) character.sessions = req.body.sessions;
      character.updatedAt = new Date();
      await character.save();
      res.status(200).json({ success: true, character });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Supprimer un personnage (si owner)
  deleteCharacter: async (req, res) => {
    try {
      const character = await Character.findById(req.params.id);
      if (!character) return res.status(404).json({ success: false, message: "Character not found" });
      if (String(character.user) !== String(req.user._id)) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      await character.deleteOne();
      res.status(200).json({ success: true, message: "Character deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Upload avatar pour un personnage (si owner)
  uploadAvatar: async (req, res) => {
    try {
      const character = await Character.findById(req.params.id);
      if (!character) return res.status(404).json({ success: false, message: "Character not found" });
      if (String(character.user) !== String(req.user._id)) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
      character.avatar = path.basename(req.file.path);
      character.updatedAt = new Date();
      await character.save();
      res.status(200).json({ success: true, character, file: req.file });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export default characterController; 