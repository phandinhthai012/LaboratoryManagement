import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import warehouseService from '../services/wareHouseService';
import { useNotifier } from '../contexts/NotifierContext';

const querykeys = {
  allInstruments: () => ['warehouse', 'instruments'],
  // instrumentStatus: ['warehouse', 'instrumentStatus'],
  allConfigurations: (params) => ['warehouse', 'configurations', params],
  configurationDetails: (configId) => ['warehouse', 'configuration', configId],
  testParameters: (params) => ['warehouse', 'testParameters', params],
  reagantHistory: (params) => ['warehouse', 'reagantHistory', params],
  reagantHistoryById: (historyId) => ['warehouse', 'reagantHistory', historyId],
  AllVendor: (params) => ['warehouse', 'vendors', params],
  allReagentTypes: () => ['warehouse', 'reagentTypes']
};

// Hook for fetching all instruments
export const useAllInstruments = () => {
  return useQuery({
    queryKey: querykeys.allInstruments(),
    queryFn: () => warehouseService.getAllInstruments(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for checking instrument status (requires data parameter)
export const useCheckInstrumentStatus = (data, options = {}) => {
  return useQuery({
    queryKey: ['warehouse', 'instrumentStatus', data?.instrumentId],
    queryFn: () => warehouseService.checkInstrumentStatus(data),
    enabled: !!data?.instrumentId, // Only run when instrumentId is provided
    refetchInterval: options.autoRefresh ? 30000 : false, // Optional auto-refresh
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Hook for all configurations
export const useAllConfigurations = (params = {}) => {
  return useQuery({
    queryKey: querykeys.allConfigurations(params),
    queryFn: () => warehouseService.getALLConfigurations(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for configuration details
export const useConfigurationDetails = (configId) => {
  return useQuery({
    queryKey: querykeys.configurationDetails(configId),
    queryFn: () => warehouseService.getConfigurationDetails(configId),
    enabled: !!configId, // Only run when configId is provided
    staleTime: 5 * 60 * 1000,
  });
};

export const useReagantHistory = (param = {}) => {
  return useQuery({
    queryKey: querykeys.reagantHistory(param),
    queryFn: () => warehouseService.getAllReagantHistory(param),
    staleTime: 30 * 60 * 1000, // 30 minutes
    keepPreviousData: true, // Giữ dữ liệu cũ khi param thay đổi
  });
}

export const useReagantHistoryById = (historyId) => {
  return useQuery({
    queryKey: querykeys.reagantHistoryById(historyId),
    queryFn: () => warehouseService.getReagantHistoryById(historyId),
    enabled: !!historyId, // Chỉ chạy khi có historyId
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export const useAllReagentTypes = () => {
  return useQuery({
    queryKey: querykeys.allReagentTypes(),
    queryFn: () => warehouseService.getAllReagentTypes(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}


export const useAllVendors = (param = {}) => {
  return useQuery({
    queryKey: querykeys.AllVendor(param),
    queryFn: () => warehouseService.getAllVendors(param),
    staleTime: 30 * 60 * 1000, // 30 minutes
    keepPreviousData: true, // Giữ dữ liệu cũ khi param thay đổi
  });
}


// Main warehouse hook with mutations
export const useWareHouse = () => {
  const { showNotification } = useNotifier();
  const queryClient = useQueryClient();

  // Add instrument mutation
  const addInstrumentMutation = useMutation({
    mutationFn: (instrumentData) => warehouseService.addInstrument(instrumentData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['warehouse', 'instruments'] });
      showNotification('Thêm thiết bị thành công', 'success');
      
    },
    onError: (error) => {
      showNotification(`Thêm thiết bị thất bại: ${error.message}`, 'error');
    },
  });

  // Create configurations mutation
  const createConfigurationsMutation = useMutation({
    mutationFn: (configData) => warehouseService.createConfigurations(configData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['warehouse', 'configurations'] });
      showNotification('Tạo cấu hình thành công', 'success');
    },
    onError: (error) => {
      showNotification(`Tạo cấu hình thất bại: ${error.message}`, 'error');
    },
  });

  // Check instrument status mutation
  const checkInstrumentStatusMutation = useMutation({
    mutationFn: (data) => warehouseService.checkInstrumentStatus(data),
    onSuccess: (data) => {
      showNotification('Kiểm tra trạng thái thiết bị thành công', 'success');
      // Invalidate status queries for this instrument
      queryClient.invalidateQueries({
        // queryKey: ['warehouse', 'instrumentStatus'] 
        queryKey: ['warehouse', 'instrumentStatus', data.instrumentId]
      });
    },
    onError: (error) => {
      showNotification(`Kiểm tra trạng thái thiết bị thất bại: ${error.message}`, 'error');
    },
  });

  // Activate instrument mutation
  const activateInstrumentMutation = useMutation({
    mutationFn: (activateData) => warehouseService.activateInstrument(activateData),
    onSuccess: async () => {
      showNotification('Kích hoạt thiết bị thành công', 'success');
      await queryClient.invalidateQueries({ queryKey: ['warehouse', 'instruments'] });
      // queryClient.invalidateQueries({ queryKey: ['warehouse', 'instrumentStatus'] });
    },
    onError: (error) => {
      showNotification(`Kích hoạt thiết bị thất bại: ${error.message}`, 'error');
    },
  });

  // Deactivate instrument mutation
  const deactivateInstrumentMutation = useMutation({
    mutationFn: (deactivateData) => warehouseService.deactivateInstrument(deactivateData),
    onSuccess: async () => {

      await queryClient.invalidateQueries({ queryKey: ['warehouse', 'instruments'] });
      // await queryClient.invalidateQueries({ queryKey: ['warehouse', 'instrumentStatus'] });
      showNotification('Vô hiệu hóa thiết bị thành công', 'success');
    },
    onError: (error) => {
      showNotification(`Vô hiệu hóa thiết bị thất bại: ${error.message}`, 'error');
    },
  });

  // Modify configuration mutation
  const modifyConfigurationMutation = useMutation({
    mutationFn: ({ configId, configData }) => warehouseService.modifyConfiguration(configId, configData),
    onSuccess: (data, variables) => {
      const { configId } = variables;
      showNotification('Cập nhật cấu hình thành công', 'success');
      queryClient.invalidateQueries({ queryKey: ['warehouse', 'configurations'] });
      queryClient.invalidateQueries(querykeys.configurationDetails(configId));
    },
    onError: (error) => {
      showNotification(`Cập nhật cấu hình thất bại: ${error.message}`, 'error');
    },
  });

  const deleteConfigurationMutation = useMutation({
    mutationFn: (configId) => warehouseService.deleteConfiguration(configId),
    onSuccess: () => {
      showNotification('Xóa cấu hình thành công', 'success');
      queryClient.invalidateQueries({ queryKey: ['warehouse', 'configurations'] });
    },
    onError: (error) => {
      showNotification(`Xóa cấu hình thất bại: ${error.message}`, 'error');
    },
  });
  // ReceiveReagantHistoryForVendorSupply
  const receiveReagantHistoryForVendorSupplyMutation = useMutation({
    mutationFn: (data) => warehouseService.receiveReagantHistory(data),
    onSuccess: async  () => {
      await queryClient.invalidateQueries({ queryKey: ['warehouse', 'reagantHistory'] });
      showNotification('Nhận hóa chất thành công', 'success');
    },
    onError: (error) => {
      showNotification(`Nhận hóa chất thất bại: ${error.message}`, 'error');
    },
  });


  return {
    // Instrument operations
    addInstrument: addInstrumentMutation.mutateAsync,
    isAddingInstrument: addInstrumentMutation.isPending,

    checkInstrumentStatus: checkInstrumentStatusMutation.mutateAsync,
    isCheckingInstrumentStatus: checkInstrumentStatusMutation.isPending,

    activateInstrument: activateInstrumentMutation.mutateAsync,
    isActivatingInstrument: activateInstrumentMutation.isPending,

    deactivateInstrument: deactivateInstrumentMutation.mutateAsync,
    isDeactivatingInstrument: deactivateInstrumentMutation.isPending,

    // Configuration operations
    createConfigurations: createConfigurationsMutation.mutateAsync,
    isCreatingConfigurations: createConfigurationsMutation.isPending,

    modifyConfiguration: modifyConfigurationMutation.mutateAsync,
    isModifyingConfiguration: modifyConfigurationMutation.isPending,

    deleteConfiguration: deleteConfigurationMutation.mutateAsync,
    isDeletingConfiguration: deleteConfigurationMutation.isPending,

    // Receive Reagant History
    receiveReagantHistoryForVendorSupply: receiveReagantHistoryForVendorSupplyMutation.mutateAsync,
    isReceivingReagantHistoryForVendorSupply: receiveReagantHistoryForVendorSupplyMutation.isPending,
  };
};

export const useAllTestParameters = (param = {}) => {
  return useQuery({
    queryKey: querykeys.testParameters(param),
    queryFn: () => warehouseService.getAllTestParameters(param),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}