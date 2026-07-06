import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import prisma from '../lib/prisma.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Check if admin exists
router.get('/status', async (req, res) => {
  try {
    const admin = await prisma.adminAuth.findFirst();
    res.json({ initialized: !!admin });
  } catch (error) {
    console.error('Auth status check failed:', error);
    res.status(500).json({ error: 'Failed to check auth status' });
  }
});

// Apply rate limiter to login and setup (status is exempt)
router.use('/login', authLimiter);
router.use('/setup', authLimiter);

// Setup admin password (only if none exists)
router.post('/setup', async (req, res) => {
  try {
    const existingAdmin = await prisma.adminAuth.findFirst();
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already initialized' });
    }

    const { password } = req.body;
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.adminAuth.create({
      data: { passwordHash },
    });

    res.json({ message: 'Admin initialized' });
  } catch (error) {
    res.status(500).json({ error: 'Setup failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;

    if (typeof password !== 'string' || !password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const admin = await prisma.adminAuth.findFirst();

    if (!admin) {
      return res.status(400).json({ error: 'Admin not initialized' });
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: admin.id, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
