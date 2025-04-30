import { Router } from "express";
import feedbackController from "./feedback.controller.js";

const feedbackRouter = Router();

feedbackRouter.post("/", feedbackController.createFeedback);
feedbackRouter.get("/", feedbackController.getFeedback);

export default feedbackRouter;