import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for handling API calls with loading states and error handling
 * 
 * @returns {Object} - API utilities
 * @returns {boolean} loading - Current loading state
 * @returns {string|null} error - Current error message
 * @returns {Function} callApi - Function to call API
 * @returns {Function} clearError - Function to clear current error
 * @returns {Function} cancel - Function to cancel ongoing request
 */
export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    /**
     * Call API function with automatic loading and error handling
     * 
     * @param {Function} apiFunction - The API service function to call
     * @param {...any} args - Arguments to pass to the API function
     * @returns {Promise} - API response
     */
    const callApi = useCallback(async (apiFunction, ...args) => {
        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();
        
        setLoading(true);
        setError(null);
        
        try {
            // Call the API function with abort signal
            const result = await apiFunction(...args, {
                signal: abortControllerRef.current.signal
            });
            
            // Reset abort controller after successful request
            abortControllerRef.current = null;
            
            return result;
        } catch (err) {
            // Don't set error if request was cancelled
            if (err.name === 'AbortError') {
                console.log('Request was cancelled');
                return null;
            }
            
            const errorMessage = err.response?.data?.message || 
                               err.message || 
                               'An unexpected error occurred';
            
            setError(errorMessage);
            
            // Re-throw error for component to handle if needed
            const enhancedError = new Error(errorMessage);
            enhancedError.originalError = err;
            enhancedError.status = err.response?.status;
            enhancedError.data = err.response?.data;
            throw enhancedError;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Clear current error state
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Cancel ongoing API request
     */
    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setLoading(false);
    }, []);

    return {
        loading,
        error,
        callApi,
        clearError,
        cancel
    };
};

/**
 * Hook for handling multiple API calls with individual states
 * Useful when you need to track multiple API calls separately
 * 
 * @returns {Object} - Multiple API utilities
 */
export const useMultipleApi = () => {
    const [states, setStates] = useState({});

    const callApi = useCallback(async (key, apiFunction, ...args) => {
        setStates(prev => ({
            ...prev,
            [key]: { ...prev[key], loading: true, error: null }
        }));

        try {
            const result = await apiFunction(...args);
            
            setStates(prev => ({
                ...prev,
                [key]: { ...prev[key], loading: false, data: result }
            }));
            
            return result;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'An error occurred';
            
            setStates(prev => ({
                ...prev,
                [key]: { ...prev[key], loading: false, error: errorMessage }
            }));
            
            throw error;
        }
    }, []);

    const clearError = useCallback((key) => {
        setStates(prev => ({
            ...prev,
            [key]: { ...prev[key], error: null }
        }));
    }, []);

    const getState = useCallback((key) => {
        return states[key] || { loading: false, error: null, data: null };
    }, [states]);

    return {
        states,
        callApi,
        clearError,
        getState
    };
};

/**
 * Hook for paginated API calls
 * Automatically handles pagination state
 * 
 * @param {Function} apiFunction - API function that supports pagination
 * @param {Object} initialFilters - Initial filter parameters
 * @returns {Object} - Pagination utilities
 */
export const usePaginatedApi = (apiFunction, initialFilters = {}) => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10
    });
    const [filters, setFilters] = useState(initialFilters);
    const { loading, error, callApi, clearError } = useApi();

    const loadData = useCallback(async (page = 1, newFilters = {}) => {
        try {
            const mergedFilters = { ...filters, ...newFilters };
            const result = await callApi(
                apiFunction, 
                page, 
                pagination.itemsPerPage, 
                mergedFilters
            );

            if (result?.success) {
                setData(result.data);
                setPagination(result.pagination || {});
                setFilters(mergedFilters);
            }

            return result;
        } catch (error) {
            console.error('Failed to load paginated data:', error);
            throw error;
        }
    }, [apiFunction, callApi, filters, pagination.itemsPerPage]);

    const nextPage = useCallback(() => {
        if (pagination.currentPage < pagination.totalPages) {
            loadData(pagination.currentPage + 1);
        }
    }, [loadData, pagination.currentPage, pagination.totalPages]);

    const prevPage = useCallback(() => {
        if (pagination.currentPage > 1) {
            loadData(pagination.currentPage - 1);
        }
    }, [loadData, pagination.currentPage]);

    const goToPage = useCallback((page) => {
        if (page >= 1 && page <= pagination.totalPages) {
            loadData(page);
        }
    }, [loadData, pagination.totalPages]);

    const refresh = useCallback(() => {
        loadData(pagination.currentPage, filters);
    }, [loadData, pagination.currentPage, filters]);

    const search = useCallback((newFilters) => {
        loadData(1, newFilters);
    }, [loadData]);

    return {
        data,
        pagination,
        filters,
        loading,
        error,
        loadData,
        nextPage,
        prevPage,
        goToPage,
        refresh,
        search,
        clearError
    };
};

export default useApi;