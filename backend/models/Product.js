const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, enum: ['Paramount', 'Finder'], required: true },
  category: {
    type: String,
    enum: [
      'Relays', 'Relay Sockets', 'Diode ORings', 'Power Supply/SMPS',
      'Tower Lamp', 'Surge Protection Devices', 'Relay Boards',
      'Solid State Relays', 'Timer Relays', 'Electric Panel Accessories',
      'Hard to find Electronic Components'
    ],
    required: true
  },
  imagePath: { type: String, required: true },
  pdfPath: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);