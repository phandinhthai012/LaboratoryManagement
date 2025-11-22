import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaArrowLeft, FaFlask, FaUser, FaCalendar, FaIdCard,
    FaCheckCircle, FaSpinner, FaTimes, FaEdit,
    FaPrint, FaPhone, FaEnvelope, FaMapMarkerAlt,
    FaSave, FaMale, FaFemale, FaPlay, FaBan,
    FaComments, FaPlus, FaPaperPlane, FaRobot,
    FaUserCheck, FaStethoscope, FaComment // Thêm FaComment
} from 'react-icons/fa';
import MainLayout from '../../../layouts/MainLayout';
import AddTestItemModal from './component/AddTestItemModal';
import { formatDate, formatDateWithTime } from '../../../utils/helpers';
import { useTestOrderById, useTestOrder } from '../../../hooks/useTestOrder';
import { useNotifier } from '../../../contexts/NotifierContext';

//comment section
import CommentSection from './component/CommentSection';
import CommentList from './component/CommentList';
import { useTestComments } from '../../../hooks/useTestOrder';

const TestOrderDetail = () => {
    const { showNotification } = useNotifier();
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: testOrder, isLoading, isError } = useTestOrderById(id);
    console.log('Fetched test order:', testOrder, id);
    const {
        updateTestOrder,
        isUpdateLoading,
        updateTestOrderItem,
        isUpdateItemLoading,
        sendOrderToInstrument,
        isSendOrderLoading,
        printTestResults,
        isPrintTestResultsLoading

    } = useTestOrder();

    const {
        createComment, isCreatingComment,
        replyComment, isReplyingComment
    } = useTestComments();

    useEffect(() => {
        if (testOrder) {
            console.log('Test Order Data:', testOrder);
        }
    }, [testOrder]);

    // Test Order
    const canReview = () => {
        return testOrder.status === 'COMPLETED' &&
            (!testOrder.reviewStatus || testOrder.reviewStatus === 'NONE');
    };
    const [showAddTestModal, setShowAddTestModal] = useState(false);

    // Comment state
    const [comments, setComments] = useState([]);
    const [replyTo, setReplyTo] = useState(null); // ID của comment đang reply
    const [replyContent, setReplyContent] = useState('');
    const [showCommentSection, setShowCommentSection] = useState({});
    const [selectedResult, setSelectedResult] = useState(null);

    // Mock comments từ API
    useEffect(() => {
        if (testOrder?.comments) {
            setComments(testOrder.comments);
        }
    }, [testOrder]);

    const handleHumanReview = async () => {
        if (!canReview()) {
            showNotification('Đơn xét nghiệm không thể duyệt thủ công', 'error');
            return;
        }
        try {
            const data = {
                // NONE, HUMAN_REVIEWED, AI_REVIEWED
                status: testOrder.status,
                reviewStatus: 'HUMAN_REVIEWED',
                reviewMode: 'HUMAN',
            }
            await updateTestOrder({
                testOrderCode: testOrder.orderCode,
                data: data
            });
        } catch (error) {
        }
    }
    const handleAIReview = async () => {
        if (!canReview()) {
            showNotification('Đơn xét nghiệm không thể duyệt tự động', 'error');
            return;
        }
        try {
            const data = {
                // NONE, HUMAN_REVIEWED, AI_REVIEWED
                status: testOrder.status,
                reviewStatus: 'AI_REVIEWED',
                reviewMode: 'AI',
            }
            await updateTestOrder({
                testOrderCode: testOrder.orderCode,
                data: data
            });
        } catch (error) {
        }
    }
    const getReviewStatus = () => {
        switch (testOrder.reviewStatus) {
            case 'NONE':
                return 'Chưa được duyệt';
            case 'HUMAN_REVIEWED':
                return 'Đã duyệt thủ công';
            case 'AI_REVIEWED':
                return 'Đã duyệt tự động';
            default:
                return 'Không xác định';
        }
    }
    const canAddTestItem = () => {
        return testOrder.status !== 'COMPLETED' && testOrder.status !== 'CANCELLED';
    }
    const canGetResult = () => {
        if (!testOrder.items || testOrder.items.length === 0) {
            console.log('Không thể lấy kết quả: Không có mục xét nghiệm');
            return false;
        }
        // if (testOrder.status !== 'COMPLETED') {
        //     console.log('Không thể lấy kết quả: Đơn chưa hoàn thành');
        //     return false;
        // }

        return true;
    }
    // add test order item
    const openAddTestItemModal = () => {
        if (!canAddTestItem()) {
            showNotification('Không thể thêm mục xét nghiệm', 'error');
            return;
        }
        setShowAddTestModal(true);
    }

    const sendOrderToGetResult = async () => {
        try {
            console.log('Sending order to instrument, order ID:', testOrder.id);
            await sendOrderToInstrument(testOrder.id);
        } catch (error) {
            showNotification('Không thể gửi đơn xét nghiệm đến thiết bị', 'error');
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ xử lý';
            case 'IN_PROGRESS': return 'Đang thực hiện';
            case 'COMPLETED': return 'Hoàn thành';
            case 'CANCELLED': return 'Đã hủy';
            default: return 'Không xác định';
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            case 'AI_REVIEWED': return 'bg-yellow-100 text-yellow-800';
            case 'HUMAN_REVIEWED': return 'bg-blue-100 text-blue-800';
            case 'NONE': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getReviewModeColor = (mode) => {
        switch (mode) {
            case 'HUMAN': return 'bg-blue-100 text-blue-800';
            case 'AUTO': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getFlagRule = (abnormalFlag) => {
        switch (abnormalFlag) {
            case 'H':
                return {
                    style: 'bg-red-100 text-red-800 border border-red-200',
                    text: 'Cao bất thường',
                    icon: '↑'
                };
            case 'L':
                return {
                    style: 'bg-blue-100 text-blue-800 border border-blue-200',
                    text: 'Thấp bất thường',
                    icon: '↓'
                };
            case 'A':
                return {
                    style: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
                    text: 'Bất thường',
                    icon: '⚠'
                };
            case 'N':
                return {
                    style: 'bg-green-100 text-green-800 border border-green-200',
                    text: 'Bình thường',
                    icon: '✓'
                };
            default:
                return {
                    style: 'bg-gray-100 text-gray-800 border border-gray-200',
                    text: 'Không xác định',
                    icon: '?'
                };
        }
    };

    // comment section handlers
    // Handle add comment
    const handleAddComment = async (payload) => {
        const { targetId, targetType, content } = payload;
        if (!content.trim()) return;
        try {
            const result = await createComment({ targetId, targetType, content });
        } catch (error) {
            showNotification('Không thể thêm bình luận', 'error');
        }
    };

    // Handle add reply
    const handleAddReply = useCallback(async ({ commentId, content }) => {
        if (!content.trim()) return;
        if (!commentId) return;
        try {
            const result = await replyComment({ commentId, content, targetId: testOrder.id });
            // Cập nhật lại comments với reply mới
        } catch (error) {
            console.error('Error replying to comment:', error);
        }
    }, [replyComment, testOrder]);

    const toggleCommentSection = (result) => {
        const resultId = result.id;
        setShowCommentSection(prev => ({
            ...prev,
            [resultId]: !prev[resultId] // Toggle cho result này
        }));
        if (!showCommentSection[resultId]) {
            setSelectedResult(result); // Set result đang được select
        }
    };
    const closeCommentSection = (resultId) => {
        setShowCommentSection(prev => ({
            ...prev,
            [resultId]: false
        }));
        setSelectedResult(null);
    };
    const handleAddCommentForResult = async (payload) => {
        try {
            const { targetId, targetType, content } = payload;
            if (!content.trim()) return;
            const result = await createComment({ targetId, targetType, content });
            setComments(prev => [result, ...prev]);
        } catch (error) {
            showNotification('Không thể thêm bình luận', 'error');
        }
    };

    if (isLoading) return <MainLayout><div className="flex justify-center p-8"><FaSpinner className="animate-spin text-2xl" /></div></MainLayout>;
    if (isError || !testOrder) return <MainLayout><div className="text-red-500 p-8">Không thể tải thông tin đơn xét nghiệm</div></MainLayout>;

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Enhanced Header with breadcrumb */}
                    <div className="mb-8">
                        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                            <span>Quản lý xét nghiệm</span>
                            <span>›</span>
                            <span>Danh sách đơn xét nghiệm</span>
                            <span>›</span>
                            <span className="text-gray-900 font-medium">Chi tiết đơn</span>
                        </nav>

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                                <button
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    onClick={() => navigate(-1)}
                                >
                                    <FaArrowLeft className="mr-2 h-4 w-4" />
                                    Quay lại
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn xét nghiệm</h1>
                                    <p className="text-sm text-gray-600 mt-1">Mã đơn: {testOrder.orderCode}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(testOrder.status)}`}>
                                        <span className="w-2 h-2 bg-current rounded-full mr-2"></span>
                                        {getStatusText(testOrder.status)}
                                    </span>
                                </div>
                                <button
                                    onClick={()=>{}}
                                    disabled={ isPrintTestResultsLoading}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-colors"
                                >
                                    <FaPrint className="mr-2 h-4 w-4" />
                                    {isPrintTestResultsLoading ? 'Đang in...' : 'In kết quả'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                        {/* Patient Information */}
                        <div className="lg:col-span-2 bg-white rounded-lg">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <FaUser className="mr-2 text-blue-600" /> Thông tin bệnh nhân
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Họ và tên</label>

                                    <p className="mt-1 text-gray-900">{testOrder.fullName}</p>

                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Giới tính</label>

                                    <p className="mt-1 text-gray-900 flex items-center">
                                        {testOrder.gender === 'MALE' ? <FaMale className="mr-1 text-blue-500" /> : <FaFemale className="mr-1 text-pink-500" />}
                                        {testOrder.gender === 'MALE' ? 'Nam' : 'Nữ'}
                                    </p>

                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Ngày sinh</label>

                                    <p className="mt-1 text-gray-900">{formatDate(testOrder.dateOfBirth)} (Tuổi: {testOrder.age})</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Số điện thoại</label>
                                    <p className="mt-1 text-gray-900 flex items-center">
                                        <FaPhone className="mr-1" /> {testOrder.phone}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Email</label>
                                    <p className="mt-1 text-gray-900 flex items-center">
                                        <FaEnvelope className="mr-1" /> {testOrder.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Địa chỉ</label>
                                    <p className="mt-1 text-gray-900 flex items-center">
                                        <FaMapMarkerAlt className="mr-1" /> {testOrder.address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-lg">
                            <h2 className="text-xl font-semibold flex items-center">
                                <FaIdCard className="mr-2 text-green-600" /> Thông tin đơn
                            </h2>
                            <div className="mb-4 border-b pb-2">
                                {canReview() ? (
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={handleAIReview}
                                            disabled={isUpdateLoading}
                                            className="inline-flex items-center px-3 py-1 border border-purple-300 shadow-sm text-sm leading-4 font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                        >
                                            <FaRobot className="mr-1 h-4 w-4" />
                                            {isUpdateLoading ? 'Đang duyệt...' : 'Duyệt AI'}
                                        </button>
                                        <button
                                            onClick={handleHumanReview}
                                            disabled={isUpdateLoading}
                                            className="inline-flex items-center px-3 py-1 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                        >
                                            <FaUserCheck className="mr-1 h-4 w-4" />
                                            {isUpdateLoading ? 'Đang duyệt...' : 'Duyệt thủ công'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-end">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${testOrder.status !== 'COMPLETED'
                                            ? 'bg-gray-100 text-gray-600'
                                            : 'bg-green-100 text-green-800'
                                            }`}>
                                            {testOrder.status !== 'COMPLETED'
                                                ? <>
                                                    <FaBan className="mr-2 h-3 w-3" />
                                                    Chưa thể duyệt (Review khi đơn hoàn thành)
                                                </>
                                                : <>
                                                    {testOrder.reviewStatus === 'HUMAN_REVIEWED' && <FaUserCheck className="mr-2 h-3 w-3" />}
                                                    {testOrder.reviewStatus === 'AI_REVIEWED' && <FaRobot className="mr-2 h-3 w-3" />}
                                                    {(!testOrder.reviewStatus || testOrder.reviewStatus === 'NONE') && <FaPlay className="mr-2 h-3 w-3" />}
                                                    {getReviewStatus()}
                                                </>
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm text-gray-600">Mã đơn:</span>
                                    <p className="font-medium">{testOrder.orderCode}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Mã bệnh án:</span>
                                    <p className="font-medium">{testOrder.medicalRecordCode}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Ngày tạo:</span>
                                    <p className="flex items-center">
                                        <FaCalendar className="mr-1" /> {formatDate(testOrder.createdAt)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Trạng thái đơn:</span>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(testOrder.status)}`}>
                                        {getStatusText(testOrder.status)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Trạng thái duyệt:</span>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(testOrder.reviewStatus)}`}>
                                        {getReviewStatus(testOrder.reviewStatus)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Chế độ duyệt:</span>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getReviewModeColor(testOrder.reviewMode)}`}>
                                        {testOrder.reviewMode || 'Chưa đặt'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaFlask className="mr-2 text-purple-600" /> Danh sách xét nghiệm ({testOrder.items?.length || 0})
                            {/* button add new test item */}
                            {canAddTestItem() ? (
                                <button
                                    className="ml-auto px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-sm transition-colors"
                                    onClick={openAddTestItemModal}
                                >
                                    <FaPlus className="mr-1" size={12} /> Thêm xét nghiệm
                                </button>
                            ) : (
                                <span className="ml-auto px-3 py-1 bg-gray-400 text-white rounded-lg flex items-center text-sm cursor-not-allowed">
                                    <FaBan className="mr-1" size={12} />
                                    {testOrder.status === 'COMPLETED' ? 'Đơn đã hoàn thành' : 'Không thể thêm'}
                                </span>
                            )}
                        </h2>
                        <div className="overflow-x-auto max-h-96 overflow-y-auto">
                            <table className="w-full table-auto">
                                <thead className="sticky top-0 bg-white">
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-3 text-left">Mã xét nghiệm</th>
                                        <th className="px-4 py-3 text-left">Tên xét nghiệm</th>
                                        <th className="px-4 py-3 text-left">Trạng thái</th>
                                        <th className="px-4 py-3 text-left">Ngày tạo</th>
                                        <th className="px-4 py-3 text-left">Cập nhật lần cuối</th>
                                        <th className="px-4 py-3 text-left">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testOrder.items?.map((item, index) => {
                                        return (
                                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium">{item.testCode}</td>
                                                <td className="px-4 py-3">{item.testName}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    <div>
                                                        <div>{formatDateWithTime(item.createdAt)?.date}</div>
                                                        <div className="text-xs text-gray-500">{formatDateWithTime(item.createdAt)?.time}</div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    <div>
                                                        <div>{formatDateWithTime(item.updatedAt)?.date}</div>
                                                        <div className="text-xs text-gray-500">{formatDateWithTime(item.updatedAt)?.time}</div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)} cursor-pointer`}>
                                                        {getStatusText(item.status)}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <FaCheckCircle className="mr-2 text-green-600" /> Kết quả xét nghiệm ({testOrder.results.length})
                            </h2>
                            {canGetResult() ? (
                                <button
                                    onClick={sendOrderToGetResult}
                                    disabled={isSendOrderLoading}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm transition-colors"
                                >
                                    {isSendOrderLoading ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-1" size={12} /> Đang gửi...
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane className="mr-1" size={12} /> Gửi đến thiết bị
                                        </>
                                    )}
                                </button>
                            ) : null}
                        </div>

                        <div className="overflow-x-auto max-h-96 overflow-y-auto">
                            <table className="w-full table-auto">
                                <thead className="sticky top-0 bg-white">
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-3 text-left">Tên phân tích</th>
                                        <th className="px-4 py-3 text-left">Giá trị</th>
                                        <th className="px-4 py-3 text-left">Đơn vị</th>
                                        <th className="px-4 py-3 text-left">Khoảng tham chiếu</th>
                                        <th className="px-4 py-3 text-left">Trạng thái</th>
                                        <th className="px-4 py-3 text-left">Thời gian đo</th>
                                        <th className="px-4 py-3 text-left">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testOrder.results && testOrder.results.length > 0 && (
                                        <>
                                            {testOrder.results.map((result) => {
                                                const flagInfo = getFlagRule(result.abnormalFlag || 'N');
                                                return (
                                                    <>
                                                        <tr key={result.id} className="border-b hover:bg-gray-50">
                                                            <td className="px-4 py-3 font-medium">{result.analyteName}</td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center">
                                                                    <span className="font-bold mr-2">{result.value}</span>
                                                                    {result.abnormalFlag && result.abnormalFlag !== 'N' && (
                                                                        <span className="text-lg text-red-500">{flagInfo.icon}</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3">{result.unit}</td>
                                                            <td className="px-4 py-3">{result.referenceRange}</td>
                                                            <td className="px-4 py-3">
                                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${flagInfo.style}`}>
                                                                    <span className="mr-1">{flagInfo.icon}</span>
                                                                    {flagInfo.text}
                                                                </span>
                                                                {result.flagSeverity === 'CRITICAL' && (
                                                                    <div className="text-xs text-red-600 font-medium mt-1">
                                                                        Critical Value
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                                <div>
                                                                    <div>{formatDate(result.measuredAt)}</div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {result.entrySource || 'Manual'}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                {/* Button comment được tách riêng thành cột cuối */}
                                                                <div className="flex items-center justify-center">
                                                                    <button
                                                                        onClick={() => toggleCommentSection(result)}
                                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative"
                                                                        title={`Comment cho ${result.analyteName}`}
                                                                    >
                                                                        <FaComment size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {/* Comment row - hiển thị dưới result row */}
                                                        {showCommentSection[result.id] && (
                                                            <tr>
                                                                <td colSpan="7" className="px-4 py-0">
                                                                    <div className="pb-4">
                                                                        <CommentSection
                                                                            isOpen={true}
                                                                            onClose={() => closeCommentSection(result.id)}
                                                                            targetId={result.id}
                                                                            targetType="RESULT"
                                                                            onCommentAdded={handleAddCommentForResult}
                                                                            resultInfo={result}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </>
                                                )
                                            })
                                            }
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaComments className="mr-2 text-indigo-600" /> Bình luận & Ghi chú ({comments.length})
                        </h2>
                        <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                            {comments.length > 0 ? (
                                <CommentList
                                    comments={comments}
                                    onReply={handleAddReply} 
                                    isReplyingComment={isReplyingComment}
                                    setComments={setComments}
                                    
                                />
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <FaComments className="mx-auto text-4xl mb-2" />
                                    <p>Chưa có bình luận nào</p>
                                </div>
                            )}
                        </div>
                        <CommentSection
                            isOpen={true}
                            targetId={testOrder.id}
                            targetType="ORDER"
                            onCommentAdded={handleAddComment}
                            isLoading={isCreatingComment}
                        />
                    </div>
                </div>
                <AddTestItemModal
                    isOpen={showAddTestModal}
                    onClose={() => setShowAddTestModal(false)}
                    testOrderId={testOrder.id}
                    existingTestNames={testOrder.items.map(item => item.testName)}
                />
            </div>
        </MainLayout>
    );
};

export default TestOrderDetail;