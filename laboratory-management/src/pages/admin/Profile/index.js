import React, { useCallback,useMemo, useState } from "react";
import MainLayout from "../../../layouts/MainLayout";
import { FaUserCog, FaEnvelope, FaSpinner } from "react-icons/fa";
import { useAuth } from "../../../contexts/AuthContext";
import { formatDate, encryptPassword, validatePassword } from "../../../utils/helpers";
import { formatPhoneNumber, validatePhoneNumber } from "../../../utils/phoneFormatter";
import userService from "../../../services/userService";
import { useNotifier } from "../../../contexts/NotifierContext";
import { useUpdateUser } from "../../../hooks/useUser";
import authService from "../../../services/authService";

const Profile = () => {
    const { user, login, updateUser } = useAuth();
    const { showNotification } = useNotifier();
    const updateUserMutation = useUpdateUser();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    console.log("User in Profile:", user);
    const [formData, setFormData] = useState({
        username: user.username,
        fullName: user?.fullName || "Unknown",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        dateOfBirth: user?.dateOfBirth ? user.dateOfBirth : "",
        gender: user?.gender || "",
        roleName: user?.roleName || "unknown",
        identifyNumberMasked: user?.identifyNumberMasked || "*******",
        updatedAt: user?.updatedAt ? formatDate(new Date(user.updatedAt)) : "N/A"
    });

    const [editMessage, setEditMessage] = useState("");
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    const [passwordMessage, setPasswordMessage] = useState("");

    const handleEditClick = () => {
        setIsEditing(true);
        setEditMessage("");
    };
    const validFormUpdate = () => {
        setEditMessage("");
        if (!formData.fullName?.trim()) {
            setEditMessage("Họ và tên là bắt buộc.");
            return false;
        }

        if (!formData.email?.trim()) {
            setEditMessage("Email là bắt buộc.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setEditMessage("Email không đúng định dạng.");
            return false;
        }
        if (formData.fullName.length < 2) {
            setEditMessage("Họ và tên phải có ít nhất 2 ký tự.");
            return false;
        }

        if (formData.fullName.length > 100) {
            setEditMessage("Họ và tên không được vượt quá 100 ký tự.");
            return false;
        }
        if (formData.phone?.trim()) {
            if (!validatePhoneNumber(formData.phone)) {
                setEditMessage("Số điện thoại không đúng định dạng.");
                return false;
            }
        }

        if (formData.dateOfBirth) {
            const birthDate = new Date(formData.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();

            if (birthDate > today) {
                setEditMessage("Ngày sinh không thể ở tương lai.");
                return false;
            }

            if (age > 120) {
                setEditMessage("Tuổi không hợp lệ (quá 120 tuổi).");
                return false;
            }

            if (age < 0) {
                setEditMessage("Tuổi không hợp lệ.");
                return false;
            }
        }
        return true;
    };
    const handleSaveClick = async () => {
        if (!validFormUpdate()) {
            return;
        }

        setIsLoading(true);
        setEditMessage("");

        try {
            let calculatedAge = null;
            let formattedDateOfBirth = null;
            if (formData.dateOfBirth) {
                const birthDate = new Date(formData.dateOfBirth);
                const today = new Date();

                // Calculate age
                calculatedAge = today.getFullYear() - birthDate.getFullYear();

                formattedDateOfBirth = `${String(birthDate.getMonth() + 1).padStart(2, '0')}/${String(birthDate.getDate()).padStart(2, '0')}/${birthDate.getFullYear()}`;
            }
            const updateData = {
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                phone: formData.phone?.trim() || null,
                address: formData.address?.trim() || null,
                dateOfBirth: formattedDateOfBirth,
                age: calculatedAge,
                gender: formData.gender?.toLowerCase() || null
            };

            const response = await updateUserMutation.mutateAsync({ userId: user.userId, userData: updateData });
            if (response.code === 200 || response.success) {
                const userAuthData = await userService.getUserById(response.data.userId || user.userId);
                updateUser({ ...user, ...userAuthData.data });

                setIsEditing(false);
                setEditMessage("Cập nhật thông tin thành công!");

                setTimeout(() => {
                    setEditMessage("");
                }, 3000);

            } else {
                setEditMessage(response.message || "Cập nhật thất bại. Vui lòng thử lại.");
                showNotification(response.message || "Cập nhật thất bại", "error");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.message ||
                "Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.";

            setEditMessage(errorMessage);
            showNotification(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editMessage) {
            setEditMessage("");
        }

        // Handle phone number formatting
        if (name === 'phone' && value) {
            const formatted = formatPhoneNumber(value);
            setFormData({ ...formData, [name]: formatted });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handlePasswordChange = useCallback((e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
        if (passwordMessage) {
            setPasswordMessage("");
        }
    }, [passwordForm, passwordMessage]);

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage("");

        // Validate
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
            setPasswordMessage("Vui lòng nhập đầy đủ các trường.");
            return;
        }

        if (!validatePassword(passwordForm.newPassword)) {
            setPasswordMessage("Mật khẩu mới phải có 8-128 ký tự, bao gồm ít nhất 1 chữ cái và 1 số.");
            return false;
        }

        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            setPasswordMessage("Xác nhận mật khẩu không khớp.");
            return;
        }

        if (passwordForm.currentPassword === passwordForm.newPassword) {
            setPasswordMessage("Mật khẩu mới phải khác mật khẩu hiện tại.");
            return;
        }

        try {
            const passwordData = {
                // currentPassword: await encryptPassword(passwordForm.currentPassword),
                // newPassword: await encryptPassword(passwordForm.newPassword),
                // confirmNewPassword: await encryptPassword(passwordForm.confirmNewPassword)
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                confirmNewPassword: passwordForm.confirmNewPassword
            };
            const response = await userService.changePassword(user.userId, passwordData);
            console.log("Change password response:", response);
            if (response.code === 200 || response.success) {
                setPasswordMessage("Đổi mật khẩu thành công!");
                setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
                showNotification("Đổi mật khẩu thành công!", "success");
                const encryptedNewPassword = await encryptPassword(passwordForm.newPassword);
                const loginAgain = await authService.login({
                    username: user.username,
                    password: encryptedNewPassword
                });
                // Clear success message after 3 seconds
                setTimeout(() => {
                    setPasswordMessage("");
                }, 3000);
            } else {
                setPasswordMessage(response.message || "Đổi mật khẩu thất bại.");
                showNotification(response.message || "Đổi mật khẩu thất bại", "error");
            }
        } catch (error) {
            console.error('Change password error:', error);
            const errorMessage = error.response?.data?.message ||
                "Có lỗi xảy ra khi đổi mật khẩu.";

            setPasswordMessage(errorMessage);
            showNotification(errorMessage, "error");
        }
    };

    return (
        <MainLayout>
            <div className="w-full bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {/* Avatar placeholder */}
                        <FaUserCog className="w-8 h-8 text-gray-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{user.username}</h2>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>
                    {!isEditing ? (
                        <button
                            className="ml-auto px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            onClick={handleEditClick}
                            disabled={isLoading}
                        >
                            Chỉnh sửa
                        </button>
                    ) : (
                        <button
                            className="ml-auto px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            onClick={handleSaveClick}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="w-4 h-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                'Lưu'
                            )}
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-gray-600 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            className="w-full p-2 bg-gray-100 rounded"
                            onChange={handleChange}
                            disabled={true}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1">Full Name *</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            className={`w-full p-2 rounded transition-colors ${!isEditing ? 'bg-gray-100' : 'bg-white border border-gray-300 focus:border-blue-500 focus:outline-none'
                                }`}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Nhập họ và tên"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            className={`w-full p-2 rounded transition-colors ${!isEditing ? 'bg-gray-100' : 'bg-white border border-gray-300 focus:border-blue-500 focus:outline-none'
                                }`}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                            <option value="OTHER">Khác</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1">Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            className={`w-full p-2 rounded transition-colors ${!isEditing ? 'bg-gray-100' : 'bg-white border border-gray-300 focus:border-blue-500 focus:outline-none'
                                }`}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            className={`w-full p-2 rounded transition-colors ${!isEditing ? 'bg-gray-100' : 'bg-white border border-gray-300 focus:border-blue-500 focus:outline-none'
                                }`}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Nhập email"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            className={`w-full p-2 rounded transition-colors ${!isEditing ? 'bg-gray-100' : 'bg-white border border-gray-300 focus:border-blue-500 focus:outline-none'
                                }`}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Nhập số điện thoại"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            className={`w-full p-2 rounded transition-colors ${!isEditing ? 'bg-gray-100' : 'bg-white border border-gray-300 focus:border-blue-500 focus:outline-none'
                                }`}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Nhập địa chỉ"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1">Role</label>
                        <input
                            type="text"
                            name="roleName"
                            value={formData.roleName}
                            className="w-full p-2 bg-gray-100 rounded"
                            readOnly
                        />
                    </div>
                </div>
                {editMessage && (
                    <div className={`mb-4 font-medium ${editMessage.includes('thành công') ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {editMessage}
                    </div>
                )}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-2">My email Address</h3>
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded">
                        <FaEnvelope className="text-blue-500 w-6 h-6" />
                        <div>
                            <p className="font-medium">{formData.email}</p>
                            <p className="text-gray-400 text-sm">
                                Last updated: {formData.updatedAt}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full bg-white rounded-lg shadow-md p-8 mt-4">
                <h2 className="text-xl font-semibold mb-4">Thay đổi mật khẩu</h2>
                <form className="space-y-4 max-w-md" onSubmit={handlePasswordSubmit}>
                    <div>
                        <label className="block text-gray-600 mb-1">Mật khẩu hiện tại *</label>
                        <input
                            type="password"
                            name="currentPassword"
                            className="w-full p-2 bg-white border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                            placeholder="Nhập mật khẩu hiện tại"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1">Mật khẩu mới *</label>
                        <input
                            type="password"
                            name="newPassword"
                            className="w-full p-2 bg-white border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                            placeholder="Nhập mật khẩu mới (ít nhất 8 ký tự)"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1">Xác nhận mật khẩu mới *</label>
                        <input
                            type="password"
                            name="confirmNewPassword"
                            className="w-full p-2 bg-white border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                            placeholder="Nhập lại mật khẩu mới"
                            value={passwordForm.confirmNewPassword}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    {passwordMessage && (
                        <div className={`mb-2 font-medium ${passwordMessage.includes('thành công') ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {passwordMessage}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold mt-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        Đổi mật khẩu
                    </button>
                </form>
            </div>
        </MainLayout>
    );
};

export default Profile;