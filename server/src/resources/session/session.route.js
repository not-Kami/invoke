import { Router } from "express";
import sessionController from "./session.controller.js";
import validate from "../../middlewares/validate.js";
import * as sessionValidation from "./session.validation.js";

const sessionRouter = Router();

sessionRouter.post("/", /*validate(sessionValidation.createSessionSchema),*/ sessionController.createSession);
sessionRouter.get("/", /*validate(sessionValidation.getSessionsSchema),*/ sessionController.getSessions);
sessionRouter.get("/:id", /*validate(sessionValidation.getSessionSchema),*/ sessionController.getSession);
sessionRouter.put("/:id", /*validate(sessionValidation.updateSessionSchema),*/ sessionController.updateSession);
sessionRouter.delete("/:id", /*validate(sessionValidation.deleteSessionSchema),*/ sessionController.deleteSession);

export default sessionRouter;