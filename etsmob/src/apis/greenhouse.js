import axios from 'axios';

const url = {};

// url.baseURL = 'https://exploring-the-space.com/api';

url.baseURL = 'http://localhost:8000/api';

const instance = axios.create(url);

export default instance;
