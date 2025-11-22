import React, { useState, useEffect, useRef } from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaClock, FaArrowLeft } from 'react-icons/fa';
import { useNotifier } from '../../contexts/NotifierContext';
import userService from '../../services/userService';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotifier(); // Fix: destructure showNotification
    const location = useLocation();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(60); // 1 minutes in seconds
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);

    // Get email from navigation state or use default
    // const email = location.state?.email || 'user@example.com';
    const { email, userId, phone, fullName } = location.state || {};
    
    // Debug log only when props change
    useEffect(() => {
        console.log('VerifyEmail Props:', { email, userId, phone, fullName });
    }, [email, userId, phone, fullName]);
    
    // Check if required data exists and redirect if not (only once)
    useEffect(() => {
        if (!email || !userId) {
            console.log('Missing required data, redirecting to register');
            navigate('/register');
        }
    }, [email, userId, navigate]);
    useEffect(() => {
        // Start countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);//1 phút

        return () => clearInterval(timer);
    }, []);

    // Handle OTP input change
    const handleOTPChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste
    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];

        for (let i = 0; i < 6; i++) {
            newOtp[i] = pasteData[i] || '';
        }
        setOtp(newOtp);

        // Focus on first empty input or last input
        const nextEmptyIndex = newOtp.findIndex(val => !val);
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        inputRefs.current[focusIndex]?.focus();
    };

    // Verify OTP
    const handleVerifyOTP = async () => {
        const otpString = otp.join('');

        if (otpString.length !== 6) {
            setError('Vui lòng nhập đầy đủ mã OTP 6 số');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            console.log('Verifying OTP:', { email, otp: otpString });

            const response = await userService.verifyEmail({
                userId: userId,
                otp: otpString
            });
            
            console.log('Verify OTP response:', response);
            
            if (response && response.code === 200) {
                showNotification("Xác thực thành công! Chuyển hướng về trang đăng nhập.", 'success');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }

        } catch (error) {
            console.error('OTP verification failed:', error);
            setError('Mã OTP không chính xác hoặc đã hết hạn. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        setResendLoading(true);
        setError('');

        try {
            console.log('Resending OTP to:', email);
            // Simulate API call
            const response = await userService.resendEmail({
                userId: userId
            });
            console.log('Resend OTP response:', response);
            if (response && response.code === 200) {
                showNotification("Mã OTP mới đã được gửi đến email của bạn", 'success');
                // Reset countdown
                setCountdown(60);
                setCanResend(false);
                setOtp(['', '', '', '', '', '']);

                // Start new countdown
                const timer = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            setCanResend(true);
                            clearInterval(timer);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        } catch (error) {
            console.error('Resend OTP failed:', error);
            setError('Không thể gửi lại mã OTP. Vui lòng thử lại.');
        } finally {
            setResendLoading(false);
        }
    };

    // Format countdown time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Don't render if missing required data
    if (!email || !userId) {
        return null;
    }

    return (
        <AuthLayout>
            <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200 mt-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <FaEnvelope className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Xác Thực Email</h1>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Chúng tôi đã gửi mã xác thực 6 số đến email
                    </p>
                    <p>
                        Chào mừng <span className="font-semibold">{fullName}</span>
                    </p>
                    <p className="text-blue-600 font-semibold mt-1">{email}</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {/* OTP Input Fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                            Nhập mã xác thực
                        </label>
                        <div className="flex justify-center space-x-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOTPChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg transition-all duration-200 ${digit
                                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                                        : 'border-gray-300 hover:border-gray-400'
                                        } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
                                    placeholder="0"
                                />
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            Bạn có thể dán mã OTP từ clipboard
                        </p>
                    </div>

                    {/* Verify Button */}
                    <button
                        onClick={handleVerifyOTP}
                        disabled={isLoading || otp.join('').length !== 6}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${isLoading || otp.join('').length !== 6
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                Đang xác thực...
                            </div>
                        ) : (
                            'Xác Thực Email'
                        )}
                    </button>

                    {/* Resend OTP Section */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-3">
                                Không nhận được mã xác thực?
                            </p>

                            {canResend ? (
                                <button
                                    onClick={handleResendOTP}
                                    disabled={resendLoading}
                                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 disabled:opacity-50"
                                >
                                    {resendLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent mr-2"></div>
                                            Đang gửi...
                                        </>
                                    ) : (
                                        'Gửi lại mã'
                                    )}
                                </button>
                            ) : (
                                <div className="flex items-center justify-center text-sm text-gray-500">
                                    <FaClock className="w-4 h-4 mr-2" />
                                    Gửi lại sau {formatTime(countdown)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Back to Register */}
                    <div className="text-center pt-4 border-t border-gray-200">
                        <button
                            onClick={() => navigate('/register')}
                            className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
                        >
                            <FaArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại đăng ký
                        </button>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500">
                        Nếu bạn không thấy email, vui lòng kiểm tra thư mục spam
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
};

export default VerifyEmail;
