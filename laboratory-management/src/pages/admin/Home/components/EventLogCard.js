import React from 'react';
import { FaClock, FaUser, FaCode, FaServer, FaNetworkWired } from 'react-icons/fa';
import { formatDate, formatDateTime } from '../../../../utils/helpers';

const EventLogCard = ({ log }) => {
    const getActionIcon = (action) => {
        const lowerAction = action.toLowerCase();
        if (lowerAction.includes('modify') || lowerAction.includes('update')) {
            return <FaCode className="w-4 h-4 text-blue-500" />;
        }
        if (lowerAction.includes('create') || lowerAction.includes('add')) {
            return <FaUser className="w-4 h-4 text-green-500" />;
        }
        if (lowerAction.includes('delete') || lowerAction.includes('remove')) {
            return <FaUser className="w-4 h-4 text-red-500" />;
        }
        return <FaServer className="w-4 h-4 text-gray-500" />;
    };

    const getActionColor = (action) => {
        const lowerAction = action.toLowerCase();
        if (lowerAction.includes('modify') || lowerAction.includes('update')) {
            return 'bg-blue-50 text-blue-700 border-blue-200';
        }
        if (lowerAction.includes('create') || lowerAction.includes('add')) {
            return 'bg-green-50 text-green-700 border-green-200';
        }
        if (lowerAction.includes('delete') || lowerAction.includes('remove')) {
            return 'bg-red-50 text-red-700 border-red-200';
        }
        return 'bg-gray-50 text-gray-700 border-gray-200';
    };

    return (
        <div className="border-l-4 border-blue-400 bg-white p-4 mb-3 rounded-r-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                        {getActionIcon(log.action)}
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getActionColor(log.action)}`}>
                            {log.action}
                        </span>
                        {log.eventCode && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono">
                                {log.eventCode}
                            </span>
                        )}
                    </div>

                    {/* Message */}
                    <p className="text-sm text-gray-800 mb-2 font-medium">
                        {log.message}
                    </p>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                        {log.details?.orderId && (
                            <div className="flex items-center gap-1">
                                <FaCode className="w-3 h-3" />
                                <span>Order: </span>
                                <span className="font-mono bg-gray-100 px-1 rounded">{log.details.orderId}</span>
                            </div>
                        )}
                        {log.details?.resultId && (
                            <div className="flex items-center gap-1">
                                <FaCode className="w-3 h-3" />
                                <span>Result: </span>
                                <span className="font-mono bg-gray-100 px-1 rounded">{log.details.resultId}</span>
                            </div>
                        )}
                        {log.sourceService && (
                            <div className="flex items-center gap-1">
                                <FaServer className="w-3 h-3" />
                                <span>Service: </span>
                                <span className="font-medium">{log.sourceService}</span>
                            </div>
                        )}
                        {log.operator && (
                            <div className="flex items-center gap-1">
                                <FaUser className="w-3 h-3" />
                                <span>Operator: </span>
                                <span className="font-medium">{log.operator}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Timestamp */}
                <div className="text-right text-xs text-gray-500 ml-4">
                    <div className="flex items-center gap-1 mb-1">
                        <FaClock className="w-3 h-3" />
                        <span>{formatDateTime(log.createdAt || log.access_time)}</span>
                    </div>
                    {(log.ipAddress || log.ip_addr) && log.ipAddress !== 'N/A' && (
                        <div className="flex items-center gap-1">
                            <FaNetworkWired className="w-3 h-3" />
                            <span className="font-mono">{log.ipAddress || log.ip_addr}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventLogCard;