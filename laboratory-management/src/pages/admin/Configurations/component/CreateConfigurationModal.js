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
        dataType: 'STRING',
        value: ''
    });

    if (!isOpen) return null;

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
                processedValue = Number(formData.value).toString();
            } else if (formData.dataType === 'BOOLEAN') {
                const boolValue = formData.value.toLowerCase();
                processedValue = (boolValue === 'true' || boolValue === '1') ? 'true' : 'false';
            }

            const payload = {
                ...formData,
                value: processedValue
            };
            
            
            const response = await createConfigurations(payload);
            // Reset form
            setFormData({
                name: '',
                description: '',
                dataType: 'STRING',
                value: ''
            });

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
                    rows={4}
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
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
                                placeholder="VD: Lockout Policy 02"
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
                                placeholder="VD: This security feature is activated when a user enters an incorrect password multiple time."
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