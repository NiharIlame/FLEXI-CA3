const Perfume = require('../models/Perfume');
const QuizResponse = require('../models/QuizResponse');
const Favorite = require('../models/Favorite');

const budgetMap = {
  'Under ₹2,000': 2000,
  '₹2,000 - ₹4,000': 4000,
  '₹4,000 - ₹8,000': 8000,
  'Above ₹8,000': Number.MAX_SAFE_INTEGER,
};

const buildRecommendation = (perfume, payload) => {
  let score = 0;
  const reasons = [];

  const notes = (payload.favoriteScents || []).map((note) => note.toLowerCase());
  const scentSet = new Set((perfume.notes || []).map((note) => note.toLowerCase()));

  notes.forEach((note) => {
    if (scentSet.has(note)) {
      score += 24;
      reasons.push(`Matches your favorite note: ${note}`);
    }
  });

  if (payload.fragranceFamily && perfume.family === payload.fragranceFamily) {
    score += 18;
    reasons.push(`Fits your preferred fragrance family: ${perfume.family}`);
  }

  if (payload.occasion && (perfume.occasion || []).includes(payload.occasion)) {
    score += 18;
    reasons.push(`Works well for ${payload.occasion} occasions`);
  }

  if (payload.scentProfile && (perfume.scentProfile || []).includes(payload.scentProfile)) {
    score += 14;
    reasons.push(`Aligns with your scent mood: ${payload.scentProfile}`);
  }

  if (payload.brandPreference && perfume.brand === payload.brandPreference) {
    score += 10;
    reasons.push(`Matches your preferred brand: ${perfume.brand}`);
  }

  const maxBudget = budgetMap[payload.budget] || Number.MAX_SAFE_INTEGER;
  if (perfume.price <= maxBudget) {
    score += 16;
    reasons.push(`Stays within your budget range`);
  }

  if (perfume.rating >= 4.5) {
    score += 6;
    reasons.push(`Highly rated by fragrance lovers`);
  }

  if (reasons.length === 0) {
    reasons.push('A versatile option that still fits your profile well');
  }

  return { ...perfume.toObject(), score, reasons: [...new Set(reasons)].slice(0, 4) };
};

const getAllPerfumes = async (req, res) => {
  try {
    const { family, brand, maxPrice, occasion } = req.query;
    const filter = {};

    if (family) filter.family = family;
    if (brand) filter.brand = brand;
    if (occasion) filter.occasion = { $in: [occasion] };
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };

    const perfumes = await Perfume.find(filter).sort({ rating: -1, price: 1 });
    return res.status(200).json({ perfumes });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching perfumes.', error: error.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { favoriteScents, scentProfile, budget, occasion, fragranceFamily, brandPreference } = req.body;

    if (!favoriteScents || !favoriteScents.length) {
      return res.status(400).json({ message: 'Please choose at least one favorite scent.' });
    }

    const response = await QuizResponse.create({
      user: req.user._id,
      favoriteScents,
      scentProfile,
      budget,
      occasion,
      fragranceFamily,
      brandPreference,
    });

    const perfumes = await Perfume.find();
    const scored = perfumes
      .map((perfume) => buildRecommendation(perfume, req.body))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    return res.status(201).json({
      message: 'Your perfume quiz has been saved.',
      quiz: response,
      recommendations: scored,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error submitting perfume quiz.', error: error.message });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const latest = await QuizResponse.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    if (!latest) {
      return res.status(200).json({ recommendations: [] });
    }

    const perfumes = await Perfume.find();
    const scored = perfumes
      .map((perfume) => buildRecommendation(perfume, latest.toObject()))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    return res.status(200).json({ recommendations: scored });
  } catch (error) {
    return res.status(500).json({ message: 'Error generating recommendations.', error: error.message });
  }
};

const getSavedFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate('perfume');
    return res.status(200).json({ favorites });
  } catch (error) {
    return res.status(500).json({ message: 'Error loading favorites.', error: error.message });
  }
};

const saveFavorite = async (req, res) => {
  try {
    const { perfumeId } = req.body;
    if (!perfumeId) {
      return res.status(400).json({ message: 'Perfume ID is required.' });
    }

    const perfume = await Perfume.findById(perfumeId);
    if (!perfume) {
      return res.status(404).json({ message: 'Perfume not found.' });
    }

    const exists = await Favorite.findOne({ user: req.user._id, perfume: perfumeId });
    if (exists) {
      return res.status(409).json({ message: 'This perfume is already in your favorites.' });
    }

    const favorite = await Favorite.create({ user: req.user._id, perfume: perfumeId });
    return res.status(201).json({ message: 'Perfume saved to favorites.', favorite });
  } catch (error) {
    return res.status(500).json({ message: 'Error saving favorite.', error: error.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found.' });
    }

    return res.status(200).json({ message: 'Favorite removed successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error removing favorite.', error: error.message });
  }
};

module.exports = {
  getAllPerfumes,
  submitQuiz,
  getRecommendations,
  getSavedFavorites,
  saveFavorite,
  removeFavorite,
};
