import Session from "./session.model.js";

const sessionController = {
    createSession: async (req, res) => {
        const session = await Session.create(req.body);
        res.status(201).json(session);
    },
    getSessions: async (req, res) => {
        const sessions = await Session.find();
        res.status(200).json(sessions);
    },
    
}

export default sessionController;