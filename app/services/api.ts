import axios from 'axios';

const api = axios.create({
  baseURL: 'https://54327051f610.ngrok-free.app',
  headers: {
    'ngrok-skip-browser-warning': 'true',
    
  },
});

export default api;
