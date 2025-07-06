import { Router } from "express";
import feedbackController from "./feedback.controller.js";
import validate from "../../middlewares/validate.js";
import * as feedbackValidation from "./feedback.validation.js";

const feedbackRouter = Router();

feedbackRouter.post("/", validate(feedbackValidation.createFeedbackSchema), feedbackController.createFeedback);
feedbackRouter.get("/:id", validate(feedbackValidation.getFeedbackSchema), feedbackController.getFeedback);
feedbackRouter.put("/:id", validate(feedbackValidation.updateFeedbackSchema), feedbackController.updateFeedback);
feedbackRouter.delete("/:id", validate(feedbackValidation.deleteFeedbackSchema), feedbackController.deleteFeedback);

export default feedbackRouter;