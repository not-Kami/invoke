import Campaign from "./campaign.model.js";

const campaignController = {
    createCampaign: async (req, res) => {
        const campaign = await Campaign.create(req.body);
        res.status(201).json(campaign);
    },
    getCampaigns: async (req, res) => {
        try {
            const { status, system, nextDate_gte, page = 1, limit = 10, sort } = req.query;
            const filter = {};
            if (status) filter.status = status;
            if (system) filter.system = system;
            if (nextDate_gte) filter.nextDate = { $gte: new Date(nextDate_gte) };

            const sortOption = sort ? (sort.startsWith('-') ? { [sort.slice(1)]: -1 } : { [sort]: 1 }) : { createdAt: -1 };
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const campaigns = await Campaign.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(parseInt(limit))
                .select('name description status system nextDate createdAt');
            const total = await Campaign.countDocuments(filter);
            res.status(200).json({
                success: true,
                data: campaigns,
                page: parseInt(page),
                limit: parseInt(limit),
                total
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch campaigns', error: error.message });
        }
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