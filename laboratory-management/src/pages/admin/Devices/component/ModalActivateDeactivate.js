import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaTimes, FaExclamationCircle } from 'react-icons/fa';

const ModalActivateDeactivate = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading, 
  instrumentId, 
  instrumentName, 
  actionType // 'activate' or 'deactivate'
}) => {
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setReason('');
      setSelectedReason('');
    }
  }, [isOpen]);

  // Predefined reasons based on action type
  const activateReasons = [
    'Bảo trì hoàn tất',
    'Khắc phục lỗi thành công',
    'Thiết bị đã được kiểm tra và sẵn sàng',
    'Cập nhật phần mềm hoàn thành',
    'Thay thế linh kiện thành công',
    'Khác (ghi rõ lý do)'
  ];

  const deactivateReasons = [
    'Bảo trì định kỳ',
    'Phát hiện lỗi kỹ thuật',
    'Cập nhật phần mềm',
    'Thay thế linh kiện',
    'Tạm ngưng sử dụng theo kế hoạch',
    'Khác (ghi rõ lý do)'
  ];

  const reasons = actionType === 'activate' ? activateReasons : deactivateReasons;

  const handleSubmit = async () => {
    const finalReason = selectedReason === 'Khác (ghi rõ lý do)' ? reason : selectedReason;
    
    if (!finalReason.trim()) {
      alert('Vui lòng nhập lý do');
      return;
    }

    try {
      await onSubmit({
        instrumentId,
        reason: finalReason,
        actionType
      });
    } catch (error) {
      console.error(`Error ${actionType} instrument:`, error);
    }finally {
      setReason('');
      setSelectedReason('');
      onClose();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isActivating = actionType === 'activate';
  const actionText = isActivating ? 'Kích hoạt' : 'Tạm dừng';
  const actionColor = isActivating ? 'green' : 'orange';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center">
            {isActivating ? (
              <FaPlay className="w-5 h-5 text-green-600 mr-2" />
            ) : (
              <FaPause className="w-5 h-5 text-orange-600 mr-2" />
            )}
            <h3 className="text-lg font-medium text-gray-900">
              {actionText} thiết bị
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

        {/* Content */}
        <div className="p-6">
          {/* Device Info */}
          <div className="mb-6">
            <div className="flex items-start">
              <FaExclamationCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700 mb-2">
                  Bạn có chắc chắn muốn <span className="font-semibold">{actionText.toLowerCase()}</span> thiết bị{' '}
                  <span className="font-semibold">{instrumentName}</span>?
                </p>
                <p className="text-xs text-gray-500">
                  ID: {instrumentId}
                </p>
              </div>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lý do {actionText.toLowerCase()}
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">-- Chọn lý do --</option>
              {reasons.map((reasonOption, index) => (
                <option key={index} value={reasonOption}>
                  {reasonOption}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Reason Input */}
          {selectedReason === 'Khác (ghi rõ lý do)' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi rõ lý do
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isLoading}
                rows={3}
                placeholder="Nhập lý do cụ thể..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
          )}

          {/* Actions */}
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
              disabled={isLoading || !selectedReason}
              className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md disabled:cursor-not-allowed disabled:opacity-50 flex items-center ${
                actionColor === 'green' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  {isActivating ? (
                    <FaPlay className="w-4 h-4 mr-2" />
                  ) : (
                    <FaPause className="w-4 h-4 mr-2" />
                  )}
                  {actionText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalActivateDeactivate;