import Feedback from "./feedback.model.js";

const feedbackController = {
    createFeedback: async (req, res) => {
        const feedback = await Feedback.create(req.body);
        res.status(201).json(feedback);
    },
    getFeedbacks: async (req, res) => {
        const feedbacks = await Feedback.find();
        res.status(200).json(feedbacks);
    },
    getFeedback: async (req, res) => {
        const feedback = await Feedback.findById(req.params.id);
        res.status(200).json(feedback);
    },
    updateFeedback: async (req, res) => {
        const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(feedback);
    },
    deleteFeedback: async (req, res) => {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        res.status(200).json(feedback);
    }
}

export default feedbackController;