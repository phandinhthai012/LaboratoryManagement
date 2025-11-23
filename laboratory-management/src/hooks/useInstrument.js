import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import instrumentService from '../services/instrumentService';
import { useNotifier } from '../contexts/NotifierContext';
import { querykeys } from './useTestOrder';



export const useInitiateSampleAnalysisWithId = (testOrderId) => {
    const { showNotification } = useNotifier();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const response = await instrumentService.initiateSampleAnalysis(data);
            return response.data;
        },
        onSuccess: async (data, variables) => {
            console.log('Sample analysis initiated:', data, variables);
            // Sử dụng testOrderId được truyền vào từ parameter
            if (testOrderId) {
                await queryClient.invalidateQueries({
                    queryKey: querykeys.testOrderDetails(testOrderId)
                });
                console.log('Invalidated query for testOrderId:', testOrderId);
            }
            showNotification('Khởi tạo phân tích mẫu thành công', 'success');

            await queryClient.invalidateQueries({ queryKey: ['testOrders'] });
        },
        onError: (error) => {
            showNotification(`Khởi tạo phân tích mẫu thất bại: ${error.message}`, 'error');
        },
    });
};

const useInstrument = () => {
    const { showNotification } = useNotifier();
    const queryClient = useQueryClient();
    // Mutation to add a new instrument
    // initiateSampleAnalysis
    const initiateSampleAnalysis = useMutation({
        mutationFn: async (data) => {
            const response = await instrumentService.initiateSampleAnalysis(data);
            return response.data;
        },
        onSuccess: async (data) => {
            showNotification('Khởi tạo phân tích mẫu thành công', 'success');
            await queryClient.invalidateQueries({ queryKey: ['testOrders'] });
        },
        onError: (error) => {
            showNotification(`Khởi tạo phân tích mẫu thất bại: ${error.message}`, 'error');
        },
    });
    return {
        initiateSampleAnalysis: initiateSampleAnalysis.mutateAsync,
        isLoadingInitiateSampleAnalysis: initiateSampleAnalysis.isLoading,
    };
}

export default useInstrument;