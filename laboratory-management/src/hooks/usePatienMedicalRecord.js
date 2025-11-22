import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifier } from '../contexts/NotifierContext';
import patientService from '../services/patientService';
import { useAuth } from '../contexts/AuthContext';


const querykeys = {
    patientMedicalRecordDetails: (patientId) => ['patientMedicalRecord', patientId],
    listPatientMedicalRecords: (params) => ['patientMedicalRecords', params],
};


export const usePatientMedicalRecordById = (patientId) => {
    return useQuery({
        queryKey: querykeys.patientMedicalRecordDetails(patientId),
        queryFn: async () => {
            const response = await patientService.getPatientById(patientId);
            return response.data;
        },
        enabled: !!patientId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const usePatientMedicalRecords = (params = {}) => {
    const { user } = useAuth();
    return useQuery({
        queryKey: querykeys.listPatientMedicalRecords(params),
        queryFn: async () =>{
            const response = await patientService.getAllPatientMedicalRecords(params);
            return response.data;
        },
        enabled: !!user,
        staleTime: 30 * 1000, // 30 seconds
        cacheTime: 5 * 60 * 1000, // 5 minutes
        keepPreviousData: true, // Keep previous data when params change
    });
}

export const useCreatePatientMedicalRecord = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotifier();

    return useMutation({
        mutationFn: async (data) => {
            const response = await patientService.createPatientMedicalRecord(data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patientMedicalRecords'] });
            showNotification('Tạo hồ sơ y tế thành công', 'success');
        },
        onError: (error) => {
            console.error('Error creating patient medical record:', error);
            showNotification(error?.response?.data?.message || 'Tạo hồ sơ y tế thất bại', 'error');
        },
    });
};

export const useUpdatePatientMedicalRecord = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotifier();

    return useMutation({
        mutationFn: async ({ recordId, updatedData }) => {
            const response = await patientService.updatePatientMedicalRecord(recordId, updatedData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patientMedicalRecords'] });
            showNotification('Cập nhật hồ sơ y tế thành công', 'success');
        },
        onError: (error) => {
            console.error('Error updating patient medical record:', error);
            showNotification(error?.response?.data?.message || 'Cập nhật hồ sơ y tế thất bại', 'error');
        },
    });
};
export const useDeletePatientMedicalRecord = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotifier();

    return useMutation({
        mutationFn: async (id) => {
            const response = await patientService.deletePatientMedicalRecord(id);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patientMedicalRecords'] });
            showNotification('Xóa hồ sơ y tế thành công', 'success');
        },
        onError: (error) => {
            console.error('Error deleting patient medical record:', error);
            showNotification(error?.response?.data?.message || 'Xóa hồ sơ y tế thất bại', 'error');
        },
    });
};