import User from "./user.model.js";

const userController = {
    createUser: async (req, res) => {
        const user = await User.create(req.body);
        res.status(201).json(user);
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
                error: error.message
            });
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },
    updateUser: async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },
    uploadAvatar: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Aucun fichier fourni'
                });
            }

            const userId = req.params.id;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'ID utilisateur requis'
                });
            }

            // Vérifier que l'utilisateur existe
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            // Vérifier que l'utilisateur connecté peut modifier cet avatar
            if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Vous n\'êtes pas autorisé à modifier cet avatar'
                });
            }

            // Construire l'URL de l'avatar
            // Le middleware uploadImage sauvegarde dans uploads/user/:userId/
            // Utiliser l'URL du serveur depuis les variables d'environnement
            const serverUrl = process.env.SERVER_URL || (req.protocol + '://' + req.get('host'));
            const avatarUrl = `${serverUrl}/uploads/user/${userId}/${req.file.filename}`;
            


            // Mettre à jour l'utilisateur avec le nouvel avatar
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { 
                    avatar: avatarUrl,
                    updatedAt: new Date()
                },
                { new: true }
            );

            res.status(200).json({
                success: true,
                message: 'Avatar uploadé avec succès',
                data: {
                    user: {
                        id: updatedUser._id,
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        avatar: updatedUser.avatar
                    },
                    file: {
                        filename: req.file.filename,
                        path: req.file.path,
                        size: req.file.size,
                        mimetype: req.file.mimetype,
                        url: avatarUrl
                    }
                }
            });
        } catch (error) {
            console.error('Erreur upload avatar:', error);
            res.status(500).json({ 
                success: false, 
                message: "Échec de l'upload", 
                error: error.message 
            });
        }
    },
    getFeaturedDMs: async (req, res) => {
        try {
            const dms = await User.find({ 
                isDM: true, 
                featured: true,
                deletedAt: null 
            })
            .select('firstName lastName avatar bio nickname')
            .sort({ createdAt: -1 })
            .limit(6);
            
            res.status(200).json({
                success: true,
                data: dms
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch featured DMs', error: error.message });
        }
    }
}

export default userController;