import { removeSession } from '@/app/actions/auth-action';
import { verifySession } from '@/app/actions/session-action';
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
      const isValid = await verifySession(token as string);

      if (!isValid) {
        removeSession();
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
      removeSession();
    }

    return Promise.reject(error);
  },
);

export default api;
