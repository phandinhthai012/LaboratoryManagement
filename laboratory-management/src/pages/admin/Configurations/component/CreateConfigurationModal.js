import React, { useState } from 'react';
import { FaTimes, FaPlus, FaSpinner, FaCogs } from 'react-icons/fa';
import { useNotifier } from '../../../../contexts/NotifierContext';
import { useWareHouse } from '../../../../hooks/useWareHouse';

const CreateConfigurationModal = ({ isOpen, onClose, onCreated }) => {
    const { showNotification } = useNotifier();
    const { createConfigurations, isCreatingConfigurations } = useWareHouse();
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        configType: 'GENERAL',
        instrumentModel: '',
        instrumentType: '',
        version: '1.0',
        settings: {}
    });
    const [settingsInput, setSettingsInput] = useState('');


    if (!isOpen) return null;

    const configTypes = [
        { value: 'GENERAL', label: 'Chung (GENERAL)' },
        { value: 'SPECIFIC', label: 'Cụ thể (SPECIFIC)' }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = () => {
        const { name, configType, instrumentModel, instrumentType, version, settings, description } = formData;

        if (!name.trim()) {
            showNotification('Vui lòng nhập tên cấu hình', 'error');
            return false;
        }
        const namePattern = /^[A-Z0-9]+(_[A-Z0-9]+)*$/;
        if (!namePattern.test(name)) {
            showNotification('Tên cấu hình phải viết hoa, cách nhau bằng dấu gạch dưới (VD: CONFIG_NAME)', 'error');
            return false;
        }
        if (name.length > 255) {
            showNotification('Tên cấu hình không được vượt quá 255 ký tự', 'error');
            return false;
        }

        if (formData.description && formData.description.length > 1000) {
            showNotification('Mô tả không được vượt quá 1000 ký tự', 'error');
            return false;
        }
        if (configType === 'SPECIFIC') {
            if (!instrumentModel.trim()) {
                showNotification('Vui lòng nhập mô hình thiết bị cho cấu hình cụ thể', 'error');
                return false;
            }
            if (!instrumentType.trim()) {
                showNotification('Vui lòng nhập loại thiết bị cho cấu hình cụ thể', 'error');
                return false;
            }
        }

        if (!version.trim()) {
            showNotification('Vui lòng nhập phiên bản', 'error');
            return false;
        }

        // Validate settings JSON
        if (!settingsInput.trim()) {
            showNotification('Vui lòng nhập cấu hình settings', 'error');
            return false;
        }

        try {
            const parsedSettings = JSON.parse(settingsInput);
            if (Object.keys(parsedSettings).length === 0) {
                showNotification('Settings không được để trống', 'error');
                return false;
            }
        } catch (error) {
            showNotification('Cấu hình settings phải là JSON hợp lệ', 'error');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        try {
            const parsedSettings = JSON.parse(settingsInput);

            const payload = {
                ...formData,
                settings: parsedSettings
            };
            // Remove instrumentModel and instrumentType if configType is GENERAL
            if (formData.configType === 'GENERAL') {
                delete payload.instrumentModel;
                delete payload.instrumentType;
            }
            console.log('Payload to be sent:', payload);
            const response = await createConfigurations(payload);
            setFormData({
                name: '',
                description: '',
                configType: 'GENERAL',
                instrumentModel: '',
                instrumentType: '',
                version: '1.0',
                settings: {}
            });
            setSettingsInput('');

            showNotification('Tạo cấu hình thành công!', 'success');
            // Callback
            onCreated && onCreated(response);
            onClose();

        } catch (error) {
            console.error('Error creating configuration:', error);
            const errorMsg = error?.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo cấu hình';
            showNotification(errorMsg, 'error');
        } finally {

        }
    };



    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <FaCogs className="mr-2 text-blue-600" />
                            Tạo Cấu hình Mới
                        </h3>
                        <button
                            onClick={onClose}
                            disabled={isCreatingConfigurations}
                            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tên cấu hình *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value.toUpperCase())}
                                placeholder="VD: GLOBAL_HL7_TIMEOUT_CONFIG"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                maxLength={255}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Tên phải viết hoa, cách nhau bằng dấu gạch dưới
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mô tả
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="VD: Cấu hình timeout chung cho tất cả các kết nối HL7"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
                                rows={3}
                                maxLength={1000}
                            />
                        </div>

                        {/* Config Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Loại cấu hình *
                            </label>
                            <select
                                value={formData.configType}
                                onChange={(e) => handleInputChange('configType', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            >
                                {configTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Instrument fields - only show if SPECIFIC */}
                        {formData.configType === 'SPECIFIC' && (
                            <div className="bg-gray-50 p-4 rounded-md space-y-4">
                                <h4 className="text-sm font-semibold text-gray-800 mb-3">Thông tin thiết bị cụ thể</h4>
                                {/* Instrument Model */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mô hình thiết bị *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.instrumentModel}
                                        onChange={(e) => handleInputChange('instrumentModel', e.target.value)}
                                        placeholder="VD: C60001"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                {/* Instrument Type */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Loại thiết bị *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.instrumentType}
                                        onChange={(e) => handleInputChange('instrumentType', e.target.value)}
                                        placeholder="VD: Chemistry Analyzer01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        )}
                        {/* Version */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phiên bản *
                            </label>
                            <input
                                type="text"
                                value={formData.version}
                                onChange={(e) => handleInputChange('version', e.target.value)}
                                placeholder="VD: 1.0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {/* Settings */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Cấu hình Settings *
                            </label>
                            <textarea
                                value={settingsInput}
                                onChange={(e) => setSettingsInput(e.target.value)}
                                placeholder={`{
  "connectionTimeout": 30000,
  "readTimeout": 15000,
  "retryCount": 3
}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical font-mono text-sm"
                                rows={6}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Nhập JSON hợp lệ cho cấu hình settings
                            </p>
                        </div>
                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isCreatingConfigurations}
                                className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isCreatingConfigurations}
                                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {isCreatingConfigurations ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" size={14} />
                                        Đang tạo...
                                    </>
                                ) : (
                                    <>
                                        <FaPlus className="mr-2" size={14} />
                                        Tạo cấu hình
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

export default CreateConfigurationModal;