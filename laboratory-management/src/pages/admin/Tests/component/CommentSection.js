import React, { useState } from 'react';
import {
    FaComments,
    FaPaperPlane,
    FaTimes,
    FaFlask
} from 'react-icons/fa';

const CommentSection = ({ isOpen, onClose, targetId, targetType, onCommentAdded, isLoading }) => {
    const [newComment, setNewComment] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!newComment.trim()) return;
        const payload = {
            targetId,
            targetType,
            content: newComment.trim(),
        };
        if (typeof onCommentAdded === 'function') {
            setNewComment('');
            await onCommentAdded(payload);
        }
        
        if (typeof onClose === 'function') onClose();
    };

    const handleClose = () => {
        setNewComment('');
        if (typeof onClose === 'function') onClose();
    };

    // Thay đổi từ modal thành inline form
    return (
        <div className="bg-gray-50 border rounded-lg p-4 mt-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h4 className="font-medium text-gray-700 flex items-center">
                        <FaComments className="mr-2 text-blue-600" />
                        Thêm bình luận
                    </h4>
                    {/* Hiển thị thông tin result đang được comment */}
                    {targetType === 'RESULT' && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <FaFlask className="mr-1" />
                            Kết quả ID: <span className="font-medium ml-1">{targetId}</span>
                        </p>
                    )}
                    {targetType === 'ORDER' && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <FaFlask className="mr-1" />
                            Đơn xét nghiệm ID: <span className="font-medium ml-1">{targetId}</span>
                        </p>
                    )}
                </div>
                <button 
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <FaTimes />
                </button>
            </div>

            {/* Form */}
            <div className="space-y-3">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Nhập bình luận cho kết quả xét nghiệm..."
                    className="w-full p-3 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    autoFocus
                />
                
                {/* Buttons */}
                <div className="flex justify-end space-x-2">
                    {onClose && (
                        <button
                        onClick={handleClose}
                        className="px-3 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-sm"
                    >
                        Hủy
                    </button>)}
                    <button
                        onClick={handleSubmit}
                        disabled={!newComment.trim()}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center text-sm"
                    >
                        <FaPaperPlane className="mr-1" size={12} /> 
                       {isLoading ? 'Đang gửi...' : 'Gửi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentSection;