import React, { useState, useEffect } from 'react';
import { 
    FaTimes, 
    FaUser, 
    FaBirthdayCake, 
    FaVenusMars, 
    FaPhone, 
    FaEnvelope, 
    FaMapMarkerAlt, 
    FaIdCard, 
    FaCalendarAlt, 
    FaSpinner,
    FaClock,
    FaUserEdit
} from 'react-icons/fa';
import { usePatientMedicalRecordById } from '../../../../hooks/usePatienMedicalRecord';
import { formatDate } from '../../../../utils/helpers';

const PatientDetailModal = ({ isOpen, onClose, medicalRecordId, onEdit, onDelete }) => {
    const { data: medicalRecord, isLoading, isError, error } = usePatientMedicalRecordById(medicalRecordId);
    const [patientDetail, setPatientDetail] = useState(null);
    console.log("medicalRecord in PatientDetailModal: ", medicalRecord);

    useEffect(() => {
        if (medicalRecord) {
            setPatientDetail(medicalRecord);
        }
    }, [medicalRecord]);

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

    const genderInfo = getGenderDisplay(patientDetail?.gender);

    const handleEdit = () => {
        if (onEdit && patientDetail) {
            onEdit(patientDetail);
        }
    };

    const handleDelete = () => {
        if (onDelete && patientDetail) {
            onDelete(patientDetail);
        }
    };

    if (!isOpen) {
        return null;
    }

    if (!medicalRecordId) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <FaTimes className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi</h3>
                        <p className="text-sm text-gray-500">Không tìm thấy ID bệnh nhân</p>
                        <button
                            onClick={onClose}
                            className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-xl">
                    <div className="text-center">
                        <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Đang tải...</h3>
                        <p className="text-sm text-gray-500">Vui lòng chờ trong giây lát</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <FaTimes className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-medium text-red-600 mb-2">Lỗi</h3>
                        <p className="text-sm text-gray-700 mb-2">Không thể tải thông tin bệnh nhân</p>
                        {error?.message && (
                            <p className="text-xs text-gray-500 mb-4">{error.message}</p>
                        )}
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                                    Thông Tin Bệnh Nhân
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Hồ sơ mã: {patientDetail?.medicalRecordCode || 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                            {/* {onEdit && patientDetail && (
                                <button
                                    onClick={handleEdit}
                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Chỉnh sửa"
                                >
                                    <FaUserEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            )}

                            {onDelete && patientDetail && (
                                <button
                                    onClick={handleDelete}
                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Xóa bệnh nhân"
                                >
                                    <FaUserEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            )} */}

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
                        {/* Patient Detail Content */}
                        {patientDetail && !isLoading && !isError && (
                            <>
                                {/* Basic Info Section */}
                                <div className="mb-6">
                                    <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <FaUser className="w-4 h-4 mr-2 text-blue-600" />
                                        Thông Tin Cơ Bản
                                    </h4>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex items-start space-x-3">
                                                <FaIdCard className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">Mã hồ sơ</p>
                                                    <p className="text-sm sm:text-base text-gray-900 font-semibold truncate">
                                                        {patientDetail.medicalRecordCode || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <FaUser className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">Họ và tên</p>
                                                    <p className="text-sm sm:text-base text-gray-900 font-semibold break-all">
                                                        {patientDetail.fullName || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <FaVenusMars className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">Giới tính</p>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${genderInfo?.bg} ${genderInfo?.color}`}>
                                                            {genderInfo?.text || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <FaBirthdayCake className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">Ngày sinh</p>
                                                    <p className="text-sm sm:text-base text-gray-900">
                                                        {patientDetail.dateOfBirth ? new Date(patientDetail.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'}
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
                                                        {patientDetail.email || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <FaPhone className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">Số điện thoại</p>
                                                    <p className="text-sm sm:text-base text-gray-900">
                                                        {patientDetail.phone || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <FaMapMarkerAlt className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">Địa chỉ</p>
                                                    <p className="text-sm sm:text-base text-gray-900">
                                                        {patientDetail.address || 'N/A'}
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
                                        Thông Tin khác
                                    </h4>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            {patientDetail.createdAt && (
                                                <div className="flex items-start space-x-3">
                                                    <FaCalendarAlt className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs sm:text-sm font-medium text-gray-500">Ngày tạo</p>
                                                        <p className="text-sm sm:text-base text-gray-900">
                                                            {formatDateTime(patientDetail.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            {patientDetail.updatedAt && (
                                                <div className="flex items-start space-x-3">
                                                    <FaUserEdit className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs sm:text-sm font-medium text-gray-500">Cập nhật lần cuối</p>
                                                        <p className="text-sm sm:text-base text-gray-900">
                                                            {formatDate(patientDetail.updatedAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
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

export default PatientDetailModal;