import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifier } from '../contexts/NotifierContext';
import testOrderService from '../services/testOrderService';

export const querykeys = {
    testOrderDetails: (testOrderId) => ['testOrder', testOrderId],
    testOrderItemsDetail: (testOrderId, testOrderItemId) => ['testOrderItems', testOrderId, testOrderItemId],
    listTestOrders: (params) => ['testOrders', params],
    testCatalogs: () => ['testCatalogs'],
    testTypes: (params) => ['testTypes', params],
};

export const useTestOrdersList = (params = {}) => {
    return useQuery({
        queryKey: querykeys.listTestOrders(params),
        queryFn: async () => {
            const response = await testOrderService.getAllTestOrders(params);
            return response;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes - longer cache for list data
        gcTime: 15 * 60 * 1000, // 15 minutes - keep in memory longer
        refetchOnWindowFocus: false, // Don't refetch when window focus
        refetchOnReconnect: true, // Only refetch when network reconnects
        keepPreviousData: true, // Keep previous data when params change
    });

}

export const useTestCatalogs = () => {
    return useQuery({
        queryKey: querykeys.testCatalogs(),
        queryFn: async () => {
            const response = await testOrderService.getAllTestCatalogs();
            return response.data;
        },
        staleTime: 30 * 60 * 1000, // 30 minutes - test catalogs rarely change
        gcTime: 60 * 60 * 1000, // 1 hour - keep cached very long
        refetchOnWindowFocus: false, // Don't refetch when window focus
        refetchOnReconnect: false, // Don't refetch on reconnect for static data
        refetchOnMount: false, // Don't refetch when component mounts if data exists
    });
}

export const useTestOrderById = (testOrderId) => {
    return useQuery({
        queryKey: querykeys.testOrderDetails(testOrderId),
        queryFn: async () => {
            const response = await testOrderService.getTestOrderById(testOrderId);
            return response.data;
        },
        enabled: !!testOrderId, // Only run when testOrderId is provided
        staleTime: 2 * 60 * 1000, // 2 minutes - detail data may change more frequently
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false, // Don't refetch when window focus
        refetchOnReconnect: true, // Refetch on reconnect for important data
    });
}

export const useTestOrderItemById = (testOrderId, testOrderItemId) => {
    return useQuery({
        queryKey: querykeys.testOrderItemsDetail(testOrderId, testOrderItemId),
        queryFn: async () => {
            const response = await testOrderService.viewTestOrderItem(testOrderId, testOrderItemId);
            return response.data;
        },
        enabled: !!testOrderId && !!testOrderItemId, // Only run when both IDs are provided
        staleTime: 3 * 60 * 1000, // 3 minutes - item details don't change often
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false, // Don't refetch when window focus
        refetchOnReconnect: true, // Refetch on reconnect
    });
}

export const useTestOrder = () => {
    const { showNotification } = useNotifier();
    const queryClient = useQueryClient();

    const deleteTestOrderMutation = useMutation({
        mutationFn: async (testOrderId) => {
            const response = await testOrderService.deleteTestOrder(testOrderId);
            return response.data;
        },
        onSuccess: () => {
            showNotification('Xóa đơn xét nghiệm thành công', 'success');
            queryClient.invalidateQueries({ queryKey: ['testOrders'] });
        }
    });

    // thêm các mutation khác nếu cần
    const createTestOrderMutation = useMutation({
        mutationFn: async (data) => {
            const response = await testOrderService.createTestOrder(data);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['testOrders'] });
            showNotification('Tạo đơn xét nghiệm thành công', 'success');
           
        },
        onError: (error) => {
            showNotification(`Tạo đơn xét nghiệm thất bại: ${error.message}`, 'error');
        }
    });

    const createTestTypeMutation  = useMutation({
        mutationFn: async (data) => {
            const response = await testOrderService.createTestType(data);
            return response.data;
        },
        onSuccess: () => {
            showNotification('Tạo loại xét nghiệm thành công', 'success');
        },
        onError: (error) => {
            showNotification(`Tạo loại xét nghiệm thất bại: ${error.message}`, 'error');
        }
    });

    const updateTestOrderMutation = useMutation({
        mutationFn: async ({ testOrderCode, data }) => {
            const response = await testOrderService.updateTestOrderByCode(testOrderCode, data);
            return response.data;
        },
        onSuccess: (response) => {
            showNotification('Cập nhật đơn xét nghiệm thành công', 'success');
            queryClient.invalidateQueries({ queryKey: ['testOrders'] });
            queryClient.invalidateQueries(querykeys.testOrderDetails(response.orderCode));
        },
        onError: (error) => {
            showNotification(`Cập nhật đơn xét nghiệm thất bại: ${error.message}`, 'error');
        }
    });

    const addTestOrderItemMutation = useMutation({
        mutationFn: async ({ testOrderId, testName }) => {
            const response = await testOrderService.addTestOrderItem({ testOrderId, testName });
            return response.data;
        },
        onSuccess: () => {
            showNotification('Thêm mục đơn xét nghiệm thành công', 'success');
            queryClient.invalidateQueries({ queryKey: ['testOrders'] });
            queryClient.invalidateQueries({ queryKey: ['testOrder'] });
        },
        onError: (error) => {
            console.error('Add item mutation error:', error);
            showNotification('Thêm xét nghiệm thất bại', 'error');
        }
    });

    const updateTestOrderItemMutation = useMutation({
        mutationFn: async ({ testOrderId, itemId, data }) => {
            const response = await testOrderService.updateTestOrderItem(testOrderId, itemId, data);
            return response.data;
        },
        onSuccess: () => {
            showNotification('Cập nhật mục đơn xét nghiệm thành công', 'success');
            queryClient.invalidateQueries({ queryKey: ['testOrders'] });
            queryClient.invalidateQueries({ queryKey: ['testOrder'] });
        },
        onError: (error) => {
            showNotification(`Cập nhật mục đơn xét nghiệm thất bại: ${error.message}`, 'error');
        }
    });

    const printTestResultsMutation = useMutation({
        mutationFn: async ({ testOrderId, data }) => {
            const response = await testOrderService.printTestResults(testOrderId, data);
            return response.data;
        },
        onSuccess: async (data) => {
            const jobResponse = await testOrderService.getReportJobStatus(data.jobId);
            console.log('Report job status:', jobResponse);
            const jobData = jobResponse.data;
            if (jobData.status === 'SUCCEEDED' && jobData.resultFile) {
                // Auto download the PDF file
                const downloadUrl = jobData.resultFile.objectKey;
                const fileName = jobData.resultFile.fileName;
                
                downloadFile(downloadUrl, fileName);
                
                showNotification('In kết quả xét nghiệm thành công và tự động tải về', 'success');
            } else if (jobData.status === 'FAILED') {
                showNotification('Tạo file PDF thất bại', 'error');
            } else {
                showNotification('File đang được tạo, vui lòng thử lại sau', 'info');
            }
        },
        onError: (error) => {
            showNotification(`In kết quả xét nghiệm thất bại: ${error.message}`, 'error');
        }
    });

    const exportExcelTestOrdersMutation = useMutation({
        mutationFn: async (data) => {
            const response = await testOrderService.exportExcelTestOrders(data);
            return response.data;
        },
        onSuccess: async(data) => {
            const jobResponse = await testOrderService.getReportJobStatus(data.jobId);
            console.log('Report job status:', jobResponse);
            const jobData = jobResponse.data;
            if (jobData.status === 'SUCCEEDED' && jobData.resultFile) {
                // Auto download the Excel file
                const downloadUrl = jobData.resultFile.objectKey;
                const fileName = jobData.resultFile.fileName;
                downloadFile(downloadUrl, fileName);
                showNotification('Xuất file Excel thành công', 'success');
            } else if (jobData.status === 'FAILED') {
                showNotification('Tạo file Excel thất bại', 'error');
            } else {
                showNotification('File đang được tạo, vui lòng thử lại sau', 'info');
            }
        },
        onError: (error) => {
            showNotification(`Xuất file Excel thất bại: ${error.message}`, 'error');
        }
    });

    return {
        deleteTestOrder: deleteTestOrderMutation.mutateAsync,
        isDeleteLoading: deleteTestOrderMutation.isPending,

        createTestOrder: createTestOrderMutation.mutateAsync,
        isCreateLoading: createTestOrderMutation.isPending,

        createTestType: createTestTypeMutation.mutateAsync,
        isCreateTestTypeLoading: createTestTypeMutation.isPending,

        updateTestOrder: updateTestOrderMutation.mutateAsync,
        isUpdateLoading: updateTestOrderMutation.isPending,

        addTestOrderItem: addTestOrderItemMutation.mutateAsync,
        isAddItemLoading: addTestOrderItemMutation.isPending,

        updateTestOrderItem: updateTestOrderItemMutation.mutateAsync,
        isUpdateItemLoading: updateTestOrderItemMutation.isPending,

        printTestResults: printTestResultsMutation.mutateAsync,
        isPrintTestResultsLoading: printTestResultsMutation.isPending,

        exportExcelTestOrders: exportExcelTestOrdersMutation.mutateAsync,
        isExportExcelTestOrdersLoading: exportExcelTestOrdersMutation.isPending,
    };
}

