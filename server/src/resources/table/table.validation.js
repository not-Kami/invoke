import Joi from 'joi';

export const createTableSchema = Joi.object({
  name: Joi.string().min(2).max(100).required()
}); 