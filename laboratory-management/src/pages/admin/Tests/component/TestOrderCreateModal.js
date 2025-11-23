import React, { useState } from 'react';
import testOrderService from '../../../../services/testOrderService';
import { useNotifier } from '../../../../contexts/NotifierContext';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { usePatientMedicalRecords } from '../../../../hooks/usePatienMedicalRecord';
import { useTestOrder } from '../../../../hooks/useTestOrder';
import CreateTestTypeModal from './CreateTestTypeModal';

const TestOrderCreateModal = ({ isOpen, onClose, onCreated }) => {
    const { showNotification } = useNotifier();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [medicalRecordCode, setMedicalRecordCode] = useState('');
    const [testTypeId, setTestTypeId] = useState(''); // Thêm state cho test type
    const [testTypeName, setTestTypeName] = useState(''); // Thêm state cho test type name
    const [loading, setLoading] = useState(false);
    const [showCreateTestTypeModal, setShowCreateTestTypeModal] = useState(false); // State cho modal tạo test type
    const {createTestOrder, isCreateLoading} = useTestOrder();
    // load patients to allow selecting by name + medicalRecordCode
    const { data: patientsRes, isLoading: patientsLoading } = usePatientMedicalRecords({ size: 50, page: 0 });
    const patients = patientsRes?.values || [];

    // set default selected code when patients load
    React.useEffect(() => {
        if (!medicalRecordCode && patients.length > 0) {
            setMedicalRecordCode(patients[0].medicalRecordCode || '');
        }
    }, [patients]);

    if (!isOpen) return null;


    const handleTestTypeCreated = (newTestType) => {
        console.log('New test type created:', newTestType);
        const testId =newTestType?.id;
        const testName = newTestType?.name;
        
        setTestTypeId(testId);
        setTestTypeName(testName);
        showNotification(`Tạo loại xét nghiệm "${testName}" thành công!`, 'success');
        setShowCreateTestTypeModal(false);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!medicalRecordCode || medicalRecordCode.trim() === '' || testTypeId.trim() === '') {
            showNotification('Vui lòng chọn mã hồ sơ (medicalRecordCode) và loại xét nghiệm', 'error');
            return;
        }
        setLoading(true);
        try {
            const payload = {
                medicalRecordCode,
                testTypeId
            };
            const data = await createTestOrder(payload);
            console.log('Created test order:', data);
            onCreated && onCreated(data);

            // navigate to detail if id or orderCode returned
            const id = data?.id || data?.orderCode || data?.orderId;
            if (id) {
                // try to navigate to an integer id path, fall back to orderCode
                navigate(`/test-orders/${id}`);
            }

            onClose && onClose();
        } catch (err) {
            console.error('Create test order error', err);
            const msg = err?.response?.data?.message || err.message || 'Tạo thất bại';
            showNotification(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
         <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Tạo Đơn Xét Nghiệm</h3>
                            <button 
                                onClick={() => onClose && onClose()} 
                                className="text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Chọn Bệnh Nhân</label>
                                {patientsLoading ? (
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                        <span>Đang tải danh sách bệnh nhân...</span>
                                    </div>
                                ) : (
                                    <select
                                        value={medicalRecordCode}
                                        onChange={(e) => setMedicalRecordCode(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    >
                                        <option value="">-- Chọn bệnh nhân --</option>
                                        {patients.map(p => (
                                            <option key={p.id || p.medicalRecordCode} value={p.medicalRecordCode}>
                                                {`${p.fullName} — ${p.medicalRecordCode || p.code || ''}`}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Thêm phần chọn/tạo test type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Loại Xét Nghiệm</label>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={testTypeName}
                                            placeholder='Tên loại xét nghiệm'
                                            readOnly
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                        
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={testTypeId}
                                            onChange={(e) => setTestTypeId(e.target.value)}
                                            placeholder="Nhập ID loại xét nghiệm"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateTestTypeModal(true)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors whitespace-nowrap flex items-center gap-1"
                                        >
                                            <span>+</span>
                                            <span>Tạo Mới</span>
                                        </button>
                                    </div>
                                    
                                    {testTypeName && (
                                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                                            <div className="text-sm text-blue-800">
                                                <span className="font-semibold">Tên loại xét nghiệm:</span> {testTypeName}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {testTypeId && (
                                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                            <div className="text-sm text-green-800 flex items-center gap-2">
                                                <span className="text-green-600">✓</span>
                                                <span>ID: <span className="font-mono font-semibold">{testTypeId}</span></span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button 
                                    type="button" 
                                    onClick={() => onClose && onClose()} 
                                    className="px-5 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading || !medicalRecordCode || !testTypeId}
                                    className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center gap-2"
                                >
                                    {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                    <span>{loading ? 'Đang tạo...' : 'Tạo Đơn'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal tạo test type */}
            <CreateTestTypeModal
                isOpen={showCreateTestTypeModal}
                onClose={() => setShowCreateTestTypeModal(false)}
                onCreated={handleTestTypeCreated}
            />
        </>
    );
};

export default TestOrderCreateModal;
