import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../config/api";

const warehouseService = {
    // instrument management
    // getALL instruments
    getAllInstruments: async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.WAREHOUSE.GET_ALL_INSTRUMENTS);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // add 1 instrument
//     {
//     "name": "Máy Hóa Sinh",
//     "ipAddress": "192.168.1.100",
//     "port": 5001,
//     "model": "Cobas 8000",
//     "type": "Hóa sinh",
//     "serialNumber": "C8K-SN-TEST-001",
//     "vendorId": "VDR-251104142101-b2c3d4e5-1002",
//     "configurationSettingIds": ["CFS-251103111530-de796b1a-7950", "CFS-251103112034-5154bd02-7934"],
//     "compatibleReagentIds": ["RTY-ALINITY-002"]
// }
    addInstrument: async (instrumentData) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.WAREHOUSE.ADD_INSTRUMENT, instrumentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // create configurations
    createConfigurations: async (configData) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.WAREHOUSE.CREATE_CONFIGURATIONS, configData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // check instrument status
//     {
//   "instrumentId": "INS-251112114411-30d5ae95-4571",
//   "forceRecheck": false
// }
    checkInstrumentStatus: async (data) => {
        try {
            const {instrumentId, forceRecheck} = data;
            const response = await apiClient.post(API_ENDPOINTS.WAREHOUSE.CHECK_INSTRUMENT_STATUS, {
                instrumentId,
                forceRecheck
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // activate instrument
//     {
//     "instrumentId": "INS-251112114411-30d5ae95-4571",
//     "reason": "Bật lại để dùng"
// }
    activateInstrument: async (activateData) => {
        try {
            const {instrumentId, reason} = activateData;
            if (!instrumentId || !reason) {
                throw new Error('Instrument ID and reason are required for activation.');
            }
            const response = await apiClient.put(API_ENDPOINTS.WAREHOUSE.ACTIVATE_INSTRUMENT, activateData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // deactivate instrument
    deactivateInstrument: async (deactivateData) => {
        try {
            const {instrumentId, reason} = deactivateData;
            if (!instrumentId || !reason) {
                throw new Error('Instrument ID and reason are required for deactivation.');
            }
            const response = await apiClient.put(API_ENDPOINTS.WAREHOUSE.DEACTIVATE_INSTRUMENT, deactivateData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // configure manage 
    getALLConfigurations: async (params) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.WAREHOUSE.GET_ALL_CONFIGURATIONS, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    //modify configuration
    modifyConfiguration: async (configId, configData) => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.WAREHOUSE.MODIFY_CONFIGURATION(configId), configData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getConfigurationDetails: async (configId) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.WAREHOUSE.GET_CONFIGURATION_BY_ID(configId));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // Reagant History for Vendor Supply
    receiveReagantHistory: async (data) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.WAREHOUSE.RECEIVE_REAGANT_HISTORY_FOR_VENDOR_SUPPLY, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getAllReagantHistory: async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.WAREHOUSE.GET_ALL_REAGANT_HISTORY_FOR_VENDOR_SUPPLY);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getReagantHistoryById: async (historyId) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.WAREHOUSE.GET_REAGANT_HISTORY_FOR_VENDOR_SUPPLY_BY_ID(historyId));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getAllTestParameters: async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.WAREHOUSE.GET_ALL_TEST_PARAMETERS);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default warehouseService;