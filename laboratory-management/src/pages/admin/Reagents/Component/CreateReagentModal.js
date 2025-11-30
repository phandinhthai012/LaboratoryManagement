import React, { useState } from "react";
import { useAllVendors } from "../../../../hooks/useWareHouse";
import { useAllReagentTypes } from "../../../../hooks/useWareHouse";
import { FaTimes, FaSpinner, FaVials, FaCalendarAlt } from 'react-icons/fa';
import Select from 'react-select';
import { useAuth } from '../../../../contexts/AuthContext';
import { useWareHouse } from "../../../../hooks/useWareHouse";
const CreateReagentModal = ({ isOpen, onClose, onCreated }) => {
    const { user } = useAuth();
    console.log('Current User:', user);
    const { data: reagentTypesRes, isLoading: isLoadingReagentTypes } = useAllReagentTypes();
    const { data: vendorsRes, isLoading: isLoadingVendors } = useAllVendors({size:50,page:0});
    const { receiveReagantHistoryForVendorSupply } = useWareHouse();
    console.log('Reagent Types:', reagentTypesRes);
    console.log('Vendors:', vendorsRes);

    const [formData, setFormData] = useState({
        reagentTypeId: '',
        vendorId: '',
        vendorName: '',
        poNumber: '',
        orderDate: '',
        receiptDate: '',
        quantityReceived: '',
        unitOfMeasure: '',
        lotNumber: '',
        expirationDate: '',
        initialStorageLocation: '',
        status: 'RECEIVED'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const reagentTypes = reagentTypesRes?.data || [];
    const vendors = vendorsRes?.data?.values || [];

    if (!isOpen) return null;

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.reagentTypeId) newErrors.reagentTypeId = 'Vui lòng chọn loại hóa chất';
        if (!formData.vendorId) newErrors.vendorId = 'Vui lòng chọn nhà cung cấp';
        if (!formData.poNumber) newErrors.poNumber = 'Vui lòng nhập số PO';
        if (!formData.orderDate) newErrors.orderDate = 'Vui lòng chọn ngày đặt hàng';
        if (!formData.receiptDate) newErrors.receiptDate = 'Vui lòng chọn ngày nhận';
        if (!formData.quantityReceived) newErrors.quantityReceived = 'Vui lòng nhập số lượng nhận';
        if (!formData.unitOfMeasure) newErrors.unitOfMeasure = 'Vui lòng nhập đơn vị đo';
        if (!formData.lotNumber) newErrors.lotNumber = 'Vui lòng nhập số lô';
        if (!formData.expirationDate) newErrors.expirationDate = 'Vui lòng chọn ngày hết hạn';
        if (!formData.initialStorageLocation) newErrors.initialStorageLocation = 'Vui lòng nhập vị trí lưu trữ';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            // Prepare submission data
            const submitData = {
                ...formData,
                receivedByUserId: user.userId,
                quantityReceived: parseFloat(formData.quantityReceived)
            };

            await receiveReagantHistoryForVendorSupply(submitData);
            onCreated();
            onClose();
            // Reset form
            setFormData({
                reagentTypeId: '',
                vendorId: '',
                poNumber: '',
                orderDate: '',
                receiptDate: '',
                quantityReceived: '',
                unitOfMeasure: '',
                lotNumber: '',
                expirationDate: '',
                initialStorageLocation: '',
                status: 'RECEIVED'
            });
            setErrors({});
        } catch (error) {
            console.error('Error creating reagent:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const reagentTypeOptions = reagentTypes.map(type => ({
        value: type.id,
        label: `${type.name} (${type.catalogNumber})`,
        reagentType: type
    }));

    const vendorOptions = vendors.map(vendor => ({
        value: vendor.id,
        label: vendor.name,
        vendor: vendor
    }));

    const statusOptions = [
        { value: 'RECEIVED', label: 'Đã Nhận' },
        { value: 'PARTIAL_SHIPMENT', label: 'Nhận Một Phần' },
        { value: 'RETURNED', label: 'Đã Trả Lại' }
    ];

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <FaVials className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Thêm Hóa Chất Mới</h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Reagent Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại Hóa Chất <span className="text-red-500">*</span>
                            </label>
                            <Select
                                options={reagentTypeOptions}
                                value={reagentTypeOptions.find(opt => opt.value === formData.reagentTypeId)}
                                onChange={(selected) => setFormData(prev => ({ ...prev, reagentTypeId: selected?.value || '' }))}
                                placeholder="Chọn loại hóa chất..."
                                isLoading={isLoadingReagentTypes}
                                className="react-select"
                                classNamePrefix="react-select"
                            />
                            {errors.reagentTypeId && (
                                <p className="mt-1 text-sm text-red-600">{errors.reagentTypeId}</p>
                            )}
                        </div>

                        {/* Vendor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nhà Cung Cấp <span className="text-red-500">*</span>
                            </label>
                            <Select
                                options={vendorOptions}
                                value={vendorOptions.find(opt => opt.value === formData.vendorId)}
                                onChange={(selected) => setFormData(prev => ({ ...prev, vendorId: selected?.value || '', vendorName: selected?.vendor.name || '' }))}
                                placeholder="Chọn nhà cung cấp..."
                                isLoading={isLoadingVendors}
                                className="react-select"
                                classNamePrefix="react-select"
                            />
                            {errors.vendorId && (
                                <p className="mt-1 text-sm text-red-600">{errors.vendorId}</p>
                            )}
                        </div>

                        {/* PO Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số PO <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="poNumber"
                                value={formData.poNumber}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.poNumber ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="VD: PO-2025-0045"
                            />
                            {errors.poNumber && (
                                <p className="mt-1 text-sm text-red-600">{errors.poNumber}</p>
                            )}
                        </div>

                        {/* Order Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày Đặt Hàng <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="orderDate"
                                    value={formData.orderDate}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.orderDate ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                <FaCalendarAlt className="absolute right-3 top-3 text-gray-400 w-4 h-4 pointer-events-none" />
                            </div>
                            {errors.orderDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.orderDate}</p>
                            )}
                        </div>

                        {/* Receipt Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày Nhận <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="receiptDate"
                                value={formData.receiptDate}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.receiptDate ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.receiptDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.receiptDate}</p>
                            )}
                        </div>

                        {/* Quantity Received */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số Lượng Nhận <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="quantityReceived"
                                value={formData.quantityReceived}
                                onChange={handleInputChange}
                                min="0"
                                step="0.01"
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.quantityReceived ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="VD: 100"
                            />
                            {errors.quantityReceived && (
                                <p className="mt-1 text-sm text-red-600">{errors.quantityReceived}</p>
                            )}
                        </div>

                        {/* Unit of Measure */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Đơn Vị Đo <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="unitOfMeasure"
                                value={formData.unitOfMeasure}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.unitOfMeasure ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="VD: Kits, Bottles, Vials"
                            />
                            {errors.unitOfMeasure && (
                                <p className="mt-1 text-sm text-red-600">{errors.unitOfMeasure}</p>
                            )}
                        </div>

                        {/* Lot Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số Lô <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="lotNumber"
                                value={formData.lotNumber}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lotNumber ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="VD: LOT-A500-XYZ"
                            />
                            {errors.lotNumber && (
                                <p className="mt-1 text-sm text-red-600">{errors.lotNumber}</p>
                            )}
                        </div>

                        {/* Expiration Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày Hết Hạn <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="expirationDate"
                                value={formData.expirationDate}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.expirationDate ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.expirationDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.expirationDate}</p>
                            )}
                        </div>

                        {/* Initial Storage Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Vị Trí Lưu Trữ Ban Đầu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="initialStorageLocation"
                                value={formData.initialStorageLocation}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.initialStorageLocation ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="VD: Fridge-01, Shelf-A"
                            />
                            {errors.initialStorageLocation && (
                                <p className="mt-1 text-sm text-red-600">{errors.initialStorageLocation}</p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng Thái
                            </label>
                            <Select
                                options={statusOptions}
                                value={statusOptions.find(opt => opt.value === formData.status)}
                                onChange={(selected) => setFormData(prev => ({ ...prev, status: selected?.value || 'RECEIVED' }))}
                                className="react-select"
                                classNamePrefix="react-select"
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {isSubmitting && <FaSpinner className="w-4 h-4 animate-spin" />}
                            {isSubmitting ? 'Đang tạo...' : 'Tạo Hóa Chất'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateReagentModal;