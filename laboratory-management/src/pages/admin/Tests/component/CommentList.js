import React, { useState, useCallback, useMemo } from 'react';
import { FaComments } from 'react-icons/fa';
import { useAuth } from '../../../../contexts/AuthContext';
import { formatDate } from '../../../../utils/helpers';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import { useTestComments } from '../../../../hooks/useTestOrder';
const CommentList = ({
    comments,
    onReply,
    isReplyingComment = false,
    setComments,

}) => {
    console.log('Rendering CommentList with comments:', comments);
    const { user } = useAuth();
    const [showReplyForm, setShowReplyForm] = useState({});
    const [replyContent, setReplyContent] = useState('');
    const { deleteComment, isDeletingComment } = useTestComments();

    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, commentId: null });
    const handleOpenDeleteDialog = useCallback((commentId) => {
        setDeleteDialog({ isOpen: true, commentId });
    }, []);
    
    const handleCloseDeleteDialog = useCallback(() => {
        setDeleteDialog({ isOpen: false, commentId: null });
    }, []);
    
    const handleDeleteComment = useCallback(async (commentId) => {
        try {
            await deleteComment(commentId);
            // Cập nhật lại danh sách bình luận sau khi xóa
            setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
            handleCloseDeleteDialog();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    }, [deleteComment, setComments, handleCloseDeleteDialog]);

    // Optimize callback functions
    const handleReplyContentChange = useCallback((e) => {
        setReplyContent(e.target.value);
    }, []);

    const handleToggleReplyForm = useCallback((commentId) => {
        setShowReplyForm(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
        setReplyContent('');
    }, []);

    const handleSubmitReply = useCallback((commentId) => {
        if (!replyContent.trim()) return;

        onReply({ commentId, content: replyContent.trim() });

        // Reset form
        setReplyContent('');
        setShowReplyForm(prev => ({
            ...prev,
            [commentId]: false
        }));
    }, [replyContent, onReply]);

    // Memoize comments list
    const commentsList = useMemo(() => {
        return comments.map((comment,index) => (
            <div key={comment?.id || index} className="space-y-3">
                {/* Main Comment */}
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-gray-600">
                            <span className="font-medium text-gray-800">{comment?.createdBy?.fullName || 'Unknown User'}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(comment.createdAt)}</span>
                            {comment.targetInfo?.targetType === 'RESULT' && (
                                <>
                                    <span className="mx-2">•</span>
                                    <span className="text-blue-600 font-medium">
                                        {comment.targetInfo.analyteName}: {comment.targetInfo.resultValue}
                                    </span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            {comment?.createdBy?.roles?.includes('Administrator') && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                    Admin
                                </span>
                            )}
                            <button
                                onClick={() => handleToggleReplyForm(comment?.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                                type="button"
                            >
                                {showReplyForm[comment?.id] ? 'Hủy phản hồi' : 'Phản hồi'}
                            </button>
                            {/* You can add delete button here if needed */}
                            {user?.userId === comment.createdBy?.userId && (
                                <button
                                    onClick={() => {
                                        console.log('Delete comment ID:', comment.id);
                                        handleOpenDeleteDialog(comment?.id);
                                    }}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                    type="button"
                                >
                                    xóa
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="text-gray-800 leading-relaxed">{comment.content}</p>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-8 space-y-2">
                        {comment.replies.map((reply, index) => (
                            <div key={reply?.id || index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-300">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium text-gray-800">{reply?.createdBy?.fullName || 'Unknown User'}</span>
                                        <span className="mx-2">•</span>
                                        <span>{formatDate(reply.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {reply?.createdBy?.roles?.includes('Administrator') && (
                                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                                Admin
                                            </span>
                                        )}
                                        {user?.userId === reply.createdBy?.userId && (
                                            <button
                                                onClick={() => {
                                                    console.log('Delete reply ID:', reply.id);
                                                    handleOpenDeleteDialog(reply?.id);
                                                }}
                                                className="px-2 py-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded text-xs transition-colors duration-200 border border-transparent hover:border-red-200"
                                                type="button"
                                                title="Xóa phản hồi"
                                            >
                                                Xóa
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">{reply.content}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Reply Form */}
                {showReplyForm[comment?.id] && (
                    <div className="ml-8 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium mb-2 text-sm text-gray-700">
                            Phản hồi cho {comment?.createdBy?.fullName || 'Unknown User'}:
                        </h4>
                        <textarea
                            value={replyContent}
                            onChange={handleReplyContentChange}
                            placeholder="Nhập phản hồi..."
                            className="w-full p-2 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            rows="2"
                            autoFocus
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                            <button
                                onClick={() => handleToggleReplyForm(comment?.id)}
                                className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
                                type="button"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => handleSubmitReply(comment?.id)}
                                disabled={!replyContent.trim() || isReplyingComment}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                                type="button"
                            >
                                {isReplyingComment ? 'Đang gửi...' : 'Gửi'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

        ));
    }, [
        comments,
        showReplyForm,
        replyContent,
        isReplyingComment,
        handleToggleReplyForm,
        handleReplyContentChange,
        handleSubmitReply,
        handleOpenDeleteDialog,
        user?.userId
    ]);

    // Empty state
    if (comments.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <FaComments className="mx-auto text-4xl mb-2" />
                <p>Chưa có bình luận nào</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {commentsList}
            </div>
            
            {/* Confirm Dialog - moved outside of map loop for better performance */}
            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Xác nhận xóa bình luận"
                message="Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác."
                type="warning"
                confirmText="Xóa"
                cancelText="Hủy"
                isLoading={isDeletingComment}
                onClose={handleCloseDeleteDialog}
                onConfirm={() => handleDeleteComment(deleteDialog.commentId)}
            />
        </>
    );
};

export default React.memo(CommentList);