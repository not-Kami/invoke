import { Router } from "express";
import gameController from "./game.controller.js";
import { uploads, compressImage } from "../../middlewares/upload.middleware.js";
import { validateGameImages } from "../../middlewares/validation.middleware.js";

const router = Router();

// Configuration pour les uploads multiples
const gameUpload = uploads.game.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]);

router.post("/", gameUpload, compressImage('game'), validateGameImages, gameController.createGame);
router.get("/", gameController.getGames);
router.get("/:id/image/:type/:index?", gameController.getGameImage);

export default router;