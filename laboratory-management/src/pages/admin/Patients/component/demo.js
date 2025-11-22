//  {/* Add/Edit Patient Modal */}
//                 {showAddModal && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
//                             <div className="p-6">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                                     {selectedPatient ? 'Chỉnh Sửa Bệnh Nhân' : 'Thêm Bệnh Nhân Mới'}
//                                 </h3>

//                                 <form className="space-y-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Họ và Tên *
//                                         </label>
//                                         <input
//                                             type="text"
//                                             value={formData.full_name}
//                                             onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                             required
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Ngày Sinh *
//                                         </label>
//                                         <input
//                                             type="date"
//                                             value={formData.date_of_birth}
//                                             onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                             required
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Giới Tính
//                                         </label>
//                                         <select
//                                             value={formData.gender}
//                                             onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         >
//                                             <option value="">Chọn giới tính</option>
//                                             <option value="Nam">Nam</option>
//                                             <option value="Nữ">Nữ</option>
//                                             <option value="Khác">Khác</option>
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Số Điện Thoại
//                                         </label>
//                                         <input
//                                             type="tel"
//                                             value={formData.phone}
//                                             onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                             placeholder="0901234567"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Email
//                                         </label>
//                                         <input
//                                             type="email"
//                                             value={formData.email}
//                                             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Địa Chỉ
//                                         </label>
//                                         <textarea
//                                             value={formData.address}
//                                             onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                                             rows={3}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         />
//                                     </div>
//                                 </form>

//                                 <div className="flex justify-end space-x-3 mt-6">
//                                     <button
//                                         onClick={() => {
//                                             setShowAddModal(false);
//                                             setSelectedPatient(null);
//                                             setFormData({
//                                                 full_name: '',
//                                                 date_of_birth: '',
//                                                 gender: '',
//                                                 phone: '',
//                                                 email: '',
//                                                 address: ''
//                                             });
//                                         }}
//                                         className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
//                                     >
//                                         Hủy
//                                     </button>
//                                     <button
//                                         onClick={handleAddPatient}
//                                         className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
//                                     >
//                                         {selectedPatient ? 'Cập Nhật' : 'Thêm'} Bệnh Nhân
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Patient Detail Modal */}
//                 {showDetailModal && selectedPatient && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
//                             <div className="p-6">
//                                 <div className="flex justify-between items-center mb-6">
//                                     <h3 className="text-xl font-semibold text-gray-900">
//                                         Chi Tiết Bệnh Nhân - {selectedPatient.patient_id}
//                                     </h3>
//                                     <button
//                                         onClick={() => setShowDetailModal(false)}
//                                         className="text-gray-400 hover:text-gray-600"
//                                     >
//                                         ✕
//                                     </button>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div>
//                                         <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
//                                             Thông Tin Cá Nhân
//                                         </h4>
//                                         <div className="space-y-3">
//                                             <div>
//                                                 <dt className="text-sm font-medium text-gray-500">Họ và Tên</dt>
//                                                 <dd className="text-sm text-gray-900">{selectedPatient.full_name}</dd>
//                                             </div>
//                                             {/* <div>
//                                                 <dt className="text-sm font-medium text-gray-500">Mã Bệnh Nhân</dt>
//                                                 <dd className="text-sm text-gray-900">{selectedPatient.patient_id}</dd>
//                                             </div> */}
//                                             <div>
//                                                 <dt className="text-sm font-medium text-gray-500">Tuổi</dt>
//                                                 <dd className="text-sm text-gray-900">
//                                                     {calculateAge(selectedPatient.date_of_birth)} tuổi
//                                                     ({selectedPatient.date_of_birth})
//                                                 </dd>
//                                             </div>
//                                             <div>
//                                                 <dt className="text-sm font-medium text-gray-500">Giới Tính</dt>
//                                                 <dd className="text-sm text-gray-900">{selectedPatient.gender || 'Chưa xác định'}</dd>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
//                                             Thông Tin Liên Hệ
//                                         </h4>
//                                         <div className="space-y-3">
//                                             <div>
//                                                 <dt className="text-sm font-medium text-gray-500">Điện Thoại</dt>
//                                                 <dd className="text-sm text-gray-900">{selectedPatient.phone}</dd>
//                                             </div>
//                                             <div>
//                                                 <dt className="text-sm font-medium text-gray-500">Email</dt>
//                                                 <dd className="text-sm text-gray-900">{selectedPatient.email}</dd>
//                                             </div>
//                                             <div>
//                                                 <dt className="text-sm font-medium text-gray-500">Địa Chỉ</dt>
//                                                 <dd className="text-sm text-gray-900">{selectedPatient.address}</dd>
//                                             </div>
//                                             <div>
//                                                 <dt className="text-sm font-medium text-gray-500">Ngày Đăng Ký</dt>
//                                                 <dd className="text-sm text-gray-900">{selectedPatient.created_at}</dd>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="mt-6 pt-6 border-t border-gray-200">
//                                     <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
//                                         Lịch Sử Y Tế
//                                     </h4>
//                                     {selectedPatient.last_test ? (
//                                         <div className="bg-gray-50 rounded-lg p-4">
//                                             <div className="text-sm">
//                                                 <span className="font-medium">Xét nghiệm gần nhất:</span> {selectedPatient.last_test.name}
//                                             </div>
//                                             <div className="text-sm text-gray-500 mt-1">
//                                                 Ngày: {selectedPatient.last_test.date}
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <div className="text-sm text-gray-500">Chưa có lịch sử xét nghiệm</div>
//                                     )}
//                                 </div>

//                                 <div className="flex justify-end space-x-3 mt-6">
//                                     <button
//                                         onClick={() => setShowDetailModal(false)}
//                                         className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
//                                     >
//                                         Đóng
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             setShowDetailModal(false);
//                                             setFormData(selectedPatient);
//                                             setShowAddModal(true);
//                                         }}
//                                         className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
//                                     >
//                                         Chỉnh Sửa Bệnh Nhân
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}




//  {/* ✅ Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//                     <div className="bg-white p-6 rounded-lg shadow-sm border">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Tổng Bệnh Nhân</p>
//                                 <p className="text-2xl font-bold text-gray-900">{paginationInfo.totalElements}</p>
//                             </div>
//                             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                                 👥
//                             </div>
//                         </div>
//                     </div>
//                     <div className="bg-white p-6 rounded-lg shadow-sm border">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Trang Hiện Tại</p>
//                                 <p className="text-2xl font-bold text-gray-900">{paginationInfo.currentPage + 1}</p>
//                             </div>
//                             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                                 📄
//                             </div>
//                         </div>
//                     </div>
//                     <div className="bg-white p-6 rounded-lg shadow-sm border">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Tổng Trang</p>
//                                 <p className="text-2xl font-bold text-gray-900">{paginationInfo.totalPages}</p>
//                             </div>
//                             <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
//                                 📊
//                             </div>
//                         </div>
//                     </div>
//                     <div className="bg-white p-6 rounded-lg shadow-sm border">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Kích Thước Trang</p>
//                                 <p className="text-2xl font-bold text-gray-900">{paginationInfo.size}</p>
//                             </div>
//                             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                                 📋
//                             </div>
//                         </div>
//                     </div>
//                 </div>