import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import authService from "../../services/authService";
import { useNotifier } from "../../contexts/NotifierContext";

// Password validation constants
const PASSWORD_RULES = {
    minLength: 8,
    maxLength: 20,
    patterns: [
        { regex: /[A-Z]/, message: "ít nhất một chữ in hoa" },
        { regex: /[a-z]/, message: "ít nhất một chữ thường" },
        { regex: /[0-9]/, message: "ít nhất một số" },
        { regex: /[!@#$%^&*]/, message: "ít nhất một ký tự đặc biệt (!@#$%^&*)" }
    ]
};

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotifier();
    const isMountedRef = useRef(true);
    const tokenValidatedRef = useRef(false);

    const [formData, setFormData] = useState(() => ({
        newPassword: "",
        confirmPassword: ""
    }));
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Validate token on mount
    const validateToken = useCallback(async () => {
        if (!token || tokenValidatedRef.current) {
            return;
        }

        if (!token) {
            showNotification('Token không hợp lệ', 'error');
            navigate('/login');
            return;
        }

        try {
            tokenValidatedRef.current = true;
            const response = await authService.validateResetToken(token);
            if((response?.code === 200 || response?.code === 204)) {
                showNotification('Xác thực hợp lệ. Vui lòng đặt lại mật khẩu của bạn.', 'success');
            }
        } catch (error) {
            if (isMountedRef.current) {
                showNotification('Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn', 'error');
                navigate('/forgot-password');
            }
        }
    }, [token, navigate, showNotification]);

    useEffect(() => {
        validateToken();
        
        return () => {
            isMountedRef.current = false;
        };
    }, [validateToken]);

    // const validatePassword = (password) => {
    //     const errors = [];

    //     if (!password) {
    //         errors.push("Vui lòng nhập mật khẩu");
    //         return errors;
    //     }

    //     if (password.length < PASSWORD_RULES.minLength) {
    //         errors.push(`Mật khẩu phải có ít nhất ${PASSWORD_RULES.minLength} ký tự`);
    //     }

    //     if (password.length > PASSWORD_RULES.maxLength) {
    //         errors.push(`Mật khẩu không được vượt quá ${PASSWORD_RULES.maxLength} ký tự`);
    //     }

    //     PASSWORD_RULES.patterns.forEach(pattern => {
    //         if (!pattern.regex.test(password)) {
    //             errors.push(`Mật khẩu phải có ${pattern.message}`);
    //         }
    //     });

    //     return errors;
    // };

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear specific error when typing
        setErrors(prev => {
            if (prev[name]) {
                return {
                    ...prev,
                    [name]: undefined
                };
            }
            return prev;
        });
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setErrors({});

        // Validate password
        // const passwordErrors = validatePassword(formData.newPassword);
        // if (passwordErrors.length > 0) {
        //     setErrors(prev => ({ ...prev, newPassword: passwordErrors }));
        //     return;
        // }

        // Validate confirm password
        if (formData.newPassword !== formData.confirmPassword) {
            setErrors({ confirmPassword: "Mật khẩu xác nhận không khớp" });
            return;
        }

        setIsLoading(true);
        try {
            const response = await authService.resetPassword(
                token,
                formData.newPassword,
                formData.confirmPassword
            );

            // Check for success - could be 200, 204, or success flag
            if (response?.code === 204 || response?.code === 200 || response?.success === true) {
                // Set success state if component still mounted
                if (isMountedRef.current) {
                    setSuccess(true);
                    showNotification('Mật khẩu đã được đặt lại thành công', 'success');
                }
                
                // Navigate immediately, don't wait for timeout
                try {
                    navigate('/login');
                } catch (navError) {
                    window.location.href = '/login';
                }
                
                // Also set a backup timeout in case navigate fails
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
            }
        } catch (error) {
            if (isMountedRef.current) {
                const errorMessage = error?.response?.data?.message
                    || 'Có lỗi xảy ra khi đặt lại mật khẩu';
                setErrors({ submit: errorMessage });
                showNotification(errorMessage, 'error');
            }
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [formData.newPassword, formData.confirmPassword, token, navigate, showNotification]);

    if (!token) return null;

    return (
        <AuthLayout>
            <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200 mt-8">
                <h1 className="text-2xl font-bold text-center mb-2">Đặt Lại Mật Khẩu</h1>
                <p className="text-center text-gray-500 mb-6">
                    Vui lòng nhập mật khẩu mới của bạn
                </p>


                {errors.submit && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errors.submit}
                    </div>
                )}

                {success ? (
                    <div className="text-center">
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            Mật khẩu của bạn đã được đặt lại thành công.
                            <br />
                            Đang chuyển hướng đến trang đăng nhập...
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="newPassword">
                                Mật khẩu mới
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 
                                    ${errors.newPassword ? 'border-red-500 focus:ring-red-200' :
                                        'border-gray-300 focus:ring-blue-200'}`}
                                disabled={isLoading}
                                required
                            />
                            {Array.isArray(errors.newPassword) && errors.newPassword.map((error, index) => (
                                <p key={index} className="text-sm text-red-600 mt-1">{error}</p>
                            ))}
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 
                                    ${errors.confirmPassword ? 'border-red-500 focus:ring-red-200' :
                                        'border-gray-300 focus:ring-blue-200'}`}
                                disabled={isLoading}
                                required
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-blue-500 text-white py-2 rounded transition duration-200
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}
                        </button>

                        <div className="text-center mt-4">
                            <a href="/login" className="text-blue-600 hover:underline">
                                Quay lại đăng nhập
                            </a>
                        </div>
                    </form>
                )}
            </div>
        </AuthLayout>
    );
}