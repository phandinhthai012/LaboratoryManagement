
import React, { useState } from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import { useNotifier } from '../../contexts/NotifierContext';
import authService from '../../services/authService';


const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { showNotification } = useNotifier();
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Vui lòng nhập email.');
            setSuccess(false);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setMessage('');
        setError('');
        try {
            const response = await authService.forgotPassword(email);
            console.log('Forgot Password Response:', response);
            if (response.code === 204) {
                setSuccess(true);
                showNotification('Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn', 'success');
            }
        } catch (error) {
            setError(error?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
            showNotification('Không thể gửi yêu cầu đặt lại mật khẩu', 'error');
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <AuthLayout>
            <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200 mt-8">
                <h1 className="text-2xl font-bold text-center mb-2">Quên Mật Khẩu</h1>
                <p className="text-center text-gray-500 mb-6">
                    Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="text-center">
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            Link đặt lại mật khẩu đã được gửi đến email của bạn
                        </div>
                        <a href="/login" className="text-blue-600 hover:underline">
                            Quay lại trang đăng nhập
                        </a>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                                placeholder="Nhập email của bạn"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-gray-900 text-white py-2 rounded font-semibold hover:bg-gray-800 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu đặt lại mật khẩu'}
                        </button>
                        <div className="text-center">
                            <a href="/login" className="text-blue-600 hover:underline">
                                Quay lại đăng nhập
                            </a>
                        </div>
                    </form>
                )}
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
