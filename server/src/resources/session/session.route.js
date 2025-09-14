import { Router } from "express";
import sessionController from "./session.controller.js";
import { validate, validateParams, validateQuery } from "../../middlewares/validate.js";
import * as sessionValidation from "./session.validation.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/restrictTo.middleware.js";

const sessionRouter = Router();

sessionRouter.post("/", protect, validate(sessionValidation.createSessionSchema), sessionController.createSession);
sessionRouter.get("/", validateQuery(sessionValidation.getSessionsSchema), sessionController.getSessions);
sessionRouter.get("/featured", sessionController.getFeaturedSessions);
sessionRouter.get("/:id", validateParams(sessionValidation.getSessionSchema), sessionController.getSession);
sessionRouter.put("/:id", protect, validateParams(sessionValidation.getSessionSchema), validate(sessionValidation.updateSessionSchema), sessionController.updateSession);
sessionRouter.delete("/:id", protect, restrictTo("admin"), validateParams(sessionValidation.getSessionSchema), sessionController.deleteSession);

// Route admin pour mettre à jour le statut featured
sessionRouter.patch("/:id/featured", protect, restrictTo("admin"), sessionController.adminUpdateSession);

// Routes pour la gestion des joueurs
sessionRouter.post("/:id/invite", protect, sessionController.invitePlayer);
sessionRouter.delete("/:id/remove-player", protect, sessionController.removePlayer);
sessionRouter.post("/:id/join", protect, sessionController.joinSession);

export default sessionRouter;