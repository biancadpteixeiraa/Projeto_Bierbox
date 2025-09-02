import axios from 'axios';

const api = axios.create({
  baseURL: 'https://5f27d5135b75.ngrok-free.app',
  headers: {
    'ngrok-skip-browser-warning': 'true',
    
  },
});

export default api;
