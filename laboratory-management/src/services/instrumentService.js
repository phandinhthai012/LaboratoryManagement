import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../config/api";

const instrumentService = {
    initiateSampleAnalysis: async (data) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.INSTRUMENT.INITIATE_SAMPLE_ANALYSIS, data);
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },
    changeInstrumentMode: async (instrumentCode, modeData) => {
        try {
            const endpoint = API_ENDPOINTS.INSTRUMENT.CHANGE_INSTRUMENT_MODE(instrumentCode);
            const response = await apiClient.post(endpoint, modeData);
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }
};

export default instrumentService;