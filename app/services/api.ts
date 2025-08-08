import axios from 'axios';

const api = axios.create({
  baseURL: 'https://e6d9f40bda44.ngrok-free.app',
});

export default api;
