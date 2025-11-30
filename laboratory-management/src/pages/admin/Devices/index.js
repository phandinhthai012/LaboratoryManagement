import React, { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaEye, FaCog, FaTools, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaSync, FaPlay, FaPause, FaPlus } from 'react-icons/fa';
import MainLayout from '../../../layouts/MainLayout';
import { useAllInstruments, useWareHouse } from '../../../hooks/useWareHouse';
import StatisticCard from './component/StatisticCard';
import ModalAddInstrument from './component/ModalAddInstrument';
import ModalCheckStatus from './component/ModalCheckStatus';
import ModalActivateDeactivate from './component/ModalActivateDeactivate';
const Devices = () => {
  const { data: instrumentsResponse, isLoading, error, refetch } = useAllInstruments();
  const { 
    addInstrument, 
    isAddingInstrument,
    checkInstrumentStatus,
    isCheckingInstrumentStatus,
    activateInstrument,
    isActivatingInstrument,
    deactivateInstrument,
    isDeactivatingInstrument,
  } = useWareHouse();
  // Removed API calls - using alerts instead

  // Get instruments from API response
  const instruments = instrumentsResponse ? instrumentsResponse.data : [];
  console.log('Instruments from API:', instruments);
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');
  const [protocolFilter, setProtocolFilter] = useState('Tất cả giao thức');
  const [showAddModal, setShowAddModal] = useState(false);

  const [showDetails, setShowDetails] = useState({});
  // pagination (client-side)
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // check status modal state
  const [checkStatusModalOpen, setCheckStatusModalOpen] = useState(false);
  const [selectedInstrumentStatus, setSelectedInstrumentStatus] = useState({
      instrumentId: null,
      instrumentName: null,
  });

  // activate/deactivate modal state
  const [activateDeactivateModalOpen, setActivateDeactivateModalOpen] = useState(false);
  const [selectedInstrumentActivateDeactivate, setSelectedInstrumentActivateDeactivate] = useState({
      instrumentId: null,
      instrumentName: null,
      actionType: null
  }); 


  // Calculate statistics from API data
  const totalDevices = instruments.length;
  const readyDevices = instruments.filter(device => device.status === 'READY').length;
  const errorDevices = instruments.filter(device => device.status === 'ERROR').length;
  const inactiveDevices = instruments.filter(device => device.status === 'INACTIVE').length;
  const maintenanceDevices = instruments.filter(device => device.status === 'MAINTENANCE').length;
  const processingDevices = instruments.filter(device => device.status === 'PROCESSING').length;

  // Protocol types from data
  const protocolTypes = [
    ...new Set(instruments.map(instrument => instrument.protocolType))
  ];

  // Get status color and icon
  const getStatusColor = (status) => {
    switch (status) {
      case 'READY': return 'bg-green-100 text-green-800 border-green-200';
      case 'ERROR': return 'bg-red-100 text-red-800 border-red-200';
      case 'INACTIVE': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'READY': return <FaCheckCircle />;
      case 'ERROR': return <FaExclamationTriangle />;
      case 'INACTIVE': return <FaTimesCircle />;
      case 'MAINTENANCE': return <FaTools />;
      case 'PROCESSING': return <FaCog className="animate-spin" />;
      default: return <FaCog />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'READY': return 'Sẵn sàng';
      case 'ERROR': return 'Lỗi';
      case 'INACTIVE': return 'Không hoạt động';
      case 'MAINTENANCE': return 'Bảo trì';
      case 'PROCESSING': return 'Đang xử lý';
      default: return 'Không xác định';
    }
  };

  // Filter instruments based on search and filters
  const filteredInstruments = instruments.filter(instrument => {
    const matchesSearch =
      instrument.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instrument.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instrument.ipAddress.includes(searchTerm) ||
      instrument.protocolType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'Tất cả trạng thái' || instrument.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // reset page when filters or search change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, statusFilter, protocolFilter]);

  // paginated instruments (client-side)
  const paginatedInstruments = useMemo(() => {
    const start = currentPage * pageSize;
    return filteredInstruments.slice(start, start + pageSize);
  }, [filteredInstruments, currentPage, pageSize]);

  const totalItems = filteredInstruments.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const handleActivateInstrument = (instrumentId) => {
    alert(`Đang kích hoạt thiết bị: ${instrumentId}`);
  };

  const handleDeactivateInstrument = (instrumentId) => {
    alert(`Đang tạm dừng thiết bị: ${instrumentId}`);
  };

  const toggleDetails = (instrumentId) => {
    setShowDetails(prev => ({
      ...prev,
      [instrumentId]: !prev[instrumentId]
    }));
  };

  // handle check status
  const openCheckStatusModal = (instrumentId, instrumentName) => {
    setSelectedInstrumentStatus({ instrumentId, instrumentName });
    setCheckStatusModalOpen(true);
  };
  const closeCheckStatusModal = () => {
    setCheckStatusModalOpen(false);
    setSelectedInstrumentStatus({
      instrumentId: null,
      instrumentName: null
    });
  };
  const handleSubmitCheckStatus = async (data) => {
    if (!data.instrumentId) return;
    try {
      const response = await checkInstrumentStatus(data);
      return response;
    } catch (error) {
      console.error('Error checking instrument status:', error);
    }
  };

  // handle activate/deactivate modal
  const openActivateDeactivateModal = (instrumentId, instrumentName, actionType) => {
    setSelectedInstrumentActivateDeactivate({
      instrumentId: instrumentId,
      instrumentName: instrumentName,
      actionType: actionType
    });
    setActivateDeactivateModalOpen(true);
  };
  const closeActivateDeactivateModal = () => {
    setActivateDeactivateModalOpen(false);
    setSelectedInstrumentActivateDeactivate({
      instrumentId: null,
      instrumentName: null,
      actionType: null
    });
  };
  const handleSubmitActivateDeactivate = async (data) => {
    if (!data.instrumentId || !data.reason || !data.actionType) return;
    try {
      if (data.actionType === 'activate') {
        await activateInstrument({
          instrumentId: data.instrumentId,
          reason: data.reason
        });
      } else if (data.actionType === 'deactivate') {
        await deactivateInstrument({
          instrumentId: data.instrumentId,
          reason: data.reason
        });
      }
    } catch (error) {
      console.error(`Error ${data.actionType} instrument:`, error);
    }
  }

  // Status options for filter
  const statusOptions = ['Tất cả trạng thái', 'READY', 'ERROR', 'INACTIVE', 'MAINTENANCE', 'PROCESSING'];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span>Đang tải dữ liệu thiết bị...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <FaExclamationTriangle className="mx-auto h-12 w-12 mb-2" />
            <h3 className="text-lg font-medium">Lỗi tải dữ liệu</h3>
            <p className="text-sm text-gray-500 mt-1">
              {error?.message || 'Không thể tải danh sách thiết bị'}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản Lý Thiết Bị</h1>
              <p className="text-gray-600">Quản lý thiết bị xét nghiệm, bảo trì và theo dõi trạng thái</p>
            </div>
            <div className="flex items-center gap-4">

              <div className="text-sm text-gray-500">
                <span className="font-semibold">Quản trị viên</span> • Thứ Sáu, 27 tháng 9, 2025
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <StatisticCard
            title="Tổng Thiết Bị"
            value={totalDevices}
            icon={FaCog}
            iconColor="text-gray-400"
            valueColor="text-gray-900"
          />

          <StatisticCard
            title="Sẵn sàng"
            value={readyDevices}
            icon={FaCheckCircle}
            iconColor="text-green-400"
            valueColor="text-green-600"
          />

          <StatisticCard
            title="Lỗi"
            value={errorDevices}
            icon={FaExclamationTriangle}
            iconColor="text-red-400"
            valueColor="text-red-600"
          />

          <StatisticCard
            title="Không hoạt động"
            value={inactiveDevices}
            icon={FaTimesCircle}
            iconColor="text-gray-400"
            valueColor="text-gray-600"
          />

          <StatisticCard
            title="Bảo trì"
            value={maintenanceDevices}
            icon={FaTools}
            iconColor="text-yellow-400"
            valueColor="text-yellow-600"
          />

          <StatisticCard
            title="Đang xử lý"
            value={processingDevices}
            icon={FaCog}
            iconColor="text-blue-400"
            valueColor="text-blue-600"
          />
        </div>

        {/* Protocol Types */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Giao thức kết nối</h2>
            <p className="text-sm text-gray-600">Phân bổ thiết bị theo loại giao thức kết nối</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6">
            {protocolTypes.map((protocol, index) => {
              const count = instruments.filter(inst => inst.protocolType === protocol).length;
              return (
                <div key={index} className="text-center p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="inline-flex px-3 py-1 rounded-full text-sm font-medium mb-2 bg-blue-100 text-blue-800">
                    {protocol}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500">thiết bị</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Devices Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Danh Sách Thiết Bị</h2>
                <p className="text-sm text-gray-600">Quản lý và theo dõi tất cả thiết bị trong phòng lab</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowAddModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors shadow-sm">
                  <FaPlus className="w-4 h-4" />
                  Thêm Thiết Bị Mới
                </button>
                <button
                  onClick={() => refetch()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
                  disabled={isLoading}
                >
                  <FaSync className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Làm mới
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, ID, IP address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={protocolFilter}
                onChange={(e) => setProtocolFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Tất cả giao thức">Tất cả giao thức</option>
                {protocolTypes.map((protocol, index) => (
                  <option key={index} value={protocol}>{protocol}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((status, index) => (
                  <option key={index} value={status}>
                    {status === 'Tất cả trạng thái' ? status : getStatusText(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Instruments Table */}
          <div className="overflow-auto max-h-96 border rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên thiết bị
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giao thức
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lần cập nhật cuối
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInstruments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FaExclamationTriangle className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-900">Không tìm thấy thiết bị</p>
                        <p className="text-sm">Thử thay đổi bộ lọc tìm kiếm</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedInstruments.map((instrument) => (
                    <tr key={instrument.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {instrument.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">{instrument.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {instrument.ipAddress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {instrument.protocolType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(instrument.status)}`}>
                          {getStatusIcon(instrument.status)}
                          <span className="ml-1">{getStatusText(instrument.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {instrument.updatedAt || instrument.createdAt ?
                          new Date(instrument.updatedAt || instrument.createdAt).toLocaleString('vi-VN') :
                          'Chưa cập nhật'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openCheckStatusModal(instrument.id, instrument.name)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Kiểm tra trạng thái"
                          >
                            <FaSync className="w-4 h-4" />
                          </button>
                          {!instrument.active || instrument.status === 'INACTIVE' || instrument.status === 'ERROR' ? (
                            <button
                              onClick={() => openActivateDeactivateModal(instrument.id, instrument.name, 'activate')}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Kích hoạt"
                            >
                              <FaPlay className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => openActivateDeactivateModal(instrument.id, instrument.name, 'deactivate')}
                              className="text-orange-600 hover:text-orange-900 p-1"
                              title="Tạm dừng"
                            >
                              <FaPause className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => toggleDetails(instrument.id)}
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="Xem chi tiết"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{Math.min(currentPage * pageSize + 1, totalItems || 0)}</span> đến <span className="font-medium">{Math.min((currentPage + 1) * pageSize, totalItems)}</span> trong <span className="font-medium">{totalItems}</span> kết quả
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                  disabled={currentPage === 0}
                  className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  ← Trước
                </button>
                <span className="text-sm text-gray-700">Trang {currentPage + 1} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  Sau →
                </button>
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(0); }} className="ml-3 border border-gray-300 rounded px-2 py-1">
                  <option value={5}>5 / trang</option>
                  <option value={10}>10 / trang</option>
                  <option value={20}>20 / trang</option>
                  <option value={50}>50 / trang</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* Add Instrument Modal */}
        <ModalAddInstrument
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={async (payload) => {
            try {
              await addInstrument(payload);
              setShowAddModal(false);
            } catch (err) {
              // useWareHouse already shows notifications; optionally log here
              console.error('Add instrument failed', err);
            }
          }}
          isLoadingAddNew={isAddingInstrument}
        />
        <ModalCheckStatus
          isOpen={checkStatusModalOpen}
          onClose={closeCheckStatusModal}
          isLoading={isCheckingInstrumentStatus}
          instrumentId={selectedInstrumentStatus.instrumentId}
          instrumentName={selectedInstrumentStatus.instrumentName}
          onSubmit={handleSubmitCheckStatus}
        />
        <ModalActivateDeactivate
          isOpen={activateDeactivateModalOpen}
          onClose={closeActivateDeactivateModal}
          isLoading={isActivatingInstrument || isDeactivatingInstrument}
          onSubmit={handleSubmitActivateDeactivate}
          instrumentId={selectedInstrumentActivateDeactivate.instrumentId}
          instrumentName={selectedInstrumentActivateDeactivate.instrumentName}
          actionType={selectedInstrumentActivateDeactivate.actionType}
        />
        {/* Instrument Detail Cards */}
        {filteredInstruments.map((instrument) => (
          showDetails[instrument.id] && (
            <div key={`details-${instrument.id}`} className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Chi tiết thiết bị: {instrument.name}
                  </h3>
                  <button
                    onClick={() => toggleDetails(instrument.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimesCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Thông tin cơ bản</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">ID:</span> {instrument.id}</div>
                      <div><span className="font-medium">Tên:</span> {instrument.name}</div>
                      <div><span className="font-medium">IP Address:</span> {instrument.ipAddress}</div>
                      <div><span className="font-medium">Port:</span> {instrument.port}</div>
                      <div><span className="font-medium">Hoạt động:</span> {instrument.active ? 'Có' : 'Không'}</div>
                      <div><span className="font-medium">Đã xóa:</span> {instrument.isDeleted ? 'Có' : 'Không'}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Cấu hình kết nối</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Protocol:</span> {instrument.protocolType}</div>
                      <div>
                        <span className="font-medium">Trạng thái:</span>
                        <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs ${getStatusColor(instrument.status)}`}>
                          {getStatusIcon(instrument.status)}
                          <span className="ml-1">{getStatusText(instrument.status)}</span>
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Cập nhật cuối:</span>
                        {instrument.updatedAt || instrument.createdAt ?
                          ` ${new Date(instrument.updatedAt || instrument.createdAt).toLocaleString('vi-VN')}` :
                          ' Chưa cập nhật'
                        }
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Cấu hình & Reagent</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Reagent IDs:</span>
                        <div className="mt-1">
                          {instrument.compatibleReagentIds?.length > 0 ? (
                            instrument.compatibleReagentIds.map((id, idx) => (
                              <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                                {id}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">Không có</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Config IDs:</span>
                        <div className="mt-1">
                          {instrument.configurationSettingIds?.length > 0 ? (
                            instrument.configurationSettingIds.slice(0, 2).map((id, idx) => (
                              <span key={idx} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                                {id}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">Không có</span>
                          )}
                          {instrument.configurationSettingIds?.length > 2 && (
                            <span className="text-xs text-gray-500">+{instrument.configurationSettingIds.length - 2} khác</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Thao tác</h4>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={()=>openCheckStatusModal(instrument.id, instrument.name)}
                        className="flex items-center justify-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                      >
                        <FaSync className="w-4 h-4 mr-2" />
                        Kiểm tra trạng thái
                      </button>
                          {!instrument.active || instrument.status === 'INACTIVE' || instrument.status === 'ERROR' ? (
                        <button
                          onClick={() => handleActivateInstrument(instrument.id)}
                          className="flex items-center justify-center px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                        >
                          <FaPlay className="w-4 h-4 mr-2" />
                          Kích hoạt
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeactivateInstrument(instrument.id)}
                          className="flex items-center justify-center px-3 py-2 text-sm bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200"
                        >
                          <FaPause className="w-4 h-4 mr-2" />
                          Tạm dừng
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </MainLayout>
  );
};

export default Devices;