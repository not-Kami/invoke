import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { uploadImage, handleUploadError } from "../../middlewares/upload.middleware.js";
import * as userController from "./user.controller.js";
import validate from "../../middlewares/validate.js";
import * as userValidation from "./user.validation.js";
import { restrictTo } from "../../middlewares/restrictTo.middleware.js";

const userRouter = Router();

// ===== ROUTES PUBLIQUES =====
userRouter.post("/", validate(userValidation.createUserSchema), userController.createUser);
userRouter.get("/featured-dms", userController.getFeaturedDMs);

// ===== ROUTES PROTÉGÉES =====
userRouter.use(protect); // Toutes les routes suivantes nécessitent une authentification

// ===== GESTION DES UTILISATEURS (Admin uniquement) =====
userRouter.get("/", restrictTo("admin"), userController.getUsers);
userRouter.get("/:id", userController.getUser); // L'utilisateur peut voir son propre profil

// ===== PROFIL UTILISATEUR =====
userRouter.put("/:id/profile", userController.updateProfile); // Profil de base uniquement
userRouter.delete("/:id", userController.deleteUser); // Suppression de profil
userRouter.post("/:id/avatar", uploadImage, handleUploadError, userController.uploadAvatar);

// ===== RÔLE UTILISATEUR =====
userRouter.put("/:id/role", userController.updateRole); // Changer de rôle (devenir DM)

// ===== JEUX FAVORIS =====
userRouter.get("/:id/favorites", userController.getFavorites);
userRouter.post("/:id/favorites", userController.addFavorite);
userRouter.delete("/:id/favorites/:gameId", userController.removeFavorite);

// ===== JEUX MAÎTRISÉS (DM uniquement) =====
userRouter.get("/:id/mastered", userController.getMastered);
userRouter.post("/:id/mastered", userController.addMastered);
userRouter.delete("/:id/mastered/:gameId", userController.removeMastered);

export default userRouter;
