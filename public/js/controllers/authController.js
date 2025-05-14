import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { APIResponse } from '../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json(
        APIResponse.error('Username or email already exists')
      );
    }

    // Create new user
    const user = await User.create({ username, email, password });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json(
      APIResponse.success({
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        },
        token
      }, 'User registered successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json(
        APIResponse.error('Invalid credentials')
      );
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json(
        APIResponse.error('Invalid credentials')
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json(
      APIResponse.success({
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin
        },
        token
      }, 'Login successful')
    );
  } catch (error) {
    next(error);
  }
};