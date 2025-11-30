import React from "react";
import { 
  FaUserShield, 
  FaCrown, 
  FaKey, 
  FaCalendarAlt, 
  FaIdCard,
  FaInfoCircle,
  FaLock,
  FaUser,
  FaFlask,
  FaMicroscope,
  FaCog,
  FaComments,
  FaTint,
  FaClipboardList,
  FaEye
} from 'react-icons/fa';

const RoleDetail = ({ role }) => {
  if (!role) return null;

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

  const privilegeCategories = {
    USER: { label: 'Quản lý người dùng', color: 'bg-blue-100 text-blue-800', icon: FaUser },
    ROLE: { label: 'Quản lý vai trò', color: 'bg-purple-100 text-purple-800', icon: FaUserShield },
    TEST_ORDER: { label: 'Quản lý đơn xét nghiệm', color: 'bg-green-100 text-green-800', icon: FaFlask },
    INSTRUMENT: { label: 'Quản lý thiết bị', color: 'bg-orange-100 text-orange-800', icon: FaMicroscope },
    REAGENT: { label: 'Quản lý hóa chất', color: 'bg-yellow-100 text-yellow-800', icon: FaFlask },
    CONFIG: { label: 'Cấu hình hệ thống', color: 'bg-gray-100 text-gray-800', icon: FaCog },
    COMMENT: { label: 'Quản lý bình luận', color: 'bg-indigo-100 text-indigo-800', icon: FaComments },
    BLOOD_TEST: { label: 'Thực hiện xét nghiệm', color: 'bg-red-100 text-red-800', icon: FaTint },
    EVENT_LOG: { label: 'Xem nhật ký', color: 'bg-teal-100 text-teal-800', icon: FaClipboardList },
    READ_ONLY: { label: 'Chỉ đọc', color: 'bg-gray-100 text-gray-600', icon: FaEye }
  };

  const categorizePrivileges = (privileges) => {
    const categorized = {};
    privileges.forEach(privilege => {
      const category = privilege.split('_')[0];
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push(privilege);
    });
    return categorized;
  };

  const categorizedPrivileges = categorizePrivileges(role.privilegeCodes || []);

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FaUserShield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{role.roleName}</h2>
            <p className="text-sm text-gray-600">{role.roleCode}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {role.isSystem && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <FaCrown className="w-3 h-3 mr-1" />
              Hệ thống
            </span>
          )}
        </div>
      </div>

      {/* Basic Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <FaIdCard className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-500">ID Vai trò</p>
              <p className="text-sm text-gray-900 font-mono break-all">
                {role.roleId}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FaInfoCircle className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-500">Mô tả</p>
              <p className="text-sm text-gray-900">
                {role.roleDescription || 'Không có mô tả'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <FaCalendarAlt className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-500">Ngày tạo</p>
              <p className="text-sm text-gray-900">
                {formatDateTime(role.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FaCalendarAlt className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-500">Cập nhật lần cuối</p>
              <p className="text-sm text-gray-900">
                {formatDateTime(role.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Privileges Section */}
      <div className="border-t pt-6">
        <div className="flex items-center space-x-2 mb-4">
          <FaKey className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">
            Quyền hạn ({role.privilegeCodes?.length || 0})
          </h3>
        </div>

        {Object.keys(categorizedPrivileges).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(categorizedPrivileges).map(([category, privileges]) => {
              const categoryInfo = privilegeCategories[category] || {
                label: category,
                color: 'bg-gray-100 text-gray-800',
                icon: FaLock
              };

              const IconComponent = categoryInfo.icon;

              return (
                <div key={category} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <IconComponent className="w-4 h-4 text-gray-600" />
                    <h4 className="font-medium text-gray-900">{categoryInfo.label}</h4>
                    <span className="text-xs text-gray-500">({privileges.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {privileges.map((privilege) => (
                      <span
                        key={privilege}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.color}`}
                      >
                        {privilege.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FaLock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Không có quyền hạn nào được gán</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleDetail;