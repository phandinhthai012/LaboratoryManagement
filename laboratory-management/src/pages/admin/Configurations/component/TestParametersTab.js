import React, { useMemo, useState } from 'react';
import { FaEye } from 'react-icons/fa';

const TestParametersTab = ({ 
  data, // Raw data từ API
  isLoading,
  paginationInfo
}) => {
  // Local state for all filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt,desc');

  // Filter and sort data trên frontend
  const filteredData = useMemo(() => {
    if (!data) return [];
    
    let filtered = data.filter(param => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        param.paramName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        param.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        param.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });

    // Sort data
    const [sortField, sortOrder] = sortBy.split(',');
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortField === 'createdAt') {
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
      } else if (sortField === 'paramName') {
        aValue = a.paramName.toLowerCase();
        bValue = b.paramName.toLowerCase();
      } else {
        return 0;
      }
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [data, searchTerm, sortBy]);

  const handleView = (param) => {
    console.log('View parameter:', param);
    // TODO: Implement view functionality
  };

  const formatParameterRanges = (ranges) => {
    if (!ranges || ranges.length === 0) return 'Chưa có';
    
    return ranges.map(range => {
      const parts = [];
      
      if (range.minValue !== null && range.maxValue !== null) {
        parts.push(`${range.minValue} - ${range.maxValue}`);
      } else if (range.minValue !== null) {
        parts.push(`≥ ${range.minValue}`);
      } else if (range.maxValue !== null) {
        parts.push(`≤ ${range.maxValue}`);
      }
      
      if (range.unit) {
        parts.push(range.unit);
      }
      
      if (range.gender && range.gender !== 'BOTH') {
        parts.push(`(${range.gender === 'MALE' ? 'Nam' : 'Nữ'})`);
      }
      
      return parts.join(' ') || 'N/A';
    }).join(', ');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('createdAt,desc');
  };

  return (
    <div className="p-6">
      {/* Search and Sort */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên thông số, viết tắt, mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
              className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              disabled={isLoading}
              className={`px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm min-w-[180px] transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <option value="createdAt,desc"> Mới nhất trước</option>
              <option value="createdAt,asc"> Cũ nhất trước</option>
              <option value="paramName,asc"> Tên A-Z</option>
              <option value="paramName,desc"> Tên Z-A</option>
            </select>
          </div>

          {(searchTerm || sortBy !== 'createdAt,desc') && (
            <button
              className={`px-4 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={resetFilters}
              disabled={isLoading}
            >
              {isLoading ? 'Đang tải...' : 'Đặt lại'}
            </button>
          )}
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-4 text-sm text-gray-600">
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            <span>Đang tải dữ liệu...</span>
          </div>
        ) : (
          <>Hiển thị <span className="font-semibold">{filteredData.length}</span> trong tổng số <span className="font-semibold">{data?.length || 0}</span> thông số</>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-sm text-gray-600">Đang tải...</p>
            </div>
          </div>
        )}
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 #F7FAFC'
        }}>
          <table className="w-full min-w-[900px]">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200" style={{ width: '180px', minWidth: '180px' }}>
                  Tên thông số
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200" style={{ width: '70px', minWidth: '70px' }}>
                  Viết tắt
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200" style={{ width: '200px', minWidth: '200px' }}>
                  Mô tả
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200" style={{ width: '160px', minWidth: '160px' }}>
                  Khoảng tham chiếu
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200" style={{ width: '110px', minWidth: '110px' }}>
                  Ngày tạo
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200" style={{ width: '80px', minWidth: '80px' }}>
                  Trạng thái
                </th>
                <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200" style={{ width: '60px', minWidth: '60px' }}>
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                // Skeleton loading rows
                [...Array(5)].map((_, i) => (
                  <tr key={`skeleton-${i}`} className="animate-pulse">
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-300 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="h-6 bg-gray-200 rounded mx-auto w-10"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-3 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded mb-1 w-4/5"></div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="h-3 bg-gray-200 rounded mx-auto w-16 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded mx-auto w-12"></div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="h-5 bg-gray-200 rounded mx-auto w-8"></div>
                    </td>
                    <td className="px-2 py-3 text-center">
                      <div className="h-6 w-6 bg-gray-200 rounded mx-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-xl font-medium text-gray-900 mb-2">Không tìm thấy thông số nào</p>
                      <p className="text-sm text-gray-500 mb-4">Thử thay đổi bộ lọc tìm kiếm hoặc từ khóa khác</p>
                      <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        Đặt lại
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((param, index) => (
                  <tr
                    key={param.testParameterId}
                    className={`hover:bg-blue-50 transition-colors duration-200 ${
                      param.isDeleted ? 'bg-red-50 opacity-60' : 
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm">
                      <div className="font-semibold text-gray-900 mb-1">{param.paramName}</div>
                      <div className="text-xs text-gray-500 font-mono bg-gray-100 px-1 py-0.5 rounded">
                        ID: {param.testParameterId.slice(-8)}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="font-bold text-blue-600 text-sm bg-blue-50 px-2 py-1 rounded">
                        {param.abbreviation}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="leading-relaxed text-xs">
                        {param.description.length > 80 
                          ? `${param.description.substring(0, 80)}...` 
                          : param.description
                        }
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm">
                      <div className="text-xs text-gray-700 font-medium">
                        {formatParameterRanges(param.parameterRanges)}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-xs text-gray-600">
                      <div>{new Date(param.createdAt).toLocaleDateString('vi-VN')}</div>
                      <div className="text-gray-400">{new Date(param.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-flex items-center px-1 py-1 text-xs font-medium rounded ${
                        param.isDeleted
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {param.isDeleted ? 'Xóa' : 'OK'}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => handleView(param)}
                          className="p-1 rounded transition-all text-green-600 hover:bg-green-100"
                          title="Xem chi tiết"
                        >
                          <FaEye className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Info */}
      {paginationInfo && paginationInfo.totalElements > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg mt-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4">
            <div className="flex items-center text-sm text-gray-700 gap-4">
              <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium">Thông tin:</span>
                <span className="text-gray-500">Tổng</span>
                <span className="ml-1 font-semibold text-blue-600">{paginationInfo.totalElements}</span>
                <span className="text-gray-500 ml-1">mục</span>
              </div>
              {/* <div className="flex items-center">
                <span className="text-gray-600">Kích thước trang:</span>
                <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-sm font-medium">{paginationInfo.size}</span>
              </div> */}
            </div>
            <div className="flex items-center">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                paginationInfo.empty 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {paginationInfo.empty ? 'Không có dữ liệu' : 'Có dữ liệu'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestParametersTab;