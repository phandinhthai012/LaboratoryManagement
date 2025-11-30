import React, { useState, useEffect, use } from 'react';
import {
    FaTimes,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaIdCard,
    FaMapMarkerAlt,
    FaBirthdayCake,
    FaVenusMars,
    FaClock,
    FaUserEdit,
    FaCalendarAlt,
    FaTrash,
    FaSpinner
} from 'react-icons/fa';
import { formatDate } from '../../../../utils/helpers';
import { useUserById } from '../../../../hooks/useUser';
import { useAuth } from '../../../../contexts/AuthContext';
import ConfirmDialog from '../../../../components/ConfirmDialog';

const UserDetailModal = ({
    isOpen,
    onClose,
    userId,
    onEdit,
    onDelete
}) => {
    const { data: userData, isLoading, isError, error } = useUserById(userId);
    const { user: userAuth } = useAuth();
    console.log("UserDetailModal - userData:", userData);
    const [userDetail, setUserDetail] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        if (userData) {
            setUserDetail(userData);
        }
    }, [userData]);

    if (!isOpen || !userDetail) return null;

    const getGenderDisplay = (gender) => {
        switch (gender) {
            case 'MALE': return { text: 'Nam', color: 'text-blue-600', bg: 'bg-blue-100' };
            case 'FEMALE': return { text: 'Nữ', color: 'text-pink-600', bg: 'bg-pink-100' };
            default: return { text: 'Khác', color: 'text-gray-600', bg: 'bg-gray-100' };
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const genderInfo = getGenderDisplay(userDetail?.gender);

    const handleEdit = () => {
        alert('Chức năng chỉnh sửa chưa được triển khai.');
    };

    const handleDelete = () => {
        if (onDelete && userDetail) {
            onDelete(userDetail);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden transform transition-all">

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaUser className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                    Thông Tin Chi Tiết
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Xem thông tin người dùng
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                            {onEdit && userDetail(
                                <button
                                    onClick={handleEdit}
                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Chỉnh sửa"
                                >
                                    <FaUserEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            )}

                            {userDetail && userAuth.userId !== userDetail.userId && (
                                <button
                                    onClick={handleDelete}
                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Xóa người dùng"
                                >
                                    <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            )}

                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 max-h-[80vh] sm:max-h-96 overflow-y-auto">

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-12">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <FaSpinner className="w-5 h-5 animate-spin" />
                                    <span>Đang tải thông tin...</span>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {isError && (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="text-red-500 mb-2">
                                        <FaTimes className="w-8 h-8 mx-auto" />
                                    </div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                                        Không thể tải thông tin
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {error?.message || 'Đã xảy ra lỗi khi tải dữ liệu'}
                                    </p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* User Detail Content */}
                        {userDetail && !isLoading && !isError && (
                            <>
                                {/* Basic Info Section */}
                                <div className="mb-6">
                                    <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <FaUser className="w-4 h-4 mr-2 text-blue-600" />
                                        Thông Tin Cá Nhân {userAuth.userId === userDetail.userId && '(Bạn)'}
                                    </h4>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex items-start space-x-3">
                                                <FaUser className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">Họ và tên</p>
                                                    <p className="text-sm sm:text-base text-gray-900 font-semibold truncate">
                                                        {userDetail.fullName || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <FaUser className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">Tên đăng nhập</p>
                                                    <p className="text-sm sm:text-base text-gray-900 font-mono break-all">
                                                        {userDetail.username || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <FaIdCard className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">CCCD/CMND</p>
                                                    <p className="text-sm sm:text-base text-gray-900 break-all">
                                                        {userDetail.identifyNumberMasked || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <FaVenusMars className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">Giới tính & Tuổi</p>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${genderInfo?.bg} ${genderInfo?.color}`}>
                                                            {genderInfo?.text || 'N/A'}
                                                        </span>
                                                        <span className="text-sm sm:text-base text-gray-900">
                                                            {userDetail.ageYears || userDetail.age || 'N/A'} tuổi
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <FaBirthdayCake className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">Ngày sinh</p>
                                                    <p className="text-sm sm:text-base text-gray-900">
                                                        {formatDate(userDetail.dateOfBirth)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-start space-x-3">
                                                <FaEnvelope className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">Email</p>
                                                    <p className="text-sm sm:text-base text-gray-900 break-all">
                                                        {userDetail.email || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <FaPhone className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">Số điện thoại</p>
                                                    <p className="text-sm sm:text-base text-gray-900">
                                                        {userDetail.phone || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <FaMapMarkerAlt className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">Địa chỉ</p>
                                                    <p className="text-sm sm:text-base text-gray-900">
                                                        {userDetail.address || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* System Info Section */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <FaClock className="w-4 h-4 mr-2 text-blue-600" />
                                        Thông Tin Hệ Thống
                                    </h4>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex items-start space-x-3">
                                                <FaIdCard className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">ID người dùng</p>
                                                    <p className="text-xs sm:text-sm text-gray-900 font-mono break-all">
                                                        {userDetail.userId || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <FaCalendarAlt className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">Ngày tạo</p>
                                                    <p className="text-sm sm:text-base text-gray-900">
                                                        {formatDateTime(userDetail.createdAt)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Bởi: {userDetail.createdBy || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-start space-x-3">
                                                <FaUserEdit className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">Cập nhật lần cuối</p>
                                                    <p className="text-sm sm:text-base text-gray-900">
                                                        {formatDateTime(userDetail.updatedAt)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Bởi: {userDetail.updatedBy || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <FaUserEdit className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">Vai trò</p>
                                                    <p className="text-sm sm:text-base text-gray-900">
                                                        {userDetail.roleName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {userDetail.roleCode || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end space-x-2 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                        <button
                            onClick={onClose}
                            className="px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;