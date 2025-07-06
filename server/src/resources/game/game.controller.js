import Game from "./game.model.js";

const gameController = {
    createGame: async (req, res) => {
        const game = await Game.create(req.body);
        res.status(201).json(game);
    },
    getGames: async (req, res) => {
        const games = await Game.find();
        res.status(200).json(games);
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