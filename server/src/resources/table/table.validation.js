import Joi from 'joi';

export const createTableSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  description: Joi.string().max(500).allow(''),
  isPrivate: Joi.boolean().default(false),
  tags: Joi.array().items(Joi.string().max(20)).default([])
}); 