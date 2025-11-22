import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { fallbackProvinces } from '../../../../store/mockData';
const UserModal = ({ open, onClose, onSubmit, selectedUser, roles = [], departments = [] }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        fullName: '',
        identifyNumber: '',
        gender: '',
        age: '',
        address: '',
        dateOfBirth: '',
        password: '',
        confirmPassword: '',
        roleCode: '',
        status: 'active'
    });
    const [errors, setErrors] = useState({});
    const [provinceOptions, setProvinceOptions] = useState([]);
    useEffect(() => {
        // Debug: log selectedUser when modal opens (remove this in production)
        console.log('[UserModal] selectedUser on open:', selectedUser);
        if (selectedUser) {
            setFormData({
                username: selectedUser.username || selectedUser.userName || '',
                email: selectedUser.email || '',
                phone: selectedUser.phone || '',
                fullName: selectedUser.fullName || '',
                identifyNumber: selectedUser.identifyNumber || '',
                gender: selectedUser.gender || '',
                age: selectedUser.age ?? '',
                address: selectedUser.address || selectedUser.province || '',
                dateOfBirth: selectedUser.dateOfBirth || '',
                password: '',
                confirmPassword: '',
                roleCode: selectedUser.roleCode || '',
                status: selectedUser.status || 'active'
            });
        } else {
            setFormData({
                username: '',
                email: '',
                phone: '',
                fullName: '',
                identifyNumber: '',
                gender: '',
                age: '',
                address: '',
                dateOfBirth: '',
                password: '',
                confirmPassword: '',
                roleCode: '',
                status: 'active'
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
                // Use fallback data
                // setProvinceOptions(fallbackProvinces);
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
    const editing = !!selectedUser;
    const editingHasUsername = editing && (!!selectedUser?.username || !!selectedUser?.userName);
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

    const validate = () => {
        const e = {};
        // Determine username for validation: prefer trimmed formData.username, otherwise selectedUser fields
        const rawUsername = (formData.username || '').toString();
        const trimmedFormUsername = rawUsername.trim();
        const usernameValue = (!editing)
            ? trimmedFormUsername
            : (trimmedFormUsername || (editingHasUsername ? (selectedUser?.username || selectedUser?.userName) : ''));

        // Only validate username when creating or when editing user that already has a username
        if (!editing || editingHasUsername) {
            if (!usernameValue) e.username = 'Tên đăng nhập là bắt buộc';
        }

        // Validate other required fields when creating
        // userService.createUser requires: username, email, phone, fullName, gender, age, address, dateOfBirth, password, identifyNumber
        if (!formData.fullName.toString().trim()) e.fullName = 'Họ và tên là bắt buộc';
        if (!formData.email.toString().trim()) e.email = 'Email là bắt buộc';
        if (!editing) {
            if (!formData.phone.toString().trim()) e.phone = 'Số điện thoại là bắt buộc';
            if (!formData.gender) e.gender = 'Giới tính là bắt buộc';
            if (!formData.age && formData.age !== 0) e.age = 'Tuổi là bắt buộc';
            if (!formData.address.toString().trim()) e.address = 'Địa chỉ là bắt buộc';
            if (!formData.dateOfBirth) e.dateOfBirth = 'Ngày sinh là bắt buộc';
            if (!formData.identifyNumber.toString().trim()) e.identifyNumber = 'CCCD/CMND là bắt buộc';
            if (!formData.password) e.password = 'Mật khẩu là bắt buộc';
        } else {
            // when editing, password is optional; only validate confirm if password provided
            if (formData.password && formData.password !== formData.confirmPassword) e.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        if (!validate()) return;

        // ensure username preserved for edit: use trimmed formData.username if present, otherwise fallback to selectedUser
        const rawUsername = (formData.username || '').toString();
        const trimmedFormUsername = rawUsername.trim();
        let usernameToSend;
        if (!editing) {
            usernameToSend = trimmedFormUsername || '';
        } else if (editingHasUsername) {
            usernameToSend = trimmedFormUsername || selectedUser?.username || selectedUser?.userName || '';
        } else {
            // editing and the user has no username property: do not send username at all
            usernameToSend = undefined;
        }

        const payload = {
            // only include username when defined (create OR editing with existing username)
            ...(typeof usernameToSend !== 'undefined' ? { username: usernameToSend } : {}),
            email: formData.email,
            phone: formData.phone,
            fullName: formData.fullName,
            identifyNumber: formData.identifyNumber,
            gender: formData.gender,
            age: formData.age ? Number(formData.age) : undefined,
            address: formData.address,
            dateOfBirth: formatDateToMMDDYYYY(formData.dateOfBirth),
            password: formData.password || undefined,
            roleCode: formData.roleCode,
            status: formData.status
        };
        // Remove undefined keys
        Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);
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
                        {/* Username: show only when creating; when editing keep an invisible hidden input */}
                        {selectedUser ? (
                            <input
                                type="hidden"
                                name="username"
                                value={formData.username || selectedUser?.username || selectedUser?.userName || ''}
                            />
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập *</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Tên đăng nhập"
                                />
                                {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username}</p>}
                            </div>
                        )}


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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="+84901234567"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CCCD / CMND</label>
                            <input
                                type="text"
                                value={formData.identifyNumber}
                                onChange={(e) => setFormData({ ...formData, identifyNumber: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="012345678901"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Chọn</option>
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                                <option value="OTHER">Khác</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tuổi</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="22"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <Select
                                options={provinceOptions}
                                placeholder="Chọn tỉnh/thành phố"
                                value={provinceOptions.find(option => option.value === formData.address)}
                                onChange={handleProvinceChange}
                                className={`w-full ${errors.address ? 'border-red-500' : ''}`}
                            />
                            {errors.province && (
                                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                            <input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleDateOfBirthChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò *</label>
                            <select
                                value={formData.roleCode}
                                onChange={(e) => setFormData({ ...formData, roleCode: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Chọn vai trò</option>
                                {roles.map((r, i) => (
                                    <option key={i} value={r.roleCode || r.code || r.name}>
                                        {r.roleName || r.name || r.roleCode}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Không hiển thị password khi đang chỉnh sửa */}
                        {!selectedUser && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="P@ssw0rd123"
                                    />
                                    {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="P@ssw0rd123"
                                    />
                                    {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
                                </div>
                            </>
                        )}

                        <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                Hủy
                            </button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
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