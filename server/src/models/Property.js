import mongoose from 'mongoose';
const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ['House', 'Apartment', 'Plot', 'Commercial'], required: true },
  listingType: { type: String, enum: ['Sale', 'Rent'], default: 'Sale' },
  city: { type: String, required: true, index: true },
  address: { type: String, required: true },
  area: { type: Number, required: true, min: 0 },
  areaUnit: { type: String, enum: ['sqft', 'sqyd', 'marla'], default: 'sqft' },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  images: [{ type: String }],
  coordinates: { lat: Number, lng: Number },
  features: [{ type: String }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approvedAt: Date
}, { timestamps: true });
export default mongoose.model('Property', propertySchema);
