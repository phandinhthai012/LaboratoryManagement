import React, { use, useEffect, useState } from 'react';
import { formatPhoneNumber } from '../../../../utils/phoneFormatter';
import Select from 'react-select';
const UserModal = ({ open, onClose, onSubmit, selectedUser, roles = [], isLoading = false }) => {
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        fullName: '',
        userName: '',
        identifyNumber: '',
        gender: '',
        age: '',
        address: '',
        dateOfBirth: '',
        roleCode: ''
    });
    const [errors, setErrors] = useState({});
    const [provinceOptions, setProvinceOptions] = useState([]);
    useEffect(() => {
        if (selectedUser) {
            setFormData({
                email: selectedUser.email || '',
                phone: selectedUser.phone || '',
                fullName: selectedUser.fullName || '',
                username: selectedUser.username || '',
                identifyNumber: selectedUser.identifyNumber || '',
                gender: selectedUser.gender || '',
                age: selectedUser.age ?? '',
                address: selectedUser.address || selectedUser.province || '',
                dateOfBirth: selectedUser.dateOfBirth || '',
                roleCode: selectedUser.roleCode || ''
            });
        } else {
            setFormData({
                email: '',
                phone: '',
                fullName: '',
                username: '',
                identifyNumber: '',
                gender: '',
                age: '',
                address: '',
                dateOfBirth: '',
                roleCode: ''
            });
        }
        setErrors({});
    }, [selectedUser, open]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch('https://provinces.open-api.vn/api/p/');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const options = data.map(item => ({
                    value: item.name,
                    label: item.name
                }));
                setProvinceOptions(options);
            } catch (error) {
                console.error('Failed to fetch provinces:', error);
            }
        };

        fetchProvinces();
    }, []);
    const handleProvinceChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            address: (prev.address && prev.address.toString().trim()) ? prev.address : (selectedOption ? selectedOption.value : '')
        }));
    };

    if (!open) return null;

    // Calculate age from date of birth
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return '';
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 0 ? age : '';
    };

    // Format date to MM/DD/YYYY (backend expects this format)
    const formatDateToMMDDYYYY = (dateInput) => {
        if (!dateInput) return '';
        const date = new Date(dateInput);
        if (isNaN(date)) return dateInput;

        const year = String(date.getFullYear());
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${month}/${day}/${year}`;
    };

    // Handle date of birth change and auto-calculate age
    const handleDateOfBirthChange = (e) => {
        const newDate = e.target.value;
        const calculatedAge = calculateAge(newDate);
        setFormData({
            ...formData,
            dateOfBirth: newDate,
            age: calculatedAge
        });
    };

    // Handle phone number change (no formatting during input)
    const handlePhoneChange = (e) => {
        setFormData({
            ...formData,
            phone: e.target.value
        });
    };

    const validate = () => {
        const e = {};
        
        // Validate required fields according to backend
        if (!formData.email.toString().trim()) {
            e.email = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            e.email = 'Email không hợp lệ';
        }
        
        if (!formData.phone.toString().trim()) {
            e.phone = 'Số điện thoại là bắt buộc';
        } else {
            const phone = formData.phone.toString().trim();
            // Accept both formats: 0xxxxxxxxx or +84xxxxxxxxx
            if (!/^(0\d{9,10}|\+84\d{9,10})$/.test(phone)) {
                e.phone = 'Số điện thoại phải có định dạng 0xxxxxxxxx hoặc +84xxxxxxxxx';
            }
        }
        
        if (!formData.fullName.toString().trim()) {
            e.fullName = 'Họ và tên là bắt buộc';
        } else if (formData.fullName.length > 100) {
            e.fullName = 'Họ và tên không được quá 100 ký tự';
        }
        
        // Only validate identifyNumber for new users (not in edit mode)
        if (!selectedUser) {
            if (!formData.identifyNumber.toString().trim()) {
                e.identifyNumber = 'CCCD/CMND là bắt buộc';
            } else if (!/^\d{8,20}$/.test(formData.identifyNumber)) {
                e.identifyNumber = 'CCCD/CMND phải là 8-20 chữ số';
            }
        }
        
        if (!formData.gender) {
            e.gender = 'Giới tính là bắt buộc';
        } else if (!['MALE', 'FEMALE'].includes(formData.gender)) {
            e.gender = 'Giới tính phải là MALE hoặc FEMALE';
        }
        
        if (!formData.age && formData.age !== 0) {
            e.age = 'Tuổi là bắt buộc';
        } else if (formData.age < 0 || formData.age > 150) {
            e.age = 'Tuổi phải từ 0 đến 150';
        }
        
        if (!formData.address.toString().trim()) {
            e.address = 'Địa chỉ là bắt buộc';
        }
        
        if (!formData.dateOfBirth) {
            e.dateOfBirth = 'Ngày sinh là bắt buộc';
        }
        
        // Only validate roleCode for new users (not in edit mode)
        if (!selectedUser) {
            if (!formData.roleCode) {
                e.roleCode = 'Vai trò là bắt buộc';
            } else if (!formData.roleCode.startsWith('ROLE_')) {
                e.roleCode = 'Mã vai trò phải bắt đầu bằng ROLE_';
            }
        }
        
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        if (!validate()) return;

        const payload = {
            email: formData.email.trim(),
            phone: formatPhoneNumber(formData.phone.trim()), // Format phone only on submit
            fullName: formData.fullName.trim(),
            gender: formData.gender,
            age: Number(formData.age),
            address: formData.address.trim(),
            dateOfBirth: formatDateToMMDDYYYY(formData.dateOfBirth)
        };
        
        // Only include these fields for new users
        if (!selectedUser) {
            payload.identifyNumber = formData.identifyNumber.trim();
            payload.roleCode = formData.roleCode;
        }
        console.log('[UserModal] Submitting payload:', payload, 'isEditMode:', !!selectedUser);
        onSubmit && onSubmit(payload, !!selectedUser);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {selectedUser ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng Mới'}
                    </h3>

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên *</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Đặng Bảo Thông"
                            />
                            {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
                        </div>

                        {/* {selectedUser && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên đăng nhập <span className="text-gray-500 text-xs">(Chỉ hiển thị)</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                                    placeholder="Không có tên đăng nhập"
                                />
                            </div>
                        )} */}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="thong@example.com"
                            />
                            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại * 
                                <span className="text-xs text-gray-500">(Sẽ tự động format khi lưu)</span>
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0901234567 hoặc +84901234567"
                                required
                            />
                            {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                CCCD / CMND * {selectedUser && <span className="text-gray-500 text-xs">(Không thể thay đổi)</span>}
                            </label>
                            <input
                                type="text"
                                value={formData.identifyNumber}
                                onChange={(e) => setFormData({ ...formData, identifyNumber: e.target.value })}
                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    selectedUser ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                                placeholder="022345878441"
                                disabled={!!selectedUser}
                                required
                            />
                            {errors.identifyNumber && <p className="text-sm text-red-600 mt-1">{errors.identifyNumber}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính *</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                            </select>
                            {errors.gender && <p className="text-sm text-red-600 mt-1">{errors.gender}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tuổi *</label>
                            <input
                                type="number"
                                min="0"
                                max="150"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="22"
                                required
                            />
                            {errors.age && <p className="text-sm text-red-600 mt-1">{errors.age}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ *</label>
                            <Select
                                options={provinceOptions}
                                placeholder="Chọn tỉnh/thành phố"
                                value={provinceOptions.find(option => option.value === formData.address)}
                                onChange={handleProvinceChange}
                                className={`w-full ${errors.address ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.address && (
                                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh *</label>
                            <input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleDateOfBirthChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            {errors.dateOfBirth && <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vai trò * {selectedUser && <span className="text-gray-500 text-xs">(Không thể thay đổi)</span>}
                            </label>
                            <select
                                value={formData.roleCode}
                                onChange={(e) => setFormData({ ...formData, roleCode: e.target.value })}
                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    selectedUser ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                                disabled={!!selectedUser}
                                required
                            >
                                <option value="">Chọn vai trò</option>
                                {roles.map((r, i) => (
                                    <option key={i} value={r.roleCode || r.code || r.name}>
                                        {r.roleName || r.name || r.roleCode}
                                    </option>
                                ))}
                            </select>
                            {errors.roleCode && <p className="text-sm text-red-600 mt-1">{errors.roleCode}</p>}
                        </div>



                        <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Hủy
                            </button>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading && (
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                )}
                                {selectedUser ? 'Cập Nhật' : 'Thêm'} Người Dùng
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserModal;