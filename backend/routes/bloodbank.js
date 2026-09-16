const express = require('express');
const multer = require('multer');
const path = require('path');
const Donor = require('../models/Donor');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-donor-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

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
router.post('/register', upload.single('image'), async (req, res) => {
  try {
    const { bloodGroup, phone, location, lastDonation, name } = req.body;
    let imageUrl = undefined;
    
    if (req.file) {
      imageUrl = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
    }

    const newDonor = new Donor({
      blood_group: bloodGroup,
      phone,
      location,
      last_donation: lastDonation,
      name: name || 'Anonymous Donor',
      image: imageUrl,
    });

    await newDonor.save();

    res.status(201).json({ status: 'success', message: 'Donor registered successfully' });
  } catch (error) {
    console.error('Register Donor Error:', error);
    res.status(500).json({ status: 'error', message: 'Server Error' });
  }
});

// Delete donor
router.delete('/donors/:id', async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);
    if (!donor) {
      return res.status(404).json({ status: 'error', message: 'Donor not found' });
    }
    res.status(200).json({ status: 'success', message: 'Donor deleted' });
  } catch (error) {
    console.error('Delete Donor Error:', error);
    res.status(500).json({ status: 'error', message: 'Server Error' });
  }
});

module.exports = router;
