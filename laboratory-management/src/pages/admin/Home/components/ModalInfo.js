import React from "react";

const ModalInfo = ({ open, onClose, user, onLogout }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <div className="mb-4">
          <div className="text-lg font-bold mb-1">{user.fullName}</div>
          <div className="text-gray-500 mb-2">Role: <span className="font-semibold">{user.roleName || user.roleCode}</span></div>
        </div>
        <button
          className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
          onClick={onLogout}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default ModalInfo;
