const express = require('express');
const { getAllPerfumes, submitQuiz, getRecommendations, getSavedFavorites, saveFavorite, removeFavorite } = require('../controllers/perfumeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllPerfumes);
router.post('/quiz', protect, submitQuiz);
router.get('/recommendations', protect, getRecommendations);
router.get('/favorites', protect, getSavedFavorites);
router.post('/favorites', protect, saveFavorite);
router.delete('/favorites/:id', protect, removeFavorite);

module.exports = router;
