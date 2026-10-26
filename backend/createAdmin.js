const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const Admin = mongoose.model('Admin', adminSchema);

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const hashedPassword = await bcrypt.hash('admin123', 10); // 'admin123' is the password
  await Admin.create({ username: 'supraj_admin', password: hashedPassword });
  console.log('Admin created! Username: supraj_admin | Password: admin123');
  process.exit();
}
createAdmin();