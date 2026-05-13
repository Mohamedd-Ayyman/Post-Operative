const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['patient', 'doctor', 'admin']).optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  surgeryDate: z.string().optional(),
  surgeryType: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const authCtrl = {
  register: async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      const exists = await User.findOne({ email: data.email });
      if (exists) return res.status(409).json({ error: 'Email already registered' });

      const password = await bcrypt.hash(data.password, config.bcryptRounds);
      const user = await User.create({ ...data, password });
      const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpire });

      res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
      res.status(500).json({ error: 'Registration failed' });
    }
  },

  login: async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      const user = await User.findOne({ email: data.email });
      if (!user || !(await bcrypt.compare(data.password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpire });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
      res.status(500).json({ error: 'Login failed' });
    }
  },

  me: async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  },

  updateProfile: async (req, res) => {
    const { name, phone, dateOfBirth, surgeryDate, surgeryType } = req.body;
    const updated = await User.findByIdAndUpdate(req.user.id, { name, phone, dateOfBirth, surgeryDate, surgeryType }, { new: true }).select('-password');
    res.json(updated);
  },
};

module.exports = authCtrl;