const mongoose = require('mongoose');

// Cache the connection promise so serverless invocations (Vercel) reuse one
// connection instead of opening a new one on every request.
let connection = null;

const connectDB = () => {
  if (!process.env.MONGO_URI) {
    return Promise.reject(new Error('MONGO_URI is not set'));
  }
  if (!connection) {
    connection = mongoose
      .connect(process.env.MONGO_URI)
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        connection = null; // allow a retry on the next request
        throw error;
      });
  }
  return connection;
};

module.exports = connectDB;