export const useTestComments = () => {
    const { showNotification } = useNotifier();
    const queryClient = useQueryClient();

    const createCommentMutation = useMutation({
        mutationFn: async ({ targetId, targetType, content }) => {
            const response = await testOrderService.createComment({ targetId, targetType, content });
            return response.data;
        },
        onSuccess: async (data, variables) => {
            const { targetId, targetType } = variables;
            
            if (targetType === 'ORDER') {
                await queryClient.invalidateQueries({
                    queryKey: querykeys.testOrderDetails(targetId),
                    refetchType: 'active'
                });
            } else {
                await queryClient.invalidateQueries({
                    queryKey: ['testOrder'],
                    refetchType: 'active'
                });
            }
            showNotification('Thêm bình luận thành công', 'success');
        },
        onError: (error) => {
            showNotification(`Thêm bình luận thất bại: ${error.message}`, 'error');
        }
    });

    const replyCommentMutation = useMutation({
        mutationFn: async ({ commentId, content, targetId }) => {
            console.log('Replying to commentId:', commentId, 'with content:', content);
            const response = await testOrderService.replyComment(commentId, { content });
            return response.data;
        },
        onSuccess: async (data, variables) => {
            const { targetId } = variables;
            
            await queryClient.invalidateQueries(querykeys.testOrderDetails(targetId));
            showNotification('Trả lời bình luận thành công', 'success');
            queryClient.invalidateQueries({ queryKey: ['testOrder'] });
            
        },
        onError: (error) => {
            showNotification(`Trả lời bình luận thất bại: ${error.message}`, 'error');
        }
    });

    const deleteCommentMutation = useMutation({
        mutationFn: async (commentId) => {
            const response = await testOrderService.deleteComment(commentId);
            return response.data;
        },
        onSuccess: (data, variables) => {
            const { targetId } = variables;
            showNotification('Xóa bình luận thành công', 'success');
            queryClient.invalidateQueries(querykeys.testOrderDetails(targetId));
            queryClient.invalidateQueries({ queryKey: ['testOrder'] });
        },
        onError: (error) => {
            showNotification(`Xóa bình luận thất bại: ${error.message}`, 'error');
        }
    });

    return {
        createComment: createCommentMutation.mutateAsync,
        isCreatingComment: createCommentMutation.isPending,

        replyComment: replyCommentMutation.mutateAsync,
        isReplyingComment: replyCommentMutation.isPending,

        deleteComment: deleteCommentMutation.mutateAsync,
        isDeletingComment: deleteCommentMutation.isPending,
    };

}

// getAll testType
export const useTestTypes = (params = {}) => {
    return useQuery({
        queryKey: querykeys.testTypes(params),
        queryFn: async () => {
            const response = await testOrderService.getAllTestTypes(params);
            return response.data;
        },
        staleTime: 30 * 60 * 1000, // 30 minutes - test types rarely change
        gcTime: 60 * 60 * 1000, // 1 hour - keep cached very long
        refetchOnWindowFocus: false, // Don't refetch when window focus
        refetchOnReconnect: false, // Don't refetch on reconnect for static data
        refetchOnMount: false, // Don't refetch when component mounts if data exists
    });
}

const downloadFile = (url, filename) => {
    // Method 1: Simple approach
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};