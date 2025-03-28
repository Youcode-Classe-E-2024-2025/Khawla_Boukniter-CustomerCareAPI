import axios from "axios";
import API_BASE_URL from "../config/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');

    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

const ticketService = {
    getAllTickets: async (filters = {}, perpage = 10) => {
        try {
            let params = new URLSearchParams();

            if (filters.status) {
                params.append('status', filters.status);
            }

            if (filters.search) {
                params.append('search', filters.search);
            }

            if (filters.assigned_to_me) {
                params.append('assigned_to_me', 'true');
            }

            params.append('perpage', perpage);

            const response = await axios.get(`${API_BASE_URL}/tickets?${params.toString()}`, getAuthHeaders());

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    createTicket: async (ticketData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/tickets`, ticketData, getAuthHeaders());

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    cancelTicket: async (id) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/tickets/${id}/cancel`, {}, getAuthHeaders());

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    assignTicket: async (id) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/tickets/${id}/assign`, {}, getAuthHeaders());

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    changeTicketStatus: async (id, status) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/tickets/${id}/status`, { status }, getAuthHeaders());

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    getTicket: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tickets/${id}`, getAuthHeaders());

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    updateTicket: async (id, ticketData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/tickets/${id}`, ticketData, getAuthHeaders());

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },
};

export default ticketService;