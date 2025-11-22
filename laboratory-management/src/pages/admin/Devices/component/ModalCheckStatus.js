import React, { useState, useEffect } from 'react';
import { FaSync, FaTimes, FaExclamationCircle, FaCheckCircle, FaExclamationTriangle, FaClock, FaInfo } from 'react-icons/fa';

const ModalCheckStatus = ({ isOpen, onClose, onSubmit, isLoading, instrumentId, instrumentName }) => {
    const [forceRecheck, setForceRecheck] = useState(false);
    const [result, setResult] = useState(null);
    const [showResult, setShowResult] = useState(false);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setResult(null);
            setShowResult(false);
            setForceRecheck(false);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!instrumentId) {
            return;
        }
        try {
            if (typeof onSubmit === 'function') {
                const response = await onSubmit({ instrumentId, forceRecheck });
                setResult(response);
                setShowResult(true);
            }
        } catch (error) {
            console.error('Error checking instrument status:', error);
        }finally {
            setForceRecheck(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setForceRecheck(false);
            setResult(null);
            setShowResult(false);
            onClose();
        }
    };

    const handleBackToForm = () => {
        setShowResult(false);
        setResult(null);
    };

    // Get status styling functions
    const getStatusColor = (status) => {
        switch (status) {
            case 'READY': return 'text-green-600 bg-green-50 border-green-200';
            case 'ERROR': return 'text-red-600 bg-red-50 border-red-200';
            case 'INACTIVE': return 'text-gray-600 bg-gray-50 border-gray-200';
            case 'BUSY': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'READY': return <FaCheckCircle className="w-5 h-5" />;
            case 'ERROR': return <FaExclamationTriangle className="w-5 h-5" />;
            default: return <FaInfo className="w-5 h-5" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'READY': return 'Sẵn sàng';
            case 'ERROR': return 'Lỗi';
            case 'INACTIVE': return 'Không hoạt động';
            case 'BUSY': return 'Đang bận';
            default: return 'Không xác định';
        }
    };

    if (!isOpen) return null;

    const data = result?.data;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
                    <div className="flex items-center">
                        {showResult ? (
                            <FaCheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        ) : (
                            <FaSync className="w-5 h-5 text-blue-600 mr-2" />
                        )}
                        <h3 className="text-lg font-medium text-gray-900">
                            {showResult ? 'Kết quả kiểm tra trạng thái' : 'Kiểm tra trạng thái thiết bị'}
                        </h3>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    {!showResult ? (
                        <>
                            <div className="mb-4">
                                <div className="flex items-start">
                                    <FaExclamationCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-700 mb-2">
                                            Bạn có muốn kiểm tra trạng thái thiết bị <span className="font-semibold">{instrumentName}</span>?
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            ID: {instrumentId}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-start">
                                    <input
                                        id="forceRecheck"
                                        type="checkbox"
                                        checked={forceRecheck}
                                        onChange={(e) => setForceRecheck(e.target.checked)}
                                        disabled={isLoading}
                                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
                                    />
                                    <div className="ml-3">
                                        <label htmlFor="forceRecheck" className="text-sm font-medium text-gray-700">
                                            Kiểm tra lại bắt buộc (Force Recheck)
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Bỏ qua cache và thực hiện kiểm tra trạng thái hoàn toàn mới từ thiết bị
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={handleClose}
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 flex items-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                            Đang kiểm tra...
                                        </>
                                    ) : (
                                        <>
                                            <FaSync className="w-4 h-4 mr-2" />
                                            Kiểm tra ngay
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-start">
                                    <FaCheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-green-800">
                                            {result?.message || 'Kiểm tra trạng thái thành công'}
                                        </p>
                                        <p className="text-xs text-green-600 mt-1">
                                            {data?.recheckPerformed ? 'Đã thực hiện kiểm tra lại bắt buộc' : 'Sử dụng dữ liệu cache'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin thiết bị</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tên thiết bị:</span>
                                        <span className="font-medium">{data?.instrumentName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">ID:</span>
                                        <span className="font-mono text-xs">{data?.instrumentId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Có thể sử dụng:</span>
                                        <span className={`font-medium ${data?.canBeUsed ? 'text-green-600' : 'text-red-600'}`}>
                                            {data?.canBeUsed ? 'Có' : 'Không'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Status Information */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Trạng thái thiết bị</h4>
                                <div className="space-y-3">
                                    {/* Current Status */}
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-600 mr-2">Trạng thái hiện tại:</span>
                                        </div>
                                        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(data?.currentStatus)}`}>
                                            {getStatusIcon(data?.currentStatus)}
                                            <span className="ml-2">{getStatusText(data?.currentStatus)}</span>
                                        </div>
                                    </div>
                                    {/* Previous Status */}
                                    {data?.previousStatus && data?.previousStatus !== data?.currentStatus && (
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-600 mr-2">Trạng thái trước đó:</span>
                                            </div>
                                            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(data?.previousStatus)}`}>
                                                {getStatusIcon(data?.previousStatus)}
                                                <span className="ml-2">{getStatusText(data?.previousStatus)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Status Message */}
                            {data?.statusMessage && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Thông báo trạng thái</h4>
                                    <p className="text-sm text-gray-700 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        {data.statusMessage}
                                    </p>
                                </div>
                            )}
                            {/* Error Details */}
                            {data?.errorDetails && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-red-900 mb-2">Chi tiết lỗi</h4>
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-700">
                                            {data.errorDetails}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {/* Timestamp */}
                            <div className="mb-6">
                                <div className="flex items-center text-xs text-gray-500">
                                    <FaClock className="w-4 h-4 mr-1" />
                                    <span>
                                        Kiểm tra lúc: {data?.lastCheckedAt ? new Date(data.lastCheckedAt).toLocaleString('vi-VN') : 'N/A'}
                                    </span>
                                </div>
                            </div>
                            {/* Actions */}
                            <div className="flex justify-between">
                                <button
                                    onClick={handleBackToForm}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    ← Kiểm tra lại
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                                >
                                    Đóng
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalCheckStatus;