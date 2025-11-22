import React, { useEffect, useState } from 'react';
import { useNotifier } from '../../../../contexts/NotifierContext';
import patientService from '../../../../services/patientService';
import Select from 'react-select';
import { useQueryClient } from '@tanstack/react-query';

const PatientsModal = ({ mode = 'create', initialData = null, onClose, onSaved }) => {
    const { showNotification } = useNotifier();
    const [form, setForm] = useState({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        phone: '',
        email: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [provinceOptions, setProvinceOptions] = useState([]);
    const queryClient = useQueryClient();

    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/p/')
            .then(res => res.json())
            .then(data => {
                const options = data.map(item => ({ value: item.name, label: item.name }));
                setProvinceOptions(options);
            })
            .catch(() => {
                setProvinceOptions([]);
            });
    }, []);

    useEffect(() => {
        if (initialData) {
            setForm({
                fullName: initialData.fullName || initialData.full_name || '',
                dateOfBirth: initialData.dateOfBirth || initialData.date_of_birth || '',
                gender: initialData.gender || '',
                phone: initialData.phone || '',
                email: initialData.email || '',
                address: initialData.address || ''
            });
        } else {
            setForm({ fullName: '', dateOfBirth: '', gender: '', phone: '', email: '', address: '' });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleProvinceChange = (selectedOption) => {
        setForm(prev => ({ ...prev, address: selectedOption ? selectedOption.value : '' }));
    };

    // custom styles for react-select
    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '44px',
            height: '44px',
            borderRadius: '6px',
            borderColor: state.isFocused ? '#2563eb' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 1px rgba(37,99,235,0.2)' : provided.boxShadow
        }),
        valueContainer: (provided) => ({ ...provided, padding: '6px 12px' }),
        input: (provided) => ({ ...provided, margin: 0, padding: 0 }),
        indicatorSeparator: () => ({ display: 'none' }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 })
    };

    const validate = () => {
        const missing = [];
        if (!form.fullName.trim()) missing.push('Họ và tên');
        if (!form.dateOfBirth) missing.push('Ngày sinh');
        if (!form.gender) missing.push('Giới tính');
        if (!form.phone.trim()) missing.push('Số điện thoại');
        if (!form.email.trim()) missing.push('Email');
        if (!form.address.trim()) missing.push('Địa chỉ');
        if (missing.length > 0) {
            showNotification(`Thiếu trường: ${missing.join(', ')}`, 'error');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            if (mode === 'create') {
                const data = await patientService.createPatientMedicalRecord(form);
                showNotification('Tạo bệnh án thành công', 'success');
                // invalidate the list so it refetches
                queryClient.invalidateQueries({ queryKey: ['patientMedicalRecords'] });
                onSaved && onSaved(data);
            } else {
                // update mode: prefer medicalRecordCode (MRC) as identifier, fall back to other ids
                const recordKey = initialData?.medicalRecordCode || initialData?.medicalRecord_code || initialData?.medicalRecordId || initialData?.medicalRecord_id || initialData?.id;
                const data = await patientService.updatePatientMedicalRecord(recordKey, form);
                showNotification('Cập nhật bệnh án thành công', 'success');
                // invalidate list and detail
                queryClient.invalidateQueries({ queryKey: ['patientMedicalRecords'] });
                if (recordKey) queryClient.invalidateQueries({ queryKey: ['patientMedicalRecord', recordKey] });
                onSaved && onSaved(data);
            }
            onClose && onClose();
        } catch (err) {
            console.error('Save patient error', err);
            const msg = err?.response?.data?.message || err.message || (mode === 'create' ? 'Tạo bệnh án thất bại' : 'Cập nhật thất bại');
            showNotification(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{mode === 'create' ? 'Thêm Bệnh Án Mới' : 'Chỉnh Sửa Bệnh Án'}</h3>
                        <button onClick={() => onClose && onClose()} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium">Họ và Tên</label>
                            <input name="fullName" value={form.fullName} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Ngày sinh</label>
                            <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Giới tính</label>
                            <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                                <option value="">Chọn</option>
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                                <option value="OTHER">Khác</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Số điện thoại</label>
                            <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                        </div>
                        <div>
                            <Select
                                options={provinceOptions}
                                placeholder="Chọn tỉnh/thành phố"
                                value={provinceOptions.find(option => option.value === form.address) || null}
                                onChange={handleProvinceChange}
                                styles={customSelectStyles}
                                classNamePrefix="react-select"
                                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                menuPosition="fixed"
                                isClearable
                            />
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
                                {loading ? (mode === 'create' ? 'Đang tạo...' : 'Đang cập nhật...') : (mode === 'create' ? 'Tạo bệnh án' : 'Cập nhật bệnh án')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientsModal;