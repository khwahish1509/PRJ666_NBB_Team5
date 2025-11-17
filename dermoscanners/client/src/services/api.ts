import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  timeout: 15000,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('auth');
  if (stored) {
    const { tokens } = JSON.parse(stored);
    if (tokens?.accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
  }
  return config;
});

// Response interceptor for retry logic and error handling
let retryCount = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

api.interceptors.response.use(
  (response) => {
    // Reset retry count on successful response
    retryCount = 0;
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { _retry?: number };

    // Don't retry if it's a client error (4xx) or no config
    if (!config || (error.response && error.response.status >= 400 && error.response.status < 500)) {
      return Promise.reject(error);
    }

    // Initialize retry count for this request
    config._retry = config._retry || 0;

    // Check if we should retry
    if (config._retry < MAX_RETRIES) {
      config._retry += 1;
      
      // Calculate exponential backoff delay
      const delay = RETRY_DELAY * Math.pow(2, config._retry - 1);
      
      console.log(`Retrying request (${config._retry}/${MAX_RETRIES}) after ${delay}ms...`);
      
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
      
      // Retry the request
      return api(config);
    }

    // Max retries exceeded
    console.error('Max retries exceeded for request:', config.url);
    return Promise.reject(error);
  }
);

export default api;

