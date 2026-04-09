const express = require('express');
const Notice = require('../models/Notice');
const AppConfig = require('../models/AppConfig');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Public: Get current notice board text
router.get('/', async (_req, res) => {
  try {
    const doc = await Notice.findOne({ singletonKey: 'global' }).lean();
    if (doc?.notices) {
      return res.status(200).json({ notices: doc.notices });
    }

    const appConfig = await AppConfig.findOne({ singletonKey: 'global' }).lean();
    const fallbackNotices = appConfig?.config?.notices ?? null;
    return res.status(200).json({ notices: fallbackNotices });
  } catch (error) {
    console.error('Fetch Notices Error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Admin: Save/update notice board text
router.put('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { notices } = req.body;
    const bn = typeof notices?.bn === 'string' ? notices.bn.trim() : '';
    const en = typeof notices?.en === 'string' ? notices.en.trim() : '';

    if (!bn || !en) {
      return res.status(400).json({ message: 'Invalid notices payload' });
    }

    await Notice.findOneAndUpdate(
      { singletonKey: 'global' },
      { $set: { notices: { bn, en } } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json({ message: 'Notices saved' });
  } catch (error) {
    console.error('Save Notices Error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
