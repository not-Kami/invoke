import Campaign from "./campaign.model.js";

const campaignController = {
    createCampaign: async (req, res) => {
        const campaign = await Campaign.create(req.body);
        res.status(201).json(campaign);
    },
    getCampaigns: async (req, res) => {
        const campaigns = await Campaign.find();
        res.status(200).json(campaigns);
    },
    getCampaign: async (req, res) => {
        const campaign = await Campaign.findById(req.params.id);
        res.status(200).json(campaign);
    },
    updateCampaign: async (req, res) => {
        const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(campaign);
    },
    deleteCampaign: async (req, res) => {
        const campaign = await Campaign.findByIdAndDelete(req.params.id);
        res.status(200).json(campaign);
    }
}

export default campaignController;