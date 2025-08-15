import mongoose from "mongoose";

// Schéma pour les messages individuels
const messageSchema = new mongoose.Schema({
    content: { 
        type: String, 
        required: true,
        maxlength: 2000 // Limite de caractères pour éviter les messages trop longs
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: false // Peut être null pour les messages anonymes
    },
    senderType: { 
        type: String, 
        enum: ["user", "admin"], 
        required: true 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    }
});

// Schéma principal de la conversation
const conversationSchema = new mongoose.Schema({
    // Type de conversation (contact admin ou chat entre users)
    conversationType: { 
        type: String, 
        enum: ["contact_admin", "user_chat"], 
        default: "contact_admin" 
    },
    
    // Pour les conversations de contact admin
    userEmail: { 
        type: String, 
        required: function() { return this.conversationType === "contact_admin"; },
        lowercase: true,
        trim: true
    },
    
    // Nom de l'utilisateur pour l'affichage
    userName: { 
        type: String, 
        required: false,
        trim: true
    },
    
    // Pour les conversations entre utilisateurs
    participants: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: function() { return this.conversationType === "user_chat"; }
    }],
    
    subject: { 
        type: String, 
        required: true,
        maxlength: 200
    },
    status: { 
        type: String, 
        enum: ["open", "in_progress", "closed"], 
        default: "open" 
    },
    priority: { 
        type: String, 
        enum: ["low", "medium", "high", "urgent"], 
        default: "medium" 
    },
    messages: [messageSchema],
    metadata: {
        userAgent: { type: String, default: null },
        ipAddress: { type: String, default: null },
        referrer: { type: String, default: null }
    },
    lastMessageAt: { 
        type: Date, 
        default: Date.now 
    },
    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        default: null // Admin assigné à cette conversation
    },
    tags: [{ 
        type: String, 
        maxlength: 50 
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Middleware pour mettre à jour updatedAt et lastMessageAt
conversationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    
    // Si on a des messages, mettre à jour lastMessageAt
    if (this.messages && this.messages.length > 0) {
        this.lastMessageAt = this.messages[this.messages.length - 1].timestamp;
    }
    
    next();
});

// Index pour les performances
conversationSchema.index({ status: 1, createdAt: -1 });
conversationSchema.index({ userEmail: 1, createdAt: -1 });
conversationSchema.index({ assignedTo: 1, status: 1 });
conversationSchema.index({ lastMessageAt: -1 });

// Méthodes virtuelles
conversationSchema.virtual('unreadCount').get(function() {
    return this.messages.filter(msg => !msg.isRead).length;
});

conversationSchema.virtual('isUnread').get(function() {
    return this.messages.some(msg => !msg.isRead);
});

// Configuration pour les virtuals
conversationSchema.set('toJSON', { virtuals: true });
conversationSchema.set('toObject', { virtuals: true });

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
