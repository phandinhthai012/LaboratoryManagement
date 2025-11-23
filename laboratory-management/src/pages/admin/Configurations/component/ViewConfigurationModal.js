import React from 'react';
import { FaTimes, FaEye, FaCopy, FaUser, FaCalendar } from 'react-icons/fa';
import { useNotifier } from '../../../../contexts/NotifierContext';
import { formatDate, formatDateWithTime } from '../../../../utils/helpers';
import { useConfigurationDetails } from '../../../../hooks/useWareHouse';
const ViewConfigurationModal = ({ isOpen, onClose, configID }) => {
    const { showNotification } = useNotifier();

    const { data: configRes, isLoading, isError } = useConfigurationDetails(configID);

    // ensure hook is called unconditionally; guard early return after hook
    if (!isOpen || !configID) return null;

    const config = configRes?.data || {};
    console.log('Configuration Details:', config);
    
    // Safe date formatter to handle object returns
    const formatDateSafe = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            const result = formatDateWithTime(dateStr);
            // If result is an object, convert to string
            if (typeof result === 'object' && result !== null) {
                if (result.date && result.time) {
                    return `${result.date} ${result.time}`;
                }
                return JSON.stringify(result);
            }
            return result || dateStr;
        } catch (error) {
            return new Date(dateStr).toLocaleString('vi-VN');
        }
    };
    
    const formatValue = (value, dataType) => {
        if (value === null || value === undefined) return 'N/A';

        try {
            switch (dataType) {
                case 'JSON':
                    const jsonValue = typeof value === 'string' ? JSON.parse(value) : value;
                    return JSON.stringify(jsonValue, null, 2);
                case 'BOOLEAN':
                    return value === true || value === 'true' ? 'True' : 'False';
                case 'INTEGER':
                    return Number(value).toLocaleString('vi-VN');
                case 'STRING':
                    return value.toString();
                default:
                    return value.toString();
            }
        } catch (error) {
            return value.toString();
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Đã sao chép vào clipboard!', 'success');
        }).catch(() => {
            showNotification('Không thể sao chép', 'error');
        });
    };

    const getDataTypeColor = (dataType) => {
        switch (dataType) {
            case 'JSON': return 'bg-blue-100 text-blue-800';
            case 'BOOLEAN': return 'bg-purple-100 text-purple-800';
            case 'INTEGER': return 'bg-green-100 text-green-800';
            case 'STRING': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <FaEye className="mr-2 text-blue-600" />
                            Chi tiết Cấu hình
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Config Info */}
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Thông tin cơ bản</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">ID</label>
                                    <div className="flex items-center">
                                        <code className="bg-white px-2 py-1 rounded text-sm font-mono border flex-1">
                                            {config.id}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(config.id)}
                                            className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                                            title="Sao chép ID"
                                        >
                                            <FaCopy size={12} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Kiểu dữ liệu</label>
                                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${getDataTypeColor(config.dataType)}`}>
                                        {config.dataType}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Name & Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tên cấu hình</label>
                            <div className="bg-white border rounded-lg p-3">
                                <p className="text-gray-900 font-medium">{config.name}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
                            <div className="bg-white border rounded-lg p-3">
                                <p className="text-gray-700 leading-relaxed">{config.description}</p>
                            </div>
                        </div>

                        {/* Value */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-gray-700">Giá trị</label>
                                <button
                                    onClick={() => copyToClipboard(formatValue(config.value, config.dataType))}
                                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                    <FaCopy className="mr-1" size={10} />
                                    Sao chép giá trị
                                </button>
                            </div>
                            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-48">
                                <pre className="whitespace-pre-wrap break-words">
                                    {formatValue(config.value, config.dataType)}
                                </pre>
                            </div>
                            {config.dataType === 'JSON' && (
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 Giá trị được format JSON để dễ đọc
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                            <div className="flex items-center">
                                <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                                    config.isDeleted 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-green-100 text-green-800'
                                }`}>
                                    {config.isDeleted ? '❌ Đã xóa' : '✅ Hoạt động'}
                                </span>
                            </div>
                        </div>

                        {/* Audit Info */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                <FaCalendar className="mr-2" />
                                Thông tin kiểm tra
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Ngày tạo</label>
                                    <p className="text-gray-700">{formatDateSafe(config.createdAt)}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        <FaUser className="inline mr-1" />
                                        ID: {config.createdByUserId}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Lần cập nhật cuối</label>
                                    <p className="text-gray-700">{formatDateSafe(config.updatedAt)}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        <FaUser className="inline mr-1" />
                                        ID: {config.updatedByUserId}
                                    </p>
                                </div>
                                {config.deletedAt && (
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-medium text-red-500 mb-1">Ngày xóa</label>
                                        <p className="text-red-700">{formatDateSafe(config.deletedAt)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewConfigurationModal;