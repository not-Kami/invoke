import User from "./user.model.js";

const userController = {
    createUser: async (req, res) => {
        const user = await User.create(req.body);
        res.status(201).json(user);
    },
    getUsers: async (req, res) => {
        const users = await User.find();
        res.status(200).json(users);
    },
    getUser: async (req, res) => {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
        return;
    },
    updateUser: async (req, res) => {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(user);
        return;
    },
    deleteUser: async (req, res) => {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(user);
        return;
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
    }
}

export default userController;