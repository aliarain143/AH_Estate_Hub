import { Router } from 'express';
import Property from '../models/Property.js';
import { protect, allowRoles } from '../middleware/auth.js';

const router = Router();
router.use(protect, allowRoles('admin'));
router.get('/properties/pending', async (_req, res) => {
  const properties = await Property.find({ status: 'pending' }).populate('owner', 'name email').sort({ createdAt: 1 });
  res.json({ properties });
});
router.patch('/properties/:id/approve', async (req, res) => {
  const property = await Property.findByIdAndUpdate(req.params.id, { status: 'approved', approvedAt: new Date() }, { new: true });
  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.json({ property, message: 'Listing approved' });
});
router.patch('/properties/:id/reject', async (req, res) => {
  const property = await Property.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.json({ property, message: 'Listing rejected' });
});
export default router;
