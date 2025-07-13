import Joi from "joi";

export const createCampaignSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  game: Joi.string().required(),
  dm: Joi.string().required(),
  players: Joi.array().items(Joi.string()).optional(),
  sessions: Joi.array().items(Joi.string()).optional(),
  active: Joi.boolean().optional(),
  createdAt: Joi.date().optional(),
});

export const updateCampaignSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  game: Joi.string().optional(),
  dm: Joi.string().optional(),
  players: Joi.array().items(Joi.string()).optional(),
  sessions: Joi.array().items(Joi.string()).optional(),
  active: Joi.boolean().optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});

export const getCampaignSchema = Joi.object({
  id: Joi.string().required(),
});

export const deleteCampaignSchema = Joi.object({
  id: Joi.string().required(),
});

export const getCampaignsSchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    search: Joi.string().optional(),
    active: Joi.boolean().optional(),
    game: Joi.string().optional(),
    dm: Joi.string().optional(),
});

