import React, { useState, useEffect, useCallback } from 'react';
import {
  X, Volume2, VolumeX, Pause, Play,
  MoreHorizontal, Heart, Send
} from 'lucide-react';

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
        return prev + 0.5;
      });
    }, 25);

    return () => clearInterval(timer);
  }, [currentStoryIndex, currentGroupIndex, isPaused]);

  const handleNextStory = () => {
    if (currentStoryIndex < currentGroup.stories.length - 1) {
      setCurrentStoryIndex((i) => i + 1);
      setProgress(0);
    } else {
      if (currentGroupIndex < storyGroups.length - 1) {
        onNextGroup();
      } else {
        onClose();
      }
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((i) => i - 1);
      setProgress(0);
    } else {
      if (currentGroupIndex > 0) {
        onPrevGroup();
      }
    }
  };

  const handleStoryCardClick = (groupIndex) => {
    const targetIndex = storyGroups.findIndex(group => group.id === storyGroups[groupIndex].id);
    if (targetIndex < currentGroupIndex) onPrevGroup();
    else if (targetIndex > currentGroupIndex) onNextGroup();
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowRight') {
      handleNextStory();
    } else if (e.key === 'ArrowLeft') {
      handlePrevStory();
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [handleNextStory, handlePrevStory, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getVisibleStories = () => {
    const start = Math.max(0, currentGroupIndex - 2);
    const end = Math.min(currentGroupIndex + 3, storyGroups.length);
    return storyGroups.slice(start, end);
  };

  const visibleStories = getVisibleStories();

  if (!currentGroup || !currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* Horizontal Story Cards at Bottom */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {visibleStories.map((story) => {
            const isActive = story.id === currentGroup.id;
            return (
              <div
                key={story.id}
                onClick={() => handleStoryCardClick(storyGroups.indexOf(story))}
                className={`transition-all duration-300 ease-out cursor-pointer ${
                  isActive
                    ? 'scale-110 opacity-100'
                    : 'scale-90 opacity-50 hover:opacity-75 hover:scale-95'
                }`}
              >
                <div className="w-14 h-20 rounded-xl overflow-hidden relative bg-gray-800 border border-white/30">
                  <img
                    src={story.stories[0].url}
                    alt={story.username}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-5 h-5 rounded-full p-[1px] bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]">
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
                <p className="text-white text-[10px] text-center mt-1 max-w-[56px] truncate font-medium">
                  {story.username}
                </p>
                <p className="text-gray-400 text-[9px] text-center">{story.timeAgo}</p>
              </div>
            );
          })}
        </div>

        {/* Main Story Display */}
        <div className="relative w-full h-full max-w-sm mx-auto">
          {/* Progress Bars */}
          <div className="absolute top-3 left-2 right-2 flex gap-1 z-10">
            {currentGroup.stories.map((_, index) => (
              <div key={index} className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                  style={{
                    width: index < currentStoryIndex ? '100%' : index === currentStoryIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-6 left-3 right-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full p-[1px] bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]">
                <div className="w-full h-full rounded-full bg-white p-[1px]">
                  <img
                    src={currentGroup.profilePicture}
                    alt={currentGroup.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{currentGroup.username}</p>
                <p className="text-white/70 text-xs">{currentGroup.timeAgo}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsPaused(!isPaused)} 
                className="text-white hover:text-white/70 transition-colors"
              >
                {isPaused ? <Play size={20} /> : <Pause size={20} />}
              </button>
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="text-white hover:text-white/70 transition-colors"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <button className="text-white hover:text-white/70 transition-colors">
                <MoreHorizontal size={20} />
              </button>
              <button 
                onClick={onClose} 
                className="text-white hover:text-white/70 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Story Image */}
          <div className="relative w-full h-full">
            <img 
              src={currentStory.url} 

              alt={currentStory.caption} 
              className="w-full h-full object-cover" 
            />
            
            {/* Click areas for navigation */}
            <div className="absolute inset-0 flex">
              <div 
                className="w-1/2 h-full cursor-pointer" 
                onClick={handlePrevStory}
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onMouseLeave={() => setIsPaused(false)}
              />
              <div 
                className="w-1/2 h-full cursor-pointer" 
                onClick={handleNextStory}
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onMouseLeave={() => setIsPaused(false)}
              />
            </div>
            <br />
            {/* Story Caption */}
            {currentStory.caption && (
              <div className="absolute bottom-24 left-3 right-3">
                <p className="text-white text-sm bg-black/40 px-3 py-2 rounded-lg backdrop-blur-sm">
                  {currentStory.caption}
                </p>
              </div>
            )}
          </div>

          {/* Reply Input */}
          <div className="absolute bottom-6 left-3 right-3 z-10">
            <div className="flex items-center gap-3">
              <div className="flex-1 border border-white/40 rounded-full px-4 py-2.5 bg-transparent backdrop-blur-sm">
                <input
                  type="text"
                  placeholder={`Send message`}
                  className="w-full bg-transparent text-white placeholder-white/60 outline-none text-sm"
                />
              </div>
              <button className="text-white hover:text-white/70 transition-colors">
                <Heart size={24} />
              </button>
              <button className="text-white hover:text-white/70 transition-colors">
                <Send size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;