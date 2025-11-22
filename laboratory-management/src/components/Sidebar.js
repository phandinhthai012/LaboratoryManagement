import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FaUserCog, FaUserMd, FaVials, FaBoxOpen, FaFileAlt, FaSignOutAlt, FaTachometerAlt, FaServicestack, FaCogs } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifier } from '../contexts/NotifierContext';

// sidebar component for ROLE_ADMIN, ROLE_LAB_MANAGER, ROLE_LAB_USER, ROLE_SERVICE

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { showNotification } = useNotifier();
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split('/')[1] || 'dashboard';
  const [open, setOpen] = React.useState(false);

  const handleLogout = async () => {
    const result = await logout();
    if(result.code === 200 || result.code === 204) {
      showNotification( 'Đăng xuất thành công! Hẹn gặp lại bạn sau.','success');
      navigate('/');
    }else{
      showNotification('lỗi', 'error');
    }
  }



  // Đóng sidebar khi đổi route trên mobile
  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Đóng sidebar khi đổi route trên mobile
  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Sidebar content
  const sidebarContent = (
    <aside className="fixed top-0 left-0 h-screen w-80 bg-white border-r flex flex-col justify-between py-8 px-6 z-50">
      <div>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-bold">LIMS</h2>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-1 mb-4">Welcome, {user.username}</p>
        <nav className="space-y-2">
          {/* Trang chủ: mọi role đều thấy */}
          <div
            className={`flex items-center gap-3 py-2 px-3 rounded-lg font-medium text-sm  cursor-pointer ${(activeTab === 'dashboard' || activeTab === '') ? 'bg-gray-900 text-white font-semibold' : 'hover:bg-gray-100 text-gray-800 font-medium'}`}
            onClick={() => navigate('/dashboard')}
          >
            <FaTachometerAlt className="w-5 h-5" /> Trang chủ
          </div>
          {/* Quản lý bệnh nhân: ROLE_ADMIN, ROLE_LAB_MANAGER */}
          {(user.roleCode === 'ROLE_ADMIN' || user.roleCode === 'ROLE_LAB_MANAGER') && (
            <div
              className={`flex items-center gap-3 py-2 px-3 rounded-lg font-medium text-sm cursor-pointer ${activeTab === 'patients' ? 'bg-gray-900 text-white font-semibold' : 'hover:bg-gray-100 text-gray-800 font-medium'}`}
              onClick={() => navigate('/patients')}
            >
              <FaUserMd className="w-5 h-5" /> Quản Lý Bệnh Nhân
            </div>
          )}
          {/* Quản lý xét nghiệm: ROLE_ADMIN, ROLE_LAB_MANAGER, ROLE_LAB_USER */}
          {(user.roleCode === 'ROLE_ADMIN' || user.roleCode === 'ROLE_LAB_MANAGER' || user.roleCode === 'ROLE_LAB_USER') && (
            <div
              className={`flex items-center gap-3 py-2 px-3 rounded-lg font-medium text-sm cursor-pointer ${activeTab === 'tests' ? 'bg-gray-900 text-white font-semibold' : 'hover:bg-gray-100 text-gray-800 font-medium'}`}
              onClick={() => navigate('/tests')}
            >
              <FaVials className="w-5 h-5" /> Quản Lý Xét Nghiệm
            </div>
          )}
          {/* Quản lý dịch vụ: ROLE_ADMIN, ROLE_SERVICE, ROLE_LAB_MANAGER */}
          {(user.roleCode === 'ROLE_ADMIN' || user.roleCode === 'ROLE_SERVICE' || user.roleCode === 'ROLE_LAB_MANAGER') && (
            <div
              className={`flex items-center gap-3 py-2 px-3 rounded-lg text-gray-800 font-medium text-sm cursor-pointer ${activeTab === 'services' ? 'bg-gray-900 text-white font-semibold' : 'hover:bg-gray-100 text-gray-800 font-medium'}`}
              onClick={() => navigate('/services')}
            >
              <FaServicestack className="w-5 h-5" /> Quản Lý Dịch Vụ
            </div>
          )}
          {/* Quản lý thiết bị: ROLE_ADMIN, ROLE_LAB_MANAGER, ROLE_LAB_USER */}
          {(user.roleCode === 'ROLE_ADMIN' || user.roleCode === 'ROLE_LAB_MANAGER' || user.roleCode === 'ROLE_LAB_USER') && (
            <div
              className={`flex items-center gap-3 py-2 px-3 rounded-lg  text-gray-800 font-medium text-sm cursor-pointer ${activeTab === 'devices' ? 'bg-gray-900 text-white font-semibold' : 'hover:bg-gray-100 text-gray-800 font-medium'}`}
              onClick={() => navigate('/devices')}
            >
              <FaBoxOpen className="w-5 h-5" /> Quản Lý Thiết Bị
            </div>
          )}
          {/* Quản lý cấu hình: ROLE_ADMIN, ROLE_LAB_MANAGER */}
          {(user.roleCode === 'ROLE_ADMIN' || user.roleCode === 'ROLE_LAB_MANAGER') && (
            <div
              className={`flex items-center gap-3 py-2 px-3 rounded-lg text-gray-800 font-medium text-sm cursor-pointer ${activeTab === 'configurations' ? 'bg-gray-900 text-white font-semibold' : 'hover:bg-gray-100 text-gray-800 font-medium'}`}
              onClick={() => navigate('/configurations')}
            >
              <FaCogs className="w-5 h-5" /> Quản Lý Cấu Hình
            </div>
          )}
          {/* Quản lý người dùng: chỉ ROLE_ADMIN */}
          {user.roleCode === 'ROLE_ADMIN' && (
            <div
              className={`flex items-center gap-3 py-2 px-3 rounded-lg text-gray-800 font-medium text-sm  cursor-pointer ${activeTab === 'users' ? 'bg-gray-900 text-white font-semibold' : 'hover:bg-gray-100 text-gray-800 font-medium'}`}
              onClick={() => navigate('/users')}
            >
              <FaUserCog className="w-5 h-5" /> Quản Lý Người Dùng
            </div>
          )}
          {/* Báo cáo & phân tích: ROLE_ADMIN, ROLE_LAB_MANAGER */}
          {(user.roleCode === 'ROLE_ADMIN' || user.roleCode === 'ROLE_LAB_MANAGER') && (
            <div
              className={`flex items-center gap-3 py-2 px-3 rounded-lg  text-gray-800 font-medium text-sm  cursor-pointer ${activeTab === 'reports' ? 'bg-gray-900 text-white font-semibold' : 'hover:bg-gray-100 text-gray-800 font-medium'}`}
              onClick={() => navigate('/reports')}
            >
              <FaFileAlt className="w-5 h-5" /> Báo Cáo & Phân Tích
            </div>
          )}
          {/* profile */}
          <div
            className={`flex items-center gap-3 py-2 px-3 rounded-lg  text-gray-800 font-medium text-sm cursor-pointer ${activeTab === 'profile' ? 'bg-gray-900 text-white font-semibold' : 'hover:bg-gray-100 text-gray-800 font-medium'}`}
            onClick={() => navigate('/profile')}
          >
            <FaUserCog className="w-5 h-5" /> Hồ Sơ Cá Nhân
          </div>
        </nav>
      </div>
      <div className="mb-2">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border rounded-lg text-gray-800 hover:bg-gray-100 font-medium cursor-pointer">
          <FaSignOutAlt className="w-5 h-5" /> Đăng xuất
        </button>
      </div>
    </aside>
  );

  return (
    <div>
      {/* Nút mở sidebar trên mobile */}
      <button
        className="top-10 left-10 z-40 lg:hidden bg-white border rounded-full p-2 shadow"
        onClick={() => setOpen(true)}
        aria-label="Mở menu"
      >
        <FaBars className="w-6 h-6" />
      </button>
      {/* Sidebar cho desktop và mobile */}
      <div className="hidden lg:block">{sidebarContent}</div>
      {open && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setOpen(false)}></div>
          {sidebarContent}
        </>
      )}
    </div>
  );
};

export default Sidebar;