import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaFlask } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';
import MainLayout from '../../../layouts/MainLayout';
import { usePatientMedicalRecords, useDeletePatientMedicalRecord } from '../../../hooks/usePatienMedicalRecord';
import { formatDate } from '../../../utils/helpers';
import { useAuth } from '../../../contexts/AuthContext';
import StatsCard from './component/StatsCard';
import PatientsModal from './component/PatientsModal';
import ConfirmDialog from '../../../components/ConfirmDialog';
import PatientDetailModal from './component/PatientDetailModal';
import testOrderService from '../../../services/testOrderService';
import { useNavigate } from 'react-router-dom';
import { useNotifier } from '../../../contexts/NotifierContext';

const Patients = () => {
    const { user: userAuth } = useAuth();
    const [paginationParams, setPaginationParams] = useState({
        sort: ['fullName,desc'],
        page: 0,
        size: 10,
        search: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedPatientDetail, setSelectedPatientDetail] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [formData, setFormData] = useState({
        full_name: '',
        date_of_birth: '',
        gender: '',
        phone: '',
        email: '',
        address: ''
    });

    const [filters, setFilters] = useState({
        gender: '',
        startDate: '',
        endDate: ''
    });
    const [patientToDelete, setPatientToDelete] = useState(null);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

    const { data: responsePatient, isLoading, isError, error } = usePatientMedicalRecords(paginationParams);
    const deletePatient = useDeletePatientMedicalRecord();
    const patients = responsePatient?.values || [];
    console.log('Fetched patients:', patients);
    const paginationInfo = {
        totalElements: responsePatient?.totalElements || 0,
        totalPages: responsePatient?.totalPages || 0,
        currentPage: responsePatient?.page || 0,
        size: responsePatient?.size || 10,
        empty: !responsePatient?.values?.length || responsePatient?.totalElements === 0,
        last: responsePatient?.last || false,
        first: responsePatient?.page === 0
    };
    const today = formatDate(new Date());

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setPaginationParams(prev => ({
                ...prev,
                search: searchTerm, // ✅ Use 'search' instead of 'q'
                page: 0 // Reset to first page when searching
            }));
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // ✅ Handle filters
    useEffect(() => {
        setPaginationParams(prev => ({
            ...prev,
            ...filters,
            page: 0 // Reset to first page when filtering
        }));
    }, [filters]);

    // ✅ Pagination handlers
    const handlePageChange = (newPage) => {
        setPaginationParams(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handlePageSizeChange = (newSize) => {
        setPaginationParams(prev => ({
            ...prev,
            size: parseInt(newSize),
            page: 0
        }));
    };

    // ✅ Sort handler
    const handleSortChange = (field, direction = 'desc') => {
        const sortValue = `${field},${direction}`;
        setPaginationParams(prev => ({
            ...prev,
            sort: [sortValue],
            page: 0
        }));
    };

    // ✅ Filter handlers
    const handleGenderFilter = (gender) => {
        setFilters(prev => ({
            ...prev,
            gender: gender
        }));
    };

    const handleDateRangeFilter = (startDate, endDate) => {
        setFilters(prev => ({
            ...prev,
            startDate,
            endDate
        }));
    };



    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    };
    const navigate = useNavigate();
    const { showNotification } = useNotifier();

    const handleCreateTest = async (patient) => {
        const medicalRecordCode = patient?.medicalRecordCode || patient?.medicalRecord_code;
        if (!medicalRecordCode) {
            showNotification('Không tìm thấy mã hồ sơ y tế', 'error');
            return;
        }
        try {
            const data = await testOrderService.createTestOrder({ medicalRecordCode });
            showNotification('Tạo đơn xét nghiệm thành công', 'success');
            // If API returns an id for the created test order, navigate to its detail page
            const testOrderId = data?.id || data?.orderId || data?.orderCode;
            if (data?.id) {
                navigate(`/test-orders/${data.id}`);
            } else {
                // fallback: go to tests list
                navigate('/tests');
            }
        } catch (err) {
            console.error('Create test order error', err);
            const msg = err?.response?.data?.message || err.message || 'Tạo đơn xét nghiệm thất bại';
            showNotification(msg, 'error');
        }
    };


    // const handleAddPatient = () => {
    //     if (!formData.full_name || !formData.date_of_birth) return;

    //     const newPatient = {
    //         ...formData,
    //         id: patients.length + 1,
    //         patient_id: `BN${String(patients.length + 1).padStart(3, '0')}`,
    //         created_at: new Date().toISOString().split('T')[0],
    //         last_test: null
    //     };

    //     setPatients([...patients, newPatient]);
    //     setFormData({
    //         full_name: '',
    //         date_of_birth: '',
    //         gender: '',
    //         phone: '',
    //         email: '',
    //         address: ''
    //     });
    //     setShowAddModal(false);
    // };

    // const handleViewDetails = (patient) => {
    //     setSelectedPatient(patient);
    //     setShowDetailModal(true);
    // };

    // const handleDeletePatient = (patientId) => {
    //     if (window.confirm('Bạn có chắc chắn muốn xóa bệnh nhân này?')) {
    //         setPatients(patients.filter(p => p.id !== patientId));
    //     }
    // };

    const OpenDetailModal = (medicalRecordId) => {
        setSelectedPatientDetail(medicalRecordId);
        setShowDetailModal(true);
    }
    const CloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedPatientDetail(null);

    }
    // delete
    const openConfirmDeleteModal = (patient) => {
        setPatientToDelete(patient);
        setShowConfirmDeleteModal(true);
    }
    const closeConfirmDeleteModal = () => {
        setPatientToDelete(null);
        setShowConfirmDeleteModal(false);
    }
    const handleConfirmDelete = async () => {
        // Thực hiện xóa bệnh nhân
        if (patientToDelete) {
            try {
                await deletePatient.mutateAsync(patientToDelete.medicalRecordCode);
            } catch (error) {
                console.error("Error deleting patient:", error);
            } finally {
                closeConfirmDeleteModal();
            }
        }
    }


    if (isError) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-red-500 mb-2">❌ Lỗi tải dữ liệu</div>
                        <div className="text-gray-600 mb-4">
                            {error?.response?.data?.message || error?.message || 'Không thể tải danh sách bệnh nhân'}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div>
                {/* Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản Lý Bệnh Nhân</h1>
                            <p className="text-gray-600">Quản lý đăng ký bệnh nhân, thông tin cá nhân và lịch sử y tế</p>
                        </div>
                        <div className="text-sm text-gray-500">
                            {/* <span className="font-semibold">{userAuth?.fullName || 'Người dùng'}</span> • */}
                            <span className="font-semibold">{userAuth?.roleName || 'Người dùng'}</span> • {today}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatsCard
                        title="Tổng Bệnh Nhân"
                        value={paginationInfo.totalElements}
                        icon="👥"
                    />
                    <StatsCard
                        title="Trang Hiện Tại"
                        value={paginationInfo.currentPage + 1}
                        icon="📄"
                    />
                    <StatsCard
                        title="Tổng Trang"
                        value={paginationInfo.totalPages}
                        icon="📊"
                    />
                </div>

                {/* Patient Directory */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Danh Sách Bệnh Nhân</h2>
                                <p className="text-sm text-gray-600">Tìm kiếm và quản lý hồ sơ bệnh nhân</p>
                            </div>
                            <button
                                onClick={() => {
                                    // ensure we open the create modal (no selected patient)
                                    setSelectedPatient(null);
                                    setFormData({
                                        fullName: '',
                                        dateOfBirth: '',
                                        gender: '',
                                        phone: '',
                                        email: '',
                                        address: ''
                                    });
                                    setShowAddModal(true);
                                }}
                                className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
                            >
                                <FaPlus className="w-4 h-4" />
                                Thêm Bệnh Nhân Mới
                            </button>
                        </div>
                        {/* ✅ Enhanced Search & Controls */}
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên, mã số, email, số điện thoại..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={paginationParams.size}
                                onChange={(e) => handlePageSizeChange(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                            >
                                <option value={5}>5 / trang</option>
                                <option value={10}>10 / trang</option>
                                <option value={20}>20 / trang</option>
                                <option value={50}>50 / trang</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Giới tính:</label>
                                <select
                                    value={filters.gender}
                                    onChange={(e) => handleGenderFilter(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="MALE">Nam</option>
                                    <option value="FEMALE">Nữ</option>
                                    <option value="OTHER">Khác</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Sắp xếp:</label>
                                <select
                                    value={paginationParams.sort[0]}
                                    onChange={(e) => {
                                        const [field, direction] = e.target.value.split(',');
                                        handleSortChange(field, direction);
                                    }}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                >
                                    <option value="fullName,asc">Tên (A → Z)</option>
                                    <option value="fullName,desc">Tên (Z → A)</option>
                                    <option value="dateOfBirth,asc">Tuổi (Thấp → Cao)</option>
                                    <option value="dateOfBirth,desc">Tuổi (Cao → Thấp)</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                    onClick={() => {
                                        setFilters({
                                            search: '',
                                            gender: '',
                                            status: '',
                                            createdAt: [null, null],
                                        });
                                        setPaginationParams({
                                            ...paginationParams,
                                            sort: ['fullName', 'asc'],
                                            page: 0,
                                        });
                                    }}>
                                    Đặt lại bộ lọc
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Patient Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        STT
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mã Bệnh Án
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Họ và Tên
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tuổi / Giới Tính
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thông Tin Liên Hệ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Xét Nghiệm Gần Nhất
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao Tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center">
                                            <div className="flex items-center justify-center">
                                                <FaSpinner className="animate-spin w-6 h-6 text-gray-500 mr-2" />
                                                <span className="text-gray-500">Đang tải...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginationInfo.empty ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <span className="text-4xl mb-2">👥</span>
                                                <span>Không tìm thấy bệnh nhân nào</span>
                                                {searchTerm && (
                                                    <span className="text-sm mt-1">
                                                        Thử tìm kiếm với từ khóa khác: "{searchTerm}"
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    patients.map((patient, index) => (
                                        <tr key={patient.id} className="hover:bg-gray-50">
                                            <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                                {paginationInfo.currentPage * paginationParams.size + index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div>
                                                    <div className="font-medium">{patient.medicalRecordCode}</div>
                                                    <div className="text-xs text-gray-500">ID: {patient.medicalRecordId}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="font-medium">{patient.fullName}</div>
                                                <div className="text-xs text-gray-500">
                                                    Sinh: {formatDate(patient.dateOfBirth)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div>
                                                    <div className="font-medium">
                                                        {calculateAge(patient.dateOfBirth)} tuổi
                                                    </div>
                                                    <div className="text-xs">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${patient.gender === 'MALE' ? 'bg-blue-100 text-blue-800' :
                                                            patient.gender === 'FEMALE' ? 'bg-pink-100 text-pink-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {patient.gender === 'MALE' ? 'Nam' :
                                                                patient.gender === 'FEMALE' ? 'Nữ' :
                                                                    'Khác'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <div className="space-y-1">
                                                    <div className="flex items-center">
                                                        📞 <span className="ml-1">{patient.phone || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        ✉️ <span className="ml-1 truncate max-w-[200px]" title={patient.email}>
                                                            {patient.email || 'N/A'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start">
                                                        🏠 <span className="ml-1 text-xs truncate max-w-[200px]" title={patient.address}>
                                                            {patient.address || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {patient.lastTestDate ? (
                                                    <div>
                                                        <div className="text-gray-900 font-medium">Có xét nghiệm</div>
                                                        <div className="text-gray-500 text-xs">
                                                            {formatDate(patient.lastTestDate)}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 italic">Chưa có xét nghiệm</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            OpenDetailModal(patient.medicalRecordId)
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        title="Xem Chi Tiết"
                                                    >
                                                        <FaEye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedPatient(patient);
                                                            setFormData(patient);
                                                            setShowAddModal(true);
                                                        }}
                                                        className="text-green-600 hover:text-green-900 p-1"
                                                        title="Chỉnh Sửa"
                                                    >
                                                        <FaEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCreateTest(patient)}
                                                        className="text-purple-600 hover:text-purple-900 p-2 hover:bg-purple-50 rounded-lg transition-colors"
                                                        title="Tạo Xét Nghiệm"
                                                    >
                                                        <FaFlask className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openConfirmDeleteModal(patient)}
                                                        className="text-red-600 hover:text-red-900 p-1"
                                                        title="Xóa"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
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
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
                                    disabled={paginationInfo.first}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Trước
                                </button>
                                <button
                                    onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                                    disabled={paginationInfo.last}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Sau
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Hiển thị{' '}
                                        <span className="font-medium">
                                            {paginationInfo.currentPage * paginationParams.size + 1}
                                        </span>{' '}
                                        đến{' '}
                                        <span className="font-medium">
                                            {Math.min(
                                                (paginationInfo.currentPage + 1) * paginationParams.size,
                                                paginationInfo.totalElements
                                            )}
                                        </span>{' '}
                                        trong{' '}
                                        <span className="font-medium">{paginationInfo.totalElements}</span> kết quả
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
                                        disabled={paginationInfo.first}
                                        className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                                    >
                                        ← Trước
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Trang {paginationInfo.currentPage + 1} / {paginationInfo.totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                                        disabled={paginationInfo.last}
                                        className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                                    >
                                        Sau →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Patients modal (create / update unified) */}
                {showAddModal && (
                    <PatientsModal
                        mode={selectedPatient ? 'update' : 'create'}
                        initialData={selectedPatient}
                        onClose={() => {
                            setShowAddModal(false);
                            setSelectedPatient(null);
                            setFormData({
                                fullName: '',
                                dateOfBirth: '',
                                gender: '',
                                phone: '',
                                email: '',
                                address: ''
                            });
                        }}
                        onSaved={(data) => {
                            // close modal and reset selection
                            setShowAddModal(false);
                            setSelectedPatient(null);
                            setFormData({
                                fullName: '',
                                dateOfBirth: '',
                                gender: '',
                                phone: '',
                                email: '',
                                address: ''
                            });
                            // optional: trigger refetch by updating paginationParams (reset to page 0)
                            setPaginationParams(prev => ({ ...prev, page: 0 }));
                        }}
                    />
                )}


            </div>
            <PatientDetailModal
                isOpen={showDetailModal}
                onClose={CloseDetailModal}
                medicalRecordId={selectedPatientDetail}
            />
            <ConfirmDialog
                isOpen={showConfirmDeleteModal}
                title="Xác Nhận Xóa Bệnh Nhân"
                onClose={closeConfirmDeleteModal}
                onConfirm={handleConfirmDelete}
                isLoading={deletePatient.isPending}
            />
        </MainLayout>
    );
};

export default Patients;