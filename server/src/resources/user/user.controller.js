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
            // req.file contient les infos du fichier uploadé
            // req.params.id = id du user
            // Tu peux mettre à jour le champ avatar du user ici
            res.json({
                success: true,
                file: req.file
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Upload failed", error: error.message });
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