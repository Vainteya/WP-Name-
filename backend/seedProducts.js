const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const initialProducts = [
  {
    name: 'Industrial Relays Series',
    brand: 'Finder',
    category: 'Relays',
    imagePath: '/images/components/relay.png',
    pdfPath: ''
  },
  {
    name: 'Industrial Relay Sockets Series',
    brand: 'Finder',
    category: 'Relay Sockets',
    imagePath: '/images/components/relay-socket.png',
    pdfPath: ''
  },
  {
    name: 'Industrial Diode ORings Series',
    brand: 'Paramount',
    category: 'Diode ORings',
    imagePath: '/images/components/diode-oring.png',
    pdfPath: ''
  },
  {
    name: 'Industrial Power Supply/SMPS Series',
    brand: 'Paramount',
    category: 'Power Supply/SMPS',
    imagePath: '/images/components/smps.png',
    pdfPath: ''
  },
  {
    name: 'Industrial Tower Lamp Series',
    brand: 'Paramount',
    category: 'Tower Lamp',
    imagePath: '/images/components/tower-lamp.png',
    pdfPath: ''
  },
  {
    name: 'Industrial Surge Protection Devices Series',
    brand: 'Finder',
    category: 'Surge Protection Devices',
    imagePath: '/images/components/spd.png',
    pdfPath: ''
  },
  {
    name: 'Industrial Relay Boards Series',
    brand: 'Paramount',
    category: 'Relay Boards',
    imagePath: '/images/components/relay-board.png',
    pdfPath: ''
  },
  {
    name: 'Industrial Solid State Relays Series',
    brand: 'Finder',
    category: 'Solid State Relays',
    imagePath: '/images/components/ssr.png',
    pdfPath: ''
  },
  {
    name: 'Industrial Timer Relays Series',
    brand: 'Finder',
    category: 'Timer Relays',
    imagePath: '/images/components/timer-relay.png',
    pdfPath: ''
  },
  {
    name: 'Industrial Electric Panel Accessories Series',
    brand: 'Paramount',
    category: 'Electric Panel Accessories',
    imagePath: '/images/components/panel-accessories.png',
    pdfPath: ''
  },
  {
    name: 'Industrial Hard to find Electronic Components Series',
    brand: 'Paramount',
    category: 'Hard to find Electronic Components',
    imagePath: '/images/components/hard-to-find.png',
    pdfPath: ''
  }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Inserts the default components into the database
    await Product.insertMany(initialProducts);
    console.log('All 11 components have been successfully inserted into MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedDB();