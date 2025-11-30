import React, { useState, useEffect, useMemo } from 'react';
import { FaTimes, FaEdit, FaSpinner, FaSave } from 'react-icons/fa';
import { useNotifier } from '../../../../contexts/NotifierContext';
import { useQueryClient } from '@tanstack/react-query';
import { useWareHouse } from '../../../../hooks/useWareHouse';
import { useConfigurationDetails } from '../../../../hooks/useWareHouse';
const EditConfigurationModal = ({ isOpen, onClose, configID, onUpdated }) => {
    const { showNotification } = useNotifier();
    const queryClient = useQueryClient();
    const { modifyConfiguration, isModifyingConfiguration } = useWareHouse();
    const { data: configRes, isLoading, isError } = useConfigurationDetails(configID);
    const config = useMemo(() => configRes?.data || {}, [configRes?.data]);

    // Form state
    const [formData, setFormData] = useState({
        version: '',
        modificationReason: 'Điều chỉnh tham số phát hiện để tối ưu hiệu suất',
        settings: {}
    });
    const [settingsInput, setSettingsInput] = useState('');

    // Initialize form data when config changes
    useEffect(() => {
        if (config) {
            setFormData({
                version: config.version || '',
                modificationReason: 'Điều chỉnh tham số phát hiện để tối ưu hiệu suất',
                settings: config.settings || {}
            });
            // Initialize settings input with formatted JSON
            setSettingsInput(config.settings ? JSON.stringify(config.settings, null, 2) : '');
        }
    }, [config]);

    if (!isOpen || !config) return null;



    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = () => {
        const { version, modificationReason } = formData;
        
        if (!version.trim()) {
            showNotification('Vui lòng nhập phiên bản', 'error');
            return false;
        }
        
        if (!modificationReason.trim()) {
            showNotification('Vui lòng nhập lý do chỉnh sửa', 'error');
            return false;
        }

        if (modificationReason.length > 255) {
            showNotification('Lý do chỉnh sửa không được vượt quá 255 ký tự', 'error');
            return false;
        }
        
        if (!settingsInput.trim()) {
            showNotification('Vui lòng nhập cài đặt settings', 'error');
            return false;
        }

        // Validate settings JSON
        try {
            const parsedSettings = JSON.parse(settingsInput);
            if (typeof parsedSettings !== 'object' || parsedSettings === null || Array.isArray(parsedSettings)) {
                showNotification('Settings phải là một object JSON hợp lệ', 'error');
                return false;
            }
            if (Object.keys(parsedSettings).length === 0) {
                showNotification('Settings không được để trống', 'error');
                return false;
            }
        } catch (error) {
            showNotification('Settings phải là JSON hợp lệ', 'error');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        try {
            // Parse settings JSON
            const parsedSettings = JSON.parse(settingsInput);
            
            const payload = {
                version: formData.version,
                modificationReason: formData.modificationReason,
                settings: parsedSettings
            };

            console.log('Updating configuration with payload:', payload);
            
            await modifyConfiguration({ configId: config.id, configData: payload });
            
            showNotification('Cập nhật cấu hình thành công!', 'success');
            
            // Reset form
            setFormData({
                version: '',
                modificationReason: 'Điều chỉnh tham số phát hiện để tối ưu hiệu suất',
                settings: {}
            });
            setSettingsInput('');
            
            // Callback
            onUpdated && onUpdated();
            onClose();
            
        } catch (error) {
            console.error('Error updating configuration:', error);
            const errorMsg = error?.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật cấu hình';
            showNotification(errorMsg, 'error');
        }
    };



    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <FaEdit className="mr-2 text-blue-600" />
                            Chỉnh sửa Cấu hình
                        </h3>
                        <button
                            onClick={onClose}
                            disabled={isModifyingConfiguration}
                            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Config ID Info */}
                    <div className="bg-gray-50 p-3 rounded-md mb-4">
                        <div className="text-sm">
                            <span className="font-medium text-gray-700">ID:</span>
                            <code className="ml-2 bg-white px-2 py-1 rounded text-xs font-mono border">
                                {config.id}
                            </code>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Current Configuration Info */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="text-sm font-semibold text-blue-700 mb-2">Thông tin cấu hình hiện tại</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="font-medium text-blue-600">Tên:</span>
                                    <span className="ml-2 text-blue-900">{config.name}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-blue-600">Loại:</span>
                                    <span className="ml-2 text-blue-900">{config.configType}</span>
                                </div>
                                {config.instrumentModel && (
                                    <div>
                                        <span className="font-medium text-blue-600">Thiết bị:</span>
                                        <span className="ml-2 text-blue-900">{config.instrumentModel}</span>
                                    </div>
                                )}
                                <div>
                                    <span className="font-medium text-blue-600">Phiên bản hiện tại:</span>
                                    <span className="ml-2 text-blue-900">v{config.version}</span>
                                </div>
                            </div>
                        </div>

                        {/* Version */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phiên bản mới *
                            </label>
                            <input
                                type="text"
                                value={formData.version}
                                onChange={(e) => handleInputChange('version', e.target.value)}
                                placeholder="VD: 1.0.2, 2.1.0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Nên tăng version khi có thay đổi (VD: từ 1.0.1 → 1.0.2)
                            </p>
                        </div>

                        {/* Settings */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Cài đặt Settings *
                            </label>
                            <textarea
                                value={settingsInput}
                                onChange={(e) => setSettingsInput(e.target.value)}
                                placeholder={`{
  "protocol": "ASTM",
  "baudRate": 9600,
  "timeout": 10000
}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical font-mono text-sm"
                                rows={8}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Nhập JSON object hợp lệ cho cài đặt cấu hình
                            </p>
                        </div>

                        {/* Modification Reason */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Lý do chỉnh sửa *
                            </label>
                            <input
                                type="text"
                                value={formData.modificationReason}
                                onChange={(e) => handleInputChange('modificationReason', e.target.value)}
                                placeholder="VD: Tăng thời gian timeout do kết nối chập chờn"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                maxLength={255}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Ghi chú lý do thay đổi cấu hình này (tối đa 255 ký tự)
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isModifyingConfiguration}
                                className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isModifyingConfiguration}
                                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {isModifyingConfiguration ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" size={14} />
                                        Đang cập nhật...
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="mr-2" size={14} />
                                        Cập nhật
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditConfigurationModal;