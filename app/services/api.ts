import axios from 'axios';

const api = axios.create({
  baseURL: 'https://81e923c67e32.ngrok-free.app',
  headers: {
    'ngrok-skip-browser-warning': 'true',
    
  },
});

export default api;
