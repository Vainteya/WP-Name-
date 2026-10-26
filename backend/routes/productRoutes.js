const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const productUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]);

// Wraps multer so upload failures (bad boundary, bad file type, oversized
// file) come back as the same { message, errors: { field: message } }
// shape as our own validation, instead of crashing to a raw 500 or an
// unhandled exception that skips the route handler entirely.
function withProductUpload(req, res, next) {
  productUpload(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      const field = err.field || 'form';
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'File is too large (10MB max).'
          : err.code === 'LIMIT_UNEXPECTED_FILE'
          ? 'Unexpected file field.'
          : err.message;
      return res.status(400).json({ message: 'Upload failed', errors: { [field]: message } });
    }

    // Anything else (e.g. the fileFilter's "Invalid file type" Error, or a
    // malformed/missing multipart boundary) also becomes a 400 instead of
    // an unhandled server error.
    return res.status(400).json({
      message: 'Upload failed',
      errors: { form: err.message || 'Could not process the uploaded files. Please try again.' },
    });
  });
}

// Validates the text fields + (for new products) the required image file,
// shared by POST and PUT so both return identical, field-keyed errors.
function validateProductFields({ name, brand, category }, imageFile, { requireImage }) {
  const errors = {};

  if (!name || !name.trim()) errors.name = 'Component name is required.';
  if (!brand) errors.brand = 'Please select a brand.';
  if (!category) errors.category = 'Please select a category.';
  if (requireImage && !imageFile) errors.image = 'Product image (.png/.jpg) is required.';

  return errors;
}

function mongooseErrorsToFieldErrors(error) {
  const errors = {};
  Object.keys(error.errors).forEach((key) => {
    errors[key] = error.errors[key].message;
  });
  return errors;
}

// GET all products (Public)
router.get('/', async (req, res) => {
  try {
    const { category, brand } = req.query;
    let query = {};
    if (category) query.category = category;
    if (brand) query.brand = brand;
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// POST new product (Admin Only)
router.post('/', protect, withProductUpload, async (req, res) => {
  try {
    const { name, brand, category } = req.body;
    const imageFile = req.files && req.files['image'] ? req.files['image'][0] : null;
    const pdfFile = req.files && req.files['pdf'] ? req.files['pdf'][0] : null;

    const errors = validateProductFields({ name, brand, category }, imageFile, { requireImage: true });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const product = await Product.create({
      name: name.trim(),
      brand,
      category,
      imagePath: imageFile.path,
      pdfPath: pdfFile ? pdfFile.path : '',
    });
    res.status(201).json(product);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', errors: mongooseErrorsToFieldErrors(error) });
    }
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

// PUT update product (Admin Only)
router.put('/:id', protect, withProductUpload, async (req, res) => {
  try {
    const { name, brand, category } = req.body;
    const imageFile = req.files && req.files['image'] ? req.files['image'][0] : null;
    const pdfFile = req.files && req.files['pdf'] ? req.files['pdf'][0] : null;

    // Editing an existing product: the image is only required if the
    // record doesn't already have one (new files are optional otherwise).
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const errors = validateProductFields({ name, brand, category }, imageFile, {
      requireImage: !existing.imagePath,
    });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const updateData = { name: name.trim(), brand, category };
    if (imageFile) updateData.imagePath = imageFile.path;
    if (pdfFile) updateData.pdfPath = pdfFile.path;

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    res.json(product);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', errors: mongooseErrorsToFieldErrors(error) });
    }
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// DELETE product & remove physical files (Admin Only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Safely remove files from disk if they exist
    if (product.imagePath && fs.existsSync(product.imagePath)) {
      try {
        fs.unlinkSync(product.imagePath);
      } catch (err) {
        console.error('Error removing image file:', err);
      }
    }
    if (product.pdfPath && fs.existsSync(product.pdfPath)) {
      try {
        fs.unlinkSync(product.pdfPath);
      } catch (err) {
        console.error('Error removing PDF file:', err);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product and associated files removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
