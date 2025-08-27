import Joi from 'joi';

// Schéma pour créer une nouvelle conversation
export const createConversationSchema = Joi.object({
    conversationType: Joi.string()
        .valid('contact_admin', 'user_chat')
        .default('contact_admin')
        .messages({
            'any.only': 'Le type de conversation doit être contact_admin ou user_chat'
        }),
    userEmail: Joi.string()
        .email()
        .when('conversationType', {
            is: 'contact_admin',
            then: Joi.required(),
            otherwise: Joi.optional()
        })
        .messages({
            'string.email': 'Veuillez fournir une adresse email valide',
            'any.required': 'L\'email est requis pour les conversations de contact admin'
        }),
    subject: Joi.string()
        .min(3)
        .max(200)
        .required()
        .messages({
            'string.min': 'Le sujet doit contenir au moins 3 caractères',
            'string.max': 'Le sujet ne peut pas dépasser 200 caractères',
            'any.required': 'Le sujet est requis'
        }),
    content: Joi.string()
        .min(10)
        .max(2000)
        .required()
        .messages({
            'string.min': 'Le message doit contenir au moins 10 caractères',
            'string.max': 'Le message ne peut pas dépasser 2000 caractères',
            'any.required': 'Le contenu du message est requis'
        })
});

// Schéma pour répondre à une conversation (admin)
export const replyToConversationSchema = Joi.object({
    content: Joi.string()
        .min(1)
        .max(2000)
        .required()
        .messages({
            'string.min': 'Le message ne peut pas être vide',
            'string.max': 'Le message ne peut pas dépasser 2000 caractères',
            'any.required': 'Le contenu du message est requis'
        })
});

// Schéma pour la réponse utilisateur
export const userReplySchema = Joi.object({
    content: Joi.string()
        .min(1)
        .max(2000)
        .required()
        .messages({
            'string.min': 'Le message ne peut pas être vide',
            'string.max': 'Le message ne peut pas dépasser 2000 caractères',
            'any.required': 'Le contenu du message est requis'
        }),
    userEmail: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Veuillez fournir une adresse email valide',
            'any.required': 'L\'email est requis pour vérifier l\'accès'
        })
});

// Schéma pour ajouter un message (utilisateur connecté)
export const addMessageSchema = Joi.object({
    content: Joi.string()
        .min(1)
        .max(2000)
        .required()
        .messages({
            'string.min': 'Le message ne peut pas être vide',
            'string.max': 'Le message ne peut pas dépasser 2000 caractères',
            'any.required': 'Le contenu du message est requis'
        })
});

// Schéma pour assigner une conversation
export const assignConversationSchema = Joi.object({
    assignedTo: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'L\'ID de l\'utilisateur assigné doit être un ObjectId valide',
            'any.required': 'L\'utilisateur assigné est requis'
        })
});

// Schéma pour l'ID utilisateur
export const userIdSchema = Joi.object({
    userId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'L\'ID de l\'utilisateur doit être un ObjectId valide',
            'any.required': 'L\'ID de l\'utilisateur est requis'
        })
});

// Schéma pour les paramètres de requête (filtres)
export const getConversationsSchema = Joi.object({
    status: Joi.string()
        .valid('open', 'in_progress', 'closed')
        .optional()
        .messages({
            'any.only': 'Le statut doit être l\'un des suivants: open, in_progress, closed'
        }),
    assignedTo: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .optional()
        .messages({
            'string.pattern.base': 'L\'ID de l\'utilisateur assigné doit être un ObjectId valide'
        }),
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .optional()
        .messages({
            'number.base': 'Le numéro de page doit être un nombre',
            'number.integer': 'Le numéro de page doit être un entier',
            'number.min': 'Le numéro de page doit être au moins 1'
        }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(20)
        .optional()
        .messages({
            'number.base': 'La limite doit être un nombre',
            'number.integer': 'La limite doit être un entier',
            'number.min': 'La limite doit être au moins 1',
            'number.max': 'La limite ne peut pas dépasser 100'
        })
});

// Schéma pour les paramètres d'ID
export const conversationIdSchema = Joi.object({
    id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'L\'ID de la conversation doit être un ObjectId valide',
            'any.required': 'L\'ID de la conversation est requis'
        })
});
