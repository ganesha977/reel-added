import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import stories from '../data/stories';

const Stories = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = window.innerWidth < 768 ? 110 : 140;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative px-0 py-2 bg-white border-b border-gray-200">
      {/* Navigation Arrows - Desktop Only */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full p-1.5 shadow-md transition-all"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full p-1.5 shadow-md transition-all"
      >
        <ChevronRight size={20} />
      </button>

      {/* Stories Container */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth px-3"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {stories.map((story) => (
          <Link
            key={story.id}
            to={`/stories/${story.username}`}
            className="flex flex-col items-center shrink-0 group"
          >
            <div className="w-16 h-16 sm:w-[70px] sm:h-[70px] md:w-20 md:h-20 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 group-hover:scale-105 transition-transform duration-200">
              <img
                src={story.avatar}
                alt={story.username}
                className="w-full h-full rounded-full object-cover border-2 border-white"
              />
            </div>
            <p className="text-[11px] sm:text-xs text-gray-800 mt-1 text-center w-16 sm:w-[70px] md:w-20 truncate font-medium">
              {story.username}
            </p>
          </Link>
        ))}
      </div>

      {/* Hide scrollbar for all browsers */}
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Stories;
