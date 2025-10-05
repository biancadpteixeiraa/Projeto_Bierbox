import axios from 'axios';


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_ADDRESS, // URL pública do Render
});

export default api;
