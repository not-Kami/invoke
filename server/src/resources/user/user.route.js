import express from "express";
import userController from "./user.controller.js";
import { uploads, compressImage } from "../../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.post("/:id/avatar", uploads.user.single('avatar'), compressImage('user'), userController.updateAvatar);

export default router;
