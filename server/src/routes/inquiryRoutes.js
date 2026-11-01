import { Router } from 'express';
import Inquiry from '../models/Inquiry.js';
import Property from '../models/Property.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.post('/', async (req, res, next) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;
    if (!propertyId || !name || !email || !message) return res.status(400).json({ message: 'Please complete all required fields' });
    const property = await Property.findOne({ _id: propertyId, status: 'approved' });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    const inquiry = await Inquiry.create({ property: property._id, agent: property.owner, name, email, phone, message });
    res.status(201).json({ message: 'Your inquiry has been sent', inquiryId: inquiry._id });
  } catch (e) { next(e); }
});
router.get('/mine', protect, async (req, res) => {
  const inquiries = await Inquiry.find({ agent: req.user._id }).populate('property', 'title city price').sort({ createdAt: -1 });
  res.json({ inquiries });
});
export default router;
