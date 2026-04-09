const mongoose = require('mongoose');

const appConfigSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, required: true, unique: true, default: 'global' },
    config: { type: Object, required: true },
  },
  {
    timestamps: true,
    minimize: false,
    strict: false,
  },
);

module.exports = mongoose.model('AppConfig', appConfigSchema);
