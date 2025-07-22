import Joi from "joi";

export const createUserSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    nickname: Joi.string().optional(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid("user", "admin").required(),
    isDM: Joi.boolean().required(),
    avatar: Joi.string().optional(),
    bio: Joi.string().optional(),
    favorite_games: Joi.array().items(Joi.string()).optional(),
    evaluations: Joi.array().items(Joi.string()).optional(),
    sessionsCreated: Joi.array().items(Joi.string()).optional(),
    sessionsJoined: Joi.array().items(Joi.string()).optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
    deletedAt: Joi.date().optional(),
});

export const updateUserSchema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    nickname: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    role: Joi.string().valid("user", "admin").optional(),
    isDM: Joi.boolean().optional(),
    avatar: Joi.string().optional(),
    bio: Joi.string().optional(),
});

export const getUserSchema = Joi.object({
    id: Joi.string().required(),
});

export const deleteUserSchema = Joi.object({
    id: Joi.string().required(),
});

export const getUsersSchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    search: Joi.string().optional(),
    role: Joi.string().valid("user", "admin").optional(),
    isDM: Joi.boolean().optional(),
});

