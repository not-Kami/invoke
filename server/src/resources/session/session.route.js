import { Router } from "express";
import sessionController from "./session.controller.js";
import { validate, validateParams } from "../../middlewares/validate.js";
import * as sessionValidation from "./session.validation.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/restrictTo.middleware.js";

const sessionRouter = Router();

sessionRouter.post("/", protect, validate(sessionValidation.createSessionSchema), sessionController.createSession);
sessionRouter.get("/", validate(sessionValidation.getSessionsSchema), sessionController.getSessions);
sessionRouter.get("/featured", sessionController.getFeaturedSessions);
sessionRouter.get("/:id", validateParams(sessionValidation.getSessionSchema), sessionController.getSession);
sessionRouter.put("/:id", protect, restrictTo("admin"), validateParams(sessionValidation.getSessionSchema), validate(sessionValidation.updateSessionSchema), sessionController.updateSession);
sessionRouter.delete("/:id", protect, restrictTo("admin"), validateParams(sessionValidation.getSessionSchema), sessionController.deleteSession);

export default sessionRouter;