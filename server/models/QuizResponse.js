const mongoose = require('mongoose');

const quizResponseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  favoriteScents: [{ type: String, trim: true }],
  scentProfile: { type: String, trim: true },
  budget: { type: String, trim: true },
  occasion: { type: String, trim: true },
  fragranceFamily: { type: String, trim: true },
  brandPreference: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizResponse', quizResponseSchema);
