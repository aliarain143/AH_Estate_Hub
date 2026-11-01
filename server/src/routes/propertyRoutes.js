import { Router } from 'express';
import Property from '../models/Property.js';
import { protect, allowRoles } from '../middleware/auth.js';

const router = Router();
router.get('/', async (req, res, next) => {
  try {
    const { city, type, listingType, minPrice, maxPrice, minArea, maxArea, q } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(city, 'i');
    if (type) filter.type = type;
    if (listingType) filter.listingType = listingType;
    if (minPrice || maxPrice) filter.price = { ...(minPrice && { $gte: Number(minPrice) }), ...(maxPrice && { $lte: Number(maxPrice) }) };
    if (minArea || maxArea) filter.area = { ...(minArea && { $gte: Number(minArea) }), ...(maxArea && { $lte: Number(maxArea) }) };
    if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }, { address: new RegExp(q, 'i') }];
    const properties = await Property.find(filter).populate('owner', 'name email phone').sort({ createdAt: -1 });
    res.json({ count: properties.length, properties });
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, status: 'approved' }).populate('owner', 'name email phone');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ property });
  } catch (e) { next(e); }
});
router.post('/', protect, allowRoles('agent', 'admin'), async (req, res, next) => {
  try {
    const property = await Property.create({ ...req.body, owner: req.user._id, status: 'pending' });
    res.status(201).json({ property, message: 'Listing submitted for admin approval' });
  } catch (e) { next(e); }
});
router.put('/:id', protect, async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (String(property.owner) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    Object.assign(property, req.body);
    if (req.user.role !== 'admin') property.status = 'pending';
    await property.save();
    res.json({ property });
  } catch (e) { next(e); }
});
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (String(property.owner) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    await property.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (e) { next(e); }
});
export default router;
