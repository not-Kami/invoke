import Campaign from "./campaign.model.js";

const campaignController = {
    createCampaign: async (req, res) => {
        const campaign = await Campaign.create(req.body);
    }
}

export default campaignController;