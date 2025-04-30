import { Router } from "express";
import sessionController from "./session.controller.js";

const sessionRouter = Router();

sessionRouter.post("/", sessionController.createSession);
sessionRouter.get("/", sessionController.getSessions);

export default sessionRouter;