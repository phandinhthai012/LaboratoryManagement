import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import AuthLayout from '../../layouts/AuthLayout';
import authService from '../../services/authService';
import { encryptPassword } from '../../utils/helpers';
import { formatPhoneNumber, validatePhoneNumber } from '../../utils/phoneFormatter';
import { useNotifier } from '../../contexts/NotifierContext';
import { fallbackProvinces } from '../../store/mockData';
const Register = () => {
    const { showNotification } = useNotifier();
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        fullName: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        province: '',
        password: '',
        confirmPassword: '',
        identifyNumber: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/p/')
            .then(res => res.json())
            .then(data => {
                const options = data.map(item => ({
                    value: item.name,
                    label: item.name
                }));
                setProvinceOptions(options);
            })
            .catch(error => {
                console.error('Failed to fetch provinces:', error);
                // Use fallback data
                setProvinceOptions(fallbackProvinces);
            });
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Special handling for phone number
        if (name === 'phone') {
            const formattedPhone = formatPhoneNumber(value);
            
            setFormData(prev => ({
                ...prev,
                [name]: formattedPhone
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle province change
    const handleProvinceChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            province: selectedOption ? selectedOption.value : ''
        }));
    };

    // Calculate age from date of birth
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 0;
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    const options = {
        year: 'numeric',  // Định dạng năm là YYYY
        month: '2-digit', // Định dạng tháng là MM (luôn 2 chữ số)
        day: '2-digit'    // Định dạng ngày là DD (luôn 2 chữ số)
    };
    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Tên đăng nhập là bắt buộc';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Họ và tên là bắt buộc';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
        } else if (!validatePhoneNumber(formData.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ (phải có định dạng +84xxxxxxxxx)';
        }

        if (!formData.gender) {
            newErrors.gender = 'Giới tính là bắt buộc';
        }

        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Địa chỉ là bắt buộc';
        }

        if (!formData.province) {
            newErrors.province = 'Tỉnh/thành phố là bắt buộc';
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        } else if (!/(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Mật khẩu phải chứa ít nhất 1 ký tự số';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }
        if (!formData.identifyNumber.trim()) {
            newErrors.identifyNumber = 'Số CMND/CCCD là bắt buộc';
        } else if (!/^\d{9}$|^\d{12}$/.test(formData.identifyNumber.trim())) {
            newErrors.identifyNumber = 'Số CMND/CCCD không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const age = calculateAge(formData.dateOfBirth);
            // "Validation failed: dateOfBirth: Date of birth must be in MM/DD/YYYY format"
            const formattedDate = new Date(formData.dateOfBirth).toLocaleDateString('en-US', options);

            const encryptedPassword = await encryptPassword(formData.password);
        
            // Prepare data for API
            const registrationData = {
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                fullName: formData.fullName,
                gender: formData.gender.toUpperCase(),
                age: age,
                address: `${formData.address}, ${formData.province}`,
                dateOfBirth: formattedDate,
                password: encryptedPassword,
                roleCode: 'ROLE_USER',
                identifyNumber: formData.identifyNumber
            };

            console.log('Registration data:', registrationData);
            


            const response = await authService.register(registrationData);
            console.log('Registration response:', response);

            if(response && response.code === 200){
                showNotification('Đăng ký thành công!', 'success');
                const {email, userId, phone, fullName} = response.data;
                setTimeout(() => {
                    navigate('/verify-email', {
                        state: { email, userId, phone, fullName }
                    });
                }, 3000); // Chờ 3 giây trước khi chuyển hướng
            }

        } catch (error) {
            console.error('Registration failed:', error);
            setErrors({
                general: `Đăng ký thất bại. ${error?.response?.data?.message || 'Vui lòng thử lại.'}`,
                ...error?.response?.data?.errors
            });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <AuthLayout>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200 mt-8">
                <h1 className="text-2xl font-bold text-center mb-2">Laboratory Information Management System</h1>
                <p className="text-center text-gray-500 mb-6">Đăng ký để tạo tài khoản mới</p>

                {errors.general && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errors.general}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập *</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.username ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Nhập tên đăng nhập"
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Nhập địa chỉ email"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Nhập họ và tên"
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="+84xxxxxxxxx"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Có thể nhập: 0866952340 (tự động chuyển thành +84866952340)
                        </p>
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                    </div>
                    {/* Identity Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số CMND/CCCD *</label>
                        <input
                            type="text"
                            name="identifyNumber"
                            value={formData.identifyNumber}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.identifyNumber ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Nhập số CMND/CCCD"
                        />
                        {errors.identifyNumber && (
                            <p className="mt-1 text-sm text-red-600">{errors.identifyNumber}</p>
                        )}
                    </div>
                    {/* Gender and Date of Birth Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính *</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.gender ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                                <option value="OTHER">Khác</option>
                            </select>
                            {errors.gender && (
                                <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh *</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.dateOfBirth && (
                                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                            )}
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ cụ thể *</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.address ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện"
                        />
                        {errors.address && (
                            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                        )}
                    </div>

                    {/* Province */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố *</label>
                        <Select
                            options={provinceOptions}
                            placeholder="Chọn tỉnh/thành phố"
                            value={provinceOptions.find(option => option.value === formData.province)}
                            onChange={handleProvinceChange}
                            className={`w-full ${errors.province ? 'border-red-500' : ''}`}
                        />
                        {errors.province && (
                            <p className="mt-1 text-sm text-red-600">{errors.province}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Nhập mật khẩu"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu *</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Nhập lại mật khẩu"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-gray-900 text-white py-3 rounded font-semibold transition ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                            }`}
                    >
                        {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>

                    {/* Login Link */}
                    <div className="text-sm text-center mt-4">
                        <a href="/login" className="text-blue-600 hover:underline">Đã có tài khoản? Đăng nhập</a>
                    </div>
                </form>
            </div>
        </AuthLayout>
    )
}

export default Register;