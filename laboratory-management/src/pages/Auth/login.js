import React, { useState } from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import { encryptPassword } from '../../utils/helpers';
import { useNotifier } from '../../contexts/NotifierContext';

const Login = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotifier();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Handle input changes
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

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email hoặc tên đăng nhập là bắt buộc';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            console.log("Form validation failed");
            return;
        }

        setIsLoading(true);

        try {

            const encryptedPassword = await encryptPassword(formData.password);
            console.log("data:", formData.email, encryptedPassword);
            const response = await authService.login({
                username: formData.email,
                password: encryptedPassword
            });
            console.log("Login response:", response);
            if (response.code === 200 && response.data.accessToken) {
                showNotification('Đăng nhập thành công', 'success');
                // Save tokens to localStorage
                const userId = response.data.userId;
                const userData = await authService.getUserById(userId);

                localStorage.setItem('userData', JSON.stringify(userData.data));
                login(userData.data);
                
                switch (userData.data.roleCode) {
                    case 'ROLE_ADMIN':
                    case 'LAB_MANAGER':
                    case 'VIEWER':
                    case 'WATCHER':
                        navigate('/dashboard');
                        break;
                    case 'ROLE_USER':
                        navigate('/normal-dashboard');
                        break;
                    case 'GUEST':
                        navigate('/dashboard');
                        break;
                    default:
                        navigate('/dashboard');
                }
            } else {
                console.log("No access token in response");
                setErrors({
                    general: 'Đăng nhập thất bại. Vui lòng thử lại.'
                });
            }
        } catch (error) {
            console.error('Login failed:', error);
            setErrors({
                general: error?.response?.data?.message || 'Đã xảy ra lỗi trong quá trình đăng nhập'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Quick login function for demo accounts
    const quickLogin = (email, password) => {
        setFormData({ email, password });
        // Auto submit after setting data
        setTimeout(() => {
            const event = { preventDefault: () => { }, stopPropagation: () => { } };
            // handleLogin(event);
        }, 100);
    };

    return (
        <AuthLayout>
            <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200 mt-8">
                <h1 className="text-2xl font-bold text-center mb-2">Laboratory Information Management System</h1>
                <p className="text-center text-gray-500 mb-6">Đăng nhập để truy cập bảng điều khiển của bạn</p>

                {errors.general && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errors.general}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">User Name or Email</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter your email or username"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-gray-900 text-white py-2 rounded font-semibold hover:bg-gray-800 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                    <div className="text-sm text-center mt-4">
                        <a href="/register" className="text-blue-600 hover:underline">Chưa có tài khoản? Đăng ký</a> <br />
                        <a href="/forgot-password" className="text-blue-600 hover:underline">Quên mật khẩu?</a>
                    </div>
                </form>

                <div className="mt-6 bg-gray-50 rounded p-4 text-sm">
                    <div className="font-semibold mb-2">Demo Accounts (Click to auto-login):</div>
                    <div className="space-y-1">
                        <div
                            className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                            onClick={() => quickLogin('nguyenvanla123', 'P@ssword123')}
                        >
                            <span className="font-bold">normalUser:</span> nguyenvanla123 / P@ssword123
                        </div>
                        <div
                            className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                            onClick={() => quickLogin('Thai', '123456789a')}
                        >
                            <span className="font-bold">admin:</span>  Thai / 123456789a
                        </div>
                        
                    </div>
                </div>
            </div>
        </AuthLayout>
    )
}

export default Login;
