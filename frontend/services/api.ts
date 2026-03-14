import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    // We use JS-Cookie or localStorage depending on preference.
    // For universal SSR support with Next.js App Router, cookies are generally better,
    // but we'll try to stick to default localStorage if available, or just send what we have.
    let token = '';

    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token') || Cookies.get('token') || '';
    } else {
        // If we are server-side, we would ideally extract from headers/cookies
        // But for simplicity in this standard architecture, we handle most data fetching client-side
    }

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error: any) => {
    return Promise.reject(error);
});

export default api;
