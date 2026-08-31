import axios from 'axios';

const api = axios.create({
  baseURL: `https://node.rxchartsquare.com/`,
});

export default api;
