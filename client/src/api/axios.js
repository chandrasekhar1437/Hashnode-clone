import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  let token = null;

  // Check all possible storage locations for the token
  const tokenOnly = localStorage.getItem('token');
  if (tokenOnly) {
    token = tokenOnly;
  } else {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        token = parsed.token || parsed;
      } catch {
        token = userInfo;
      }
    }
  }

  if (token) {
    // Ensure "Bearer " prefix isn't duplicated
    const formattedToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    req.headers.Authorization = `Bearer ${formattedToken}`;
  }

  return req;
});

export default API;