import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { uploadImage, handleUploadError } from "../../middlewares/upload.middleware.js";
import userController from "./user.controller.js";
import validate from "../../middlewares/validate.js";
import * as userValidation from "./user.validation.js";
import { restrictTo } from "../../middlewares/restrictTo.middleware.js";

const userRouter = Router();

userRouter.post("/",validate(userValidation.createUserSchema), userController.createUser);
userRouter.get("/", protect, restrictTo("admin"), userController.getUsers); // admin only
userRouter.get("/:id", protect, userController.getUser); // user ou admin
userRouter.put("/:id", protect, userController.updateUser); // user ou admin
userRouter.delete("/:id", protect, userController.deleteUser); // user ou admin

userRouter.post(
  "/:id/avatar",
  protect,
  uploadImage,
  handleUploadError,
  userController.uploadAvatar // à créer dans le controller
);

export default userRouter;
