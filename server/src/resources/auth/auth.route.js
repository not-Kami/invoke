import { Router } from "express";
import * as authController from "./auth.controller.js";
import validate from "../../middlewares/validate.js";
import * as authValidation from "./auth.validation.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { authLimiter } from "../../middlewares/rateLimiter.middleware.js";

const authRouter = Router();

// Routes publiques avec rate limiting pour l'auth
authRouter.post("/signup", authLimiter, validate(authValidation.signupSchema), authController.signup);
authRouter.post("/login", authLimiter, validate(authValidation.loginSchema), authController.login);

// Routes protégées
authRouter.get("/me", protect, authController.getMe);
authRouter.put("/update-password", protect, validate(authValidation.updatePasswordSchema), authController.updatePassword);

export default authRouter; 