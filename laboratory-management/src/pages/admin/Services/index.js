import React, { useState } from 'react';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaFlask, FaToggleOn, FaToggleOff, FaFilter } from 'react-icons/fa';
import MainLayout from '../../../layouts/MainLayout';

const Services = () => {
    const [services, setServices] = useState([
        {
            id: 1,
            service_code: 'SV001',
            service_name: 'Xét nghiệm máu tổng quát',
            description: 'Phân tích thành phần máu cơ bản, bao gồm hồng cầu, bạch cầu, tiểu cầu',
            category: 'Huyết học',
            price: 150000,
            turnaround_time: '2-3 giờ',
            status: 'active',
            equipment_required: 'Máy đếm tế bào',
            sample_type: 'Máu tĩnh mạch',
            created_at: '2024-08-01'
        },
        {
            id: 2,
            service_code: 'SV002',
            service_name: 'Xét nghiệm glucose máu',
            description: 'Đo nồng độ đường trong máu để chẩn đoán tiểu đường',
            category: 'Hóa sinh',
            price: 50000,
            turnaround_time: '1-2 giờ',
            status: 'active',
            equipment_required: 'Máy sinh hóa tự động',
            sample_type: 'Máu tĩnh mạch',
            created_at: '2024-08-01'
        },
        {
            id: 3,
            service_code: 'SV003',
            service_name: 'Xét nghiệm chức năng gan',
            description: 'Đánh giá hoạt động của gan thông qua các chỉ số ALT, AST, Bilirubin',
            category: 'Hóa sinh',
            price: 200000,
            turnaround_time: '3-4 giờ',
            status: 'active',
            equipment_required: 'Máy sinh hóa tự động',
            sample_type: 'Máu tĩnh mạch',
            created_at: '2024-08-05'
        },
        {
            id: 4,
            service_code: 'SV004',
            service_name: 'Nuôi cấy vi khuẩn',
            description: 'Phân lập và định danh vi khuẩn gây bệnh từ mẫu bệnh phẩm',
            category: 'Vi sinh',
            price: 300000,
            turnaround_time: '2-3 ngày',
            status: 'inactive',
            equipment_required: 'Tủ ấm vi sinh, kính hiển vi',
            sample_type: 'Đờm, nước tiểu, máu',
            created_at: '2024-07-20'
        },
        {
            id: 5,
            service_code: 'SV005',
            service_name: 'Xét nghiệm hormone tuyến giáp',
            description: 'Đo TSH, T3, T4 để đánh giá chức năng tuyến giáp',
            category: 'Nội tiết',
            price: 250000,
            turnaround_time: '4-6 giờ',
            status: 'active',
            equipment_required: 'Máy ELISA',
            sample_type: 'Máu tĩnh mạch',
            created_at: '2024-08-10'
        },
        {
            id: 6,
            service_code: 'SV006',
            service_name: 'Xét nghiệm nước tiểu tổng quát',
            description: 'Phân tích các thành phần trong nước tiểu để phát hiện bệnh lý',
            category: 'Hóa sinh',
            price: 80000,
            turnaround_time: '1-2 giờ',
            status: 'active',
            equipment_required: 'Máy phân tích nước tiểu',
            sample_type: 'Nước tiểu',
            created_at: '2024-08-01'
        }
    ]);

    const [categories] = useState([
        { name: 'Huyết học', color: 'bg-red-100 text-red-800', count: 1 },
        { name: 'Hóa sinh', color: 'bg-blue-100 text-blue-800', count: 3 },
        { name: 'Vi sinh', color: 'bg-green-100 text-green-800', count: 1 },
        { name: 'Nội tiết', color: 'bg-purple-100 text-purple-800', count: 1 },
        { name: 'Miễn dịch', color: 'bg-yellow-100 text-yellow-800', count: 0 },
        { name: 'Huyết thanh', color: 'bg-pink-100 text-pink-800', count: 0 }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Tất cả danh mục');
    const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [formData, setFormData] = useState({
        service_name: '',
        description: '',
        category: '',
        price: '',
        turnaround_time: '',
        equipment_required: '',
        sample_type: '',
        status: 'active'
    });

    // Calculate statistics
    const totalServices = services.length;
    const activeServices = services.filter(service => service.status === 'active').length;
    const inactiveServices = services.filter(service => service.status === 'inactive').length;

    const getStatusBadge = (status) => {
        if (status === 'active') {
            return (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
                    <FaToggleOn className="w-3 h-3" />
                    Hoạt động
                </span>
            );
        } else {
            return (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                    <FaToggleOff className="w-3 h-3" />
                    Tạm ngưng
                </span>
            );
        }
    };

    const getCategoryBadge = (category) => {
        const categoryInfo = categories.find(cat => cat.name === category);
        const colorClass = categoryInfo ? categoryInfo.color : 'bg-gray-100 text-gray-800';

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                {category}
            </span>
        );
    };

    const filteredServices = services.filter(service => {
        const matchesSearch =
            service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.service_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = categoryFilter === 'Tất cả danh mục' || service.category === categoryFilter;
        const matchesStatus = statusFilter === 'Tất cả trạng thái' || service.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const handleAddService = () => {
        if (!formData.service_name || !formData.category || !formData.price) return;

        const newService = {
            id: services.length + 1,
            service_code: `SV${String(services.length + 1).padStart(3, '0')}`,
            ...formData,
            price: parseInt(formData.price),
            created_at: new Date().toISOString().split('T')[0]
        };

        setServices([...services, newService]);
        resetForm();
        setShowServiceModal(false);
    };

    const handleEditService = (service) => {
        setSelectedService(service);
        setFormData({
            service_name: service.service_name,
            description: service.description,
            category: service.category,
            price: service.price.toString(),
            turnaround_time: service.turnaround_time,
            equipment_required: service.equipment_required,
            sample_type: service.sample_type,
            status: service.status
        });
        setShowServiceModal(true);
    };

    const handleUpdateService = () => {
        if (!selectedService) return;

        const updatedServices = services.map(service =>
            service.id === selectedService.id
                ? { ...service, ...formData, price: parseInt(formData.price) }
                : service
        );

        setServices(updatedServices);
        resetForm();
        setSelectedService(null);
        setShowServiceModal(false);
    };

    const handleToggleStatus = (serviceId) => {
        const updatedServices = services.map(service =>
            service.id === serviceId
                ? { ...service, status: service.status === 'active' ? 'inactive' : 'active' }
                : service
        );
        setServices(updatedServices);
    };

    const handleDeleteService = (serviceId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
            setServices(services.filter(service => service.id !== serviceId));
        }
    };

    const resetForm = () => {
        setFormData({
            service_name: '',
            description: '',
            category: '',
            price: '',
            turnaround_time: '',
            equipment_required: '',
            sample_type: '',
            status: 'active'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <MainLayout>
            <div>
                {/* Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản Lý Dịch Vụ</h1>
                            <p className="text-gray-600">Quản lý các dịch vụ xét nghiệm, giá cả và cấu hình</p>
                        </div>
                        <div className="text-sm text-gray-500">
                            <span className="font-semibold">Quản trị viên</span> • Thứ Sáu, 27 tháng 9, 2025
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng Dịch Vụ</p>
                                <p className="text-3xl font-bold text-gray-900">{totalServices}</p>
                            </div>
                            <FaFlask className="w-8 h-8 text-gray-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    <FaToggleOn className="inline w-4 h-4 mr-1" />
                                    Đang Hoạt Động
                                </p>
                                <p className="text-3xl font-bold text-green-600">{activeServices}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    <FaToggleOff className="inline w-4 h-4 mr-1" />
                                    Tạm Ngưng
                                </p>
                                <p className="text-3xl font-bold text-red-600">{inactiveServices}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Service Categories */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Danh Mục Dịch Vụ</h2>
                        <p className="text-sm text-gray-600">Phân loại các dịch vụ xét nghiệm theo chuyên khoa</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-6">
                        {categories.map((category, index) => (
                            <div key={index} className="text-center p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mb-2 ${category.color}`}>
                                    {category.name}
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{category.count}</p>
                                <p className="text-xs text-gray-500">dịch vụ</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Services Management */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Danh Sách Dịch Vụ</h2>
                                <p className="text-sm text-gray-600">Quản lý và cấu hình các dịch vụ xét nghiệm</p>
                            </div>
                            <button
                                onClick={() => setShowServiceModal(true)}
                                className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
                            >
                                <FaPlus className="w-4 h-4" />
                                Thêm Dịch Vụ Mới
                            </button>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên dịch vụ, mã hoặc mô tả..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Tất cả danh mục">Tất cả danh mục</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category.name}>{category.name}</option>
                                ))}
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Tất cả trạng thái">Tất cả trạng thái</option>
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Tạm ngưng</option>
                            </select>
                        </div>
                    </div>

                    {/* Services Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mã Dịch Vụ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên Dịch Vụ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Danh Mục
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Giá
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thời Gian
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng Thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao Tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredServices.map((service) => (
                                    <tr key={service.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {service.service_code}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div>
                                                <div className="font-medium">{service.service_name}</div>
                                                <div className="text-gray-500 text-xs mt-1">{service.description}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getCategoryBadge(service.category)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            {formatCurrency(service.price)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {service.turnaround_time}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(service.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleEditService(service)}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="Chỉnh sửa"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(service.id)}
                                                    className={`p-1 ${service.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                                    title={service.status === 'active' ? 'Tạm ngưng' : 'Kích hoạt'}
                                                >
                                                    {service.status === 'active' ? <FaToggleOff className="w-4 h-4" /> : <FaToggleOn className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteService(service.id)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                    title="Xóa"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Service Modal */}
                {showServiceModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    {selectedService ? 'Chỉnh Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}
                                </h3>

                                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tên Dịch Vụ *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.service_name}
                                            onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="VD: Xét nghiệm máu tổng quát"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mô Tả
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Mô tả chi tiết về dịch vụ..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Danh Mục *
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {categories.map((category, index) => (
                                                <option key={index} value={category.name}>{category.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Giá (VND) *
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="150000"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Thời Gian Thực Hiện
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.turnaround_time}
                                            onChange={(e) => setFormData({ ...formData, turnaround_time: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="VD: 2-3 giờ"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Loại Mẫu
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.sample_type}
                                            onChange={(e) => setFormData({ ...formData, sample_type: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="VD: Máu tĩnh mạch"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Thiết Bị Yêu Cầu
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.equipment_required}
                                            onChange={(e) => setFormData({ ...formData, equipment_required: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="VD: Máy đếm tế bào"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Trạng Thái
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="active">Hoạt động</option>
                                            <option value="inactive">Tạm ngưng</option>
                                        </select>
                                    </div>
                                </form>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        onClick={() => {
                                            setShowServiceModal(false);
                                            setSelectedService(null);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={selectedService ? handleUpdateService : handleAddService}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                    >
                                        {selectedService ? 'Cập Nhật' : 'Thêm'} Dịch Vụ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default Services;