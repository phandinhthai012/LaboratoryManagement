import React, { useState } from 'react';
import { 
  FaSearch, FaDownload, FaCalendarAlt, FaFilter, FaChartBar, FaChartLine, 
  FaVials, FaDollarSign, FaUsers, FaCheckCircle, FaHospital, FaClock,
  FaFileAlt, FaEye
} from 'react-icons/fa';
import { MdTrendingUp, MdPercent } from 'react-icons/md';
import MainLayout from '../../../layouts/MainLayout';

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    start: '2024-09-01',
    end: '2024-09-27'
  });
  const [departmentFilter, setDepartmentFilter] = useState('Tất cả phòng ban');
  const [reportType, setReportType] = useState('Tổng quan');
  const [viewType, setViewType] = useState('overview');

  // Mock data for statistics
  const [statistics] = useState({
    monthlyTests: 2847,
    monthlyRevenue: 1248500000,
    patientVisits: 1653,
    completionRate: 96.8,
    averageProcessTime: 2.4,
    pendingReports: 23
  });

  // Mock data for departments
  const [departments] = useState([
    'Tất cả phòng ban', 'Huyết học', 'Hóa sinh', 'Vi sinh', 'Miễn dịch', 'Nội tiết', 'Tim mạch'
  ]);

  // Mock data for test trends (last 7 days)
  const [testTrends] = useState([
    { date: '21/09', tests: 245, completed: 238 },
    { date: '22/09', tests: 289, completed: 281 },
    { date: '23/09', tests: 267, completed: 259 },
    { date: '24/09', tests: 298, completed: 289 },
    { date: '25/09', tests: 276, completed: 268 },
    { date: '26/09', tests: 312, completed: 301 },
    { date: '27/09', tests: 189, completed: 167 }
  ]);

  // Mock data for department performance
  const [departmentStats] = useState([
    { 
      department: 'Huyết học', 
      tests: 856, 
      revenue: 298500000, 
      completionRate: 97.2,
      avgTime: 1.8,
      color: 'bg-red-100 text-red-800'
    },
    { 
      department: 'Hóa sinh', 
      tests: 743, 
      revenue: 367200000, 
      completionRate: 96.1,
      avgTime: 2.1,
      color: 'bg-blue-100 text-blue-800'
    },
    { 
      department: 'Vi sinh', 
      tests: 492, 
      revenue: 246800000, 
      completionRate: 95.8,
      avgTime: 3.2,
      color: 'bg-green-100 text-green-800'
    },
    { 
      department: 'Miễn dịch', 
      tests: 398, 
      revenue: 198700000, 
      completionRate: 98.1,
      avgTime: 2.8,
      color: 'bg-purple-100 text-purple-800'
    },
    { 
      department: 'Nội tiết', 
      tests: 234, 
      revenue: 89300000, 
      completionRate: 97.4,
      avgTime: 2.3,
      color: 'bg-yellow-100 text-yellow-800'
    },
    { 
      department: 'Tim mạch', 
      tests: 124, 
      revenue: 48000000, 
      completionRate: 96.8,
      avgTime: 1.9,
      color: 'bg-pink-100 text-pink-800'
    }
  ]);

  // Mock data for recent reports
  const [recentReports] = useState([
    {
      id: 1,
      title: 'Báo cáo xét nghiệm tháng 9',
      type: 'Tổng quan',
      department: 'Tất cả',
      date: '2024-09-27',
      status: 'Hoàn thành',
      size: '2.4 MB'
    },
    {
      id: 2,
      title: 'Phân tích doanh thu Q3',
      type: 'Tài chính',
      department: 'Tất cả',
      date: '2024-09-25',
      status: 'Hoàn thành',
      size: '1.8 MB'
    },
    {
      id: 3,
      title: 'Báo cáo hiệu suất Huyết học',
      type: 'Phòng ban',
      department: 'Huyết học',
      date: '2024-09-24',
      status: 'Đang xử lý',
      size: '856 KB'
    },
    {
      id: 4,
      title: 'Thống kê bệnh nhân tuần 38',
      type: 'Bệnh nhân',
      department: 'Tất cả',
      date: '2024-09-23',
      status: 'Hoàn thành',
      size: '1.2 MB'
    }
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    if (status === 'Hoàn thành') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FaCheckCircle className="inline w-3 h-3 mr-1" />
          Hoàn thành
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <FaClock className="inline w-3 h-3 mr-1" />
          Đang xử lý
        </span>
      );
    }
  };

  const handleExportReport = (reportId) => {
    alert(`Xuất báo cáo ID: ${reportId}`);
  };

  const handleGenerateReport = () => {
    alert('Tạo báo cáo mới với các bộ lọc đã chọn');
  };

  return (
    <MainLayout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Báo Cáo & Phân Tích</h1>
              <p className="text-gray-600">Theo dõi hiệu suất và phân tích dữ liệu phòng xét nghiệm</p>
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-semibold">Báo cáo</span> • Thứ Sáu, 27 tháng 9, 2025
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Khoảng thời gian:</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-500">đến</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
                
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Tổng quan">Tổng quan</option>
                  <option value="Tài chính">Tài chính</option>
                  <option value="Phòng ban">Phòng ban</option>
                  <option value="Bệnh nhân">Bệnh nhân</option>
                </select>
                
                <button
                  onClick={handleGenerateReport}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors text-sm"
                >
                  <FaChartBar className="w-4 h-4" />
                  Tạo Báo Cáo
                </button>
              </div>
            </div>
          </div>

          {/* View Type Toggle */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => setViewType('overview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewType === 'overview' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaChartBar className="inline w-4 h-4 mr-2" />
                Tổng Quan
              </button>
              <button
                onClick={() => setViewType('trends')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewType === 'trends' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaChartLine className="inline w-4 h-4 mr-2" />
                Xu Hướng
              </button>
              <button
                onClick={() => setViewType('departments')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewType === 'departments' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaHospital className="inline w-4 h-4 mr-2" />
                Phòng Ban
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        {viewType === 'overview' && (
          <div className="space-y-8">
            {/* Key Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Xét Nghiệm Tháng Này</p>
                    <p className="text-3xl font-bold text-blue-600">{statistics.monthlyTests.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1">
                      <MdTrendingUp className="inline w-3 h-3 mr-1" />
                      +12.5% so với tháng trước
                    </p>
                  </div>
                  <FaVials className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Doanh Thu Tháng</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(statistics.monthlyRevenue)}</p>
                    <p className="text-xs text-green-600 mt-1">
                      <MdTrendingUp className="inline w-3 h-3 mr-1" />
                      +8.3% so với tháng trước
                    </p>
                  </div>
                  <FaDollarSign className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lượt Khám</p>
                    <p className="text-3xl font-bold text-purple-600">{statistics.patientVisits.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1">
                      <MdTrendingUp className="inline w-3 h-3 mr-1" />
                      +5.7% so với tháng trước
                    </p>
                  </div>
                  <FaUsers className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tỷ Lệ Hoàn Thành</p>
                    <p className="text-3xl font-bold text-orange-600">{statistics.completionRate}%</p>
                    <p className="text-xs text-green-600 mt-1">
                      <MdPercent className="inline w-3 h-3 mr-1" />
                      +2.1% so với tháng trước
                    </p>
                  </div>
                  <FaCheckCircle className="w-8 h-8 text-orange-400" />
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiệu Suất Hệ Thống</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Thời gian xử lý trung bình</span>
                    <span className="text-sm font-semibold text-gray-900">{statistics.averageProcessTime} giờ</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Báo cáo chờ xử lý</span>
                    <span className="text-sm font-semibold text-yellow-600">{statistics.pendingReports} báo cáo</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tỷ lệ hài lòng khách hàng</span>
                    <span className="text-sm font-semibold text-green-600">94.2%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Xét Nghiệm Phổ Biến</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Xét nghiệm máu tổng quát', count: 456, percentage: 16.0 },
                    { name: 'Xét nghiệm sinh hóa máu', count: 389, percentage: 13.7 },
                    { name: 'Xét nghiệm nước tiểu', count: 342, percentage: 12.0 },
                    { name: 'Xét nghiệm lipid máu', count: 298, percentage: 10.5 },
                    { name: 'Xét nghiệm đường huyết', count: 276, percentage: 9.7 }
                  ].map((test, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-700">{test.name}</span>
                          <span className="text-xs text-gray-500">{test.count} lần</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${test.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trends View */}
        {viewType === 'trends' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Xu Hướng Xét Nghiệm (7 ngày qua)</h3>
              <div className="space-y-4">
                {testTrends.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-900 w-12">{day.date}</span>
                      <div className="flex items-center gap-6">
                        <div className="text-sm">
                          <span className="text-gray-600">Tổng: </span>
                          <span className="font-semibold text-blue-600">{day.tests}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Hoàn thành: </span>
                          <span className="font-semibold text-green-600">{day.completed}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Tỷ lệ: </span>
                          <span className="font-semibold text-orange-600">
                            {((day.completed / day.tests) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-32 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full" 
                        style={{ width: `${(day.completed / day.tests) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Departments View */}
        {viewType === 'departments' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Hiệu Suất Theo Phòng Ban</h3>
                <p className="text-sm text-gray-600 mt-1">Phân tích chi tiết theo từng chuyên khoa</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phòng Ban
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số Xét Nghiệm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doanh Thu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tỷ Lệ Hoàn Thành
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời Gian TB
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {departmentStats.map((dept, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${dept.color}`}>
                            {dept.department}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {dept.tests.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(dept.revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 mr-2">{dept.completionRate}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${dept.completionRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {dept.avgTime} giờ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Báo Cáo Gần Đây</h3>
                <p className="text-sm text-gray-600 mt-1">Lịch sử các báo cáo đã tạo</p>
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors text-sm">
                <FaDownload className="w-4 h-4" />
                Xuất Tất Cả
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên Báo Cáo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phòng Ban
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày Tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kích Thước
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <FaFileAlt className="w-4 h-4 text-blue-500 mr-3" />
                        {report.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.date).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Xem báo cáo"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleExportReport(report.id)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Tải về"
                        >
                          <FaDownload className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;