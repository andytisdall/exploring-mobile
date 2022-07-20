import axios from 'axios';

const url = {};

url.baseURL = 'https://exploring-the-space.com/api';

const instance = axios.create(url);

// instance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = token;
//     }
//     return config;
//   },
//   (err) => {
//     return Promise.reject(err);
//   }
// );

export default instance;
