// src/services/favoriteService.js (simplified version)
import api from './api';

// Get all favorites for a user
export const getFavorites = async (userId) => {
  try {
    const response = await api.get(`/favorites/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

// Add a runner to favorites
export const addFavorite = async (userId, runnerId) => {
  try {
    const response = await api.post('/favorites', { userId, runnerId });
    return response.data;
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

// Remove a runner from favorites
export const removeFavorite = async (userId, runnerId) => {
  try {
    const response = await api.delete(`/favorites/${userId}/${runnerId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

// Check if a runner is favorited by user
export const isFavorite = async (userId, runnerId) => {
  try {
    const response = await api.get(`/favorites/check/${userId}/${runnerId}`);
    return response.data.isFavorite;
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};