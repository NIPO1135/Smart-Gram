require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const AppConfig = require('./backend/models/AppConfig');

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-village');
  console.log('Connected to MongoDB');

  const testConfig = {
    education: { courses: [{ id: 'test', title: { bn: 'Test', en: 'Test' } }] },
    talentHub: { talents: [] }
  };

  const updated = await AppConfig.findOneAndUpdate(
    { singletonKey: 'global' },
    { $set: { config: testConfig } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('Updated doc:', JSON.stringify(updated));

  const fetched = await AppConfig.findOne({ singletonKey: 'global' }).lean();
  console.log('Fetched doc:', JSON.stringify(fetched));

  process.exit(0);
}

run().catch(console.error);
