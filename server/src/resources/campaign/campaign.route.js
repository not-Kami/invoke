import { Router } from "express";
import campaignController from "./campaign.controller.js";
import { validate, validateParams } from "../../middlewares/validate.js";
import * as campaignValidation from "./campaign.validation.js";
import { protect } from "../../middlewares/auth.middleware.js";

const campaignRouter = Router();

campaignRouter.post("/", protect, validate(campaignValidation.createCampaignSchema), campaignController.createCampaign);
campaignRouter.get("/", validate(campaignValidation.getCampaignsSchema), campaignController.getCampaigns);
campaignRouter.get("/:id", validateParams(campaignValidation.getCampaignSchema), campaignController.getCampaign);
campaignRouter.put("/:id", protect, validate(campaignValidation.updateCampaignSchema), campaignController.updateCampaign);
campaignRouter.delete("/:id", protect, validate(campaignValidation.deleteCampaignSchema), campaignController.deleteCampaign);

export default campaignRouter;