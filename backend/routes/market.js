const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: products,
    });
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ status: 'error', message: 'Server Error' });
  }
});

// Upload new product
router.post('/products', upload.single('image'), async (req, res) => {
  try {
    const { name, price, unit, contact, seller } = req.body;
    let imageUrl = undefined;
    
    if (req.file) {
      imageUrl = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
    }

    const newProduct = new Product({
      name,
      price,
      unit,
      image: imageUrl,
      contact,
      seller: seller || undefined,
    });

    await newProduct.save();

    res.status(201).json({ status: 'success', message: 'Product uploaded successfully', data: newProduct });
  } catch (error) {
    console.error('Upload Product Error:', error);
    res.status(500).json({ status: 'error', message: 'Server Error' });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    res.status(200).json({ status: 'success', message: 'Product deleted' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ status: 'error', message: 'Server Error' });
  }
});

module.exports = router;
