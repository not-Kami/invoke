import { Router } from "express";
import userController from "./user.controller.js";
import validate from "../../middlewares/validate.js";
import * as userValidation from "./user.validation.js";

const userRouter = Router();

userRouter.post("/",validate(userValidation.createUserSchema), userController.createUser);
userRouter.get("/", validate(userValidation.getUsersSchema), userController.getUsers);
userRouter.get("/:id", validate(userValidation.getUserSchema), userController.getUser);
userRouter.put("/:id", validate(userValidation.updateUserSchema), userController.updateUser);
userRouter.delete("/:id", validate(userValidation.deleteUserSchema), userController.deleteUser);

export default userRouter;
