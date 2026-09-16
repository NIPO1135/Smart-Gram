const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  youthProgress: {
    learnProgress: { type: Number, default: 0 },
    earnCompleted: { type: Boolean, default: false },
    growUnlocked: { type: Boolean, default: false },
    completedLessons: { type: [String], default: [] },
    quizScores: { type: Map, of: Number, default: {} },
    streakDays: { type: Number, default: 0 },
    lastActive: { type: Date }
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
