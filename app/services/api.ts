import axios from 'axios';

const api = axios.create({
  baseURL: 'https://c075299a8441.ngrok-free.app',
  headers: {
    'ngrok-skip-browser-warning': 'true',
    
  },
});

export default api;
