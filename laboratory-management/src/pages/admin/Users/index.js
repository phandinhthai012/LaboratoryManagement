import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaUser, FaUsers,FaTimes } from 'react-icons/fa';
import Avatar from '@mui/material/Avatar';
import Loading from '../../../components/Loading';
import MainLayout from '../../../layouts/MainLayout';
import StatCard from '../Home/components/StatCard';
import ErrorFetchData from '../../../components/ErrorFetchData';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useAuth } from '../../../contexts/AuthContext';
import { formatDate } from '../../../utils/helpers';
import { useUsers, useDeleteUser } from '../../../hooks/useUser';
import { useRoles } from '../../../hooks/useRole';
import { roleIconMap } from './components/RoleBadge';
import UserModal from './components/UserModal';
import UserDetailModal from './components/UserDetailModal';
import userService from '../../../services/userService';
import { useNotifier } from '../../../contexts/NotifierContext';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminCreateUser } from '../../../hooks/useUser';
import RoleDetail from './components/RoleDetail';
const Users = () => {
  const { user: userAuth } = useAuth();
  const today = formatDate(new Date());

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [paginationParams, setPaginationParams] = useState({
    q: '',
    gender: '',
    minAge: null,
    maxAge: null,
    sortBy: 'createdAt',
    sortDir: 'desc',
    page: 0,
    size: 10
  });
  const [showUserModal, setShowUserModal] = useState(false);

  const { showNotification } = useNotifier();
  const queryClient = useQueryClient();
  const { mutateAsync: adminCreateUser, isPending: isLoadingCreateUser } = useAdminCreateUser();

  const handleCreateUser = async (data) => {
    try {
      console.log('Create user data', data);
      // Use adminCreateUser hook instead of direct service call
      await adminCreateUser(data);
      setShowUserModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Create user error', error);
      // Error handling is done in the hook
    }
  };

  const handleUpdateUser = async (data) => {
    try {
      if (!selectedUser) {
        showNotification('Không tìm thấy người dùng để cập nhật', 'error');
        return;
      }

      const userId = selectedUser.userId || selectedUser.id;

      // Only send allowed fields for update
      const payload = {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        age: data.age,
        gender: data.gender,
        address: data.address,
        email: data.email,
        phone: data.phone
      };

      console.log('Update user payload:', payload);
      const res = await userService.updateUser(userId, payload);
      console.log('Update user response', res);
      showNotification('Cập nhật người dùng thành công', 'success');
      queryClient.invalidateQueries(['users']);
      setShowUserModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Update user error', error);
      const msg = error?.response?.data?.message || error.message || 'Cập nhật người dùng thất bại';
      showNotification(msg, 'error');
    }
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Sync debounced search với API params
  useEffect(() => {
    setPaginationParams(prev => ({
      ...prev,
      q: debouncedSearchTerm,
      page: 0
    }));
  }, [debouncedSearchTerm]);

  const [showRoleDetail, setShowRoleDetail] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const { data: responseUsers, isLoading, isError } = useUsers(paginationParams)
  console.log('Fetched users response:', responseUsers);
  const { data: responseRoles, isError: isErrorRoles } = useRoles();
  console.log('Fetched roles response:', responseRoles);
  const deleteUser = useDeleteUser();
  const listRoles = responseRoles?.content || [];

  const paginationInfo = responseUsers?.data || {
    content: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    empty: true
  };

  const users = paginationInfo.content || [];

  const handlePageChange = (newPage) => {
    setPaginationParams(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleItemsPerPageChange = (newSize) => {
    setPaginationParams(prev => ({
      ...prev,
      size: Number(newSize),
      page: 0 // Reset to first page
    }));
  };

  const handleGenderFilter = (gender) => {
    setPaginationParams(prev => ({
      ...prev,
      gender: gender,
      page: 0
    }));
  };

  const openDeleteConfirm = (user) => {
    setUserToDelete(user);
    setShowConfirmDialog(true);
  }
  const closeDeleteConfirm = () => {
    if (isDeleting) return; // prevent closing while deleting
    setShowConfirmDialog(false);
    setUserToDelete(null);
  };
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    if (userToDelete.userId === userAuth.userId) {
      showNotification('Bạn không thể xóa chính mình', 'error');
      closeDeleteConfirm();
      return;
    }
    setIsDeleting(true);
    try {
      await deleteUser.mutateAsync(userToDelete.userId);
    } catch (error) {
      console.error('Delete user error', error);
    } finally {
      setIsDeleting(false);
      closeDeleteConfirm();
    }
  }


  const handleViewDetails = (userId) => {
    setSelectedUserId(userId);
    setShowUserDetailModal(true);
  };
  const closeViewDetails = () => {
    setShowUserDetailModal(false);
    setSelectedUserId(null);
  };

  const handleDeleteFromDetail = (user) => {
    setUserToDelete(user);
    setShowUserDetailModal(false);
    setShowConfirmDialog(true);
  };

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setShowRoleDetail(true);
  };

  const closeRoleDetail = () => {
    setShowRoleDetail(false);
    setSelectedRole(null);
  };

  // Calculate statistics
  const totalUsers = paginationInfo.totalElements || 0;


  return (
    <MainLayout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản Lý Người Dùng</h1>
              <p className="text-gray-600">Quản lý tài khoản, phân quyền và truy cập hệ thống</p>
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-semibold">{userAuth.roleName || userAuth.roleCode}</span> • {today}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Tổng Người Dùng"
            value={totalUsers}
            icon={FaUsers}
            subtitle="Tổng số người dùng trong hệ thống"
          />
          <StatCard
            title="Người Dùng Hoạt Động"
            value="N/A"
            icon={FaUsers}
            subtitle="Người dùng đăng nhập trong 30 ngày qua"
          />
          <StatCard
            title="Vai Trò Khác Nhau"
            value={listRoles.length}
            icon={FaUsers}
            subtitle="Số vai trò người dùng khác nhau"
          />
        </div>

        {/* Roles Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Phân Quyền Vai Trò</h2>
            <p className="text-sm text-gray-600">Phân bổ người dùng theo vai trò và quyền hạn</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            {isErrorRoles ? (
              <div className="col-span-full text-center text-red-500">
                <ErrorFetchData onRetry={() => window.location.reload()} />
              </div>
            ) : listRoles.map((role, index) => {
              const roleConfig = roleIconMap[role.roleCode];
              const IconComponent = roleConfig ? roleConfig.icon : FaUser;
              return (
                <div
                  onClick={() => handleRoleClick(role)}
                  key={index}
                  className="text-center p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-center mb-3">
                    <div className={`p-3 rounded-full`}>
                      <IconComponent className={`w-6 h-6 ${roleConfig ? roleConfig.className : 'text-gray-600'}`} />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{role.roleName}</h3>
                  {/* <p className="text-2xl font-bold text-gray-900 mb-2">{role.count}</p> */}
                  <p className="text-xs text-gray-500">{role.roleDescription}</p>
                </div>
              );
            })
            }
          </div>
        </div>

        {/* Users Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Danh Sách Người Dùng</h2>
                <p className="text-sm text-gray-600">Quản lý tài khoản và phân quyền người dùng</p>
              </div>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setShowUserModal(true);
                }}
                className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <FaPlus className="w-4 h-4" />
                Thêm Người Dùng
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, mã người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Giới tính:</label>
                <select
                  value={paginationParams.gender}
                  onChange={(e) => handleGenderFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1"
                >
                  <option value="">Tất cả</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
            </div>
          </div>



          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người Dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giới Tính & Tuổi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên Hệ & Địa Chỉ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày Sinh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                          <div>
                            <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="h-4 bg-gray-300 rounded w-16 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-12"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="h-4 bg-gray-300 rounded w-36 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-40"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-300 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 bg-gray-300 rounded p-1"></div>
                          <div className="h-8 w-8 bg-gray-300 rounded p-1"></div>
                          <div className="h-8 w-8 bg-gray-300 rounded p-1"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-red-500">
                      <ErrorFetchData onRetry={() => window.location.reload()} />
                    </td>
                  </tr>
                ) : paginationInfo.empty ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <span className="text-lg mb-2">👤</span>
                        <span>Không tìm thấy người dùng nào</span>
                        {searchTerm && (
                          <span className="text-sm mt-1">Thử tìm kiếm với từ khóa khác</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                            <Avatar sx={{ bgcolor: 'primary.main' }}>{user.fullName.charAt(0)}</Avatar>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.fullName}</div>
                            <div className="text-gray-500 text-xs">ID: {user.userId}</div>
                            <div className="text-gray-500 text-xs">CCCD: {user.identifyNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div className="font-medium">{user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : 'Khác'}</div>
                          <div className="text-xs">Tuổi: {user.age}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div>
                          <div className="font-medium">{user.email}</div>
                          <div className="text-xs">{user.phone}</div>
                          <div className="text-xs text-gray-400">{user.address}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="font-medium">{user.dateOfBirth}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Chỉnh sửa"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              handleViewDetails(user.userId);
                            }}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Xem chi tiết"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          {userAuth.roleCode === 'ROLE_ADMIN' && user.roleCode !== 'ROLE_ADMIN' && userAuth.userId !== user.userId && (
                            <button
                              onClick={() => {
                                openDeleteConfirm(user);
                              }}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Xóa"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!paginationInfo.empty && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              {/* Mobile pagination */}
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(paginationInfo.page - 1)}
                  disabled={paginationInfo.page === 0}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <button
                  onClick={() => handlePageChange(paginationInfo.page + 1)}
                  disabled={paginationInfo.page === paginationInfo.totalPages - 1}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
              {/* Desktop pagination */}
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{paginationInfo.page * paginationInfo.size + 1}</span> đến{' '}
                    <span className="font-medium">
                      {Math.min((paginationInfo.page + 1) * paginationInfo.size, paginationInfo.totalElements)}
                    </span> trong{' '}
                    <span className="font-medium">{paginationInfo.totalElements}</span> kết quả
                  </p>

                  <select
                    value={paginationParams.size}
                    onChange={(e) => handleItemsPerPageChange(e.target.value)}
                    className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={5}>5 / trang</option>
                    <option value={10}>10 / trang</option>
                    <option value={20}>20 / trang</option>
                    <option value={50}>50 / trang</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(paginationInfo.page - 1)}
                    disabled={paginationInfo.page === 0}
                    className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                  >
                    ← Trước
                  </button>

                  <span className="text-sm text-gray-700">
                    Trang {paginationInfo.page + 1} / {paginationInfo.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(paginationInfo.page + 1)}
                    disabled={paginationInfo.page === paginationInfo.totalPages - 1}
                    className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                  >
                    Sau →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <UserModal
          open={showUserModal}
          onClose={() => { setShowUserModal(false); setSelectedUser(null); }}
          onSubmit={(data, isEdit) => isEdit ? handleUpdateUser(data) : handleCreateUser(data)}
          selectedUser={selectedUser}
          roles={listRoles}
          isLoading={isLoadingCreateUser}
        />
        <ConfirmDialog
          isOpen={showConfirmDialog}
          title="Xác nhận xóa người dùng"
          message="Bạn có chắc chắn muốn xóa người dùng này?"
          confirmText="Xóa người dùng"
          cancelText="Hủy"
          type='danger'
          onClose={closeDeleteConfirm}
          onConfirm={handleDeleteUser}
          isLoading={isDeleting}
        />

        <UserDetailModal
          isOpen={showUserDetailModal}
          onClose={closeViewDetails}
          userId={selectedUserId}
          onDelete={handleDeleteFromDetail}
        />
         <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform transition-transform duration-300 ease-in-out ${
          showRoleDetail ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex h-full flex-col bg-white shadow-xl">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-6 sm:px-6 bg-gray-50 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Chi Tiết Vai Trò</h3>
              <button
                type="button"
                className="rounded-md bg-white p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={closeRoleDetail}
              >
                <span className="sr-only">Đóng panel</span>
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="relative flex-1 px-4 py-6 sm:px-6 overflow-y-auto">
              {selectedRole && (
                <RoleDetail role={selectedRole} />
              )}
            </div>
          </div>
        </div>

        {/* Backdrop */}
        {showRoleDetail && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={closeRoleDetail}
          />
        )}

      </div>
    </MainLayout>
  );
};

export default Users;