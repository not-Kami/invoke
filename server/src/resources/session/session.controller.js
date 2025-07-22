import Session from "./session.model.js";

const sessionController = {
    createSession: async (req, res) => {
        const session = await Session.create(req.body);
        res.status(201).json(session);
    },
    getSessions: async (req, res) => {
        try {
            const { q, system, dateStart, dateEnd, format, slots_gte, page = 1, limit = 10, sort } = req.query;
            const filter = {};
            if (q) {
                filter.$or = [
                    { title: { $regex: q, $options: 'i' } },
                    { description: { $regex: q, $options: 'i' } }
                ];
            }
            if (system) filter.system = system;
            if (format) filter.format = format;
            if (dateStart || dateEnd) {
                filter.date = {};
                if (dateStart) filter.date.$gte = new Date(dateStart);
                if (dateEnd) filter.date.$lte = new Date(dateEnd);
            }
            if (slots_gte) filter.slots = { $gte: parseInt(slots_gte) };

            const sortOption = sort ? (sort.startsWith('-') ? { [sort.slice(1)]: -1 } : { [sort]: 1 }) : { date: 1 };
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const sessions = await Session.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(parseInt(limit))
                .select('title description date format slots system status createdAt');
            const total = await Session.countDocuments(filter);
            res.status(200).json({
                success: true,
                data: sessions,
                page: parseInt(page),
                limit: parseInt(limit),
                total
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch sessions', error: error.message });
        }
    },
    getSession: async (req, res) => {
        const session = await Session.findById(req.params.id);
        res.status(200).json(session);
    },
    updateSession: async (req, res) => {
        const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(session);
    },
    deleteSession: async (req, res) => {
        const session = await Session.findByIdAndDelete(req.params.id);
        res.status(200).json(session);
    }
}

export default sessionController;