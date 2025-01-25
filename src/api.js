// Create or update src/api.js with the contents from src/src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://new-reach-backend.herokuapp.com', // Replace with your backend URL
});

export const getExampleData = async () => {
  try {
    const response = await API.get('/example-endpoint');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
