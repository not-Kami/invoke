import Joi from "joi";

export const createFeedbackSchema = Joi.object({
  author: Joi.string().required(),
  rating: Joi.number().required(),
  comment: Joi.string().optional(),
  target: Joi.string().optional(),
  session: Joi.string().optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional()
});

export const updateFeedbackSchema = Joi.object({
  rating: Joi.number().optional(),
  comment: Joi.string().optional(),
  target: Joi.string().optional(),
  session: Joi.string().optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional()
});

export const getFeedbackSchema = Joi.object({
  id: Joi.string().required(),
});

export const deleteFeedbackSchema = Joi.object({
  id: Joi.string().required(),
});

