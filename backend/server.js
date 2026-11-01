const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploads (Local Storage Provider; on Vercel files
// go to Vercel Blob instead and are served from their own URLs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Make sure the database is connected before any API route runs.
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    res.status(503).json({ message: 'Database unavailable' });
  }
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// Run a normal server locally (`node server.js`); on Vercel the app is
// exported and invoked by api/index.js instead.
if (require.main === module) {
  connectDB().catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
