import Game from "./game.model.js";

const gameController = {
    createGame: async (req, res) => {
        try {
            const { name, description, genre, system } = req.body;
            
            // Créer le jeu avec les images
            const game = await Game.create({
                name,
                description,
                genre,
                system,
                logo: req.files.logo ? {
                    data: req.files.logo[0].buffer,
                    contentType: req.files.logo[0].mimetype
                } : null,
                banner: req.files.banner ? {
                    data: req.files.banner[0].buffer,
                    contentType: req.files.banner[0].mimetype
                } : null,
                images: req.files.images ? req.files.images.map(file => ({
                    data: file.buffer,
                    contentType: file.mimetype,
                    caption: req.body.captions ? req.body.captions[file.originalname] : null
                })) : []
            });

            res.status(201).json({
                success: true,
                data: game
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getGames: async (req, res) => {
        try {
            const games = await Game.find();
            res.status(200).json({
                success: true,
                data: games
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getGameImage: async (req, res) => {
        try {
            const { id, type, index } = req.params;
            const game = await Game.findById(id);

            if (!game) {
                return res.status(404).json({
                    success: false,
                    message: 'Jeu non trouvé'
                });
            }

            let imageData;
            if (type === 'logo') {
                imageData = game.logo;
            } else if (type === 'banner') {
                imageData = game.banner;
            } else if (type === 'images' && index) {
                imageData = game.images[index];
            }

            if (!imageData || !imageData.data) {
                return res.status(404).json({
                    success: false,
                    message: 'Image non trouvée'
                });
            }

            res.set('Content-Type', imageData.contentType);
            res.send(imageData.data);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

export default gameController;