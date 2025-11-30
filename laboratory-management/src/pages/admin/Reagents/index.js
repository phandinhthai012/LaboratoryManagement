import React, { useMemo, useState } from 'react';
import {
  FaSearch, FaDownload, FaCalendarAlt, FaFilter, FaChartBar, FaChartLine,
  FaVials, FaDollarSign, FaUsers, FaCheckCircle, FaHospital, FaClock,
  FaFileAlt, FaEye, FaPlus, FaSpinner, FaExclamationTriangle, FaRedo,
  FaTruck, FaUndo, FaBox
} from 'react-icons/fa';
import StatisticCard from '../Devices/component/StatisticCard';
import { MdTrendingUp, MdPercent } from 'react-icons/md';
import MainLayout from '../../../layouts/MainLayout';
import { formatDate } from '../../../utils/helpers';
import { useAuth } from '../../../contexts/AuthContext';
import { useReagantHistory } from '../../../hooks/useWareHouse';
import ErrorFetchData from '../../../components/ErrorFetchData';
import CreateReagentModal from './Component/CreateReagentModal';
import ViewReagentModel from './Component/ViewReagentModel';
const ReagentsPage = () => {
  const { user } = useAuth();
  const today = new Date();
  const [params, setParams] = useState({
    page: 0,
    size: 5,
    sort: 'createdAt,desc',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReagent, setSelectedReagent] = useState(null);

  const { data: reagentHistoryRes, isLoading: isReagentHistoryLoading, isError: isReagentHistoryError, refetch } = useReagantHistory(params);
  
  const reagentHistoryData = useMemo(() => {
    return reagentHistoryRes?.data?.content || [];
  }, [reagentHistoryRes]);
  
  const paginationParamsInfo = useMemo(() => {
    return {
      totalElements: reagentHistoryRes?.data?.totalElements || 0,
      totalPages: reagentHistoryRes?.data?.totalPages || 0,
      currentPage: reagentHistoryRes?.data?.page || 0,
      size: reagentHistoryRes?.data?.size || 10,
      empty: !reagentHistoryRes?.data?.content?.length,
      last: reagentHistoryRes?.data?.last || false,
      first: reagentHistoryRes?.data?.page === 0
    };
  }, [reagentHistoryRes]);

  // Status mapping with colors and icons
  const getStatusInfo = (status) => {
    switch (status) {
      case 'RECEIVED':
        return {
          label: 'Đã Nhận',
          color: 'bg-green-100 text-green-800',
          icon: <FaCheckCircle className="w-3 h-3" />
        };
      case 'PARTIAL_SHIPMENT':
        return {
          label: 'Nhận Một Phần',
          color: 'bg-yellow-100 text-yellow-800',
          icon: <FaTruck className="w-3 h-3" />
        };
      case 'RETURNED':
        return {
          label: 'Đã Trả Lại',
          color: 'bg-red-100 text-red-800',
          icon: <FaUndo className="w-3 h-3" />
        };
      default:
        return {
          label: status || 'N/A',
          color: 'bg-gray-100 text-gray-800',
          icon: <FaBox className="w-3 h-3" />
        };
    }
  };

  // Filter data based on search and status
  const filteredData = useMemo(() => {
    let filtered = reagentHistoryData;
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.reagentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reagentCatalogNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lotNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    return filtered;
  }, [reagentHistoryData, searchTerm, statusFilter]);

  // Statistics
  const statistics = useMemo(() => {
    const total = reagentHistoryData.length;
    const received = reagentHistoryData.filter(item => item.status === 'RECEIVED').length;
    const partialShipment = reagentHistoryData.filter(item => item.status === 'PARTIAL_SHIPMENT').length;
    const returned = reagentHistoryData.filter(item => item.status === 'RETURNED').length;
    const totalQuantity = reagentHistoryData.reduce((sum, item) => sum + (item.quantityReceived || 0), 0);

    return { total, received, partialShipment, returned, totalQuantity };
  }, [reagentHistoryData]);

  const handleViewReagent = (reagentId) => {
    setSelectedReagent(reagentId);
    setShowViewModal(true);
  };

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const handlePageChange = (newPage) => {
    setParams(prev => ({ ...prev, page: newPage }));
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản Lý Hóa Chất</h1>
              <p className="text-gray-600">Quản lý lịch sử nhập và theo dõi hóa chất trong hệ thống</p>
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-semibold">{user.roleName}</span> • {formatDate(today)}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
          <StatisticCard
            title="Tổng Số Lô Hàng"
            value={statistics.total}
            icon={FaVials}
            bgColor="bg-blue-50"
            textColor="text-blue-600"
          />
          <StatisticCard
            title="Đã Nhận"
            value={statistics.received}
            icon={FaCheckCircle}
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
          <StatisticCard
            title="Nhận Một Phần"
            value={statistics.partialShipment}
            icon={FaTruck}
            bgColor="bg-yellow-50"
            textColor="text-yellow-600"
          />
          <StatisticCard
            title="Đã Trả Lại"
            value={statistics.returned}
            icon={FaUndo}
            bgColor="bg-red-50"
            textColor="text-red-600"
          />
          <StatisticCard
            title="Tổng Số Lượng"
            value={`${statistics.totalQuantity.toLocaleString()}`}
            icon={FaBox}
            bgColor="bg-purple-50"
            textColor="text-purple-600"
          />
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-64">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm hóa chất, mã catalog, nhà cung cấp..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm min-w-44"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="RECEIVED">Đã Nhận</option>
                  <option value="PARTIAL_SHIPMENT">Nhận Một Phần</option>
                  <option value="RETURNED">Đã Trả Lại</option>
                </select>
              </div>

              {/* Page Size Selection */}
              <div className="relative">
                <select
                  value={params.size}
                  onChange={(e) => setParams(prev => ({ ...prev, size: Number(e.target.value), page: 0 }))}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm"
                >
                  <option value={5}>5/trang</option>
                  <option value={10}>10/trang</option>
                  <option value={20}>20/trang</option>
                  <option value={50}>50/trang</option>
                  <option value={100}>100/trang</option>
                </select>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => {
                  setParams(prev => ({ ...prev, page: 0 }));
                  refetch();
                }}
                disabled={isReagentHistoryLoading}
                className="flex items-center gap-2 px-3 py-2.5 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaRedo className={`w-4 h-4 ${isReagentHistoryLoading ? 'animate-spin' : ''}`} />
              </button>

              {/* Create New Button */}
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <FaPlus className="w-4 h-4" />
                Thêm Mới
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">
              Danh Sách Lịch Sử Hóa Chất ({filteredData.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            {/* Loading State */}
            {isReagentHistoryLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2 text-gray-600">
                  <FaSpinner className="w-5 h-5 animate-spin" />
                  <span>Đang tải dữ liệu...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {isReagentHistoryError && (
              <div className="flex items-center justify-center py-12">
                <ErrorFetchData 
                  onRetry={() => refetch()}
                  message="Không thể tải dữ liệu hóa chất"
                />
              </div>
            )}

            {/* Data Table */}
            {!isReagentHistoryLoading && !isReagentHistoryError && (
              <>
                {filteredData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <FaExclamationTriangle className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không có dữ liệu</h3>
                    <p className="text-gray-500 text-center">
                      {searchTerm || statusFilter ? 'Không tìm thấy kết quả phù hợp với bộ lọc' : 'Chưa có lịch sử hóa chất nào'}
                    </p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thông Tin Hóa Chất
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nhà Cung Cấp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số Lượng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng Thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày Nhận
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hành Động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.map((reagent) => {
                        const statusInfo = getStatusInfo(reagent.status);
                        return (
                          <tr key={reagent.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{reagent.reagentName}</div>
                                  <div className="text-sm text-gray-500">
                                    Mã: {reagent.reagentCatalogNumber} | Lot: {reagent.lotNumber}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{reagent.vendorName}</div>
                              <div className="text-sm text-gray-500">PO: {reagent.poNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {reagent.quantityReceived?.toLocaleString()} {reagent.unitOfMeasure}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                {statusInfo.icon}
                                {statusInfo.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDateTime(reagent.receiptDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleViewReagent(reagent.id)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                <FaEye className="w-4 h-4" />
                              </button>
                              <ViewReagentModel
                                isOpen={!!selectedReagent}
                                onClose={() => {
                                  setShowViewModal(false);
                                  setSelectedReagent(null);
                                }}
                                reagentId={selectedReagent}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>

          {/* Pagination */}
          {!isReagentHistoryLoading && !isReagentHistoryError && paginationParamsInfo.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{paginationParamsInfo.currentPage * paginationParamsInfo.size + 1}</span> đến{' '}
                <span className="font-medium">
                  {Math.min((paginationParamsInfo.currentPage + 1) * paginationParamsInfo.size, paginationParamsInfo.totalElements)}
                </span>{' '}
                trong <span className="font-medium">{paginationParamsInfo.totalElements}</span> kết quả
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(paginationParamsInfo.currentPage - 1)}
                  disabled={paginationParamsInfo.first}
                  className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Trang {paginationParamsInfo.currentPage + 1} / {paginationParamsInfo.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(paginationParamsInfo.currentPage + 1)}
                  disabled={paginationParamsInfo.last}
                  className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tiếp
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modals would go here */}
        {/* TODO: Add Create Modal */}
        <CreateReagentModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            refetch();
          }}
        />
        {/* TODO: Add View Modal */}
      </div>
    </MainLayout>
  );
};
export default ReagentsPage;