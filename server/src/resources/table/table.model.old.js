import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  joinedAt: { type: Date, default: Date.now }
}, { _id: false });

const invitationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invitedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } // 7 jours
}, { _id: true }); // Garder l'_id pour les invitations

const tableSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  description: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 500
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: { type: [memberSchema], default: [] },
  // invitedUsers supprimé - ajout direct des membres
  isPrivate: { 
    type: Boolean, 
    default: false 
  },
  tags: [{ 
    type: String, 
    trim: true,
    maxlength: 20
  }],
  avatar: { 
    type: String, 
    default: null 
  },
  // Invitations supprimées - ajout direct des membres
  // Préférences de la table
  preferences: {
    preferredGames: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
    timezone: { type: String, default: "UTC" },
    sessionTypes: [{ type: String, enum: ["online", "offline"], default: ["online"] }],
    availability: {
      weekdays: [{ type: String, enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] }],
      timeSlots: [{ 
        start: String, // Format HH:MM
        end: String     // Format HH:MM
      }]
    }
  },
  // Statistiques
  stats: {
    sessionsPlayed: { type: Number, default: 0 },
    totalPlayTime: { type: Number, default: 0 }, // en minutes
    averageRating: { type: Number, default: 0 }
  },
  // Statut de la table
  status: { 
    type: String, 
    enum: ["active", "inactive", "archived"], 
    default: "active" 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour les recherches
tableSchema.index({ name: "text", description: "text", tags: "text" });
tableSchema.index({ owner: 1 });
tableSchema.index({ "members.user": 1 });
tableSchema.index({ isPrivate: 1, status: 1 });

// Middleware pour mettre à jour updatedAt
tableSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthodes virtuelles
tableSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Méthodes d'instance
tableSchema.methods.addMember = function(userId) {
  const existingMember = this.members.find(member => member.user.toString() === userId);
  if (existingMember) {
    throw new Error('User is already a member of this table');
  }
  
  this.members.push({
    user: userId,
    joinedAt: new Date()
  });
  return this.save();
};

tableSchema.methods.removeMember = function(userId) {
  if (userId.toString() === this.owner.toString()) {
    throw new Error('Owner cannot be removed from the table');
  }
  this.members = this.members.filter(member => member.user.toString() !== userId.toString());
  return this.save();
};

tableSchema.methods.isMember = function(userId) {
  return this.members.some(member => 
    member.user.toString() === userId.toString()
  ) || this.owner.toString() === userId.toString();
};

tableSchema.methods.isOwner = function(userId) {
  return this.owner.toString() === userId.toString();
};

tableSchema.methods.canInvite = function(userId) {
  return this.isOwner(userId) || this.members.some(member => 
    member.user.toString() === userId.toString()
  );
};

// Méthode pour ajouter un membre directement
tableSchema.methods.addMemberDirect = function(userId) {
  if (!this.isMember(userId)) {
    this.members.push({ user: userId, joinedAt: new Date() });
    return this.save();
  }
  return Promise.resolve(this);
};

tableSchema.methods.removeInvitation = function(userId) {
  this.pendingInvitations = this.pendingInvitations.filter(
    inv => inv.user.toString() !== userId
  );
  return this.save();
};

// Méthodes pour gérer les utilisateurs invités
tableSchema.methods.addInvitedUser = function(userId) {
  console.log(`Adding user ${userId} to invited users of table ${this._id}`);
  
  // Vérifier que l'utilisateur n'est pas déjà membre
  if (this.isMember(userId)) {
    throw new Error('User is already a member of this table');
  }

  // Vérifier qu'il n'est pas déjà invité
  if (this.isInvited(userId)) {
    throw new Error('User is already invited to this table');
  }

  // Ajouter l'utilisateur aux invités
  this.invitedUsers.push({
    user: userId,
    joinedAt: new Date()
  });

  console.log(`Table ${this._id} now has ${this.invitedUsers.length} invited users`);
  return this.save();
};

tableSchema.methods.removeInvitedUser = function(userId) {
  this.invitedUsers = this.invitedUsers.filter(
    user => user.user.toString() !== userId.toString()
  );
  return this.save();
};

tableSchema.methods.isInvited = function(userId) {
  return this.invitedUsers.some(user => user.user.toString() === userId.toString());
};

tableSchema.methods.acceptInvitation = function(userId) {
  // Vérifier que l'utilisateur est invité
  if (!this.isInvited(userId)) {
    throw new Error('User is not invited to this table');
  }

  // Ajouter comme membre
  this.members.push({
    user: userId,
    joinedAt: new Date()
  });

  // Retirer des invités
  this.removeInvitedUser(userId);

  return this.save();
};

tableSchema.methods.declineInvitation = function(userId) {
  // Vérifier que l'utilisateur est invité
  if (!this.isInvited(userId)) {
    throw new Error('User is not invited to this table');
  }

  // Retirer des invités
  this.removeInvitedUser(userId);

  return this.save();
};

// Méthode pour dissoudre la table (seul le propriétaire peut le faire)
tableSchema.methods.dissolveTable = function(ownerId) {
  if (this.owner.toString() !== ownerId.toString()) {
    throw new Error('Only the table owner can dissolve the table');
  }
  
  // Supprimer la table de la base de données
  return this.deleteOne();
};

const Table = mongoose.model('Table', tableSchema);

export default Table; 