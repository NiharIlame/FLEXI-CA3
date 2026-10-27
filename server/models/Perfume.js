const mongoose = require('mongoose');

const perfumeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  family: { type: String, required: true, enum: ['Floral', 'Woody', 'Citrus', 'Oriental', 'Fresh', 'Gourmand', 'Musky'], trim: true },
  notes: [{ type: String, trim: true }],
  price: { type: Number, required: true },
  occasion: [{ type: String, trim: true }],
  scentProfile: [{ type: String, trim: true }],
  description: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  color: { type: String, default: '#d9b3ff' },
  image: { type: String, default: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Perfume', perfumeSchema);
