// src/pages/admin/Tests/component/CreateTestTypeModal.js
import React, { useState } from 'react';
import { useAllTestParameters } from '../../../../hooks/useWareHouse';
import testOrderService from '../../../../services/testOrderService';
import { useNotifier } from '../../../../contexts/NotifierContext';
import { useQueryClient } from '@tanstack/react-query';
import { useTestOrder } from '../../../../hooks/useTestOrder';

const CreateTestTypeModal = ({ isOpen, onClose, onCreated }) => {
    const { showNotification } = useNotifier();
    const queryClient = useQueryClient();
    const { createTestType, isCreateTestTypeLoading } = useTestOrder();
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        reagentName: '',
        requiredVolume: 0,
        testParameterIds: []
    });
    const [loading, setLoading] = useState(false);

    // Lấy danh sách thông số để chọn
    const { data: paramsRes, isLoading: paramsLoading } = useAllTestParameters({size: 50, sort: 'paramName,asc'});
    const testParameters = paramsRes?.data?.values || [];
    console.log('Loaded test parameters:', testParameters);

    const handleCheckboxChange = (paramId) => {
        setFormData(prev => {
            const currentIds = prev.testParameterIds;
            if (currentIds.includes(paramId)) {
                return { ...prev, testParameterIds: currentIds.filter(id => id !== paramId) };
            } else {
                return { ...prev, testParameterIds: [...currentIds, paramId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.testParameterIds.length === 0) {
            showNotification('Vui lòng chọn ít nhất 1 thông số', 'warning');
            return;
        }
        console.log('Submitting form data:', formData);

        setLoading(true);
        try {
            const result = await createTestType(formData);
            console.log('Created test type:', result);
            // Reset form
            setFormData({
                name: '',
                description: '',
                reagentName: '',
                requiredVolume: 0,
                testParameterIds: []
            });
            
            // Gọi callback với dữ liệu test type mới tạo
            onCreated && onCreated(result||result?.data );
            
            onClose();
        } catch (error) {
            showNotification('Tạo thất bại: ' + (error.response?.data?.message || error.message), 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto my-8">
                <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Tạo Loại Xét Nghiệm</h3>
                        <button 
                            onClick={onClose} 
                            className="text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên loại xét nghiệm *</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    placeholder="VD: Huyết học lần 1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Thể tích (mL)</label>
                                <input 
                                    type="number" 
                                    step="0.1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={formData.requiredVolume}
                                    onChange={e => setFormData({...formData, requiredVolume: Number(e.target.value)})}
                                    placeholder="0.0"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Thuốc thử</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={formData.reagentName}
                                    onChange={e => setFormData({...formData, reagentName: e.target.value})}
                                    placeholder="Tên thuốc thử"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    placeholder="Mô tả ngắn gọn"
                                />
                            </div>
                        </div>

                        {/* Chọn thông số */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Chọn thông số xét nghiệm ({formData.testParameterIds.length})</label>
                            <div className="border border-gray-300 rounded-md h-48 overflow-y-auto p-3 bg-gray-50">
                                {paramsLoading ? (
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                        <span>Đang tải thông số...</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        {testParameters.map(param => (
                                            <label key={param.testParameterId} className="flex items-start space-x-2 p-2 hover:bg-white rounded-md cursor-pointer text-sm border border-transparent hover:border-gray-200 transition-all">
                                                <input 
                                                    type="checkbox"
                                                    checked={formData.testParameterIds.includes(param.testParameterId)}
                                                    onChange={() => handleCheckboxChange(param.testParameterId)}
                                                    className="mt-0.5 flex-shrink-0 text-blue-600 focus:ring-blue-500"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-semibold text-blue-600 truncate">{param.abbreviation}</div>
                                                    <div className="text-gray-700 truncate">{param.paramName}</div>
                                                    <div className="text-gray-500 text-xs mt-1">
                                                        {param.parameterRanges?.[0]?.unit} • {param.parameterRanges?.length || 0} khoảng
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="px-5 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                            >
                                Hủy
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading || formData.testParameterIds.length === 0}
                                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center gap-2"
                            >
                                {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                <span>{loading ? 'Đang tạo...' : 'Tạo Loại XN'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTestTypeModal;