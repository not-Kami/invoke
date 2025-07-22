import Game from "./game.model.js";

const gameController = {
    createGame: async (req, res) => {
        const game = await Game.create(req.body);
        res.status(201).json(game);
    },
    getGames: async (req, res) => {
        try {
            const { q, system, genre, page = 1, limit = 10, sort } = req.query;
            const filter = {};
            if (q) {
                filter.$or = [
                    { name: { $regex: q, $options: 'i' } },
                    { description: { $regex: q, $options: 'i' } }
                ];
            }
            if (system) filter.system = system;
            if (genre) filter.genre = genre;

            const sortOption = sort ? (sort.startsWith('-') ? { [sort.slice(1)]: -1 } : { [sort]: 1 }) : { createdAt: -1 };
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const games = await Game.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(parseInt(limit))
                .select('name description genre system image isActive createdAt');
            const total = await Game.countDocuments(filter);
            res.status(200).json({
                success: true,
                data: games,
                page: parseInt(page),
                limit: parseInt(limit),
                total
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch games', error: error.message });
        }
    },
    getGame: async (req, res) => {
        const game = await Game.findById(req.params.id);
        res.status(200).json(game);
    },
    updateGame: async (req, res) => {
        try {
            // TODO: Ajouter vérification des permissions admin
            // const user = req.user; // À implémenter avec l'authentification
            // if (user.role !== 'admin') {
            //     return res.status(403).json({
            //         success: false,
            //         message: 'Access denied. Admin privileges required.'
            //     });
            // }

            const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!game) {
                return res.status(404).json({
                    success: false,
                    message: 'Game not found'
                });
            }
            res.status(200).json({
                success: true,
                data: game
            });
        } catch (error) {
            console.error('Update game error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update game',
                error: error.message
            });
        }
    },
    deleteGame: async (req, res) => {
        const game = await Game.findByIdAndDelete(req.params.id);
        res.status(200).json(game);
    }
}

export default gameController;