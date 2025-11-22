import React, { useState } from "react";
import PatientLayout from "../../../layouts/PateintLayout";
import { FaSearch, FaCalendarAlt, FaDownload, FaEye, FaVials, FaFlask, FaMicroscope, FaFileMedical, FaFilter } from 'react-icons/fa';

const TestResult = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock data for demonstration
    const testResults = [
        {
            id: "XN001",
            date: "27/09/2025",
            name: "Xét nghiệm máu tổng quát",
            department: "Huyết học",
            doctor: "BS. Nguyễn Văn B",
            status: "Hoàn thành",
            result: "Bình thường",
            urgent: false,
            type: "Huyết học",
            icon: FaVials
        },
        {
            id: "XN002",
            date: "15/08/2025",
            name: "Xét nghiệm sinh hóa máu",
            department: "Hóa sinh",
            doctor: "BS. Trần Thị C",
            status: "Hoàn thành",
            result: "Cần theo dõi",
            urgent: true,
            type: "Sinh hóa",
            icon: FaFlask
        },
        {
            id: "XN003",
            date: "01/07/2025",
            name: "Xét nghiệm vi sinh",
            department: "Vi sinh",
            doctor: "BS. Lê Văn D",
            status: "Hoàn thành",
            result: "Bình thường",
            urgent: false,
            type: "Vi sinh",
            icon: FaMicroscope
        }
    ];

    // Filter test results
    const filteredResults = testResults.filter(test => {
        const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.department.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate = dateFilter === 'all' || true; // Add date filtering logic here
        const matchesDepartment = departmentFilter === 'all' || test.department === departmentFilter;
        const matchesStatus = statusFilter === 'all' || test.status === statusFilter;

        return matchesSearch && matchesDate && matchesDepartment && matchesStatus;
    });

    const getStatusBadge = (status, urgent) => {
        if (status === 'Hoàn thành') {
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgent ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                    }`}>
                    {status}
                </span>
            );
        }
        return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {status}
            </span>
        );
    };

    const handleViewResult = (testId) => {
        // Implement view result logic
        console.log('View result:', testId);
    };

    const handleDownloadResult = (testId) => {
        // Implement download logic
        console.log('Download result:', testId);
    };

    return (
        <PatientLayout activeTab="normal-view-tests">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Kết Quả Xét Nghiệm</h1>
                        <p className="text-gray-600">Xem và tải kết quả xét nghiệm của bạn</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên xét nghiệm, mã số..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-4">
                                <select
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={departmentFilter}
                                    onChange={(e) => setDepartmentFilter(e.target.value)}
                                >
                                    <option value="all">Tất cả phòng ban</option>
                                    <option value="Huyết học">Huyết học</option>
                                    <option value="Hóa sinh">Hóa sinh</option>
                                    <option value="Vi sinh">Vi sinh</option>
                                </select>
                                <select
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="Hoàn thành">Hoàn thành</option>
                                    <option value="Đang xử lý">Đang xử lý</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Test Results List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Xét nghiệm
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày thực hiện
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phòng ban
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Bác sĩ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kết quả
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredResults.map((test) => {
                                    const IconComponent = test.icon;
                                    return (
                                        <tr key={test.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <IconComponent className="w-5 h-5 text-blue-500 mr-3" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{test.name}</div>
                                                        <div className="text-sm text-gray-500">{test.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {test.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {test.department}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {test.doctor}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(test.status, test.urgent)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {test.result}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-3">
                                                    <button
                                                        onClick={() => handleViewResult(test.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Xem kết quả"
                                                    >
                                                        <FaEye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownloadResult(test.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Tải về"
                                                    >
                                                        <FaDownload className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
}

export default TestResult;