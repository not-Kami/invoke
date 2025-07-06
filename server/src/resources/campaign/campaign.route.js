import { Router } from "express";
import campaignController from "./campaign.controller.js";
import validate from "../../middlewares/validate.js";
import * as campaignValidation from "./campaign.validation.js";

const campaignRouter = Router();

campaignRouter.post("/", validate(campaignValidation.createCampaignSchema), campaignController.createCampaign);
campaignRouter.get("/", validate(campaignValidation.getCampaignsSchema), campaignController.getCampaigns);
campaignRouter.get("/:id", validate(campaignValidation.getCampaignSchema), campaignController.getCampaign);
campaignRouter.put("/:id", validate(campaignValidation.updateCampaignSchema), campaignController.updateCampaign);
campaignRouter.delete("/:id", validate(campaignValidation.deleteCampaignSchema), campaignController.deleteCampaign);

export default campaignRouter;