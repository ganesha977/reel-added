import React, { useEffect, useState } from 'react';
import { X, Heart, MoreHorizontal, Smile, Trash2 } from 'lucide-react';
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
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedComments = [...comments, res.data.comment];
        setComments(updatedComments);

        const updatedReels = reels.map(r =>
          r._id === selectedReel._id ? { ...r, comments: updatedComments } : r
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

  const handleDeleteReel = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:7777/api/v1/reel/${selectedReel._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedReels = reels.filter(r => r._id !== selectedReel._id);
        dispatch(setReels(updatedReels));
        toast.success("Reel deleted");
        setOpen(false);
      } else {
        toast.error(res.data.message || "Failed to delete reel");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete reel");
    }
  };

  if (!open || !selectedReel) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-white w-[90%] h-[90%] rounded-lg flex overflow-hidden shadow-2xl">
        
        {/* Left: Reel Video */}
        <div className="w-1/2 bg-black flex items-center justify-center">
          <video
            src={selectedReel.video}
            controls
            autoPlay
            muted
            className="max-h-full w-full object-contain"
          />
        </div>

        {/* Right: Comment section */}
        <div className="w-1/2 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-base font-medium">Comments</h2>
            <div className="flex gap-3 items-center">
              {user?._id === selectedReel?.postedBy?._id && (
                <button onClick={handleDeleteReel}>
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              )}
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">No comments yet.</p>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className="flex gap-3">
                  <img
                    src={comment.author?.profilePicture || '/default-avatar.png'}
                    className="w-9 h-9 rounded-full"
                    alt={comment.author?.username}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm">{comment.author?.username}</span>
                      <span className="text-xs text-gray-400">{formatTimeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-800">{comment.text}</p>
                    <div className="flex items-center gap-2 text-xs mt-1 text-gray-500">
                      <button className="hover:underline">Reply</button>
                      <Heart className="w-3 h-3 hover:text-red-500 cursor-pointer" />
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="border-t px-4 py-3">
            <div className="flex items-center gap-3">
              <img
                src={user?.profilePicture || '/default-avatar.png'}
                className="w-9 h-9 rounded-full"
                alt="User"
              />
              <div className="flex-1 relative bg-gray-100 rounded-full px-4 py-2 flex items-center">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a comment..."
                  className="flex-1 bg-transparent text-sm outline-none"
                />
                <Smile className="w-5 h-5 text-gray-400" />
              </div>
              {text.trim() && (
                <button
                  onClick={sendCommentHandler}
                  className="text-blue-500 font-medium text-sm"
                >
                  Post
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelCommentDialog;
