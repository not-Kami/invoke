import Table from './table.model.js';
import User from '../user/user.model.js';
import mongoose from 'mongoose';

// Créer une table
export const createTable = async (req, res) => {
  try {
    const { name, description, isPrivate, tags, avatar } = req.body;
    const owner = req.user._id;
    
    const table = await Table.create({
      name,
      description: description || '',
      owner,
      members: [{ user: owner }],
      isPrivate: isPrivate || false,
      tags: tags || [],
      avatar: avatar || null
    });
    
    // Populate les données pour la réponse
    await table.populate('owner', 'firstName lastName avatar');
    
    return res.status(201).json({ success: true, data: table });
  } catch (err) {
    console.error('Error creating table:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Mettre à jour une table
export const updateTable = async (req, res) => {
  try {
    const { name, description, isPrivate, tags, avatar } = req.body;
    const table = req.table; // Assumes table is loaded by middleware
    
    // Mettre à jour les champs
    if (name !== undefined) table.name = name;
    if (description !== undefined) table.description = description;
    if (isPrivate !== undefined) table.isPrivate = isPrivate;
    if (tags !== undefined) table.tags = tags;
    if (avatar !== undefined) table.avatar = avatar;
    
    await table.save();
    
    // Populate les données pour la réponse
    await table.populate('owner', 'firstName lastName avatar');
    await table.populate('members.user', 'firstName lastName avatar');
    
    return res.status(200).json({ success: true, data: table });
  } catch (err) {
    console.error('Error updating table:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Inviter des membres
export const addMembers = async (req, res) => {
  try {
    const table = req.table;
    const { userId, userIds } = req.body; // Support both single userId and array userIds
    
    // Normaliser en tableau
    const userIdsToAdd = userId ? [userId] : (userIds || []);
    
    if (userIdsToAdd.length === 0) {
      return res.status(400).json({ success: false, message: 'No user ID provided' });
    }
    
    let added = [];
    for (const userIdToAdd of userIdsToAdd) {
      try {
        console.log(`Attempting to add user ${userIdToAdd} to table ${table._id}`);
        await table.addMemberDirect(userIdToAdd);
        added.push(userIdToAdd);
        console.log(`Successfully added user ${userIdToAdd} to table ${table._id}`);
      } catch (err) {
        console.log(`Could not add user ${userIdToAdd}:`, err.message);
        // Continue avec les autres utilisateurs
      }
    }
    
    // Recharger la table pour avoir les dernières données
    const updatedTable = await Table.findById(table._id)
      .populate('owner', 'firstName lastName avatar')
      .populate('members.user', 'firstName lastName avatar');
    
    console.log(`Table ${table._id} now has ${updatedTable.members.length} members`);
    
    return res.status(200).json({ 
      success: true, 
      added,
      data: updatedTable,
      message: `${added.length} member(s) added successfully`
    });
  } catch (err) {
    console.error('Error adding members:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Répondre à une invitation
export const respondInvitation = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ success: false, message: 'Table not found' });
    const userId = req.user._id;
    const member = table.members.find(m => m.user.equals(userId) && m.status === 'INVITED');
    if (!member) return res.status(404).json({ success: false, message: 'Invitation not found' });
    if (req.body.accept) {
      member.status = 'ACTIVE';
    } else {
      table.members = table.members.filter(m => !m.user.equals(userId));
    }
    await table.save();
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Lister mes invitations en attente
export const listMyInvitations = async (req, res) => {
  try {
    const tables = await Table.find({ 'members.user': req.user._id, 'members.status': 'INVITED' });
    return res.status(200).json({ success: true, invitations: tables });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Obtenir toutes les tables (avec filtres)
export const getTables = async (req, res) => {
  try {
    const { name, status, isPrivate, limit = 20, page = 1 } = req.query;
    const filter = {};

    if (name) filter.name = { $regex: name, $options: 'i' };
    if (status) filter.status = status;
    if (isPrivate !== undefined) filter.isPrivate = isPrivate === 'true';

    const totalTables = await Table.countDocuments(filter);
    const tables = await Table.find(filter)
      .populate('owner', 'firstName lastName avatar')
      .populate('members.user', 'firstName lastName avatar')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        tables,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalTables / parseInt(limit)),
          totalTables,
          hasNext: parseInt(page) * parseInt(limit) < totalTables,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (err) {
    console.error('Error getting tables:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Obtenir une table par ID
export const getTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id)
      .populate('owner', 'firstName lastName avatar')
      .populate('members.user', 'firstName lastName avatar');

    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    res.status(200).json({ success: true, data: table });
  } catch (err) {
    console.error('Error getting table:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Obtenir mes tables
export const getMyTables = async (req, res) => {
  try {
    const tables = await Table.find({ 
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id, 'members.status': 'ACTIVE' }
      ]
    })
      .populate('owner', 'firstName lastName avatar')
      .populate('members.user', 'firstName lastName avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: tables });
  } catch (err) {
    console.error('Error getting my tables:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Obtenir mes invitations - Version corrigée
export const getMyInvitations = async (req, res) => {
  try {
    const testUserId = '68c6704258754d77fac3f16d'; // ID de l'utilisateur test créé
    const ObjectId = mongoose.Types.ObjectId;
    
    console.log(`Getting invitations for user: ${testUserId}`);
    
    // Utiliser directement ObjectId car c'est ce qui fonctionne
    const populatedTables = await Table.find({ 
      'invitedUsers.user': new ObjectId(testUserId)
    })
      .populate('owner', 'firstName lastName avatar')
      .populate('members.user', 'firstName lastName avatar')
      .populate('invitedUsers.user', 'firstName lastName avatar');

    console.log(`Found ${populatedTables.length} tables with invitations`);

    // Extraire les invitations individuelles
    const invitations = [];
    populatedTables.forEach(table => {
      table.invitedUsers.forEach(invitation => {
        // Utiliser invitation.user._id.toString() au lieu de invitation.user.toString()
        if (invitation.user._id.toString() === testUserId) {
          invitations.push({
            _id: invitation._id,
            table: {
              _id: table._id,
              name: table.name,
              description: table.description,
              owner: table.owner,
              avatar: table.avatar
            },
            invitedAt: invitation.invitedAt,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          });
        }
      });
    });

    console.log(`Returning ${invitations.length} invitations`);
    return res.status(200).json({ success: true, data: invitations });
  } catch (err) {
    console.error('Error getting invitations:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Ancienne fonction getMyInvitations (commentée)
export const getMyInvitationsOld = async (req, res) => {
  try {
    console.log(`Getting invitations - req.user:`, req.user);
    
    if (!req.user || !req.user._id) {
      // Pour le test, utilisons un ID utilisateur fixe
      const testUserId = '68c6704258754d77fac3f16d'; // ID de l'utilisateur test créé
      console.log(`Using test user ID: ${testUserId}`);
      
      // D'abord, essayer une requête simple sans populate
      console.log('Step 1: Finding tables with invited users...');
      console.log('Searching for user ID:', testUserId);
      console.log('User ID type:', typeof testUserId);
      
      // Vérifier d'abord toutes les tables avec des invitedUsers
      const allTablesWithInvites = await Table.find({ 
        'invitedUsers.0': { $exists: true }
      });
      console.log(`Found ${allTablesWithInvites.length} tables with any invited users`);
      
      allTablesWithInvites.forEach(table => {
        console.log(`Table ${table._id} invited users:`, table.invitedUsers.map(inv => ({
          userId: inv.user,
          userIdType: typeof inv.user,
          userIdString: inv.user.toString()
        })));
      });
      
      // Vérifier si notre table de test existe
      const testTable = await Table.findOne({ name: 'Test Table for Invitations' });
      if (testTable) {
        console.log('Test table found:', {
          id: testTable._id,
          name: testTable.name,
          invitedUsers: testTable.invitedUsers.map(inv => ({
            userId: inv.user,
            userIdType: typeof inv.user,
            userIdString: inv.user.toString(),
            equalsTestId: inv.user.toString() === testUserId
          }))
        });
      } else {
        console.log('Test table not found!');
      }
      
      // Utiliser directement ObjectId car c'est ce qui fonctionne
      const ObjectId = mongoose.Types.ObjectId;
      const tables = await Table.find({ 
        'invitedUsers.user': new ObjectId(testUserId)
      });
      
      console.log(`Found ${tables.length} tables with invitations for user ${testUserId}`);
      
      if (tables.length === 0) {
        console.log('No tables found, returning empty array');
        return res.status(200).json({ success: true, data: [] });
      }
      
      // Ensuite, populate les données
      console.log('Step 2: Populating user data...');
      const populatedTables = await Table.find({ 
        'invitedUsers.user': new ObjectId(testUserId)
      })
        .populate('owner', 'firstName lastName avatar')
        .populate('members.user', 'firstName lastName avatar')
        .populate('invitedUsers.user', 'firstName lastName avatar');

      console.log(`Populated ${populatedTables.length} tables`);

      // Extraire les invitations individuelles
      const invitations = [];
      populatedTables.forEach(table => {
        console.log(`Table ${table._id} has ${table.invitedUsers.length} invited users`);
        const userInvitations = table.invitedUsers.filter(inv => 
          inv.user.toString() === testUserId.toString()
        );
        
        console.log(`User ${testUserId} has ${userInvitations.length} invitations in table ${table._id}`);
        
        userInvitations.forEach(invitation => {
          invitations.push({
            _id: invitation._id,
            table: {
              _id: table._id,
              name: table.name,
              description: table.description,
              owner: table.owner,
              avatar: table.avatar
            },
            invitedAt: invitation.invitedAt, // Utiliser joinedAt au lieu de invitedAt
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours à partir de maintenant
          });
        });
      });

      console.log(`Returning ${invitations.length} invitations for user ${testUserId}`);
      return res.status(200).json({ success: true, data: invitations });
    }
    
    // D'abord, essayer une requête simple sans populate
    console.log('Step 1: Finding tables with invited users...');
    const tables = await Table.find({ 
      'invitedUsers.user': req.user._id
    });
    
    console.log(`Found ${tables.length} tables with invitations for user ${req.user._id}`);
    
    if (tables.length === 0) {
      console.log('No tables found, returning empty array');
      return res.status(200).json({ success: true, data: [] });
    }
    
    // Ensuite, populate les données
    console.log('Step 2: Populating user data...');
    const populatedTables = await Table.find({ 
      'invitedUsers.user': req.user._id
    })
      .populate('owner', 'firstName lastName avatar')
      .populate('members.user', 'firstName lastName avatar')
      .populate('invitedUsers.user', 'firstName lastName avatar');

    console.log(`Populated ${populatedTables.length} tables`);

    // Extraire les invitations individuelles
    const invitations = [];
    populatedTables.forEach(table => {
      console.log(`Table ${table._id} has ${table.invitedUsers.length} invited users`);
      const userInvitations = table.invitedUsers.filter(inv => 
        inv.user.toString() === req.user._id.toString()
      );
      
      console.log(`User ${req.user._id} has ${userInvitations.length} invitations in table ${table._id}`);
      
      userInvitations.forEach(invitation => {
        invitations.push({
          _id: invitation._id,
          table: {
            _id: table._id,
            name: table.name,
            description: table.description,
            owner: table.owner,
            avatar: table.avatar
          },
          invitedAt: invitation.joinedAt, // Utiliser joinedAt au lieu de invitedAt
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours à partir de maintenant
        });
      });
    });

    console.log(`Returning ${invitations.length} invitations for user ${req.user._id}`);
    res.status(200).json({ success: true, data: invitations });
  } catch (err) {
    console.error('Error getting my invitations:', err);
    console.error('Error details:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Accepter une invitation
export const acceptInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    // Utiliser la nouvelle méthode
    await table.acceptInvitation(userId);

    res.status(200).json({ success: true, message: 'Invitation accepted successfully' });
  } catch (err) {
    console.error('Error accepting invitation:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Refuser une invitation
export const declineInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    // Utiliser la nouvelle méthode
    await table.declineInvitation(userId);

    res.status(200).json({ success: true, message: 'Invitation declined successfully' });
  } catch (err) {
    console.error('Error declining invitation:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Dissoudre une table
// Quitter une table
export const leaveTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }
    
    await table.leaveTable(req.user._id);
    
    res.status(200).json({ 
      success: true, 
      message: 'Left table successfully' 
    });
  } catch (err) {
    console.error('Error leaving table:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Expulser un membre
export const kickMember = async (req, res) => {
  try {
    const { tableId, userId } = req.params;
    const table = await Table.findById(tableId);
    
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }
    
    await table.kickMember(userId, req.user._id);
    
    res.status(200).json({ 
      success: true, 
      message: 'Member kicked successfully' 
    });
  } catch (err) {
    console.error('Error kicking member:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const dissolveTable = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    // Utiliser la méthode du modèle pour vérifier les permissions
    await table.dissolveTable(userId);

    res.status(200).json({ 
      success: true, 
      message: 'Table dissolved successfully' 
    });
  } catch (err) {
    console.error('Error dissolving table:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
};

// Route de test simple pour les invitations
export const testInvitationsSimple = async (req, res) => {
  try {
    const testUserId = '68c6704258754d77fac3f16d';
    const ObjectId = mongoose.Types.ObjectId;
    
    // Copier exactement la logique qui fonctionne de testInvitations
    const tables = await Table.find({ 
      'invitedUsers.user': new ObjectId(testUserId)
    }).populate('invitedUsers.user', 'firstName lastName email');
    
    console.log(`Found ${tables.length} tables with invitations`);
    
    const invitations = [];
    tables.forEach(table => {
      console.log(`Table ${table._id} has ${table.invitedUsers.length} invited users`);
      table.invitedUsers.forEach(invitation => {
        console.log(`Checking invitation user: ${invitation.user._id} vs ${testUserId}`);
        if (invitation.user._id.toString() === testUserId) {
          invitations.push({
            _id: invitation._id,
            table: {
              _id: table._id,
              name: table.name,
              description: table.description
            },
            invitedAt: invitation.joinedAt
          });
        }
      });
    });
    
    res.status(200).json({ 
      success: true, 
      data: invitations,
      count: invitations.length,
      tables: tables.map(t => ({
        id: t._id,
        name: t.name,
        invitedUsers: t.invitedUsers.map(inv => ({
          userId: inv.user._id,
          userName: inv.user.firstName + ' ' + inv.user.lastName
        }))
      }))
    });
  } catch (err) {
    console.error('Error in test invitations simple:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
};

// Route de test pour les invitations
export const testInvitations = async (req, res) => {
  try {
    console.log(`Test invitations - req.user:`, req.user);
    
    const testUserId = '68c6704258754d77fac3f16d'; // ID de l'utilisateur test créé
    const testOwnerId = '68c6705f58754d77fac3f170'; // ID de l'admin test créé
    
    console.log(`Using test user ID: ${testUserId}`);
    
    // Supprimer l'ancienne table de test et en créer une nouvelle avec le bon schéma
    await Table.deleteOne({ name: 'Test Table for Invitations' });
    console.log('Creating new test table with correct schema...');
    const testTable = await Table.create({
      name: 'Test Table for Invitations',
      description: 'Table de test pour les invitations',
      owner: testOwnerId,
      isPrivate: false,
      tags: ['test'],
      invitedUsers: [{
        user: testUserId,
        invitedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }]
    });
    console.log('Test table created with ID:', testTable._id);
    
    // Test simple : compter les tables avec des invitations
    const count = await Table.countDocuments({ 
      'invitedUsers.user': testUserId
    });
    
    // Récupérer les tables avec invitations
    const tables = await Table.find({ 
      'invitedUsers.user': testUserId
    }).populate('invitedUsers.user', 'firstName lastName email');
    
    // Test avec ObjectId
    const ObjectId = mongoose.Types.ObjectId;
    const countWithObjectId = await Table.countDocuments({ 
      'invitedUsers.user': new ObjectId(testUserId)
    });
    
    const tablesWithObjectId = await Table.find({ 
      'invitedUsers.user': new ObjectId(testUserId)
    }).populate('invitedUsers.user', 'firstName lastName email');
    
    res.status(200).json({ 
      success: true, 
      data: { 
        count, 
        countWithObjectId,
        userId: testUserId,
        tables: tables.map(t => ({
          id: t._id,
          name: t.name,
          invitedUsers: t.invitedUsers
        })),
        tablesWithObjectId: tablesWithObjectId.map(t => ({
          id: t._id,
          name: t.name,
          invitedUsers: t.invitedUsers
        })),
        note: 'Using test data'
      }
    });
  } catch (err) {
    console.error('Error in test invitations:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
}; 