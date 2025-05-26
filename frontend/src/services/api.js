import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// News API endpoints
export const getTopHeadlines = async (country = 'us', pageSize = 12) => {
  try {
    const response = await api.get(`/news/top-headlines?country=${country}&pageSize=${pageSize}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching top headlines:', error);
    throw error;
  }
};

export const getNewsByCategory = async (category, country = 'us', pageSize = 12) => {
  try {
    const response = await api.get(`/news/category/${category}?country=${country}&pageSize=${pageSize}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error);
    throw error;
  }
};

export const searchNews = async (query, pageSize = 12) => {
  try {
    const response = await api.get(`/news/search?q=${encodeURIComponent(query)}&pageSize=${pageSize}`);
    return response.data.data;
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
};

// Summary API endpoints
export const summarizeArticle = async (text, maxLength = 150) => {
  try {
    const response = await api.post('/summary/summarize', { text, max_length: maxLength });
    return response.data;
  } catch (error) {
    console.error('Error summarizing article:', error);
    throw error;
  }
};

export default api;
