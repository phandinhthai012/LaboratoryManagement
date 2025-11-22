import React from 'react';
import { FaRegCalendarAlt, FaRegFileAlt, FaRegCreditCard, FaRegUser } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotifier } from '../contexts/NotifierContext';

import { useAuth } from '../contexts/AuthContext';

const PatientSidebar = () => {
  const { showNotification } = useNotifier();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split('/')[1] || 'dashboard';


  const handleLogout = async () => {
    const result = await logout();
    if(result.code === 200 || result.code === 204) {
      showNotification( 'Đăng xuất thành công! Hẹn gặp lại bạn sau.','success');
      navigate('/');
    }else{
      showNotification('lỗi', 'error');
      navigate('/');
    }
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-80 bg-white border-r flex flex-col justify-between py-8 px-6 z-50">
      <div>
        <div className="mb-8">
          <h2 className="text-xl font-bold">LIMS</h2>
          <h2 className="mt-2 text-lg font-semibold">Hồ Sơ Bệnh Nhân</h2>
          <p className="text-gray-500 text-sm mt-1 mb-4">Xin chào, {user.fullName}</p>
        </div>
        <nav className="space-y-2">
          <div
            className={`flex items-center gap-3 py-2 px-3 rounded-lg  text-gray-800 font-medium text-sm cursor-pointer ${(activeTab === 'normal-dashboard'|| activeTab ==='' ) ? 'bg-gray-900 text-white font-semibold' : 'hover:bg-gray-100 text-gray-800 font-medium'}`}
            onClick={() => navigate('/normal-dashboard')}
          >
            <FaRegFileAlt className="w-5 h-5" /> Trang chủ
          </div>
          <div
            className={`flex items-center gap-3 py-2 px-4 rounded-xl text-sm font-medium cursor-pointer ${activeTab === 'normal-view-tests' ? 'bg-gray-900 text-white font-semibold' : 'hover:bg-gray-100 text-gray-900 font-normal'}`}
            onClick={() => navigate('/normal-view-tests')}
          >
            <FaRegCalendarAlt className="w-5 h-5" /> Kết quả xét nghiệm
          </div>
          {/* <div
            className={`flex items-center gap-3 py-2 px-4 rounded-xl text-base cursor-pointer ${activeTab === 'billing' ? 'bg-gray-900 text-white font-semibold' : 'hover:bg-gray-100 text-gray-900 font-normal'}`}
            onClick={() => navigate('/patient/billin')}
          >
            <FaRegCreditCard className="w-5 h-5" /> Hóa đơn
          </div> */}
          <div
            className={`flex items-center gap-3 py-2 px-4 rounded-xl text-sm font-medium cursor-pointer ${activeTab === 'normal-view-profile' ? 'bg-gray-900 text-white font-semibold' : 'hover:bg-gray-100 text-gray-900 font-normal'}`}
            onClick={() => navigate('/normal-view-profile')}
          >
            <FaRegUser className="w-5 h-5" /> Hồ Sơ
          </div>
        </nav>
      </div>
      <div className="mb-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border rounded-lg text-gray-800 hover:bg-gray-100 font-medium">
          <FaSignOutAlt className="w-5 h-5" /> Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default PatientSidebar;
