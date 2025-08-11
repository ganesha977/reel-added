import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import stories from '../data/stories';
import { X, Play, Pause } from 'lucide-react';

const StoryViewer = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const currentIndex = stories.findIndex((s) => s.username === username);
  const story = stories[currentIndex];

  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!story || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [story, isPaused]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      navigate(`/stories/${stories[currentIndex + 1].username}`);
      setProgress(0);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      navigate(`/stories/${stories[currentIndex - 1].username}`);
      setProgress(0);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  // Listen for keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!story) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-lg">
        Story not found
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md h-full max-h-[90vh] bg-black rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div className="absolute top-2 left-2 right-2 z-20">
          <div className="h-0.5 bg-white bg-opacity-30 rounded-full">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-6 left-4 right-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-white p-0.5">
              <img
                src={story.avatar}
                alt={story.username}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <p className="text-white text-sm font-medium">{story.username}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-white"
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
            <button onClick={handleClose} className="text-white">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Story Image */}
        <img src={story.image} alt="story" className="w-full h-full object-cover" />

        {/* Caption */}
        {story.text && (
          <div className="absolute bottom-20 px-4 text-center text-white">
            <p className="text-lg font-medium">{story.text}</p>
            {story.mention && (
              <p className="text-blue-400 text-sm mt-1">{story.mention}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryViewer;
