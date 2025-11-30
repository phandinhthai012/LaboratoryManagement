import React, { useState, useCallback } from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useWareHouse } from '../../../../hooks/useWareHouse';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import ViewConfigurationModal from './ViewConfigurationModal';
import EditConfigurationModal from './EditConfigurationModal';
const SystemConfigurationsTab = ({
    filteredData,
    searchTerm,
    sortBy,
    onSearchChange,
    onSortChange,
    paginationInfo,
    onPageChange,
    onPageSizeChange,
    isLoading
}) => {
    const {deleteConfiguration, isDeletingConfiguration} = useWareHouse();
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, configId: null });
    const [viewConfigId, setViewConfigId] = useState(null);
    const [editConfigId, setEditConfigId] = useState(null);

    // Optimized formatValue function for new backend structure
    const formatValue = (value) => {
        if (!value) return 'N/A';

        // Handle objects (settings from backend)
        if (typeof value === 'object' && !Array.isArray(value)) {
            try {
                const jsonString = JSON.stringify(value, null, 2);
                return jsonString;
            } catch (error) {
                return 'Invalid JSON';
            }
        }

        // Handle arrays
        if (Array.isArray(value)) {
            try {
                const arrayStr = JSON.stringify(value, null, 2);
                return `[${value.length} items] ${arrayStr.length > 120 ? arrayStr.substring(0, 120) + '...' : arrayStr}`;
            } catch (error) {
                return value.toString();
            }
        }

        // Handle booleans
        if (typeof value === 'boolean') {
            return value ? 'True' : 'False';
        }

        // Handle numbers
        if (typeof value === 'number') {
            return value.toLocaleString('vi-VN');
        }

        // Handle strings (including potential JSON strings)
        if (typeof value === 'string') {
            // Try to parse as JSON first
            try {
                const parsed = JSON.parse(value);
                if (typeof parsed === 'object') {
                    const jsonString = JSON.stringify(parsed, null, 2);
                    return jsonString.length > 150 ? jsonString.substring(0, 150) + '...' : jsonString;
                }
            } catch (error) {
                // Not JSON, treat as regular string
            }

            // Regular string - truncate if too long
            return value.length > 80 ? value.substring(0, 80) + '...' : value;
        }

        // Fallback
        const str = String(value);
        return str.length > 80 ? str.substring(0, 80) + '...' : str;
    };
    const handleView = useCallback((config) => {
        console.log('View config:', config);
        setViewConfigId(config.id);
    }, []);

    const handleEdit = useCallback((config) => {
        console.log('Edit config:', config);
        setEditConfigId(config.id);
    }, []);

    const openConfirmDelete = useCallback((configId) => {
        setConfirmDelete({ isOpen: true, configId });
    }, []);

    const closeConfirmDelete = useCallback(() => {
        setConfirmDelete({ isOpen: false, configId: null });
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (confirmDelete.configId) {
            try {
                await deleteConfiguration(confirmDelete.configId);
                setConfirmDelete({ isOpen: false, configId: null });
            } catch (error) {
                console.error('Failed to delete configuration:', error);
            }
        }
    }, [confirmDelete.configId, deleteConfiguration]);

    return (
        <div className="p-6">
            {/* Search and Filters */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên cấu hình, mô tả..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-colors"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm min-w-[180px] transition-colors appearance-none cursor-pointer"
                        >
                            <option value="createdAt,desc"> Mới nhất trước</option>
                            <option value="createdAt,asc"> Cũ nhất trước</option>
                        </select>
                    </div>
                    <button
                        className='px-4 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors'
                        onClick={() => {
                            onSearchChange('');
                            onSortChange('createdAt,desc');
                            onPageSizeChange(10);
                        }}
                    >
                        Đặt lại
                    </button>
                </div>
            </div>



            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                            <p className="text-sm text-gray-600">Đang tải...</p>
                        </div>
                    </div>
                )}
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto" style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#CBD5E0 #F7FAFC'
                }}>
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200" style={{ width: '180px', minWidth: '180px' }}>
                                    Tên cấu hình
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200" style={{ width: '160px', minWidth: '160px' }}>
                                    Thiết bị
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200" style={{ width: '220px', minWidth: '220px' }}>
                                    Cài đặt
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200" style={{ width: '180px', minWidth: '180px' }}>
                                    Mô tả
                                </th>
                                <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200" style={{ width: '90px', minWidth: '90px' }}>
                                    Loại
                                </th>
                                <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200" style={{ width: '80px', minWidth: '80px' }}>
                                    Trạng thái
                                </th>
                                <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200" style={{ width: '70px', minWidth: '70px' }}>
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                // Skeleton loading rows
                                [...Array(5)].map((_, i) => (
                                    <tr key={`skeleton-${i}`} className="animate-pulse">
                                        <td className="px-3 py-3">
                                            <div className="h-4 bg-gray-300 rounded mb-1"></div>
                                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="h-3 bg-gray-200 rounded mb-1"></div>
                                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="bg-gray-50 p-2 rounded border">
                                                <div className="h-6 bg-gray-200 rounded mb-1"></div>
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="h-3 bg-gray-200 rounded mb-1"></div>
                                            <div className="h-3 bg-gray-200 rounded mb-1 w-4/5"></div>
                                            <div className="h-3 bg-gray-200 rounded w-3/5"></div>
                                        </td>
                                        <td className="px-2 py-3 text-center">
                                            <div className="h-5 bg-gray-200 rounded mx-auto w-12 mb-1"></div>
                                            <div className="h-3 bg-gray-200 rounded mx-auto w-16"></div>
                                        </td>
                                        <td className="px-2 py-3 text-center">
                                            <div className="h-5 bg-gray-200 rounded mx-auto w-8"></div>
                                        </td>
                                        <td className="px-2 py-3 text-center">
                                            <div className="flex items-center justify-center space-x-1">
                                                <div className="h-6 w-6 bg-gray-200 rounded"></div>
                                                <div className="h-6 w-6 bg-gray-200 rounded"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-xl font-medium text-gray-900 mb-2">Không tìm thấy cấu hình nào</p>
                                            <p className="text-sm text-gray-500 mb-4">Thử thay đổi bộ lọc tìm kiếm hoặc từ khóa khác</p>
                                            <button
                                                onClick={() => {
                                                    onSearchChange('');
                                                    onSortChange('createdAt,desc');
                                                }}
                                                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                            >
                                                Đặt lại
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((config, index) => (
                                    <tr
                                        key={config.id}
                                        className={`hover:bg-blue-50 transition-colors duration-200 ${config.isDeleted ? 'bg-red-50 opacity-60' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                            }`}
                                    >
                                        <td className="px-3 py-3 text-sm">
                                            <div className="font-semibold text-gray-900 mb-1 break-words text-sm">{config.name}</div>
                                            <div className="text-xs text-gray-500 font-mono bg-gray-100 px-1 py-0.5 rounded mb-1">
                                                ID: {config.id}
                                            </div>
                                            {config.version && (
                                                <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded font-medium">
                                                    v{config.version}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-3 py-3 text-sm">
                                            {config.configType === 'SPECIFIC' && (config.instrumentModel || config.instrumentType) ? (
                                                <div className="space-y-1">
                                                    {config.instrumentModel && (
                                                        <div className="text-xs font-semibold text-gray-900 bg-blue-50 px-2 py-1 rounded">
                                                            {config.instrumentModel}
                                                        </div>
                                                    )}
                                                    {config.instrumentType && (
                                                        <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                            {config.instrumentType}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">
                                                    {config.configType === 'GENERAL' ? 'Cấu hình chung' : 'Chưa xác định'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-3 text-sm">
                                            {config.settings && typeof config.settings === 'object' && Object.keys(config.settings).length > 0 ? (
                                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200 max-w-sm">
                                                    <div className="text-xs space-y-2">
                                                        {Object.entries(config.settings).slice(0, 3).map(([key, value]) => (
                                                            <div key={key} className="flex justify-between items-center bg-white px-2 py-1 rounded shadow-sm">
                                                                <span className="font-medium text-blue-600 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                                                                <span className="text-gray-800 font-mono text-xs">
                                                                    {formatValue(value)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {Object.keys(config.settings).length > 3 && (
                                                            <div className="text-center">
                                                                <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                                                                    +{Object.keys(config.settings).length - 3} cài đặt khác
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic bg-gray-50 px-2 py-1 rounded">Chưa có cài đặt</span>
                                            )}
                                        </td>
                                        <td className="px-3 py-3 text-sm text-gray-700">
                                            <div className="break-words leading-relaxed text-xs">
                                                {config.description || (
                                                    <span className="text-gray-400 italic">Chưa có mô tả</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-2 py-3 text-center">
                                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                                                config.configType === 'SPECIFIC' 
                                                    ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                                                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                                            }`}>
                                                {config.configType ? config.configType : 'chưa xác định'}
                                            </span>
                                        </td>
                                        <td className="px-2 py-3 text-center">
                                            <span className={`inline-flex items-center px-1 py-1 text-xs font-medium rounded ${config.isDeleted
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-green-100 text-green-800'
                                                }`}>
                                                {config.isDeleted ? 'Xóa' : 'OK'}
                                            </span>
                                        </td>
                                        <td className="px-2 py-3 text-center">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button
                                                    onClick={() => handleView(config)}
                                                    className={`p-1 rounded transition-all ${config.isDeleted
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-green-600 hover:bg-green-100'
                                                        }`}
                                                    title={config.isDeleted ? 'Không thể xem' : 'Xem'}
                                                    disabled={config.isDeleted}
                                                >
                                                    <FaEye className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(config)}
                                                    className={`p-1 rounded transition-all ${config.isDeleted
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-blue-600 hover:bg-blue-100'
                                                        }`}
                                                    title={config.isDeleted ? 'Không thể sửa' : 'Sửa'}
                                                    disabled={config.isDeleted}
                                                >
                                                    <FaEdit className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={() => openConfirmDelete(config.id)}
                                                    className={`p-1 rounded transition-all ${config.isDeleted
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-red-600 hover:bg-red-100'
                                                        }`}
                                                    title={config.isDeleted ? 'Đã xóa' : 'Xóa'}
                                                    disabled={config.isDeleted}
                                                >
                                                    <FaTrash className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                </div>
            </div>
            <ConfirmDialog
                isOpen={confirmDelete.isOpen}
                title="Xác nhận xóa cấu hình"
                message="Bạn có chắc chắn muốn xóa cấu hình này? Hành động này không thể hoàn tác."
                onCancel={closeConfirmDelete}
                onConfirm={handleConfirmDelete}
                isLoading={isDeletingConfiguration}
            />
            <ViewConfigurationModal
                isOpen={!!viewConfigId}
                onClose={() => setViewConfigId(null)}
                configID={viewConfigId}
            />
            <EditConfigurationModal
                isOpen={!!editConfigId}
                onClose={() => setEditConfigId(null)}
                configID={editConfigId}
            />

            {/* Pagination */}
            {paginationInfo && paginationInfo.totalElements > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg mt-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4">
                        <div className="flex items-center text-sm text-gray-700 gap-4">
                            <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg">
                                <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="font-medium">
                                    {paginationInfo.currentPage * paginationInfo.size + 1}-{Math.min((paginationInfo.currentPage + 1) * paginationInfo.size, paginationInfo.totalElements)}
                                </span>
                                <span className="text-gray-500 mx-1">của</span>
                                <span className="font-semibold text-blue-600">{paginationInfo.totalElements}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-600">Hiển thị:</label>
                                <select
                                    value={paginationInfo.size}
                                    onChange={(e) => onPageSizeChange && onPageSizeChange(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value={5}>5 mục</option>
                                    <option value={10}>10 mục</option>
                                    <option value={20}>20 mục</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => onPageChange && onPageChange(paginationInfo.currentPage - 1)}
                                disabled={paginationInfo.first || isLoading}
                                className={`flex items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition-colors ${isLoading
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                                    }`}
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                {isLoading ? 'Đang tải...' : 'Trước'}
                            </button>
                            <div className={`flex items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg ${isLoading ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-700'
                                }`}>
                                <span>Trang </span>
                                <span className="mx-1 font-semibold text-blue-600">{paginationInfo.currentPage + 1}</span>
                                <span> / {paginationInfo.totalPages}</span>
                            </div>
                            <button
                                onClick={() => onPageChange && onPageChange(paginationInfo.currentPage + 1)}
                                disabled={paginationInfo.last || isLoading}
                                className={`flex items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition-colors ${isLoading
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                                    }`}
                            >
                                {isLoading ? 'Đang tải...' : 'Tiếp'}
                                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(SystemConfigurationsTab);