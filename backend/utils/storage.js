const fs = require('fs');

// When a Vercel Blob store is connected to the project, Vercel sets
// BLOB_READ_WRITE_TOKEN automatically. Uploads then go to Blob (Vercel's
// filesystem is read-only and wiped between requests). Without the token,
// files stay on local disk under backend/uploads like before.
const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

// After multer has parsed the request into memory, push each file to Blob
// and set file.path to its public URL so the routes can store it as-is.
async function persistUploadedFiles(files) {
  if (!useBlob() || !files) return;
  const { put } = require('@vercel/blob');
  const all = Object.values(files).flat();
  await Promise.all(
    all.map(async (file) => {
      const folder = file.mimetype === 'application/pdf' ? 'pdfs' : 'images';
      const blob = await put(`uploads/${folder}/${Date.now()}-${file.originalname}`, file.buffer, {
        access: 'public',
        contentType: file.mimetype,
        addRandomSuffix: true,
      });
      file.path = blob.url;
    })
  );
}

// Remove a stored file, whether it lives in Blob (http URL) or on disk.
async function removeStoredFile(filePath) {
  if (!filePath || filePath.startsWith('/images')) return; // bundled frontend image
  try {
    if (/^https?:\/\//.test(filePath)) {
      if (!useBlob()) return;
      const { del } = require('@vercel/blob');
      await del(filePath);
    } else if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error(`Error removing file ${filePath}:`, err);
  }
}

module.exports = { useBlob, persistUploadedFiles, removeStoredFile };
