import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaClock, FaCheckCircle, FaSpinner, FaFlask, FaTimes } from 'react-icons/fa';
import MainLayout from '../../../layouts/MainLayout';
import { useTestOrdersList, useTestOrder } from '../../../hooks/useTestOrder';
import { useAuth } from '../../../contexts/AuthContext';
import { formatDate } from '../../../utils/helpers';
import { StatisticCard } from './component/StatisticCard';
import ConfirmDialog from '../../../components/ConfirmDialog';
import TestOrderCreateModal from './component/TestOrderCreateModal';
import TestOrderUpdateModal from './component/TestOrderUpdateModal';
import ExportExcelModal from './component/ExportExcelModal';
const Tests = () => {
    const today = formatDate(new Date());
    const { user } = useAuth();
    const navigate = useNavigate();
    const [paginationParams, setPaginationParams] = useState({
        page: 0,
        size: 10,
        sorts: 'updatedAt,desc',
    });
    const [filters, setFilters] = useState({
        gender: '',
        status: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedTestOrder, setSelectedTestOrder] = useState(null);
    const [dialogConfirmDelete, setDialogConfirmDelete] = useState({
        isOpen: false,
        testOrderId: null,
    });
    const [showExportExcelModal, setShowExportExcelModal] = useState(false);
    const { data: responseTestOrders, isLoading } = useTestOrdersList(paginationParams);
    const { deleteTestOrder, isDeleteLoading, exportExcelTestOrders, isExportExcelTestOrdersLoading } = useTestOrder();

    const testOrders = responseTestOrders?.data?.values || [];
    const paginationInfo = {
        totalElements: responseTestOrders?.data?.totalElements || 0,
        totalPages: responseTestOrders?.data?.totalPages || 0,
        currentPage: responseTestOrders?.data?.page || 0,
        size: responseTestOrders?.data?.size || 10,
        empty: !testOrders?.length || responseTestOrders?.data?.totalElements === 0,
        last: responseTestOrders?.data?.last || false,
        first: responseTestOrders?.data?.page === 0
    };


    const handlePageChange = useCallback((newPage) => {
        setPaginationParams(prev => ({
            ...prev,
            page: newPage
        }));
    }, []);

    const handlePageSizeChange = useCallback((newSize) => {
        setPaginationParams(prev => ({
            ...prev,
            size: newSize,
            page: 0 // Reset to first page
        }));
    }, []);
    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);
    
    const handleSortChange = useCallback((sortField, sortDirection = 'desc') => {
        setPaginationParams(prev => ({
            ...prev,
            sorts: `${sortField},${sortDirection}`,
            page: 0
        }));
    }, []);

    const handleClearFilters = useCallback(() => {
        setSearchTerm('');
        setFilters({
            gender: '',
            status: '',
        });
        setPaginationParams({
            page: 0,
            size: 10,
            sorts: 'updatedAt,desc'
        });
    }, []);

    const handleShowDetailTest = (testOrderId) => {
        navigate(`/test-orders/${testOrderId}`);
    }

    const openDialogConfirmDelete = useCallback((testOrderId) => {
        setDialogConfirmDelete({ isOpen: true, testOrderId });
    }, []);

    const handleDeleteTestOrder = useCallback(async () => {
        const { testOrderId } = dialogConfirmDelete;
        if (!testOrderId) return;
        
        try {
            await deleteTestOrder(testOrderId);
        } catch (error) {
            console.error('Error deleting test order:', error);
        } finally {
            setDialogConfirmDelete({ isOpen: false, testOrderId: null });
        }
    }, [dialogConfirmDelete, deleteTestOrder]);


    // Sync filters and search with pagination params
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== '')
            );
            
            setPaginationParams(prev => ({
                ...prev,
                ...cleanFilters,
                ...(searchTerm && { search: searchTerm }),
                page: 0
            }));
        }, searchTerm ? 500 : 0); // Debounce only for search

        return () => clearTimeout(timeoutId);
    }, [searchTerm, filters]);

    // Calculate statistics
    const totalTests = responseTestOrders?.data?.totalElements || 0;
    const pendingTests = testOrders.filter(test => test.status === 'PENDING').length;
    const inProgressTests = testOrders.filter(test => test.status === 'IN_PROGRESS').length;
    const completedTests = testOrders.filter(test => test.status === 'COMPLETED').length;
    const cancelledTests = testOrders.filter(test => test.status === 'CANCELLED').length;

    const getStatusBadge = (status) => {
        const statusConfig = {
            PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ xử lý', icon: FaClock },
            IN_PROGRESS: { color: 'bg-blue-100 text-blue-800', text: 'Đang thực hiện', icon: FaSpinner },
            COMPLETED: { color: 'bg-green-100 text-green-800', text: 'Hoàn thành', icon: FaCheckCircle },
            CANCELLED: { color: 'bg-red-100 text-red-800', text: 'Đã hủy', icon: FaTimes }
        };

        const config = statusConfig[status] || statusConfig.PENDING;
        const IconComponent = config.icon;

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                <IconComponent className="w-3 h-3 mr-1" />
                {config.text}
            </span>
        );
    };

    const getReviewStatusBadge = (reviewStatus) => {
        const statusConfig = {
            NONE: { color: 'bg-gray-100 text-gray-800', text: 'Chưa duyệt', icon: FaClock },
            AI_REVIEWED: { color: 'bg-yellow-100 text-yellow-800', text: 'A.I duyệt', icon: FaClock },
            HUMAN_REVIEWED: { color: 'bg-green-100 text-green-800', text: 'Đã duyệt', icon: FaCheckCircle },
        };

        const config = statusConfig[reviewStatus] || statusConfig.NONE;
        const IconComponent = config.icon;

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                <IconComponent className="w-3 h-3 mr-1" />
                {config.text}
            </span>
        );
    };

    const formatDateWithTime = useCallback((dateString) => {
        if (!dateString) return { date: 'N/A', time: 'N/A' };
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('vi-VN'),
            time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
    }, []);

    const openExportExcelModal = () => {
        setShowExportExcelModal(true);
    };

    const closeExportExcelModal = () => {
        setShowExportExcelModal(false);
    };
    const handleExportExcel = async (exportParams) => {
        try {
            const response = await exportExcelTestOrders(exportParams);
            // Handle the response if needed
            closeExportExcelModal();
        } catch (error) {
            console.error('Error exporting test orders to Excel:', error);
        }finally {
            // Any cleanup actions if needed
        }
    }

    return (
        <MainLayout>
            <div>
                {/* Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản Lý Xét Nghiệm</h1>
                            <p className="text-gray-600">Quản lý đơn xét nghiệm, theo dõi mẫu và kết quả</p>
                        </div>
                        <div className="text-sm text-gray-500">
                            <span className="font-semibold">{user.roleName}</span> • {today}
                        </div>
                    </div>
                </div>

                {/* Test Order Create Modal */}
                <TestOrderCreateModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onCreated={(data) => {
                        setShowCreateModal(false);
                    }}
                />

                {/* Test Order Update Modal */}
                <TestOrderUpdateModal
                    isOpen={showUpdateModal}
                    onClose={() => { setShowUpdateModal(false); setSelectedTestOrder(null); }}
                    testOrder={selectedTestOrder}
                    onUpdated={(data) => {
                        setShowUpdateModal(false);
                        setSelectedTestOrder(null);
                    }}
                />

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <StatisticCard
                        title="Tổng số Tests"
                        value={totalTests}
                        icon={FaFlask}
                        color='blue'
                    />
                    <StatisticCard
                        title="Chờ xử lý"
                        value={pendingTests}
                        icon={FaClock}
                        color="yellow"
                    />
                    <StatisticCard
                        title="Đang thực hiện"
                        value={inProgressTests}
                        icon={FaSpinner}
                        color="purple"
                    />

                    <StatisticCard
                        title="Hoàn thành"
                        value={completedTests}
                        icon={FaCheckCircle}
                        color="green"
                    />
                    <StatisticCard
                        title="Đã hủy"
                        value={cancelledTests}
                        icon={FaTrash}
                        color="red"
                    />
                </div>

                {/* Test Orders Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Đơn Xét Nghiệm</h2>
                                <p className="text-sm text-gray-600">Theo dõi và quản lý tất cả đơn xét nghiệm và mẫu</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={openExportExcelModal}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Xuất Excel
                                </button>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                                >
                                    <FaPlus className="w-4 h-4" />
                                    Đơn Xét Nghiệm Mới
                                </button>
                            </div>
                        </div>
                        <ExportExcelModal
                            isOpen={showExportExcelModal}
                            onClose={closeExportExcelModal}
                            onExport={handleExportExcel}
                            isExporting={isExportExcelTestOrdersLoading}
                        />

                        {/* Search and Filter */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên bệnh nhân, mã đơn..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={paginationParams.size}
                                onChange={(e) => handlePageSizeChange(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                            >
                                <option value={5}>5 / trang</option>
                                <option value={10}>10 / trang</option>
                                <option value={20}>20 / trang</option>
                                <option value={50}>50 / trang</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Giới tính:</label>
                                <select
                                    value={filters.gender}
                                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="MALE">Nam</option>
                                    <option value="FEMALE">Nữ</option>
                                    <option value="OTHER">Khác</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="PENDING">Chờ xử lý</option>
                                    <option value="COMPLETED">Hoàn thành</option>
                                    <option value="IN_PROGRESS">Đang thực hiện</option>
                                    <option value="CANCELLED">Đã hủy</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Sắp xếp:</label>
                                <select
                                    value={paginationParams.sorts || 'updatedAt,desc'}
                                    onChange={(e) => {
                                        const [field, direction] = e.target.value.split(',');
                                        handleSortChange(field, direction);
                                    }}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                >
                                    <option value="updatedAt,desc">Cập Nhật (Mới → Cũ)</option>
                                    <option value="updatedAt,asc">Cập Nhật (Cũ → Mới)</option>
                                    <option value="createdAt,desc">Ngày Tạo (Mới → Cũ)</option>
                                    <option value="createdAt,asc">Ngày Tạo (Cũ → Mới)</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                    onClick={handleClearFilters}>
                                    Đặt lại bộ lọc
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Test Orders Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1150px]">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                                        STT
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                                        Mã Đơn
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                                        Thông Tin Bệnh Nhân
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                        Loại Xét Nghiệm
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                                        Ngày Tạo
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                        Trạng Thái
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                                        Trạng Thái Duyệt
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                                        Thao Tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-8 text-center">
                                            <div className="flex items-center justify-center">
                                                <FaSpinner className="animate-spin w-6 h-6 text-gray-500 mr-2" />
                                                <span className="text-gray-500">Đang tải...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : testOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-8 text-center">
                                            <div className="flex flex-col items-center">
                                                <FaFlask className="w-12 h-12 text-gray-400 mb-4" />
                                                <span className="text-gray-500">Không có đơn xét nghiệm nào</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    testOrders.map((testOrder, index) => (
                                        <tr key={testOrder.id} className="hover:bg-gray-50">
                                            {/* STT */}
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                                {paginationInfo.currentPage * paginationParams.size + index + 1}
                                            </td>

                                            {/* Mã Đơn - Compact */}
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="max-w-[180px]">
                                                    <div className="font-medium text-blue-600 truncate" title={testOrder.orderCode}>
                                                        {testOrder.orderCode}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate" title={testOrder.id}>
                                                        ID: {testOrder.id}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Thông Tin Bệnh Nhân */}
                                            <td className="px-4 py-4 text-sm text-gray-900">
                                                <div className="max-w-[240px]">
                                                    <div className="font-medium truncate" title={testOrder.fullName}>
                                                        {testOrder.fullName}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {testOrder.age} tuổi • {testOrder.gender === 'MALE' ? 'Nam' : testOrder.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate" title={testOrder.medicalRecordCode}>
                                                        {testOrder.medicalRecordCode}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {testOrder.phone}
                                                    </div>
                                                    {testOrder.barcode && (
                                                        <div className="text-xs text-blue-500 truncate" title={testOrder.barcode}>
                                                            {testOrder.barcode}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Số Lượng Tests - Compact */}
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="max-w-[150px]">
                                                    <div className="flex items-center">
                                                        <FaFlask className="w-4 h-4 text-blue-500 mr-2" />
                                                        <span className="font-medium">
                                                            {testOrder.testType?.testParameters?.length || 0}
                                                        </span>
                                                        <span className="text-gray-500 ml-1">param</span>
                                                    </div>
                                                    {testOrder.testType && (
                                                        <div className="text-xs text-gray-500 mt-1 truncate" title={testOrder.testType.name}>
                                                            {testOrder.testType.name}
                                                        </div>
                                                    )}
                                                    {testOrder.results && testOrder.results.length > 0 && (
                                                        <div className="text-xs text-green-600 mt-1">
                                                            {testOrder.results.length} kết quả
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Ngày Tạo - Compact */}
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="max-w-[130px]">
                                                    <div className="font-medium text-xs">{formatDate(testOrder.createdAt)}</div>
                                                    <div className="text-xs text-gray-400">
                                                        {formatDateWithTime(testOrder.createdAt).time}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Trạng Thái - Compact */}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="max-w-[120px]">
                                                    {getStatusBadge(testOrder.status)}
                                                    {testOrder.runAt && (
                                                        <div className="text-xs text-blue-500 mt-1">
                                                            Đã chạy: {formatDateWithTime(testOrder.runAt).time}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Trạng Thái Duyệt - Compact */}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="max-w-[130px]">
                                                    {getReviewStatusBadge(testOrder.reviewStatus)}
                                                </div>
                                            </td>

                                            {/* Thao Tác - Compact */}
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-1">
                                                    <button
                                                        onClick={() => handleShowDetailTest(testOrder.id)}
                                                        className="text-blue-600 hover:text-blue-900 p-1.5 hover:bg-blue-50 rounded"
                                                        title="Xem chi tiết"
                                                    >
                                                        <FaEye className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedTestOrder(testOrder); setShowUpdateModal(true); }}
                                                        className="text-green-600 hover:text-green-900 p-1.5 hover:bg-green-50 rounded"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <FaEdit className="w-3.5 h-3.5" />
                                                    </button>
                                                    {testOrder.status !== 'COMPLETED' && (
                                                        <button
                                                            className="text-red-600 hover:text-red-900 p-1.5 hover:bg-red-50 rounded"
                                                            title="Xóa"
                                                            onClick={() => openDialogConfirmDelete(testOrder.id)}
                                                        >
                                                            <FaTrash className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {!paginationInfo.empty && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">

                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Hiển thị{' '}
                                        <span className="font-medium">
                                            {paginationInfo.currentPage * paginationParams.size + 1}
                                        </span>{' '}
                                        đến{' '}
                                        <span className="font-medium">
                                            {Math.min(
                                                (paginationInfo.currentPage + 1) * paginationParams.size,
                                                paginationInfo.totalElements
                                            )}
                                        </span>{' '}
                                        trong{' '}
                                        <span className="font-medium">{paginationInfo.totalElements}</span> kết quả
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
                                        disabled={paginationInfo.first}
                                        className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                                    >
                                        ← Trước
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Trang {paginationInfo.currentPage + 1} / {paginationInfo.totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                                        disabled={paginationInfo.last}
                                        className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                                    >
                                        Sau →
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
                                    disabled={paginationInfo.first}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Trước
                                </button>
                                <button
                                    onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                                    disabled={paginationInfo.last}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    )}
                </div>



                {/* confirm delete dialog */}
                <ConfirmDialog
                    isOpen={dialogConfirmDelete.isOpen}
                    title="Xác nhận xóa đơn xét nghiệm"
                    message="Bạn có chắc chắn muốn xóa đơn xét nghiệm này? Hành động này không thể hoàn tác."
                    type="danger"
                    isLoading={isDeleteLoading}
                    onClose={() => setDialogConfirmDelete({ isOpen: false, testOrderId: null })}
                    onConfirm={handleDeleteTestOrder}
                />
            </div>
        </MainLayout>

    );
};

export default Tests;