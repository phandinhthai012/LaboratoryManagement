import React, { useState } from 'react';
import { FaTimes, FaCog } from 'react-icons/fa';

const ModalChangeMode = ({ isOpen, onClose, onSubmit, isLoading, instrumentId, instrumentName, currentMode }) => {
  const [newMode, setNewMode] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});

  // Mode options
  const modeOptions = [
    { value: 'READY', label: 'Sẵn sàng', color: 'text-green-600' },
    { value: 'MAINTENANCE', label: 'Bảo trì', color: 'text-yellow-600' },
    { value: 'INACTIVE', label: 'Không hoạt động', color: 'text-gray-600' }
  ];

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setNewMode(currentMode || '');
      setReason('');
      setErrors({});
    }
  }, [isOpen, currentMode]);

  const validateForm = () => {
    const newErrors = {};

    if (!newMode) {
      newErrors.newMode = 'Vui lòng chọn chế độ mới';
    }

    if (!reason.trim()) {
      newErrors.reason = 'Vui lòng nhập lý do thay đổi';
    } else if (reason.trim().length < 10) {
      newErrors.reason = 'Lý do phải có ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const payload = {
      newMode,
      reason: reason.trim()
    };

    try {
      await onSubmit({ instrumentId, ...payload });
      handleClose();
    } catch (error) {
      console.error('Error changing mode:', error);
    }
  };

  const handleClose = () => {
    setNewMode('');
    setReason('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const currentModeLabel = modeOptions.find(opt => opt.value === currentMode)?.label || currentMode;
  const selectedModeLabel = modeOptions.find(opt => opt.value === newMode)?.label || newMode;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaCog className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Thay đổi chế độ thiết bị</h3>
              <p className="text-sm text-gray-500">Thay đổi chế độ hoạt động cho thiết bị</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Device Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Thông tin thiết bị</h4>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">Tên:</span> {instrumentName}</div>
              <div><span className="font-medium">ID:</span> {instrumentId}</div>
              <div>
                <span className="font-medium">Chế độ hiện tại:</span> 
                <span className="ml-1 text-blue-600">{currentModeLabel}</span>
              </div>
            </div>
          </div>

          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chế độ mới <span className="text-red-500">*</span>
            </label>
            <select
              value={newMode}
              onChange={(e) => setNewMode(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.newMode ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            >
              <option value="">-- Chọn chế độ --</option>
              {modeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.newMode && (
              <p className="mt-1 text-sm text-red-600">{errors.newMode}</p>
            )}
            {newMode && newMode !== currentMode && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                <span className="text-blue-800">
                  Thay đổi từ <strong>{currentModeLabel}</strong> → <strong>{selectedModeLabel}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lý do thay đổi <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do thay đổi chế độ (ví dụ: Bảo trì định kỳ, Nâng cấp hệ thống...)"
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.reason ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            <div className="flex justify-between mt-1">
              {errors.reason ? (
                <p className="text-sm text-red-600">{errors.reason}</p>
              ) : (
                <p className="text-sm text-gray-500">Tối thiểu 10 ký tự</p>
              )}
              <p className="text-sm text-gray-400">{reason.length}/200</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || newMode === currentMode}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </span>
              ) : (
                'Thay đổi chế độ'
              )}
            </button>
          </div>
        </form>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Đang thay đổi chế độ...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalChangeMode;
