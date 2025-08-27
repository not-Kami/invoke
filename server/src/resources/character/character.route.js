import { Router } from "express";
import characterController from "./character.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { uploadImage, handleUploadError } from "../../middlewares/upload.middleware.js";
import { validateParams } from "../../middlewares/validate.js";
import fs from "fs";
import path from "path";

const characterRouter = Router();

// Créer un personnage
characterRouter.post("/", protect, characterController.createCharacter);
// Lister les persos de l'utilisateur connecté
characterRouter.get("/", protect, characterController.getMyCharacters);
// Voir un perso (si owner)
characterRouter.get("/:id", protect, validateParams(/*schema à créer si besoin*/), characterController.getCharacter);
// Modifier un perso (si owner)
characterRouter.put("/:id", protect, validateParams(/*schema à créer si besoin*/), characterController.updateCharacter);
// Supprimer un perso (si owner)
characterRouter.delete("/:id", protect, validateParams(/*schema à créer si besoin*/), characterController.deleteCharacter);
// Upload avatar (si owner)
characterRouter.post(
  "/:id/avatar",
  protect,
  validateParams(/*schema à créer si besoin*/),
  uploadImage,
  handleUploadError,
  characterController.uploadAvatar
);

export default characterRouter; 