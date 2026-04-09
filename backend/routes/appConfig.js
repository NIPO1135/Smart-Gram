const express = require('express');
const AppConfig = require('../models/AppConfig');
const Notice = require('../models/Notice');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get current app config for admin panel
router.get('/', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const doc = await AppConfig.findOne({ singletonKey: 'global' }).lean();
    if (!doc) {
      return res.status(200).json({ config: null });
    }
    const noticeDoc = await Notice.findOne({ singletonKey: 'global' }).lean();
    if (
      noticeDoc?.notices &&
      typeof noticeDoc.notices.bn === 'string' &&
      typeof noticeDoc.notices.en === 'string'
    ) {
      doc.config.notices = noticeDoc.notices;
    }
    return res.status(200).json({ config: doc.config });
  } catch (error) {
    console.error('Fetch App Config Error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Save/update app config from admin panel
router.put('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { config } = req.body;
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
      return res.status(400).json({ message: 'Invalid config payload' });
    }

    await AppConfig.findOneAndUpdate(
      { singletonKey: 'global' },
      { $set: { config } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const bn = typeof config?.notices?.bn === 'string' ? config.notices.bn.trim() : '';
    const en = typeof config?.notices?.en === 'string' ? config.notices.en.trim() : '';
    if (bn && en) {
      await Notice.findOneAndUpdate(
        { singletonKey: 'global' },
        { $set: { notices: { bn, en } } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    return res.status(200).json({ message: 'Config saved' });
  } catch (error) {
    console.error('Save App Config Error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
