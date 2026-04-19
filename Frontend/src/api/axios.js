import axios from 'axios';
import { API_BASE_URL } from '../config';

// Configure axios with baseURL if provided, otherwise use relative URLs
const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
};

// Only set baseURL if it's not empty (empty means use relative URLs)
if (API_BASE_URL) {
    axiosConfig.baseURL = API_BASE_URL;
}

const axiosInstance = axios.create(axiosConfig);

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access - maybe redirect to login
            console.error('Unauthorized access - please login');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;