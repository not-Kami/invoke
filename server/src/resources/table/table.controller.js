import Table from './table.model.js';
import User from '../user/user.model.js';

// Créer une table
export const createTable = async (req, res) => {
  try {
    const { name } = req.body;
    const owner = req.user._id;
    const table = await Table.create({
      name,
      owner,
      members: [{ user: owner, status: 'ACTIVE' }]
    });
    return res.status(201).json({ success: true, table });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Inviter des membres
export const inviteMembers = async (req, res) => {
  try {
    const table = req.table;
    const { userIds } = req.body; // tableau d'ids
    let added = [];
    for (const userId of userIds) {
      // Vérifier doublon
      if (table.members.some(m => m.user.equals(userId))) continue;
      table.members.push({ user: userId, status: 'INVITED' });
      added.push(userId);
    }
    await table.save();
    return res.status(200).json({ success: true, added });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
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