const express = require('express');
const AppConfig = require('../models/AppConfig');
const Notice = require('../models/Notice');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get current app config for admin panel and frontend
router.get('/', async (_req, res) => {
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

// Append a new talent (accessible to regular authenticated users)
router.post('/talent', requireAuth, async (req, res) => {
  try {
    const { talent } = req.body;
    if (!talent || typeof talent !== 'object') {
      return res.status(400).json({ message: 'Invalid talent payload' });
    }

    // Force approval to false for safety
    talent.approved = false;

    // We use an update pipeline or simple atomic push if we know the structure.
    // However, AppConfig is schema-less { config: Object }. Mongoose atomic updates 
    // on nested mixed objects are tricky if the path might not exist.
    // Since AppConfig is a singleton and traffic is low, fetching and saving is fine.
    let doc = await AppConfig.findOne({ singletonKey: 'global' });
    
    if (!doc) {
      doc = new AppConfig({ singletonKey: 'global', config: { talentHub: { talents: [] } } });
    }

    if (!doc.config) doc.config = {};
    if (!doc.config.talentHub) doc.config.talentHub = {};
    if (!doc.config.talentHub.talents || !Array.isArray(doc.config.talentHub.talents)) {
      doc.config.talentHub.talents = [];
    }

    // Unshift to put it at the beginning
    doc.config.talentHub.talents.unshift(talent);

    // Tell Mongoose the nested object was modified
    doc.markModified('config');
    await doc.save();

    return res.status(200).json({ message: 'Talent added successfully', talent });
  } catch (error) {
    console.error('Add Talent Error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
