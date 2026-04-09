const mongoose = require('mongoose');

const localizedTextSchema = new mongoose.Schema(
  {
    en: { type: String, required: true, trim: true },
    bn: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const noticeSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, required: true, unique: true, default: 'global' },
    notices: { type: localizedTextSchema, required: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Notice', noticeSchema);
