import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Property from '../models/Property.js';
import SavedSearch from '../models/SavedSearch.js';

const router = Router();
router.get('/favorites', protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate({ path: 'favorites', match: { status: 'approved' }, populate: { path: 'owner', select: 'name email phone' } });
  res.json({ favorites: user.favorites });
});
router.post('/favorites/:propertyId', protect, async (req, res) => {
  const property = await Property.findOne({ _id: req.params.propertyId, status: 'approved' });
  if (!property) return res.status(404).json({ message: 'Property not found' });
  const user = await User.findById(req.user._id);
  const exists = user.favorites.some(id => String(id) === req.params.propertyId);
  user.favorites = exists ? user.favorites.filter(id => String(id) !== req.params.propertyId) : [...user.favorites, property._id];
  await user.save();
  res.json({ favorited: !exists, favorites: user.favorites });
});
router.get('/saved-searches', protect, async (req, res) => res.json({ searches: await SavedSearch.find({ user: req.user._id }).sort({ createdAt: -1 }) }));
router.post('/saved-searches', protect, async (req, res) => {
  const search = await SavedSearch.create({ user: req.user._id, name: req.body.name || 'My search', filters: req.body.filters || {} });
  res.status(201).json({ search });
});
router.delete('/saved-searches/:id', protect, async (req, res) => {
  const result = await SavedSearch.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!result) return res.status(404).json({ message: 'Saved search not found' });
  res.json({ message: 'Saved search deleted' });
});
export default router;
