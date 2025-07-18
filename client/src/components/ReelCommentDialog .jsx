import React, { useEffect, useState } from 'react';
import { X, Heart, MoreHorizontal, Smile } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setReels } from '@/redux/reelSlice';

const ReelCommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const { selectedReel, reels } = useSelector((state) => state.reel);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedReel) {
      setComments(selectedReel.comments || []);
    }
  }, [selectedReel]);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const sendCommentHandler = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:7777/api/v1/reel/comment/${selectedReel?._id}`,
        { text },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (res.data.success) {
        const updatedComments = [...comments, res.data.comment];
        setComments(updatedComments);

        const updatedReels = reels.map(r =>
          r._id === selectedReel._id
            ? { ...r, comments: updatedComments }
            : r
        );

        dispatch(setReels(updatedReels));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to post comment");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendCommentHandler();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {comments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No comments yet.</p>
              <p className="text-sm">Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                {/* Profile Picture */}
                <img
                  src={comment.author?.profilePicture || '/default-avatar.png'}
                  alt={comment.author?.username}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                
                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">
                          {comment.author?.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 break-words">
                        {comment.text}
                      </p>
                      
                      {/* Comment Actions */}
                      <div className="flex items-center gap-4 mt-2">
                        <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                          Reply
                        </button>
                        <button className="text-xs text-gray-500 hover:text-gray-700">
                          <Heart className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    {/* More Options */}
                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <img
              src={user?.profilePicture || '/default-avatar.png'}
              alt="Your profile"
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
              />
              <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <Smile className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            {text.trim() && (
              <button
                onClick={sendCommentHandler}
                className="text-blue-500 font-semibold text-sm hover:text-blue-600 transition-colors px-2"
              >
                Post
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelCommentDialog;