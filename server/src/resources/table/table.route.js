import express from 'express';
import { createTable, inviteMembers, respondInvitation, listMyInvitations } from './table.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import isOwnerOrMember from '../../middlewares/isOwnerOrMember.middleware.js';
import validate from '../../middlewares/validate.js';
import { createTableSchema } from './table.validation.js';

const router = express.Router();

// Créer une table
router.post('/', protect, validate(createTableSchema), createTable);
// Inviter des membres
router.post('/:id/invite', protect, isOwnerOrMember, inviteMembers);
// Répondre à une invitation
router.post('/:id/respond', protect, respondInvitation);
// Lister mes invitations
router.get('/users/me/invitations', protect, listMyInvitations);

export default router; 