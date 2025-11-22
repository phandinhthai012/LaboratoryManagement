import React, { useEffect, useState } from 'react';
import testOrderService from '../../../../services/testOrderService';
import { useNotifier } from '../../../../contexts/NotifierContext';
import { useQueryClient } from '@tanstack/react-query';

const TestOrderUpdateModal = ({ isOpen, onClose, testOrder, onUpdated }) => {
    const { showNotification } = useNotifier();
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        status: 'COMPLETED',
        reviewStatus: 'NONE',
        reviewMode: 'AI'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (testOrder) {
            setForm({
                status: testOrder.status || 'COMPLETED',
                reviewStatus: testOrder.reviewStatus || 'NONE',
                reviewMode: testOrder.reviewMode || 'AI'
            });
        }
    }, [testOrder]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!testOrder) return;
        setLoading(true);
        try {
            const testOrderCode = testOrder.orderCode || testOrder.orderCode || testOrder.id || testOrder.orderCode;
            // use update by code endpoint
            const data = await testOrderService.updateTestOrderByCode(testOrderCode, {
                status: form.status,
                reviewStatus: form.reviewStatus,
                reviewMode: form.reviewMode
            });

            // invalidate test orders list and specific detail if cached
            queryClient.invalidateQueries({ queryKey: ['testOrders'] });
            if (testOrder?.id) queryClient.invalidateQueries({ queryKey: ['testOrder', testOrder.id] });

            showNotification('Cập nhật đơn xét nghiệm thành công', 'success');
            onUpdated && onUpdated(data);
            onClose && onClose();
        } catch (err) {
            console.error('Update test order error', err);
            const msg = err?.response?.data?.message || err.message || 'Cập nhật thất bại';
            showNotification(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Cập Nhật Đơn Xét Nghiệm</h3>
                        <button onClick={() => onClose && onClose()} className="text-gray-500">✕</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                            <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                                <option value="PENDING">PENDING</option>
                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Review Status</label>
                            <select name="reviewStatus" value={form.reviewStatus} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                                <option value="NONE">NONE</option>
                                <option value="AI_REVIEWED">AI_REVIEWED</option>
                                <option value="HUMAN_REVIEWED">HUMAN_REVIEWED</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Review Mode</label>
                            <select name="reviewMode" value={form.reviewMode} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                                <option value="AI">AI</option>
                                <option value="HUMAN">HUMAN</option>
                            </select>
                        </div>

                        <div className="flex justify-end">
                            <button type="button" onClick={() => onClose && onClose()} className="px-4 py-2 mr-2 border rounded">Hủy</button>
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
                                {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TestOrderUpdateModal;
