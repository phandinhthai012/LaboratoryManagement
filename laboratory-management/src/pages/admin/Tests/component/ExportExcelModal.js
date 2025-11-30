import React, { useState } from 'react';
import { FaTimes, FaDownload, FaSpinner, FaFileExcel } from 'react-icons/fa';

const ExportExcelModal = ({ isOpen, onClose, onExport, isExporting }) => {
  const [exportParams, setExportParams] = useState({
    startDate: '',
    endDate: '',
    customFileName: 'Báo cáo xét nghiệm'
  });

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      
      setExportParams({
        startDate: firstDay.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
        customFileName: `Báo cáo xét nghiệm tháng ${today.getMonth() + 1}_${today.getFullYear()}`
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!exportParams.startDate || !exportParams.endDate || !exportParams.customFileName.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const payload = {
      dateRangeType: "CUSTOM",
      startDate: exportParams.startDate,
      endDate: exportParams.endDate,
      customFileName: exportParams.customFileName
    };

    try {
      await onExport(payload);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FaFileExcel className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">Xuất Excel</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isExporting}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Từ ngày</label>
              <input
                type="date"
                value={exportParams.startDate}
                onChange={(e) => setExportParams(prev => ({ ...prev, startDate: e.target.value }))}
                disabled={isExporting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Đến ngày</label>
              <input
                type="date"
                value={exportParams.endDate}
                onChange={(e) => setExportParams(prev => ({ ...prev, endDate: e.target.value }))}
                disabled={isExporting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          {/* File Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Tên file</label>
            <input
              type="text"
              value={exportParams.customFileName}
              onChange={(e) => setExportParams(prev => ({ ...prev, customFileName: e.target.value }))}
              disabled={isExporting}
              placeholder="Nhập tên file..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
            <p className="text-xs text-gray-500 mt-1">File sẽ có đuôi .xlsx</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isExporting}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isExporting}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isExporting && <FaSpinner className="w-4 h-4 animate-spin" />}
              <FaDownload className="w-4 h-4" />
              {isExporting ? 'Đang xuất...' : 'Xuất Excel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExportExcelModal;