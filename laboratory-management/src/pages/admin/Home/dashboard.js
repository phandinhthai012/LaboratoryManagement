import React from 'react';
import { Outlet } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import StatCard from './components/StatCard';
import SystemAlerts from './components/SystemAlerts';
import { useAuth } from '../../../contexts/AuthContext';
import { formatDate } from '../../../utils/helpers';
import { FaUsers, FaMicroscope, FaClipboardList } from 'react-icons/fa';

const Dashboard = () => {
    const { isAuthenticated, user } = useAuth();
    const today = formatDate(new Date());
    const logs = [
        {
            id: 1,
            access_time: "2025-09-27T10:15:00Z",
            action: "UPDATE",
            changed_fields_json: '{"status":"approved","result":"positive"}',
            ip_addr: "192.168.1.10",
            user_id: 5,
            medical_record_id: 101
        },
        {
            id: 2,
            access_time: "2025-09-27T09:50:00Z",
            action: "VIEW",
            changed_fields_json: '{}',
            ip_addr: "192.168.1.11",
            user_id: 3,
            medical_record_id: 102
        }
        ,
        {
            id: 2,
            access_time: "2025-09-27T09:50:00Z",
            action: "VIEW",
            changed_fields_json: '{}',
            ip_addr: "192.168.1.11",
            user_id: 3,
            medical_record_id: 102
        }
        ,
        {
            id: 2,
            access_time: "2025-09-27T09:50:00Z",
            action: "VIEW",
            changed_fields_json: '{}',
            ip_addr: "192.168.1.11",
            user_id: 3,
            medical_record_id: 102
        }
        ,
        {
            id: 2,
            access_time: "2025-09-27T09:50:00Z",
            action: "VIEW",
            changed_fields_json: '{}',
            ip_addr: "192.168.1.11",
            user_id: 3,
            medical_record_id: 102
        }
        // ...
    ];
    const [ishowAlert, setIshowAlert] = React.useState(false);
    const [ShowAlerts, setShowAlerts] = React.useState(logs.slice(0, 3));
    const handleCloseAlert = () => {
        setIshowAlert(false);
        setShowAlerts(logs.slice(0, 3));
    }
    const handleShowAllAlerts = () => {
        setIshowAlert(true);
        setShowAlerts(logs);
    }

    return (
        <MainLayout>
            <div className="container">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 px-4 sm:px-6 bg-white border-b gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-2xl hidden sm:inline"></span>
                        <span className="font-semibold text-lg sm:text-xl truncate block max-w-full">Laboratory Information Management System</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold">{user.roleName || user.roleCode}</span>
                        <span className="text-gray-500 text-xs sm:text-sm">{today}</span>
                    </div>
                </div>
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Trang tổng quan</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard
                            title="Total Patients"
                            value="1,234"
                            subtitle="Number of registered patients"
                            icon={FaUsers}
                            variant="success"
                        />
                        <StatCard
                            title="Total Tests"
                            value="567"
                            subtitle="Tests conducted this month"
                            icon={FaMicroscope}
                            variant="info"
                        />

                        <StatCard
                            title="Pending Results"
                            value="45"
                            subtitle="Results pending review"
                            icon={FaClipboardList}
                            variant="warning"
                        />
                    </div>
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <SystemAlerts logs={ShowAlerts} />
                            {!ishowAlert ? (
                                <p
                                    className="mt-4 font-bold text-sm cursor-pointer text-center"  
                                    onClick={handleShowAllAlerts}
                                >
                                    Xem tất cả thông báo
                                </p>
                            ) : (
                                <p
                                    className="mt-4 font-bold text-sm cursor-pointer text-center"
                                    onClick={handleCloseAlert}
                                >
                                    Ẩn thông báo
                                </p>
                            )}
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-sm font-semibold mb-4">Lịch trình hôm nay</h2>
                            <p className="text-gray-500">Không có cuộc hẹn nào được lên lịch cho hôm nay.</p>
                        </div>

                    </div>

                </div>
            </div>
            <Outlet />
        </MainLayout>
    );
};

export default Dashboard;