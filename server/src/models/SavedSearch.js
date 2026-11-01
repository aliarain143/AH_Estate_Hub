import mongoose from 'mongoose';
const savedSearchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'My search' },
  filters: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });
export default mongoose.model('SavedSearch', savedSearchSchema);
