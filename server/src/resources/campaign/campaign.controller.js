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
        try {
            const campaign = await Campaign.findById(req.params.id);
            if (!campaign) {
                return res.status(404).json({
                    success: false,
                    error: 'Campaign not found'
                });
            }
            res.status(200).json({
                success: true,
                data: campaign
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },
    updateCampaign: async (req, res) => {
        try {
            const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!campaign) {
                return res.status(404).json({
                    success: false,
                    error: 'Campaign not found'
                });
            }
            res.status(200).json({
                success: true,
                data: campaign
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },
    deleteCampaign: async (req, res) => {
        try {
            const campaign = await Campaign.findByIdAndDelete(req.params.id);
            if (!campaign) {
                return res.status(404).json({
                    success: false,
                    error: 'Campaign not found'
                });
            }
            res.status(200).json({
                success: true,
                data: campaign
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

export default campaignController;