import React, { useState } from 'react';
import testOrderService from '../../../../services/testOrderService';
import { useNotifier } from '../../../../contexts/NotifierContext';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { usePatientMedicalRecords } from '../../../../hooks/usePatienMedicalRecord';

const TestOrderCreateModal = ({ isOpen, onClose, onCreated }) => {
    const { showNotification } = useNotifier();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [medicalRecordCode, setMedicalRecordCode] = useState('');
    const [loading, setLoading] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!medicalRecordCode) {
            showNotification('Vui lòng chọn mã hồ sơ (medicalRecordCode)', 'error');
            return;
        }
        setLoading(true);
        try {
            const payload = { medicalRecordCode };
            const data = await testOrderService.createTestOrder(payload);

            // invalidate test orders list
            queryClient.invalidateQueries({ queryKey: ['testOrders'] });

            showNotification('Tạo đơn xét nghiệm thành công', 'success');

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Tạo Đơn Xét Nghiệm Mới</h3>
                        <button onClick={() => onClose && onClose()} className="text-gray-500">✕</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Bệnh Nhân (Tên — Mã Hồ Sơ)</label>
                            {patientsLoading ? (
                                <div className="text-sm text-gray-500">Đang tải danh sách bệnh nhân...</div>
                            ) : (
                                <select
                                    value={medicalRecordCode}
                                    onChange={(e) => setMedicalRecordCode(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
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

                        <div className="flex justify-end">
                            <button type="button" onClick={() => onClose && onClose()} className="px-4 py-2 mr-2 border rounded">Hủy</button>
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
                                {loading ? 'Đang tạo...' : 'Tạo'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TestOrderCreateModal;
