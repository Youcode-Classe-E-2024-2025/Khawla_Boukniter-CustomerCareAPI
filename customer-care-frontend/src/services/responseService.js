import axios from 'axios';
import API_BASE_URL from '../config/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');

    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

const responseService = {
    getTicketResponses: async (ticketId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tickets/${ticketId}/responses`, getAuthHeaders());

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    getResponse: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/response/${id}`, getAuthHeaders());

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    createResponse: async (ticketId, content) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/tickets/${ticketId}/responses`, { content }, getAuthHeaders());

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    updateResponse: async (id, content) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/response/${id}`, { content }, getAuthHeaders());

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    deleteResponse: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/response/${id}`, getAuthHeaders());

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }
};

export default responseService;
