import Joi from "joi";

export const createGameSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    genre: Joi.string().required(),
    system: Joi.string().required(),
    images: Joi.object({
        logo: Joi.string().optional(),
        portrait: Joi.string().optional(),
        banner: Joi.string().optional()
    }).optional(),
    featured: Joi.boolean().optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
    createdBy: Joi.string().optional(), // Temporairement optionnel pour les tests
    updatedBy: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    isDeleted: Joi.boolean().optional(),
});

export const updateGameSchema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    genre: Joi.string().optional(),
    system: Joi.string().optional(),
    images: Joi.object({
        logo: Joi.string().optional(),
        portrait: Joi.string().optional(),
        banner: Joi.string().optional()
    }).optional(),
    featured: Joi.boolean().optional(),
    // Les champs suivants ne devraient être modifiés que par des admins
    // createdAt: Joi.date().optional(),
    // updatedAt: Joi.date().optional(),
    // createdBy: Joi.string().optional(),
    // updatedBy: Joi.string().optional(),
});

export const getGameSchema = Joi.object({
    id: Joi.string().required(),
});

export const deleteGameSchema = Joi.object({
    id: Joi.string().required(),
});

export const getGamesSchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    search: Joi.string().optional(),
    genre: Joi.string().optional(),
    system: Joi.string().optional(),
});

