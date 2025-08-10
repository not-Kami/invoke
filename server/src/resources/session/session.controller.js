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
        try {
            const session = await Session.findById(req.params.id);
            if (!session) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found'
                });
            }
            res.status(200).json({
                success: true,
                data: session
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },
    updateSession: async (req, res) => {
        try {
            const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!session) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found'
                });
            }
            res.status(200).json({
                success: true,
                data: session
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },
    deleteSession: async (req, res) => {
        try {
            const session = await Session.findByIdAndDelete(req.params.id);
            if (!session) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found'
                });
            }
            res.status(200).json({
                success: true,
                data: session
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },
    getFeaturedSessions: async (req, res) => {
        try {
            const sessions = await Session.find({ featured: true, status: 'open' })
                .populate('game', 'name system')
                .populate('dm', 'firstName lastName avatar')
                .sort({ createdAt: -1 })
                .limit(6);
            
            res.status(200).json({
                success: true,
                data: sessions
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch featured sessions', error: error.message });
        }
    }
}

export default sessionController;