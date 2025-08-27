import { Router } from "express";
import conversationController from "./conversation.controller.js";
import { validate, validateParams, validateQuery } from "../../middlewares/validate.js";
import * as conversationValidation from "./conversation.validation.js";
import { protect, restrictTo } from "../../middlewares/auth.middleware.js";

const conversationRouter = Router();

// Routes publiques (pas besoin d'authentification)
conversationRouter.post("/", 
    validate(conversationValidation.createConversationSchema), 
    conversationController.createConversation
);

// Routes protégées (utilisateur connecté)
conversationRouter.use(protect); // Protection JWT

// Récupérer les conversations de l'utilisateur connecté
conversationRouter.get("/user", 
    conversationController.getUserConversations
);

// Récupérer les conversations d'un utilisateur spécifique (par ID)
conversationRouter.get("/user/:userId", 
    validateParams(conversationValidation.userIdSchema),
    conversationController.getUserConversationsById
);

// Ajouter un message à une conversation (utilisateur connecté)
conversationRouter.post("/:id/messages", 
    validateParams(conversationValidation.conversationIdSchema),
    validate(conversationValidation.addMessageSchema),
    conversationController.addMessage
);

// Marquer une conversation comme lue (utilisateur connecté)
conversationRouter.patch("/:id/read", 
    validateParams(conversationValidation.conversationIdSchema),
    conversationController.markAsRead
);

// Fermer une conversation (utilisateur connecté)
conversationRouter.patch("/:id/close", 
    validateParams(conversationValidation.conversationIdSchema),
    conversationController.closeConversation
);

// Routes protégées (admin seulement)
conversationRouter.use(restrictTo('admin')); // Restriction aux admins

// Récupérer toutes les conversations (admin)
conversationRouter.get("/", 
    validateQuery(conversationValidation.getConversationsSchema),
    conversationController.getAllConversations
);

// Récupérer une conversation par ID (pour l'admin)
conversationRouter.get("/:id", 
    validateParams(conversationValidation.conversationIdSchema),
    conversationController.getConversation
);

// Admin répond à une conversation
conversationRouter.post("/:id/admin-reply", 
    validateParams(conversationValidation.conversationIdSchema),
    validate(conversationValidation.replyToConversationSchema),
    conversationController.replyToConversation
);

// Utilisateur répond à une conversation (route publique déplacée ici)
conversationRouter.post("/:id/reply", 
    validateParams(conversationValidation.conversationIdSchema),
    validate(conversationValidation.userReplySchema),
    conversationController.userReply
);

// Assigner une conversation à un admin
conversationRouter.patch("/:id/assign", 
    validateParams(conversationValidation.assignConversationSchema),
    validate(conversationValidation.assignConversationSchema),
    conversationController.assignConversation
);

// Supprimer une conversation (soft delete)
conversationRouter.delete("/:id", 
    validateParams(conversationValidation.conversationIdSchema),
    conversationController.deleteConversation
);

export default conversationRouter;
