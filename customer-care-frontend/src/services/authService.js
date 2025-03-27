import axios from "axios";
import API_BASE_URL from "../config/api";

const authService = {
    register: async (userData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, userData);

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    login: async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, data);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    logout: async () => {
        try {
            const token = localStorage.getItem('token');

            if (token) {
                await axios.post(`${API_BASE_URL}/logout`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }

            localStorage.removeItem('token');
            localStorage.removeItem('user');

            return { success: true };
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    isAuthenticated: () => {
        return localStorage.getItem('token') !== null;
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');

        return user ? JSON.parse(user) : null;
    }
};

export default authService;