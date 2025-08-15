import Conversation from "./conversation.model.js";
import mongoose from 'mongoose';

const conversationController = {
    // Créer une nouvelle conversation
    createConversation: async (req, res) => {
        try {
            const { userEmail, subject, content, conversationType = "contact_admin", userName } = req.body;
            
            let conversationData = {
                conversationType,
                subject,
                userName, // Stocker le nom de l'utilisateur
                messages: [{
                    content,
                    sender: null, // Sera défini selon le type
                    senderType: "user",
                    timestamp: new Date()
                }],
                metadata: {
                    userAgent: req.get('User-Agent'),
                    ipAddress: req.ip || req.connection.remoteAddress,
                    referrer: req.get('Referrer')
                }
            };
            
            // Selon le type de conversation
            if (conversationType === "contact_admin") {
                conversationData.userEmail = userEmail;
            } else if (conversationType === "user_chat") {
                // Pour les chats entre utilisateurs (à implémenter plus tard)
                conversationData.participants = [userEmail]; // Sera un array d'ObjectIds
            }
            
            const conversation = new Conversation(conversationData);
            const savedConversation = await conversation.save();
            
            res.status(201).json({
                success: true,
                data: savedConversation,
                message: "Conversation créée avec succès"
            });
        } catch (error) {
            console.error('Erreur création conversation:', error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la création de la conversation",
                error: error.message
            });
        }
    },

    // Récupérer une conversation par ID (pour l'utilisateur)
    getConversation: async (req, res) => {
        try {
            const { id } = req.params;
            const conversation = await Conversation.findById(id);
            
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: "Conversation non trouvée"
                });
            }

            res.status(200).json({
                success: true,
                data: conversation
            });
        } catch (error) {
            console.error('Erreur récupération conversation:', error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération de la conversation",
                error: error.message
            });
        }
    },

    // Récupérer les conversations de l'utilisateur connecté
    getUserConversations: async (req, res) => {
        try {
            const userEmail = req.user.email; // Depuis le middleware d'auth
            
            const conversations = await Conversation.find({ 
                userEmail: userEmail 
            })
            .sort({ lastMessageAt: -1, createdAt: -1 })
            .populate('messages.sender', 'firstName lastName email');
            
            res.status(200).json({
                success: true,
                data: conversations
            });
        } catch (error) {
            console.error('Erreur récupération conversations utilisateur:', error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des conversations",
                error: error.message
            });
        }
    },

    // Récupérer les conversations d'un utilisateur spécifique (par ID)
    getUserConversationsById: async (req, res) => {
        try {
            const { userId } = req.params;
            
            // Récupérer l'utilisateur pour obtenir son email
            const User = mongoose.model('User');
            const user = await User.findById(userId).select('email firstName lastName');
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Utilisateur non trouvé"
                });
            }
            
            // Récupérer les conversations de cet utilisateur
            const conversations = await Conversation.find({ 
                userEmail: user.email 
            })
            .sort({ lastMessageAt: -1, createdAt: -1 })
            .populate('messages.sender', 'firstName lastName email');
            
            res.status(200).json({
                success: true,
                data: conversations,
                user: {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            });
        } catch (error) {
            console.error('Erreur récupération conversations utilisateur par ID:', error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des conversations",
                error: error.message
            });
        }
    },

    // Ajouter un message à une conversation (utilisateur connecté)
    addMessage: async (req, res) => {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const userEmail = req.user.email; // Depuis le middleware d'auth
            
            const conversation = await Conversation.findById(id);
            
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: "Conversation non trouvée"
                });
            }
            
            // Vérifier que l'utilisateur est bien le propriétaire de la conversation
            if (conversation.userEmail !== userEmail) {
                return res.status(403).json({
                    success: false,
                    message: "Accès non autorisé à cette conversation"
                });
            }
            
            // Vérifier que la conversation n'est pas fermée
            if (conversation.status === 'closed') {
                return res.status(400).json({
                    success: false,
                    message: "Impossible d'ajouter un message à une conversation fermée"
                });
            }
            
            // Ajouter le message
            conversation.messages.push({
                content,
                sender: req.user._id, // ID de l'utilisateur connecté
                senderType: "user",
                timestamp: new Date(),
                isRead: false
            });
            
            // Mettre à jour lastMessageAt
            conversation.lastMessageAt = new Date();
            
            const updatedConversation = await conversation.save();
            
            res.status(200).json({
                success: true,
                data: updatedConversation,
                message: "Message ajouté avec succès"
            });
        } catch (error) {
            console.error('Erreur ajout message:', error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de l'ajout du message",
                error: error.message
            });
        }
    },

    // Récupérer toutes les conversations (pour l'admin)
    getAllConversations: async (req, res) => {
        try {
            const { status, assignedTo, page = 1, limit = 20 } = req.query;
            
            // Construire le filtre
            const filter = {};
            if (status) filter.status = status;
            if (assignedTo) filter.assignedTo = assignedTo;
            
            // Pagination
            const skip = (page - 1) * limit;
            
            const conversations = await Conversation.find(filter)
                .sort({ lastMessageAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .populate('assignedTo', 'firstName lastName email')
                .populate('messages.sender', 'firstName lastName email');
            
            const total = await Conversation.countDocuments(filter);
            
            res.status(200).json({
                success: true,
                data: conversations,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error('Erreur récupération conversations:', error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des conversations",
                error: error.message
            });
        }
    },

    // Admin répond à une conversation
    replyToConversation: async (req, res) => {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const adminUserId = req.user._id; // Depuis le middleware d'auth
            
            const conversation = await Conversation.findById(id);
            
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: "Conversation non trouvée"
                });
            }
            
            // Ajouter la réponse admin
            conversation.messages.push({
                content,
                sender: adminUserId,
                senderType: "admin",
                timestamp: new Date()
            });
            
            // Ne pas changer le statut - laisser la conversation ouverte
            // L'admin peut choisir de la fermer manuellement plus tard
            
            // Marquer tous les messages comme lus
            conversation.messages.forEach(msg => {
                msg.isRead = true;
            });
            
            const updatedConversation = await conversation.save();
            
            res.status(200).json({
                success: true,
                data: updatedConversation,
                message: "Réponse envoyée avec succès"
            });
        } catch (error) {
            console.error('Erreur réponse conversation:', error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de l'envoi de la réponse",
                error: error.message
            });
        }
    },

    // Utilisateur répond à une conversation
    userReply: async (req, res) => {
        try {
            const { id } = req.params;
            const { content, userEmail } = req.body;
            
            const conversation = await Conversation.findById(id);
            
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: "Conversation non trouvée"
                });
            }
            
            // Vérifier que l'email correspond
            if (conversation.userEmail !== userEmail) {
                return res.status(403).json({
                    success: false,
                    message: "Accès non autorisé à cette conversation"
                });
            }
            
            // Ajouter la réponse utilisateur
            conversation.messages.push({
                content,
                sender: null, // Sera défini selon le type de conversation
                senderType: "user",
                timestamp: new Date()
            });
            
            // Mettre à jour le statut
            if (conversation.status === 'closed') {
                conversation.status = 'in_progress';
            }
            
            const updatedConversation = await conversation.save();
            
            res.status(200).json({
                success: true,
                data: updatedConversation,
                message: "Message envoyé avec succès"
            });
        } catch (error) {
            console.error('Erreur réponse utilisateur:', error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de l'envoi du message",
                error: error.message
            });
        }
    },

    // Marquer une conversation comme lue
    markAsRead: async (req, res) => {
        try {
            const { id } = req.params;
            
            const conversation = await Conversation.findById(id);
            
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: "Conversation non trouvée"
                });
            }
            
            // Marquer tous les messages comme lus
            conversation.messages.forEach(msg => {
                msg.isRead = true;
            });
            
            const updatedConversation = await conversation.save();
            
            res.status(200).json({
                success: true,
                data: updatedConversation,
                message: "Conversation marquée comme lue"
            });
        } catch (error) {
            console.error('Erreur marquage lu:', error);
            res.status(500).json({
                success: false,
                message: "Erreur lors du marquage de la conversation",
                error: error.message
            });
        }
    },

    // Fermer une conversation
    closeConversation: async (req, res) => {
        try {
            const { id } = req.params;
            
            const conversation = await Conversation.findById(id);
            
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: "Conversation non trouvée"
                });
            }
            
            conversation.status = 'closed';
            const updatedConversation = await conversation.save();
            
            res.status(200).json({
                success: true,
                data: updatedConversation,
                message: "Conversation fermée avec succès"
            });
        } catch (error) {
            console.error('Erreur fermeture conversation:', error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la fermeture de la conversation",
                error: error.message
            });
        }
    },

    // Assigner une conversation à un admin
    assignConversation: async (req, res) => {
        try {
            const { id } = req.params;
            const { assignedTo } = req.body;
            
            const conversation = await Conversation.findById(id);
            
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: "Conversation non trouvée"
                });
            }
            
            conversation.assignedTo = assignedTo;
            const updatedConversation = await conversation.save();
            
            res.status(200).json({
                success: true,
                data: updatedConversation,
                message: "Conversation assignée avec succès"
            });
        } catch (error) {
            console.error('Erreur assignation conversation:', error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de l'assignation de la conversation",
                error: error.message
            });
        }
    },

    // Supprimer une conversation (soft delete)
    deleteConversation: async (req, res) => {
        try {
            const { id } = req.params;
            
            const conversation = await Conversation.findByIdAndDelete(id);
            
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: "Conversation non trouvée"
                });
            }
            
            res.status(200).json({
                success: true,
                message: "Conversation supprimée avec succès"
            });
        } catch (error) {
            console.error('Erreur suppression conversation:', error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la suppression de la conversation",
                error: error.message
            });
        }
    }
};

export default conversationController;
