const mongoose = require('mongoose');
require('dotenv').config();
const Perfume = require('./models/Perfume');

const seedData = [
  {
    name: 'Velvet Bloom',
    brand: 'Maison Aurora',
    family: 'Floral',
    notes: ['rose', 'jasmine', 'peony'],
    price: 3200,
    occasion: ['date night', 'special events'],
    scentProfile: ['romantic', 'elegant', 'soft'],
    description: 'A romantic floral with delicate rose petals and creamy white flowers.',
    rating: 4.8,
    color: '#d8b4fe',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Amber Drift',
    brand: 'Saffron Atelier',
    family: 'Oriental',
    notes: ['amber', 'vanilla', 'sandalwood'],
    price: 5400,
    occasion: ['evening', 'winter'],
    scentProfile: ['warm', 'luxurious', 'bold'],
    description: 'An inviting amber fragrance with comforting woods and a smooth vanilla finish.',
    rating: 4.9,
    color: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Citrus Muse',
    brand: 'Neroli House',
    family: 'Citrus',
    notes: ['bergamot', 'orange', 'neroli'],
    price: 2100,
    occasion: ['daytime', 'office', 'summer'],
    scentProfile: ['fresh', 'energetic', 'clean'],
    description: 'A bright citrus profile that feels uplifting and polished for daily wear.',
    rating: 4.6,
    color: '#fbbf24',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Forest Echo',
    brand: 'Oak & Cedar',
    family: 'Woody',
    notes: ['cedar', 'vetiver', 'moss'],
    price: 4800,
    occasion: ['business', 'autumn', 'evening'],
    scentProfile: ['grounded', 'masculine', 'clean'],
    description: 'A woody statement fragrance with earthy depth and refined elegance.',
    rating: 4.7,
    color: '#4ade80',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Luna Silk',
    brand: 'Petal & Pearl',
    family: 'Musky',
    notes: ['white musk', 'iris', 'cashmere'],
    price: 3900,
    occasion: ['daily wear', 'special occasions'],
    scentProfile: ['soft', 'clean', 'elegant'],
    description: 'A skin-like musky scent that feels airy, intimate, and sophisticated.',
    rating: 4.5,
    color: '#c4b5fd',
    image: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Golden Petal',
    brand: 'Maison Aurora',
    family: 'Floral',
    notes: ['orange blossom', 'rose', 'saffron'],
    price: 6700,
    occasion: ['weddings', 'festivals'],
    scentProfile: ['luxury', 'warm', 'floral'],
    description: 'An opulent floral perfume with a golden, luminous bouquet.',
    rating: 4.8,
    color: '#f9a8d4',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Midnight Cedar',
    brand: 'Ash & Ember',
    family: 'Woody',
    notes: ['cedarwood', 'black pepper', 'tonka bean'],
    price: 7100,
    occasion: ['night out', 'date night'],
    scentProfile: ['deep', 'smoky', 'confident'],
    description: 'An intense evening fragrance that feels bold and memorable.',
    rating: 4.7,
    color: '#7c3aed',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Fresh Current',
    brand: 'Neroli House',
    family: 'Fresh',
    notes: ['watermelon', 'mint', 'green tea'],
    price: 2400,
    occasion: ['daily wear', 'summer'],
    scentProfile: ['refreshing', 'light', 'clean'],
    description: 'A clean and juicy fresh scent that feels energizing and airy.',
    rating: 4.4,
    color: '#2dd4bf',
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888e9b?auto=format&fit=crop&w=900&q=80'
  }
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Perfume.deleteMany({});
    await Perfume.insertMany(seedData);
    console.log('Perfume seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding perfumes:', error.message);
    process.exit(1);
  }
};

run();
