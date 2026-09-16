const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_env';
const ADMIN_PANEL_PIN = process.env.ADMIN_PANEL_PIN || '2468';

function createToken(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role || 'user' }, JWT_SECRET, { expiresIn: '7d' });
}

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, email } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this phone number already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Find user
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: 'Invalid phone or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid phone or password' });
    }

    // Respond with user info
    const token = createToken(user);
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role || 'user',
          youthProgress: user.youthProgress || { learnProgress: 0, earnCompleted: false, growUnlocked: false },
        },
      });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Promote logged in user to admin using server-side PIN
router.post('/promote-admin', requireAuth, async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin || pin !== ADMIN_PANEL_PIN) {
      return res.status(400).json({ message: 'Invalid PIN' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { role: 'admin' } },
      { new: true },
    );

    const token = createToken(user);
      return res.status(200).json({
        message: 'Admin promoted',
        token,
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
          youthProgress: user.youthProgress || { learnProgress: 0, earnCompleted: false, growUnlocked: false },
        },
      });
  } catch (error) {
    console.error('Promote Admin Error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Update Youth Progress
router.put('/youth-progress', requireAuth, async (req, res) => {
  try {
    const { learnProgress, earnCompleted, growUnlocked, completedLessons, quizScores, streakDays, lastActive } = req.body;
    
    // Create an update object with only defined fields to allow partial updates
    const updateFields = {};
    if (learnProgress !== undefined) updateFields['youthProgress.learnProgress'] = learnProgress;
    if (earnCompleted !== undefined) updateFields['youthProgress.earnCompleted'] = earnCompleted;
    if (growUnlocked !== undefined) updateFields['youthProgress.growUnlocked'] = growUnlocked;
    if (completedLessons !== undefined) updateFields['youthProgress.completedLessons'] = completedLessons;
    if (quizScores !== undefined) updateFields['youthProgress.quizScores'] = quizScores;
    if (streakDays !== undefined) updateFields['youthProgress.streakDays'] = streakDays;
    if (lastActive !== undefined) updateFields['youthProgress.lastActive'] = lastActive;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No progress fields provided' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Youth progress updated',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        youthProgress: user.youthProgress,
      },
    });
  } catch (error) {
    console.error('Youth Progress Update Error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
