import Game from "./game.model.js";

const gameController = {
    createGame: async (req, res) => {
        const game = await Game.create(req.body);
        res.status(201).json(game);
    },
    getGames: async (req, res) => {
        const games = await Game.find();
        res.status(200).json(games);
    }
}

export default gameController;