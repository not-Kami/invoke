import Joi from "joi";

export const createSessionSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.date().required(),
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    estimatedDuration: Joi.number().integer().min(30).max(480).optional(),
    timezone: Joi.string().optional(),
    sessionType: Joi.string().valid("online", "offline").required(),
    isOneShot: Joi.boolean().required(),
    game: Joi.string().required(),
    dm: Joi.string().required(),
    players: Joi.array().items(Joi.string()).optional(),
    maxPlayers: Joi.number().integer().min(1).optional(),
    status: Joi.string().valid("open", "full", "finished", "cancelled").optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
    deletedAt: Joi.date().optional(),
});

export const updateSessionSchema = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    date: Joi.date().optional(),
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    estimatedDuration: Joi.number().integer().min(30).max(480).optional(),
    timezone: Joi.string().optional(),
    sessionType: Joi.string().valid("online", "offline").optional(),
    isOneShot: Joi.boolean().optional(),
    game: Joi.string().optional(),
    dm: Joi.string().optional(),
    players: Joi.array().items(Joi.string()).optional(),
    maxPlayers: Joi.number().integer().min(1).optional(),
    status: Joi.string().valid("open", "full", "finished", "cancelled").optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
    deletedAt: Joi.date().optional(),
});

export const getSessionSchema = Joi.object({
    id: Joi.string().required(),
});

export const deleteSessionSchema = Joi.object({
    id: Joi.string().required(),
});

export const getSessionsSchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    search: Joi.string().optional(),
    sessionType: Joi.string().valid("online", "offline").optional(),
    status: Joi.string().valid("open", "full", "finished", "cancelled").optional(),
    game: Joi.string().optional(),
    dm: Joi.string().optional(),
});

