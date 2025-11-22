import axios from 'axios';
import API_CONFIG from '../config/api';
import { API_PREFIX } from '../config/api';

const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS || { 'Content-Type': 'application/json' },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // log to view request details
        // console.log(`Request: ${config.method.toUpperCase()} ${config.url}`, {
        //     params: config.params,
        //     data: config.data
        // });
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// response interceptor to handle responses and errors
apiClient.interceptors.response.use(
    (response) => {
        // Log to view response details
        console.log(`Response: ${response.config.method.toUpperCase()} ${response.config.url}`, {
            data: response.data
        });
        console.log('Response data:', response);
        const data = response.data;
        // Automatically save new tokens if present in response
        if (data.data?.accessToken && data.data?.refreshToken) {           
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            data: error.response?.data,
        });
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            try {
                if (!refreshToken) {
                    console.warn('Missing refresh token. Logging out.');
                    localStorage.clear();
                    return Promise.reject(error);
                }
                const response = await axios.post(`${API_PREFIX}/iam/auth/refresh-token`, {
                    refreshToken: refreshToken
                }, {
                    baseURL: API_CONFIG.BASE_URL,
                    timeout: API_CONFIG.TIMEOUT,
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response.status === 200 || response.data?.code === 200) {
                    const { accessToken, refreshToken: newRefreshToken } = response.data.data || response.data;
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                }
            } catch (error) {
                console.error('Token refresh failed:', error);
                localStorage.clear();
                return Promise.reject(error);
            }

        }
        // if (error.response && error.response.status === 403) {
        //     // Handle 403 Forbidden
        //     alert('You do not have permission to perform this action.');

        // }
        // if (error.response && error.response.status === 500) {
        //     // Handle 500 Internal Server Error
        //     alert('A server error occurred. Please try again later.');

        // }
        return Promise.reject(error);
    }
);

export default apiClient;
