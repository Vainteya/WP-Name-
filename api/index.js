// Vercel serverless entry point: every /api/* and /uploads/* request is
// rewritten here (see vercel.json) and handled by the existing Express app.
module.exports = require('../backend/server');
