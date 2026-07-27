import axios, { type AxiosRequestConfig } from 'axios';

const AXIOS_INSTANCE = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> =>
  AXIOS_INSTANCE(config).then((res) => res.data);