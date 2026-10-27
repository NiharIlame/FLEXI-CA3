import api from './api';

export const getPerfumes = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const response = await api.get(`/perfumes?${params.toString()}`);
  return response.data.perfumes || [];
};

export const submitQuiz = async (payload) => {
  const response = await api.post('/perfumes/quiz', payload);
  return response.data;
};

export const getRecommendations = async () => {
  const response = await api.get('/perfumes/recommendations');
  return response.data.recommendations || [];
};

export const getFavorites = async () => {
  const response = await api.get('/perfumes/favorites');
  return response.data.favorites || [];
};

export const saveFavorite = async (perfumeId) => {
  const response = await api.post('/perfumes/favorites', { perfumeId });
  return response.data;
};

export const removeFavorite = async (favoriteId) => {
  const response = await api.delete(`/perfumes/favorites/${favoriteId}`);
  return response.data;
};
