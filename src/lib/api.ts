import { logout, verifyToken } from '@/app/actions/auth-action';
import axios, { AxiosInstance } from 'axios';
import { getCookie } from 'cookies-next';

const api: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = getCookie('token');

    if (token) {
      const isValid = await verifyToken(token as string);

      if (!isValid) {
        logout();
      }

      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      logout();
    }

    return Promise.reject(error);
  },
);

export default api;
