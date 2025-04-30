import { Router } from "express";
import campaignController from "./campaign.controller.js";

const campaignRouter = Router();

campaignRouter.post("/", campaignController.createCampaign);

export default campaignRouter;