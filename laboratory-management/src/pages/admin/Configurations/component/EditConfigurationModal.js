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
        name: '',
        description: '',
        dataType: 'STRING',
        value: '',
        modificationReason: 'Điều chỉnh tham số phát hiện để tối ưu hiệu suất'
    });

    // Initialize form data when config changes
    useEffect(() => {
        if (config) {
            setFormData({
                name: config.name || '',
                description: config.description || '',
                dataType: config.dataType || 'STRING',
                value: config.dataType === 'JSON' 
                    ? (typeof config.value === 'string' ? config.value : JSON.stringify(config.value, null, 2))
                    : (config.value?.toString() || ''),
                modificationReason: 'Điều chỉnh tham số phát hiện để tối ưu hiệu suất'
            });
        }
    }, [config]);

    if (!isOpen || !config) return null;

    const dataTypes = [
        { value: 'STRING', label: 'Chuỗi (STRING)' },
        { value: 'INTEGER', label: 'Số nguyên (INTEGER)' },
        { value: 'BOOLEAN', label: 'Boolean (TRUE/FALSE)' },
        { value: 'JSON', label: 'Đối tượng JSON' }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = () => {
        const { name, description, dataType, value } = formData;
        
        if (!name.trim()) {
            showNotification('Vui lòng nhập tên cấu hình', 'error');
            return false;
        }
        
        if (!description.trim()) {
            showNotification('Vui lòng nhập mô tả', 'error');
            return false;
        }
        
        if (!value.trim()) {
            showNotification('Vui lòng nhập giá trị', 'error');
            return false;
        }

        // Validate based on data type
        if (dataType === 'INTEGER') {
            if (isNaN(value) || !Number.isInteger(Number(value))) {
                showNotification('Giá trị phải là số nguyên hợp lệ', 'error');
                return false;
            }
        }
        
        if (dataType === 'BOOLEAN') {
            const booleanValue = value.toLowerCase();
            if (!['true', 'false', '1', '0'].includes(booleanValue)) {
                showNotification('Giá trị Boolean phải là: true, false, 1 hoặc 0', 'error');
                return false;
            }
        }
        
        if (dataType === 'JSON') {
            try {
                JSON.parse(value);
            } catch (error) {
                showNotification('Giá trị JSON không hợp lệ', 'error');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        try {
            // Process value based on data type
            let processedValue = formData.value;
            
            if (formData.dataType === 'INTEGER') {
                processedValue = Number(formData.value);
            } else if (formData.dataType === 'BOOLEAN') {
                const boolValue = formData.value.toLowerCase();
                processedValue = boolValue === 'true' || boolValue === '1';
            } else if (formData.dataType === 'JSON') {
                // Keep as string for JSON type
                processedValue = formData.value;
            }

            const payload = {
                newValue:{
                    ...formData,
                    value: processedValue
                },
                modificationReason: formData.modificationReason || 'Cập nhật cấu hình hệ thống'
            };

            console.log('Updating configuration with payload:', payload);
            
            // await modifyConfiguration(config.id, payload);
            
            // showNotification('Cập nhật cấu hình thành công!', 'success');
            
            // // Callback
            // onUpdated && onUpdated();
            // onClose();
            
        } catch (error) {
            console.error('Error updating configuration:', error);
            const errorMsg = error?.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật cấu hình';
            showNotification(errorMsg, 'error');
        }
    };

    const getValuePlaceholder = () => {
        switch (formData.dataType) {
            case 'STRING':
                return 'Nhập chuỗi văn bản...';
            case 'INTEGER':
                return 'Nhập số nguyên (VD: 20)';
            case 'BOOLEAN':
                return 'Nhập true/false hoặc 1/0';
            case 'JSON':
                return 'Nhập JSON hợp lệ (VD: {"key": "value"})';
            default:
                return 'Nhập giá trị...';
        }
    };

    const renderValueInput = () => {
        if (formData.dataType === 'JSON') {
            return (
                <textarea
                    value={formData.value}
                    onChange={(e) => handleInputChange('value', e.target.value)}
                    placeholder={getValuePlaceholder()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical font-mono text-sm"
                    rows={6}
                    required
                />
            );
        }

        return (
            <input
                type={formData.dataType === 'INTEGER' ? 'number' : 'text'}
                value={formData.value}
                onChange={(e) => handleInputChange('value', e.target.value)}
                placeholder={getValuePlaceholder()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                {...(formData.dataType === 'INTEGER' && { step: '1' })}
            />
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
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
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tên cấu hình *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="VD: Chính sách khóa tài khoản"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mô tả *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="VD: Tính năng bảo mật này được kích hoạt khi người dùng nhập sai mật khẩu nhiều lần."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
                                rows={3}
                                required
                            />
                        </div>

                        {/* Data Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Kiểu dữ liệu *
                            </label>
                            <select
                                value={formData.dataType}
                                onChange={(e) => handleInputChange('dataType', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            >
                                {dataTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-amber-600 mt-1">
                                ⚠️ Thay đổi kiểu dữ liệu có thể ảnh hưởng đến giá trị hiện tại
                            </p>
                        </div>

                        {/* Value */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Giá trị *
                            </label>
                            {renderValueInput()}
                            {formData.dataType === 'JSON' && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Nhập JSON hợp lệ. VD: {`{"timeout": 300, "enabled": true}`}
                                </p>
                            )}
                        </div>

                        {/* Modification Reason */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Lý do chỉnh sửa
                            </label>
                            <input
                                type="text"
                                value={formData.modificationReason}
                                onChange={(e) => handleInputChange('modificationReason', e.target.value)}
                                placeholder="VD: Điều chỉnh tham số phát hiện để tối ưu hiệu suất"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Ghi chú lý do thay đổi cấu hình này
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