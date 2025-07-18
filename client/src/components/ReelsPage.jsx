import React, { useEffect, useRef, useState } from 'react';
import {
  Heart, MessageCircle, Bookmark, Volume2, VolumeX
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import useGetAllReels from '@/hooks/useGetAllReels';
import { toast } from 'sonner';
import axios from 'axios';
import { setReels, setSelectedReel } from '@/redux/reelSlice';
import { Link } from 'react-router-dom';
import ReelCommentDialog from './ReelCommentDialog ';

const ReelsPage = () => {
  const reelsContainerRef = useRef(null);
  const videoRefs = useRef([]);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [commentTexts, setCommentTexts] = useState({});
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const { reels } = useSelector((state) => state.reel);
  const { user } = useSelector((state) => state.auth);

  // Fetch all reels
  useGetAllReels();

  const handleScroll = () => {
    const container = reelsContainerRef.current;
    if (!container) return;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / containerHeight);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reels.length) {
      setCurrentIndex(newIndex);
      videoRefs.current.forEach((video) => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });
      const currentVideo = videoRefs.current[newIndex];
      if (currentVideo) {
        currentVideo.currentTime = 0;
        currentVideo.muted = isMuted;
        currentVideo.play().catch(console.error);
      }
    }
  };

  useEffect(() => {
    const container = reelsContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [currentIndex, reels.length]);

  useEffect(() => {
    if (reels.length > 0 && videoRefs.current[0]) {
      setTimeout(() => {
        const firstVideo = videoRefs.current[0];
        firstVideo.muted = isMuted;
        firstVideo.play().catch(console.error);
      }, 100);
    }
  }, [reels]);

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = isMuted;
      }
    });
  }, [isMuted]);

  const formatCount = (count) => {
    if (!count || isNaN(count)) return '0';
    if (count >= 1e6) return `${(count / 1e6).toFixed(1)}M`;
    if (count >= 1e3) return `${(count / 1e3).toFixed(1)}K`;
    return count.toString();
  };

  const likeOrDislikeHandler = async (reel) => {
    const liked = reel.likes.includes(user._id);
    const action = liked ? "dislike" : "like";
    try {
      const res = await axios.post(
        `http://localhost:7777/api/v1/reel/${action}/${reel._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedData = reels.map(r =>
          r._id === reel._id
            ? {
                ...r,
                likes: liked
                  ? r.likes.filter(id => id !== user._id)
                  : [...r.likes, user._id],
              }
            : r
        );
        dispatch(setReels(updatedData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const commentHandler = async (reel, text) => {
    try {
      const res = await axios.post(
        `http://localhost:7777/api/v1/reel/comment/${reel._id}`,
        { text },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      if (res.data.success) {
        const updatedReels = reels.map(r =>
          r._id === reel._id
            ? { ...r, comments: [...r.comments, res.data.comment] }
            : r
        );
        dispatch(setReels(updatedReels));
        toast.success(res.data.message);
        setCommentTexts(prev => ({ ...prev, [reel._id]: "" }));
      }
    } catch (error) {
      toast.error("Comment failed");
    }
  };

  const bookmarkHandler = async (reel) => {
    try {
      const res = await axios.get(
        `http://localhost:7777/api/v1/reel/${reel._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) toast.success(res.data.message);
    } catch (error) {
      toast.error("Bookmark failed");
    }
  };

  const openCommentDialog = (reel) => {
    dispatch(setSelectedReel(reel));
    setCommentDialogOpen(true);
  };

  const setCommentText = (reelId, text) => {
    setCommentTexts(prev => ({ ...prev, [reelId]: text }));
  };

  const getCommentText = (reelId) => {
    return commentTexts[reelId] || '';
  };

  if (!reels || reels.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">No reels available</div>
          <div className="text-sm text-gray-400">Check back later for new content</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <div className="relative h-full w-full md:w-[400px] md:max-w-[400px] overflow-hidden">
        <div
          className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          ref={reelsContainerRef}
        >
          {reels.map((reel, index) => {
            const isLiked = reel.likes.includes(user._id);
            const currentText = getCommentText(reel._id);

            return (
              <div
                key={reel._id}
                className="h-full w-full snap-start relative bg-black text-white flex items-center justify-center"
              >
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={reel.video}
                  muted={isMuted}
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 z-10" />
                <button
                  onClick={() => setIsMuted((prev) => !prev)}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full z-20 backdrop-blur-sm transition-all duration-200 hover:bg-black/70"
                >
                  {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                </button>

                {/* Action Buttons */}
                <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center space-y-6 sm:right-6">
                  {/* Like */}
                  <button
                    onClick={() => likeOrDislikeHandler(reel)}
                    className="flex flex-col items-center space-y-1 group"
                  >
                    <div className="p-2 rounded-full transition-transform group-active:scale-95">
                      <Heart
                        className={`w-7 h-7 transition-colors duration-200 ${
                          isLiked ? 'text-red-500 fill-red-500' : 'text-white'
                        }`}
                      />
                    </div>
                    <span className="text-xs font-medium text-white">
                      {formatCount(reel.likes.length)}
                    </span>
                  </button>

                  {/* Comment */}
                  <button
                    onClick={() => openCommentDialog(reel)}
                    className="flex flex-col items-center space-y-1 group"
                  >
                    <div className="p-2 rounded-full transition-transform group-active:scale-95">
                      <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs font-medium text-white">
                      {formatCount(reel.comments.length)}
                    </span>
                  </button>

                  {/* Bookmark */}
                  <button
                    onClick={() => bookmarkHandler(reel)}
                    className="flex flex-col items-center space-y-1 group"
                  >
                    <div className="p-2 rounded-full transition-transform group-active:scale-95">
                      <Bookmark className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs font-medium text-white">Save</span>
                  </button>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <div className="max-w-[calc(100%-80px)]">
                    <div className="flex items-center gap-3 mb-3">
                      <Link to={`/profile/${reel.author?._id}`}>
                        <img
                          src={reel.author?.profilePicture}
                          alt="profile"
                          className="w-8 h-8 rounded-full border border-white/30"
                        />
                      </Link>
                      <Link to={`/profile/${reel.author?._id}`}>
                        <span className="text-sm font-semibold text-white hover:underline cursor-pointer">
                          @{reel.author?.username}
                        </span>
                      </Link>
                    </div>
                    <p className="text-sm text-white mb-4 leading-relaxed">{reel.caption}</p>
                    <div className="flex items-center gap-3">
                      <img src={user?.profilePicture} alt="your profile" className="w-6 h-6 rounded-full" />
                      <input
                        value={currentText}
                        onChange={(e) => setCommentText(reel._id, e.target.value)}
                        placeholder="Add a comment..."
                        className="bg-transparent text-white text-sm flex-1 outline-none placeholder-gray-400 border-b border-gray-600 pb-1"
                      />
                      {currentText.trim() && (
                        <button
                          onClick={() => commentHandler(reel, currentText)}
                          className="text-blue-400 font-semibold text-sm hover:text-blue-300"
                        >
                          Post
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>

      <ReelCommentDialog open={commentDialogOpen} setOpen={setCommentDialogOpen} />
    </div>
  );
};

export default ReelsPage;
