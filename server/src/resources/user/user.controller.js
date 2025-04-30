import User from "./user.model.js";

const userController = {
    createUser: async (req, res) => {
        try {
            const user = await User.create(req.body);
            res.status(201).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    updateAvatar: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Une image est requise pour mettre à jour l\'avatar'
                });
            }

            const user = await User.findByIdAndUpdate(
                id,
                {
                    avatar: {
                        data: req.file.buffer,
                        contentType: req.file.mimetype
                    }
                },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

export default userController;