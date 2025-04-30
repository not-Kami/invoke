import Feedback from "./feedback.model.js";

const feedbackController = {
    createFeedback: async (req, res) => {
        const feedback = await Feedback.create(req.body);
        res.status(201).json(feedback);
    },
    getFeedback: async (req, res) => {
        const feedback = await Feedback.find();
        res.status(200).json(feedback);
    }
}

export default feedbackController;