const multer = require('multer');
const fs = require('fs');
const { useBlob } = require('../utils/storage');

// 4MB per file — Vercel functions reject request bodies over 4.5MB.
// Keep in sync with the frontend's client-side check (MAX_FILE_BYTES).
const MAX_FILE_BYTES = 4 * 1024 * 1024;

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = file.mimetype === 'application/pdf' ? 'uploads/pdfs/' : 'uploads/images/';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and PDFs allowed.'), false);
  }
};

const upload = multer({
  storage: useBlob() ? multer.memoryStorage() : diskStorage,
  fileFilter,
  limits: { fileSize: MAX_FILE_BYTES },
});
module.exports = upload;
