import React from "react";
import PatientLayout from "../../../layouts/PateintLayout";
import { FaUser, FaCalendarAlt, FaPhone, FaMapMarkerAlt, FaIdCard, FaHistory, FaVials, FaFileMedical } from 'react-icons/fa';

const PatientViewProfile = () => {
    // Mock data for demonstration
    const patientInfo = {
        fullName: "Nguyễn Văn A",
        dateOfBirth: "01/01/1990",
        gender: "Nam",
        phone: "0901234567",
        email: "nguyenvana@email.com",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        identityCard: "079123456789",
        healthInsurance: "SH123456789",
        bloodType: "O+",
        allergies: "Không"
    };

    const recentVisits = [
        {
            date: "27/09/2025",
            type: "Khám định kỳ",
            department: "Nội tổng quát",
            status: "Hoàn thành"
        },
        {
            date: "15/08/2025",
            type: "Xét nghiệm máu",
            department: "Huyết học",
            status: "Hoàn thành"
        },
        {
            date: "01/07/2025",
            type: "Khám sức khỏe",
            department: "Khám tổng quát",
            status: "Hoàn thành"
        }
    ];

    const recentTests = [
        {
            date: "27/09/2025",
            name: "Xét nghiệm máu tổng quát",
            status: "Hoàn thành",
            result: "Bình thường"
        },
        {
            date: "15/08/2025",
            name: "Xét nghiệm chức năng gan",
            status: "Hoàn thành",
            result: "Bình thường"
        },
        {
            date: "01/07/2025",
            name: "Xét nghiệm đường huyết",
            status: "Hoàn thành",
            result: "Cao nhẹ"
        }
    ];

    return (
        <PatientLayout activeTab="normal-view-profile">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Hồ Sơ Bệnh Nhân</h1>
                        <p className="text-gray-600">Thông tin chi tiết và lịch sử khám chữa bệnh</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        Cập nhật lần cuối: 27/09/2025
                    </div>
                </div>

                {/* Patient Information Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                                <FaUser className="w-12 h-12 text-gray-400" />
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4">Thông Tin Cá Nhân</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center text-sm">
                                            <FaUser className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-gray-600">Họ tên:</span>
                                            <span className="ml-2 font-medium">{patientInfo.fullName}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <FaCalendarAlt className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-gray-600">Ngày sinh:</span>
                                            <span className="ml-2">{patientInfo.dateOfBirth}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <FaIdCard className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-gray-600">CMND/CCCD:</span>
                                            <span className="ml-2">{patientInfo.identityCard}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4">Thông Tin Liên Hệ</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center text-sm">
                                            <FaPhone className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-gray-600">Điện thoại:</span>
                                            <span className="ml-2">{patientInfo.phone}</span>
                                        </div>
                                        <div className="flex items-start text-sm">
                                            <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mr-2 mt-1" />
                                            <div>
                                                <span className="text-gray-600">Địa chỉ:</span>
                                                <span className="ml-2">{patientInfo.address}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4">Thông Tin Y Tế</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center text-sm">
                                            <FaFileMedical className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-gray-600">BHYT:</span>
                                            <span className="ml-2">{patientInfo.healthInsurance}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <FaVials className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-gray-600">Nhóm máu:</span>
                                            <span className="ml-2">{patientInfo.bloodType}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Visits & Tests */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Visits */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch Sử Khám Gần Đây</h3>
                            <div className="space-y-4">
                                {recentVisits.map((visit, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <FaHistory className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{visit.type}</div>
                                                <div className="text-xs text-gray-500">{visit.department}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-900">{visit.date}</div>
                                            <div className="text-xs font-medium text-green-600">{visit.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Tests */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Xét Nghiệm Gần Đây</h3>
                            <div className="space-y-4">
                                {recentTests.map((test, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <FaVials className="w-5 h-5 text-purple-500" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{test.name}</div>
                                                <div className="text-xs text-gray-500">{test.result}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-900">{test.date}</div>
                                            <div className="text-xs font-medium text-green-600">{test.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
}

export default PatientViewProfile;