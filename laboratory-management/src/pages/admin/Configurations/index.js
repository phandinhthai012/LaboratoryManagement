import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { FaPlus, FaCogs, FaCheckCircle, FaTimesCircle, FaServer, FaFlask, FaShieldAlt, FaBell } from 'react-icons/fa';
import MainLayout from '../../../layouts/MainLayout';
import StatisticCard from '../Devices/component/StatisticCard';
import SystemConfigurationsTab from './component/SystemConfigurationsTab';
import TestParametersTab from './component/TestParametersTab';
import { useAuth } from '../../../contexts/AuthContext';
import { formatDate } from '../../../utils/helpers';
import { useAllConfigurations,useAllTestParameters } from '../../../hooks/useWareHouse';

const Configurations = () => {
  const { user } = useAuth();
  const today = new Date();
  const [activeTab, setActiveTab] = useState('system');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt,desc');


  // API parameters
  const [configParams, setConfigParams] = useState({
    page: 0,
    size: 10,
    sort: ['createdAt,desc'],
    search: '',
    startDate: null,
    endDate: null
  });
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setConfigParams(prev => ({
        ...prev,
        search: searchTerm,
        page: 0 // Reset to first page when searching
      }));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    setConfigParams(prev => ({
      ...prev,
      sort: [sortBy],
      page: 0 // Reset to first page when sorting
    }));
  }, [sortBy]);


  const { data: configurationsResponse, isLoading: isLoadingConfig, error: errorConfig } = useAllConfigurations(configParams);
  const {data: parametersResponse, isLoading: isLoadingParams, error: errorParams} = useAllTestParameters();
  console.log('parametersResponse',parametersResponse);
  const systemConfigs = useMemo(() => {
    return configurationsResponse?.data?.values || [];
  }, [configurationsResponse?.data?.values]);
  
  const parametersValues = useMemo(() => {
    return parametersResponse?.data?.values || [];
  }, [parametersResponse?.data?.values]);

  const paginationConfigInfo = useMemo(() => ({
    totalElements: configurationsResponse?.data?.totalElements || 0,
    totalPages: configurationsResponse?.data?.totalPages || 0,
    currentPage: configurationsResponse?.data?.page || 0,
    size: configurationsResponse?.data?.size || 10,
    empty: !configurationsResponse?.data?.values?.length,
    last: configurationsResponse?.data?.last || false,
    first: configurationsResponse?.data?.page === 0
  }), [configurationsResponse?.data]);

  const paginationParamsInfo = useMemo(() => ({
    totalElements: parametersResponse?.data?.totalElements || 0,
    totalPages: parametersResponse?.data?.totalPages || 0,
    currentPage: parametersResponse?.data?.page || 0,
    size: parametersResponse?.data?.size || 10,
    empty: !parametersResponse?.data?.values?.length,
    last: parametersResponse?.data?.last || false,
    first: parametersResponse?.data?.page === 0
  }), [parametersResponse?.data]);


  // Calculate statistics
  const stats = useMemo(() => {
    if (activeTab === 'system') {
      const activeConfigs = systemConfigs.filter(c => !c.isDeleted);
      const inactiveConfigs = systemConfigs.filter(c => c.isDeleted);
      
      // Group by dataType
      const dataTypeGroups = systemConfigs.reduce((acc, config) => {
        const type = config.dataType;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      return {
        total: systemConfigs.length,
        active: activeConfigs.length,
        inactive: inactiveConfigs.length,
        jsonConfigs: dataTypeGroups['JSON'] || 0,
        stringConfigs: dataTypeGroups['STRING'] || 0,
        booleanConfigs: dataTypeGroups['BOOLEAN'] || 0
      };
    } else {
      // Test parameters statistics
      const activeParams = parametersValues.filter(p => !p.isDeleted);
      const inactiveParams = parametersValues.filter(p => p.isDeleted);
      
      // Group by categories (you can add more grouping logic based on your data structure)
      const paramsWithRanges = parametersValues.filter(p => p.parameterRanges && p.parameterRanges.length > 0);
      
      return {
        total: parametersValues.length,
        active: activeParams.length,
        inactive: inactiveParams.length,
        withRanges: paramsWithRanges.length,
        withoutRanges: parametersValues.length - paramsWithRanges.length,
        totalRanges: parametersValues.reduce((acc, p) => acc + (p.parameterRanges?.length || 0), 0)
      };
    }
  }, [activeTab, systemConfigs, parametersValues]);

  // Pagination handlers
  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);
  
  const handleSortChange = useCallback((sort) => {
    setSortBy(sort);
  }, []);
  
  const handlePageChange = useCallback((newPage) => {
    setConfigParams(prev => ({
      ...prev,
      page: newPage
    }));
  }, []);

  const handlePageSizeChange = useCallback((newSize) => {
    setConfigParams(prev => ({
      ...prev,
      size: parseInt(newSize),
      page: 0 // Reset to first page when changing page size
    }));
  }, []);


  if (errorConfig || errorParams) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-md">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h2>
              <p className="text-gray-600 mb-4">
                {errorConfig?.message || 'Không thể tải danh sách cấu hình'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Cấu hình</h1>
              <p className="text-gray-600">Quản lý cấu hình hệ thống và thông số xét nghiệm</p>
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-semibold">{user.roleName}</span> • {formatDate(today)}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatisticCard
            title={activeTab === 'system' ? 'Tổng Cấu hình' : 'Tổng Thông số'}
            value={stats.total}
            icon={FaCogs}
            iconColor="text-blue-400"
            valueColor="text-blue-600"
          />
          <StatisticCard
            title="Đang hoạt động"
            value={stats.active}
            icon={FaCheckCircle}
            iconColor="text-green-400"
            valueColor="text-green-600"
          />
          <StatisticCard
            title="Không hoạt động"
            value={stats.inactive}
            icon={FaTimesCircle}
            iconColor="text-red-400"
            valueColor="text-red-600"
          />
          <StatisticCard
            title={activeTab === 'system' ? 'Loại JSON' : 'Có khoảng tham chiếu'}
            value={activeTab === 'system' ? stats.jsonConfigs : stats.withRanges}
            icon={activeTab === 'system' ? FaServer : FaFlask}
            iconColor="text-purple-400"
            valueColor="text-purple-600"
          />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Danh Sách Cấu Hình</h2>
                <p className="text-sm text-gray-600">Quản lý và theo dõi tất cả cấu hình trong hệ thống</p>
              </div>
              {activeTab === 'system' && (
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors">
                  <FaPlus className="w-4 h-4" />
                  Thêm Cấu hình mới
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-4">
              <nav className="flex space-x-8">
                {[{ id: 'system', label: 'Cấu hình Hệ thống' }, { id: 'test', label: 'Thông số Xét nghiệm' }].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'system' ? (
            <SystemConfigurationsTab
              filteredData={systemConfigs}
              searchTerm={searchTerm}
              sortBy={sortBy}
              onSearchChange={handleSearchChange}
              onSortChange={handleSortChange}
              paginationInfo={paginationConfigInfo}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              isLoading={isLoadingConfig}
            />
          ) : (
            <TestParametersTab
              data ={parametersValues}
              isLoading={isLoadingParams}
              paginationInfo={paginationParamsInfo}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Configurations;