import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import StatCard from './components/StatCard';
import { useAuth } from '../../../contexts/AuthContext';
import { formatDate } from '../../../utils/helpers';
import { FaUsers, FaMicroscope, FaClipboardList, FaSearch, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useEventLogs } from '../../../hooks/userMornotoring';
import EventLogCard from './components/EventLogCard';

const Dashboard = () => {
    const { user } = useAuth();
    const today = useMemo(() => formatDate(new Date()), []);
    const [ishowAlert, setIshowAlert] = React.useState(false);
    const [showFilters, setShowFilters] = React.useState(false);

    const handleCloseAlert = useCallback(() => {
        setIshowAlert(false);
    }, []);

    const handleShowAllAlerts = useCallback(() => {
        setIshowAlert(true);
    }, []);
    const [eventLogParams, setEventLogParams] = useState({
        page: 0,
        size: 10,
        sort: 'createdAt,desc',
        keyword: ''
    });

    // http://localhost:8080/api/v1/monitoring/event-logs?fromDate=2025-11-01T00:00:00&toDate=2025-11-30T23:59:59&operator=INSTRUMENT_HL7_INGEST
    const [filteredEventLogs, setFilteredEventLogs] = useState({
        fromDate: '',
        toDate: '',
        operator: ''
    });

    // Local state for keyword input to prevent lag
    const [localKeyword, setLocalKeyword] = useState('');

    // Update params function
    const updateEventLogParams = useCallback((newParams) => {
        setEventLogParams(prev => ({
            ...prev,
            ...newParams,
            page: newParams.page !== undefined ? newParams.page : 0 // Reset to first page except when explicitly setting page
        }));
    }, []);

    // Debounce timer ref
    const debounceTimer = useRef(null);

    // Debounced search function
    const debouncedSearch = useCallback((keyword) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            updateEventLogParams({ keyword, page: 0 });
        }, 500);
    }, [updateEventLogParams]);

    // Cleanup debounce timer
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    // Handle immediate search
    const hanldeFilteredEventLogs = useCallback(() => {
        const { fromDate, toDate, operator } = filteredEventLogs;
        console.log('Filtered Event Logs Params:', filteredEventLogs);
        const newParams = {};
        if (fromDate) newParams.fromDate = new Date(fromDate).toISOString(); //+ 'T00:00:00';
        if (toDate) newParams.toDate = new Date(toDate).toISOString();   //+ 'T23:59:59';
        if (operator) newParams.operator = operator;
        console.log('Applying Event Logs Params:', newParams);
        updateEventLogParams({ ...newParams, page: 0 });
    }, [filteredEventLogs, updateEventLogParams]);

    // Handle pagination
    const handlePageChange = useCallback((newPage) => {
        updateEventLogParams({ page: newPage });
    }, [updateEventLogParams]);

    // Handle page size change
    const handlePageSizeChange = useCallback((newSize) => {
        updateEventLogParams({ size: parseInt(newSize), page: 0 });
    }, [updateEventLogParams]);

    // Handle sort change
    const handleSortChange = useCallback((newSort) => {
        updateEventLogParams({ sort: newSort });
    }, [updateEventLogParams]);

    // Reset filters
    const resetFilters = useCallback(() => {
        setLocalKeyword('');
        setEventLogParams({
            page: 0,
            size: 10,
            sort: 'createdAt,desc',
            keyword: ''
        });
        setFilteredEventLogs({ fromDate: '', toDate: '', operator: '' });
    }, []);


    const { data: eventLogsRes, error, isLoading } = useEventLogs(eventLogParams);
    const eventLogs = useMemo(() => eventLogsRes?.content || [], [eventLogsRes?.content]);

    // Removed console.logs for better performance

    // Format event logs for SystemAlerts component
    const formatEventLogsForUI = useCallback((logs) => {
        return logs.map(log => ({
            id: log.id,
            access_time: log.createdAt,
            action: log.action,
            changed_fields_json: JSON.stringify(log.details || {}),
            ip_addr: log.ipAddress || 'N/A',
            user_id: log.operator,
            medical_record_id: log.details?.orderId || 'N/A',
            eventCode: log.eventCode,
            message: log.message,
            sourceService: log.sourceService
        }));
    }, []);

    // Format and display logs
    const displayLogs = useMemo(() => {
        return eventLogs.length > 0 ? formatEventLogsForUI(eventLogs) : [];
    }, [eventLogs, formatEventLogsForUI]);

    // Get visible logs based on show all state
    const visibleLogs = useMemo(() => {
        return ishowAlert ? displayLogs : displayLogs.slice(0, 5);
    }, [displayLogs, ishowAlert]);

    return (
        <MainLayout>
            <div className="container">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 px-4 sm:px-6 bg-white border-b gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-2xl hidden sm:inline"></span>
                        <span className="font-semibold text-lg sm:text-xl truncate block max-w-full">Laboratory Information Management System</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold">{user.roleName || user.roleCode}</span>
                        <span className="text-gray-500 text-xs sm:text-sm">{today}</span>
                    </div>
                </div>
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Trang tổng quan</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard
                            title="Total Patients"
                            value="1,234"
                            subtitle="Number of registered patients"
                            icon={FaUsers}
                            variant="success"
                        />
                        <StatCard
                            title="Total Tests"
                            value="567"
                            subtitle="Tests conducted this month"
                            icon={FaMicroscope}
                            variant="info"
                        />

                        <StatCard
                            title="Pending Results"
                            value="45"
                            subtitle="Results pending review"
                            icon={FaClipboardList}
                            variant="warning"
                        />
                    </div>
                    <div className="mt-6">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Nhật ký hệ thống</h2>
                                <div className="flex items-center gap-2">
                                    {isLoading && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                            Đang tải...
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                    >
                                        <FaFilter className="w-3 h-3" />
                                        {showFilters ? 'Ẩn bộ lọc' : 'Bộ lọc'}
                                    </button>
                                </div>
                            </div>

                            {/* Filter Controls */}

                            <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-3">
                                {/* Search and Sort Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm..."
                                            value={localKeyword}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setLocalKeyword(value);
                                                debouncedSearch(value);
                                            }}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        />
                                    </div>

                                    <select
                                        value={eventLogParams.sort}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="createdAt,desc">Mới nhất</option>
                                        <option value="createdAt,asc">Cũ nhất</option>
                                        <option value="action,asc">Action A-Z</option>
                                        <option value="action,desc">Action Z-A</option>
                                    </select>

                                    <select
                                        value={eventLogParams.size}
                                        onChange={(e) => handlePageSizeChange(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="5">5 bản ghi</option>
                                        <option value="10">10 bản ghi</option>
                                        <option value="20">20 bản ghi</option>
                                        <option value="50">50 bản ghi</option>
                                    </select>
                                </div>

                                {/* Date Range and Operator */}
                                {showFilters && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        <input
                                            type="date"
                                            placeholder="Từ ngày"
                                            value={filteredEventLogs.fromDate}
                                            onChange={(e) => setFilteredEventLogs({ ...filteredEventLogs, fromDate: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        />
                                        <input
                                            type="date"
                                            placeholder="Đến ngày"
                                            value={filteredEventLogs.toDate}
                                            onChange={(e) => setFilteredEventLogs({ ...filteredEventLogs, toDate: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        />
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                onChange={(e) => {
                                                    setFilteredEventLogs(prev => ({
                                                        ...prev,
                                                        operator: e.target.checked ? 'INSTRUMENT_HL7_INGEST' : ''
                                                    }));
                                                }}
                                            />
                                            <span className="text-sm">Chỉ người vận hành: INSTRUMENT_HL7_INGEST</span>
                                        </label>
                                        <button
                                            onClick={hanldeFilteredEventLogs}
                                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            <FaSearch className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={resetFilters}
                                        className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>


                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">
                                        Lỗi khi tải nhật ký: {error.message}
                                    </p>
                                </div>
                            )}

                            {/* Event Logs Display */}
                            <div className="space-y-2">
                                {visibleLogs.length > 0 ? (
                                    visibleLogs.map((log) => (
                                        <EventLogCard key={log.id} log={log} />
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>Không có nhật ký hệ thống nào</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {eventLogsRes && eventLogsRes.totalPages > 1 && (
                                <div className="mt-4 flex items-center justify-between border-t pt-3">
                                    <div className="text-xs text-gray-500">
                                        Hiển thị {eventLogsRes.pageNo * eventLogsRes.pageSize + 1} - {Math.min((eventLogsRes.pageNo + 1) * eventLogsRes.pageSize, eventLogsRes.totalElements)} trong {eventLogsRes.totalElements} bản ghi
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(eventLogsRes.pageNo - 1)}
                                            disabled={eventLogsRes.pageNo === 0}
                                            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <FaChevronLeft className="w-3 h-3" />
                                            Trước
                                        </button>

                                        <div className="flex items-center gap-1 text-sm">
                                            <span>Trang</span>
                                            <input
                                                type="number"
                                                min="1"
                                                max={eventLogsRes.totalPages}
                                                value={eventLogsRes.pageNo + 1}
                                                onChange={(e) => {
                                                    const page = parseInt(e.target.value) - 1;
                                                    if (page >= 0 && page < eventLogsRes.totalPages) {
                                                        handlePageChange(page);
                                                    }
                                                }}
                                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                                            />
                                            <span>của {eventLogsRes.totalPages}</span>
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(eventLogsRes.pageNo + 1)}
                                            disabled={eventLogsRes.pageNo >= eventLogsRes.totalPages - 1}
                                            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Sau
                                            <FaChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Summary Info */}
                            {eventLogsRes && (
                                <div className="mt-2 text-xs text-gray-400 text-center">
                                    Tổng: {eventLogsRes.totalElements} bản ghi | Trang {eventLogsRes.pageNo + 1}/{eventLogsRes.totalPages}
                                </div>
                            )}

                            {/* Toggle Show All/Few */}
                            {displayLogs.length > 5 && (
                                <>
                                    {!ishowAlert ? (
                                        <p
                                            className="mt-4 font-bold text-sm cursor-pointer text-center text-blue-600 hover:text-blue-800"
                                            onClick={handleShowAllAlerts}
                                        >
                                            Xem tất cả thông báo ({displayLogs.length})
                                        </p>
                                    ) : (
                                        <p
                                            className="mt-4 font-bold text-sm cursor-pointer text-center text-blue-600 hover:text-blue-800"
                                            onClick={handleCloseAlert}
                                        >
                                            Thu gọn thông báo
                                        </p>
                                    )}
                                </>
                            )}
                        </div>


                    </div>

                </div>
            </div>
            <Outlet />
        </MainLayout>
    );
};

export default Dashboard;