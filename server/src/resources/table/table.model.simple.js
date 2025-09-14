import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  joinedAt: { type: Date, default: Date.now }
}, { _id: false });

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
  // Préférences de la table
  preferences: {
    preferredGames: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
    timezone: { type: String, default: "UTC" },
    sessionTypes: [{ type: String, enum: ["online", "offline"], default: ["online"] }],
    availability: {
      days: [{ type: String, enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] }],
      timeSlots: [{
        start: { type: String },
        end: { type: String }
      }]
    }
  }
}, {
  timestamps: true
});

// Virtual pour le nombre de membres
tableSchema.virtual('memberCount').get(function() {
  return this.members.length + 1; // +1 pour le propriétaire
});

// Virtual pour vérifier si la table est pleine
tableSchema.virtual('isFull').get(function() {
  return false; // Pas de limite de membres
});

// Méthodes de gestion des membres
tableSchema.methods.addMember = function(userId) {
  if (!this.isMember(userId)) {
    this.members.push({ user: userId, joinedAt: new Date() });
    return this.save();
  }
  return Promise.resolve(this);
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

// Méthode pour expulser un membre (seulement le propriétaire)
tableSchema.methods.kickMember = function(userId, kickedBy) {
  // Seul le propriétaire peut expulser un membre
  if (!this.isOwner(kickedBy)) {
    throw new Error('Only the table owner can kick members');
  }
  
  // Ne pas pouvoir expulser le propriétaire
  if (this.isOwner(userId)) {
    throw new Error('Cannot kick the table owner');
  }
  
  // Vérifier que l'utilisateur est membre
  if (!this.isMember(userId)) {
    throw new Error('User is not a member of this table');
  }
  
  return this.removeMember(userId);
};

// Méthode pour quitter la table
tableSchema.methods.leaveTable = function(userId) {
  if (this.isOwner(userId)) {
    throw new Error('Owner cannot leave the table. Transfer ownership or dissolve the table.');
  }
  
  if (!this.isMember(userId)) {
    throw new Error('User is not a member of this table');
  }
  
  return this.removeMember(userId);
};

// Méthode pour dissoudre la table
tableSchema.methods.dissolveTable = function(ownerId) {
  if (!this.isOwner(ownerId)) {
    throw new Error('Only the table owner can dissolve the table');
  }
  
  return this.deleteOne();
};

export default mongoose.model('Table', tableSchema);
