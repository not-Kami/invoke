import { Router } from "express";
import feedbackController from "./feedback.controller.js";
import { validate, validateParams } from "../../middlewares/validate.js";
import * as feedbackValidation from "./feedback.validation.js";
import { protect } from "../../middlewares/auth.middleware.js";

const feedbackRouter = Router();

feedbackRouter.post("/", protect, validate(feedbackValidation.createFeedbackSchema), feedbackController.createFeedback);
feedbackRouter.get("/", validate(feedbackValidation.getFeedbacksSchema), feedbackController.getFeedbacks);
feedbackRouter.get("/:id", validateParams(feedbackValidation.getFeedbackSchema), feedbackController.getFeedback);
feedbackRouter.put("/:id", protect, validateParams(feedbackValidation.getFeedbackSchema), validate(feedbackValidation.updateFeedbackSchema), feedbackController.updateFeedback);
feedbackRouter.delete("/:id", protect, validateParams(feedbackValidation.getFeedbackSchema), feedbackController.deleteFeedback);

export default feedbackRouter;