import { validationResult } from 'express-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

function sendValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}

export async function register(req, res) {
  const invalid = sendValidationErrors(req, res);
  if (invalid) return;
  const { name, email, password, skinType, skinGoals } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }
  const user = await User.create({ name, email, password, skinType, skinGoals });
  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);
  return res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email, skinType: user.skinType, skinGoals: user.skinGoals },
    tokens: { accessToken, refreshToken }
  });
}

export async function login(req, res) {
  const invalid = sendValidationErrors(req, res);
  if (invalid) return;
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const match = await user.comparePassword(password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);
  return res.json({
    user: { id: user.id, name: user.name, email: user.email, skinType: user.skinType, skinGoals: user.skinGoals },
    tokens: { accessToken, refreshToken }
  });
}

export async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' });
  try {
    const payload = verifyRefreshToken(refreshToken);
    const accessToken = signAccessToken(payload.sub);
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
}

export async function getProfile(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ id: user.id, name: user.name, email: user.email, skinType: user.skinType, skinGoals: user.skinGoals });
}

export async function updateProfile(req, res) {
  const invalid = sendValidationErrors(req, res);
  if (invalid) return;
  const updates = {};
  const allowed = ['name', 'skinType', 'skinGoals'];
  for (const key of allowed) {
    if (key in req.body) updates[key] = req.body[key];
  }
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  return res.json({ id: user.id, name: user.name, email: user.email, skinType: user.skinType, skinGoals: user.skinGoals });
}

export async function requestPasswordReset(req, res) {
  const invalid = sendValidationErrors(req, res);
  if (invalid) return;
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: 'If account exists, an email has been sent' });
  const token = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // In Sprint 1, we return the token for testing instead of emailing
  return res.json({ message: 'Password reset token generated', token });
}

export async function confirmPasswordReset(req, res) {
  const invalid = sendValidationErrors(req, res);
  if (invalid) return;
  const { token } = req.params;
  const { password } = req.body;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpires: { $gt: new Date() }
  }).select('+password');
  if (!user) return res.status(400).json({ message: 'Token invalid or expired' });
  user.password = password;
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return res.json({ message: 'Password has been reset' });
}

