import React, { useState, useEffect, useCallback } from 'react';
import {
  X, Volume2, VolumeX, Pause, Play,
  MoreHorizontal, Heart, Send
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const StoryViewer = ({ storyGroups, currentGroupIndex, onClose, onNextGroup, onPrevGroup }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const currentGroup = storyGroups[currentGroupIndex];
  const currentStory = currentGroup?.stories[currentStoryIndex];

  useEffect(() => {
    setCurrentStoryIndex(0);
    setProgress(0);
  }, [currentGroupIndex]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextStory();
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [currentStoryIndex, currentGroupIndex, isPaused]);

  const handleNextStory = () => {
    if (currentStoryIndex < currentGroup.stories.length - 1) {
      setCurrentStoryIndex((i) => i + 1);
      setProgress(0);
    } else {
      onNextGroup();
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((i) => i - 1);
      setProgress(0);
    } else {
      onPrevGroup();
    }
  };

  const handleStoryCardClick = (groupIndex) => {
    if (groupIndex < currentGroupIndex) onPrevGroup();
    else if (groupIndex > currentGroupIndex) onNextGroup();
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowRight') {
      onNextGroup();
    } else if (e.key === 'ArrowLeft') {
      onPrevGroup();
    }
  }, [onNextGroup, onPrevGroup]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getVisibleStories = () => {
    const totalStories = storyGroups.length;
    return storyGroups.slice(Math.max(0, currentGroupIndex - 2), Math.min(currentGroupIndex + 3, totalStories));
  };

  const visibleStories = getVisibleStories();

  if (!currentGroup || !currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">

        {/* Horizontal Story Cards */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
          {visibleStories.map((story, index) => (
            <motion.div
              key={story.id}
              onClick={() => handleStoryCardClick(storyGroups.indexOf(story))}
              className={`transition-all duration-500 ease-out transform cursor-pointer ${
                story === currentGroup
                  ? 'scale-110 opacity-100'
                  : 'scale-90 opacity-40 hover:opacity-60 hover:scale-95'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: story === currentGroup ? 1.1 : 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-24 rounded-xl overflow-hidden relative bg-gray-800 border-2 border-white/20">
                <img
                  src={story.stories[0].url}
                  alt={story.username}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 rounded-full p-[1px] bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-700">
                    <div className="w-full h-full rounded-full bg-white p-[1px]">
                      <img
                        src={story.profilePicture}
                        alt={story.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-white text-xs text-center mt-1 max-w-[64px] truncate font-medium">
                {story.username}
              </p>
              <p className="text-gray-400 text-xs text-center">{story.timeAgo}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Story Display */}
        <div className="relative w-full h-full max-w-md mx-auto">
          <div className="absolute top-4 left-4 right-4 flex space-x-1 z-10">
            {currentGroup.stories.map((_, index) => (
              <div key={index} className="flex-1 h-0.5 bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{
                    width: index < currentStoryIndex ? '100%' : index === currentStoryIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center space-x-3">
              <img
                src={currentGroup.profilePicture}
                alt={currentGroup.username}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <div>
                <p className="text-white font-medium text-sm">{currentGroup.username}</p>
                <p className="text-gray-300 text-xs">{currentGroup.timeAgo}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => setIsPaused(!isPaused)} className="text-white">{isPaused ? <Play size={20} /> : <Pause size={20} />}</button>
              <button onClick={() => setIsMuted(!isMuted)} className="text-white">{isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
              <button className="text-white"><MoreHorizontal size={20} /></button>
              <button onClick={onClose} className="text-white"><X size={24} /></button>
            </div>
          </div>

          {/* Image with transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentGroupIndex}-${currentStoryIndex}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative w-full h-full"
            >
              <img src={currentStory.url} alt={currentStory.caption} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full cursor-pointer" onClick={handlePrevStory} />
                <div className="w-1/2 h-full cursor-pointer" onClick={handleNextStory} />
              </div>
              {currentStory.caption && (
                <div className="absolute bottom-20 left-4 right-4">
                  <p className="text-white text-sm bg-black/40 px-3 py-2 rounded-lg backdrop-blur">{currentStory.caption}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Reply */}
          <div className="absolute bottom-8 left-4 right-4 z-10">
            <div className="flex items-center space-x-3">
              <div className="flex-1 border border-gray-400 rounded-full px-4 py-2 bg-transparent backdrop-blur-sm">
                <input
                  type="text"
                  placeholder={`Reply to ${currentGroup.username}...`}
                  className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                />
              </div>
              <button className="text-white"><Heart size={24} /></button>
              <button className="text-white"><Send size={24} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
