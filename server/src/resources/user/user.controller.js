import User from "./user.model.js";

const userController = {
    createUser: async (req, res) => {
        // const user = await User.create(req.body);
        // res.status(201).json(user);
        console.log(req.body);
        res.status(200).json({ message: "User created successfully" });
        return;
    },
    getUsers: async (req, res) => {
        // const users = await User.find();
        res.status(200).json({ message: "Users fetched successfully"});
        return
    }   
}

export default userController;