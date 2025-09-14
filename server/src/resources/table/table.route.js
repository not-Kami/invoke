import express from 'express';
import { 
  createTable, 
  updateTable,
  getTables, 
  getTable, 
  getMyTables, 
  addMembers,
  leaveTable,
  kickMember,
  dissolveTable,
  testInvitations,
  testInvitationsSimple
} from './table.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import isOwnerOrMember from '../../middlewares/isOwnerOrMember.middleware.js';
import validate from '../../middlewares/validate.js';
import { createTableSchema } from './table.validation.js';

const router = express.Router();

// Routes publiques
router.get('/', getTables);
router.get('/:id', getTable);
router.get('/test-invitations', testInvitations);
router.get('/test-invitations-simple', testInvitationsSimple);

// Routes protégées
router.use(protect);

// Routes spécifiques AVANT les routes avec paramètres
router.get('/user/my-tables', getMyTables);
router.post('/', validate(createTableSchema), createTable);
router.put('/:id', isOwnerOrMember, updateTable);

// Routes pour la gestion des membres
router.post('/:id/add-members', isOwnerOrMember, addMembers);
router.post('/:id/leave', leaveTable);
router.delete('/:id/kick/:userId', isOwnerOrMember, kickMember);
router.delete('/:id/dissolve', dissolveTable);

export default router; 