import React from "react";
import { useReagantHistoryById } from "../../../../hooks/useWareHouse";
import { FaTimes, FaSpinner, FaExclamationTriangle, FaVials, FaUser, FaCalendarAlt, FaBoxOpen, FaCheckCircle, FaTruck, FaUndo, FaBox } from 'react-icons/fa';
import ErrorFetchData from '../../../../components/ErrorFetchData';

const ViewReagentModel = ({ isOpen, onClose, reagentId }) => {

    const {data: reagentHistoryRes, isLoading, isError, refetch} = useReagantHistoryById(reagentId);
    
    const reagentHistory = reagentHistoryRes ? reagentHistoryRes.data : null;

    if (!isOpen) return null;

    // Status mapping với màu sắc và icons
    const getStatusInfo = (status) => {
        switch (status) {
            case 'RECEIVED':
                return {
                    label: 'Đã Nhận',
                    color: 'bg-green-100 text-green-800',
                    icon: <FaCheckCircle className="w-4 h-4" />
                };
            case 'PARTIAL_SHIPMENT':
                return {
                    label: 'Nhận Một Phần',
                    color: 'bg-yellow-100 text-yellow-800',
                    icon: <FaTruck className="w-4 h-4" />
                };
            case 'RETURNED':
                return {
                    label: 'Đã Trả Lại',
                    color: 'bg-red-100 text-red-800',
                    icon: <FaUndo className="w-4 h-4" />
                };
            default:
                return {
                    label: status || 'N/A',
                    color: 'bg-gray-100 text-gray-800',
                    icon: <FaBox className="w-4 h-4" />
                };
        }
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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-20 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <FaVials className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Chi Tiết Hóa Chất</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center space-x-3 text-gray-600">
                                <FaSpinner className="w-6 h-6 animate-spin" />
                                <span className="text-lg">Đang tải thông tin hóa chất...</span>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {isError && (
                        <div className="flex items-center justify-center py-12">
                            <ErrorFetchData 
                                onRetry={() => refetch()}
                                message="Không thể tải thông tin hóa chất"
                            />
                        </div>
                    )}

                    {/* Data Display */}
                    {!isLoading && !isError && reagentHistory && (
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <FaVials className="w-5 h-5 text-blue-600" />
                                    Thông Tin Cơ Bản
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Tên Hóa Chất</label>
                                        <p className="text-gray-900 font-medium">{reagentHistory.reagentName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Mã Catalog</label>
                                        <p className="text-gray-900">{reagentHistory.reagentCatalogNumber || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Nhà Sản Xuất</label>
                                        <p className="text-gray-900">{reagentHistory.reagentManufacturer || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Mã CAS</label>
                                        <p className="text-gray-900">{reagentHistory.reagentCasNumber || 'Không có'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Số Lô</label>
                                        <p className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded text-sm inline-block">
                                            {reagentHistory.lotNumber || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Trạng Thái</label>
                                        <div className="mt-1">
                                            {(() => {
                                                const statusInfo = getStatusInfo(reagentHistory.status);
                                                return (
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                                                        {statusInfo.icon}
                                                        {statusInfo.label}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Information */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <FaBoxOpen className="w-5 h-5 text-blue-600" />
                                    Thông Tin Đơn Hàng
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Nhà Cung Cấp</label>
                                        <p className="text-gray-900 font-medium">{reagentHistory.vendorName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Số PO</label>
                                        <p className="text-gray-900 font-mono bg-white px-2 py-1 rounded text-sm inline-block">
                                            {reagentHistory.poNumber || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Ngày Đặt Hàng</label>
                                        <p className="text-gray-900 flex items-center gap-2">
                                            <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                                            {formatDate(reagentHistory.orderDate)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Ngày Nhận</label>
                                        <p className="text-gray-900 flex items-center gap-2">
                                            <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                                            {formatDateTime(reagentHistory.receiptDate)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity & Storage */}
                            <div className="bg-green-50 rounded-lg p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <FaBoxOpen className="w-5 h-5 text-green-600" />
                                    Thông Tin Kho
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Số Lượng Nhận</label>
                                        <p className="text-gray-900 font-semibold text-lg">
                                            {reagentHistory.quantityReceived?.toLocaleString()} {reagentHistory.unitOfMeasure}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Vị Trí Lưu Trữ</label>
                                        <p className="text-gray-900 bg-white px-3 py-2 rounded border">
                                            {reagentHistory.initialStorageLocation || 'Chưa xác định'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Ngày Hết Hạn</label>
                                        <p className="text-gray-900 flex items-center gap-2">
                                            <FaCalendarAlt className="w-4 h-4 text-red-400" />
                                            <span className={`font-medium ${new Date(reagentHistory.expirationDate) < new Date() ? 'text-red-600' : 'text-gray-900'}`}>
                                                {formatDate(reagentHistory.expirationDate)}
                                            </span>
                                            {new Date(reagentHistory.expirationDate) < new Date() && (
                                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Hết hạn</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* System Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <FaUser className="w-5 h-5 text-gray-600" />
                                    Thông Tin Hệ Thống
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">ID Bản Ghi</label>
                                        <p className="text-gray-900 font-mono text-xs bg-gray-100 px-2 py-1 rounded break-all">
                                            {reagentHistory.id}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Thời Gian Ghi Nhận</label>
                                        <p className="text-gray-900 text-sm">
                                            {formatDateTime(reagentHistory.loggedAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">ID Người Nhận</label>
                                        <p className="text-gray-900 font-mono text-xs bg-gray-100 px-2 py-1 rounded break-all">
                                            {reagentHistory.receivedByUserId}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">ID Loại Hóa Chất</label>
                                        <p className="text-gray-900 font-mono text-xs bg-gray-100 px-2 py-1 rounded break-all">
                                            {reagentHistory.reagentTypeId}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* No Data State */}
                    {!isLoading && !isError && !reagentHistory && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <FaExclamationTriangle className="w-12 h-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy dữ liệu</h3>
                            <p className="text-gray-500">Hóa chất với ID này không tồn tại hoặc đã bị xóa.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ViewReagentModel;