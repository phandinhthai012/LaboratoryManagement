//  {/* New Test Order Modal */}
//                 {showNewTestModal && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
//                             <div className="p-6">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                                     Tạo Đơn Xét Nghiệm Mới
//                                 </h3>

//                                 <form className="space-y-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Patient ID *
//                                         </label>
//                                         <input
//                                             type="text"
//                                             value={formData.patient_id}
//                                             onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                             placeholder="VD: BN001"
//                                             required
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Loại Xét Nghiệm *
//                                         </label>
//                                         <select
//                                             value={formData.test_type}
//                                             onChange={(e) => setFormData({ ...formData, test_type: e.target.value })}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                             required
//                                         >
//                                             <option value="">Chọn loại xét nghiệm</option>
//                                             {testTypes.map((type, index) => (
//                                                 <option key={index} value={type.name}>
//                                                     {type.name} - {formatCurrency(type.fee)}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Kỹ Thuật Viên
//                                         </label>
//                                         <select
//                                             value={formData.technician}
//                                             onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         >
//                                             <option value="Chưa phân công">Chưa phân công</option>
//                                             <option value="Kỹ thuật viên Nguyễn">Kỹ thuật viên Nguyễn</option>
//                                             <option value="Kỹ thuật viên Trần">Kỹ thuật viên Trần</option>
//                                             <option value="Kỹ thuật viên Lê">Kỹ thuật viên Lê</option>
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Ghi Chú
//                                         </label>
//                                         <textarea
//                                             value={formData.notes}
//                                             onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//                                             rows={3}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                             placeholder="Ghi chú thêm về xét nghiệm..."
//                                         />
//                                     </div>
//                                 </form>

//                                 <div className="flex justify-end space-x-3 mt-6">
//                                     <button
//                                         onClick={() => {
//                                             setShowNewTestModal(false);
//                                             setFormData({
//                                                 patient_id: '',
//                                                 test_type: '',
//                                                 technician: '',
//                                                 notes: ''
//                                             });
//                                         }}
//                                         className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
//                                     >
//                                         Hủy
//                                     </button>
//                                     <button
//                                         onClick={handleNewTestOrder}
//                                         className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
//                                     >
//                                         Tạo Đơn
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}



// const getStatusIcon = (status) => {
//         switch (status) {
//             case 'PENDING': return <FaClock className="w-4 h-4 text-yellow-500" />;
//             case 'IN_PROGRESS': return <FaSpinner className="w-4 h-4 text-blue-500" />;
//             case 'COMPLETED': return <FaCheckCircle className="w-4 h-4 text-gray-500" />;
//             case 'CANCELLED': return <FaCheckCircle className="w-4 h-4 text-green-500" />;
//             default: return <FaClock className="w-4 h-4 text-yellow-500" />;
//         }
//     };

//     const filteredTests = tests.filter(test => {
//         const matchesSearch =
//             test.test_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             test.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             test.test_type.toLowerCase().includes(searchTerm.toLowerCase());

//         const matchesStatus = statusFilter === 'All Status' || test.status === statusFilter;

//         return matchesSearch && matchesStatus;
//     });

//     const handleNewTestOrder = () => {
//         if (!formData.patient_id || !formData.test_type) return;

//         const newTest = {
//             id: tests.length + 1,
//             test_id: `T${String(tests.length + 1).padStart(3, '0')}`,
//             ...formData,
//             sample_id: `SAM${Date.now()}`,
//             order_date: new Date().toISOString().split('T')[0],
//             status: 'pending',
//             fee: testTypes.find(type => type.name === formData.test_type)?.fee || 0
//         };

//         setTests([...tests, newTest]);
//         setFormData({
//             patient_id: '',
//             test_type: '',
//             technician: '',
//             notes: ''
//         });
//         setShowNewTestModal(false);
//     };