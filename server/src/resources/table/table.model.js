import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['ACTIVE', 'INVITED'], required: true }
}, { _id: false });

const tableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: { type: [memberSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

tableSchema.index({ owner: 1 });

const Table = mongoose.model('Table', tableSchema);

export default Table; 