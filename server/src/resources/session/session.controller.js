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
    getSession: async (req, res) => {
        const session = await Session.findById(req.params.id);
        res.status(200).json(session);
    },
    updateSession: async (req, res) => {
        const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(session);
    },
    deleteSession: async (req, res) => {
        const session = await Session.findByIdAndDelete(req.params.id);
        res.status(200).json(session);
    }
}

export default sessionController;