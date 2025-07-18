import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const Stories = () => {
  const fileInputRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [stories, setStories] = useState([]);
  const [viewed, setViewed] = useState([]);
  const { user } = useSelector(store => store.auth);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  const fetchStories = async () => {
    try {
      const res = await axios.get("http://localhost:7777/api/v1/story/all", {
        withCredentials: true
      });
      setStories(res.data.stories);
    } catch (err) {
      console.error("Error fetching stories:", err);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const res = await axios.post("http://localhost:7777/api/v1/story/add", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(percent);
        },
      });

      toast.success(res.data.message);
      setUploadProgress(100);
      setTimeout(() => setIsUploading(false), 800);
      fetchStories();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
      setIsUploading(false);
    }
  };

  const markAsViewed = (storyId) => setViewed(prev => [...prev, storyId]);

  const Avatar = ({ src, fallback, className, children }) => (
    <div className={`relative overflow-hidden rounded-full bg-gray-200 ${className}`}>
      {src ? (
        <img src={src} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white font-semibold">
          {fallback}
        </div>
      )}
      {children}
    </div>
  );

  return (
    <div className="relative bg-white border-b border-gray-200 py-4 overflow-hidden">
      {showLeftArrow && (
        <button
          onClick={() => scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md border flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={() => scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md border flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {/* Stories scroll container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth px-6 max-w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Your Story Upload */}
        <div className="flex flex-col items-center flex-shrink-0 cursor-pointer group">
          <div className="relative" onClick={() => fileInputRef.current?.click()}>
            {isUploading && (
              <div className="absolute inset-0 rounded-full z-10">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="47" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle
                    cx="50" cy="50" r="47"
                    fill="none" stroke="#3b82f6" strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 47}`}
                    strokeDashoffset={`${2 * Math.PI * 47 * (1 - uploadProgress / 100)}`}
                    className="transition-all duration-300 ease-out"
                  />
                </svg>
              </div>
            )}
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Avatar
                src={user?.profilePicture}
                fallback={user?.username?.charAt(0)}
                className="w-full h-full ring-2 ring-gray-200 group-hover:ring-gray-300 bg-gradient-to-br from-blue-500 to-purple-600"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                <Plus className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>
          <span className="mt-2 text-xs font-medium text-gray-900 max-w-[70px] truncate">Your story</span>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>

        {/* All Stories */}
        {stories.map(story => {
          const isViewed = viewed.includes(story._id);
          return (
            <div
              key={story._id}
              onClick={() => markAsViewed(story._id)}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
            >
              <div className="relative">
                <div className={`absolute inset-0 rounded-full p-0.5 ${isViewed
                  ? 'bg-gray-300'
                  : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'}`}>
                  <div className="w-full h-full bg-white rounded-full p-0.5">
                    <Avatar
                      src={story.author.profilePicture}
                      fallback={story.author.username.charAt(0).toUpperCase()}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </div>
                <div className="w-16 h-16 md:w-20 md:h-20 invisible" />
              </div>
              <span className={`mt-2 text-xs font-medium max-w-[70px] truncate ${isViewed ? 'text-gray-500' : 'text-gray-900'}`}>
                {story.author.username}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stories;