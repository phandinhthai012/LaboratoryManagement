import { useQuery } from '@tanstack/react-query';
import mornitoringService from '../services/mornitoringService';

const querykeys = {
    eventLogs: (params) => ['eventLogs', params],
};

export const useEventLogs = (params = {}) => {
    return useQuery({
        queryKey: querykeys.eventLogs(params),
        queryFn: async () => {
            const response = await mornitoringService.getAllEventLogs(params);
            return response.data;
        },
        enabled: true, // Luôn enable query
        staleTime: 30000, // Data được coi là fresh trong 30s
        cacheTime: 300000, // Cache data trong 5 phút
        refetchOnWindowFocus: false, // Không refetch khi focus window
        retry: 2, // Retry 2 lần nếu fail
        onError: (error) => {
            console.error('Error fetching event logs:', error);
        },
    });
};