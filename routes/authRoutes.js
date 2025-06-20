import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

const router = express.Router();

// @route         POST api/auth/register
// @description   Register new user
// @access        Public
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('All fields are required');
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password });

    // Create Tokens
    const payload = { userId: user._id.toString() };
    const accessToken = await generateToken(payload, '1m');
    const refreshToken = await generateToken(payload, '30d');

    // Set refresh token in HTTP-Only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route         POST api/auth/login
// @description   Authenticate user
// @access        Public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      throw new Error('Invalid Credentials');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid Credentials');
    }

    // Create Tokens
    const payload = { userId: user._id.toString() };
    const accessToken = await generateToken(payload, '1m');
    const refreshToken = await generateToken(payload, '30d');

    // Set refresh token in HTTP-Only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route         POST api/auth/logout
// @description   Logout user and clear refresh token
// @access        Private
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
