import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { createToken } from '../utils/token.js';
import { protect } from '../middleware/auth.js';

const router = Router();
const safeUser = (user) => ({ 
  id: user._id, 
  name: user.name, 
  email: user.email, 
  phone: user.phone, 
  role: user.role 
});

router.post('/register', async (req, res, next) => {
  try {
    let { name, email, password, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Email already check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    // Default Name & Phone handling to avoid backend crash
    if (!name || name.trim() === '') {
      name = email.split('@')[0];
    }
    phone = phone || '';

    // Har naya register hone wala user automatically 'admin' banega!
    const role = 'admin';

    const user = await User.create({ 
      name, 
      email, 
      phone, 
      password: await bcrypt.hash(password, 12),
      role 
    });

    res.status(201).json({ user: safeUser(user), token: createToken(user._id) });
  } catch (e) { 
    next(e); 
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    res.json({ user: safeUser(user), token: createToken(user._id) });
  } catch (e) { 
    next(e); 
  }
});

router.get('/me', protect, (req, res) => res.json({ user: safeUser(req.user) }));

export default router;