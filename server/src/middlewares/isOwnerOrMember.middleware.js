import Table from '../resources/table/table.model.js';

const isOwnerOrMember = async (req, res, next) => {
  try {
    const tableId = req.params.id;
    const userId = req.user._id;
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }
    const isOwner = table.owner.equals(userId);
    const isActiveMember = table.members.some(
      m => m.user.equals(userId) && m.status === 'ACTIVE'
    );
    if (!isOwner && !isActiveMember) {
      return res.status(403).json({ success: false, message: 'Forbidden: not owner or active member' });
    }
    req.table = table;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export default isOwnerOrMember; 