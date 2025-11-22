import React from "react";
import PatientLayout from "../../../layouts/PateintLayout";
import { useAuth } from "../../../contexts/AuthContext";
import StatCard from '../../admin/Home/components/StatCard';
import TestResultItem from "./componets/TestResultItem";
import { formatDate } from "../../../utils/helpers";
import { FaFlask, FaHourglassHalf, FaFileInvoiceDollar } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const today = formatDate(new Date());
  const testResults = [
    {
      name: 'Blood Chemistry',
      orderDate: '2024-09-10',
      completedDate: '2024-09-12',
      status: 'completed',
      resultsAvailable: true,
    },
    {
      name: 'Thyroid Function',
      orderDate: '2024-09-15',
      completedDate: '2024-09-15',
      status: 'completed',
      resultsAvailable: true,
    },
    {
      name: 'Complete Blood Count',
      orderDate: '2024-09-16',
      completedDate: null,
      status: 'in progress',
      resultsAvailable: false,
    },
  ];



  return (
    <PatientLayout>
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 px-4 sm:px-6 bg-white border-b gap-2 sm:gap-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl hidden sm:inline"></span>
            <span className="font-semibold text-lg sm:text-xl truncate block max-w-full">Hồ Sơ Bệnh Nhân</span>
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
              title="Tổng số Kết quả Xét nghiệm"
              value="2"
              subtitle="Số lượng kết quả xét nghiệm đã có"
              icon={FaFlask}
              variant="success"
            />
            <StatCard
              title="Số lượng Xét nghiệm Đang Chờ"
              value="1"
              subtitle="Số lượng xét nghiệm đang chờ"
              icon={FaHourglassHalf}
              variant="warning"
            />

            <StatCard
              title="Hóa đơn Thanh Toán"
              value="0"
              subtitle="Số lượng hóa đơn chưa thanh toán"
              icon={FaFileInvoiceDollar}
              variant="danger"
            />
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Kết quả Xét nghiệm Gần đây</h2>
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <TestResultItem key={index} result={result} />
            ))}
          </div>
        </div>
      </div>

    </PatientLayout>
  );
};




export default Dashboard;