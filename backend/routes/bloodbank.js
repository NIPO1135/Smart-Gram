const express = require('express');
const Donor = require('../models/Donor');

const router = express.Router();

// Get donors
router.get('/donors', async (req, res) => {
  try {
    const { bloodGroup } = req.query;
    let query = {};
    
    // If empty or 'All', get all
    if (bloodGroup && bloodGroup !== 'All') {
      // It might be URL encoded like A%2B, decode it just in case
      const decodedGroup = decodeURIComponent(bloodGroup);
      query = { blood_group: decodedGroup };
    }

    const donors = await Donor.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: donors,
    });
  } catch (error) {
    console.error('Get Donors Error:', error);
    res.status(500).json({ status: 'error', message: 'Server Error' });
  }
});

// Register new donor
router.post('/register', async (req, res) => {
  try {
    const { bloodGroup, phone, location, lastDonation } = req.body;

    const newDonor = new Donor({
      blood_group: bloodGroup,
      phone,
      location,
      last_donation: lastDonation,
    });

    await newDonor.save();

    res.status(201).json({ status: 'success', message: 'Donor registered successfully' });
  } catch (error) {
    console.error('Register Donor Error:', error);
    res.status(500).json({ status: 'error', message: 'Server Error' });
  }
});

module.exports = router;
