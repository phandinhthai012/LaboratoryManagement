import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { FaFlask, FaTimes, FaPlay, FaSpinner } from 'react-icons/fa';
import { useNotifier } from '../../../../contexts/NotifierContext';
import {useInitiateSampleAnalysisWithId} from '../../../../hooks/useInstrument';
import { useAllInstruments } from '../../../../hooks/useWareHouse';
const SimulateAnalysisModal = ({ isOpen, onClose, testOrder, onResultsUpdated }) => {
    const { showNotification } = useNotifier();
    const [selectedInstrument, setSelectedInstrument] = useState('');
    const [selectedCassette, setSelectedCassette] = useState('CST-OLD-001');
    
    const { 
        mutateAsync: initiateSampleAnalysis, 
        isPending: isLoadingInitiateSampleAnalysis 
    } = useInitiateSampleAnalysisWithId(testOrder?.id);
    
    // Combined loading state  
    const isRunning = isLoadingInitiateSampleAnalysis;
    const { data: instrumentsData, isLoading: isLoadingInstruments } = useAllInstruments();
    
    // Memoize instruments list
    const instruments = useMemo(() => instrumentsData?.data || [], [instrumentsData]);
    
    // Auto-select first instrument when available
    useEffect(() => {
        if (instruments.length > 0 && !selectedInstrument) {
            setSelectedInstrument(instruments[0].id);
        }
    }, [instruments, selectedInstrument]);
    
    // Validation
    const isValid = useMemo(() => {
        return selectedInstrument && 
               selectedCassette?.trim() && 
               testOrder?.barcode && 
               testOrder?.id;
    }, [selectedInstrument, selectedCassette, testOrder]);

    const simulateAnalysis = useCallback(async () => {
        if (!isValid) {
            showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
            return;
        }

        try {
            showNotification('Đang khởi tạo phân tích mẫu...', 'info');
            
            const payload = {
                instrumentId: selectedInstrument,
                samples: [{
                    barcode: testOrder.barcode,
                    testOrderId: testOrder.id,
                    cassetteId: selectedCassette.trim()
                }]
            };
            
            console.log('Initiate Sample Analysis Payload:', payload);
            await initiateSampleAnalysis(payload);
            
            // Refresh data và đóng modal
            // onResultsUpdated?.();
            
            // Auto close after success
            setTimeout(() => {
                onClose();
            }, 1500);
            
        } catch (error) {
            console.error('Error during analysis simulation:', error);
            const errorMsg = error?.response?.data?.message || 
                           error?.message || 
                           'Có lỗi xảy ra khi chạy phân tích';
            showNotification(errorMsg, 'error');
        }
    }, [isValid, selectedInstrument, selectedCassette, testOrder, initiateSampleAnalysis, showNotification, onClose]);

    // Early returns for better performance
    if (!isOpen || !testOrder) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <FaFlask className="mr-2 text-blue-600" />
                            Mô phỏng phân tích mẫu
                        </h3>
                        <button
                            onClick={onClose}
                            disabled={isRunning}
                            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Test Order Info */}
                    <div className="bg-gray-50 p-3 rounded-md mb-4">
                        <div className="text-sm space-y-1">
                            <div><span className="font-medium">Mã đơn:</span> {testOrder?.orderCode}</div>
                            <div><span className="font-medium">Barcode:</span> {testOrder?.barcode}</div>
                            <div><span className="font-medium">Bệnh nhân:</span> {testOrder?.fullName}</div>
                        </div>
                    </div>

                    {/* Instrument Selection */}
                    <div className="space-y-3 mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Chọn máy phân tích *
                            </label>
                            {isLoadingInstruments ? (
                                <div className="flex items-center space-x-2 text-sm text-gray-500 py-2">
                                    <FaSpinner className="animate-spin" size={14} />
                                    <span>Đang tải danh sách máy...</span>
                                </div>
                            ) : instruments.length > 0 ? (
                                <select
                                    value={selectedInstrument}
                                    onChange={(e) => setSelectedInstrument(e.target.value)}
                                    disabled={isRunning}
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        selectedInstrument ? 'border-gray-300' : 'border-red-300'
                                    }`}
                                    required
                                >
                                    <option value="">-- Chọn máy phân tích --</option>
                                    {instruments.map((instrument) => (
                                        <option key={instrument.id} value={instrument.id}>
                                            {instrument.name} {instrument.model ? `(${instrument.model})` : ''}
                                            {instrument.id}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="text-sm text-red-600 py-2">
                                    ⚠️ Không có máy phân tích nào khả dụng
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mã cassette *
                            </label>
                            <input
                                type="text"
                                value={selectedCassette}
                                onChange={(e) => setSelectedCassette(e.target.value.toUpperCase())}
                                disabled={isRunning}
                                placeholder="Nhập mã cassette (VD: CST-OLD-001)"
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                    selectedCassette.trim() ? 'border-gray-300' : 'border-red-300'
                                }`}
                                required
                                minLength={3}
                            />
                        </div>
                    </div>



                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isRunning}
                            className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={simulateAnalysis}
                            disabled={isRunning || !isValid}
                            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isLoadingInitiateSampleAnalysis ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" size={14} />
                                    Đang gửi yêu cầu...
                                </>
                            ) : (
                                <>
                                    <FaPlay className="mr-2" size={14} />
                                    Bắt đầu phân tích
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimulateAnalysisModal;