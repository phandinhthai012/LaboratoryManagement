import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../config/api";


const patientService = {
    // Create a new patient medical record
    createPatientMedicalRecord: async (recordData) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.PATIENTS.CREATE_PATIENT_MEDICAL_RECORD, recordData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // Update an existing patient medical record
    updatePatientMedicalRecord: async (recordId, updatedData) => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.PATIENTS.UPDATE_PATIENT_MEDICAL_RECORD(recordId), updatedData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // Delete a patient medical record 
    deletePatientMedicalRecord: async (recordId) => {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.PATIENTS.DELETE_PATIENT_MEDICAL_RECORD(recordId));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // Get all patient medical records with optional query parameters
    getAllPatientMedicalRecords: async (queryParams) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.PATIENTS.GET_ALL_PATIENT_MEDICAL_RECORDS, { params: queryParams });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // Get patient medical record by ID medicalRecordId
    getPatientById: async (patientId) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.PATIENTS.GET_PATIENT_BY_ID(patientId));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getPatientByCode: async (patientCode) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.PATIENTS.GET_PATIENT_BY_CODE(patientCode));
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default patientService;