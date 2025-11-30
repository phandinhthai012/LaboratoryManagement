import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../config/api";


const mornitoringService = {
    getAllEventLogs: async (params) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.MORNITO.GET_ALL_EVENT_LOGS, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default mornitoringService;