import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import stories from '../data/stories';

const Stories = () => {
  const scrollRef = useRef(null);

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-[935px] mx-auto px-5">
        {/* Stories Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth py-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {stories.map((story) => (
            <Link
              key={story.id}
              to={`/stories/${story.username}`}
              className="flex flex-col items-center shrink-0 group cursor-pointer"
            >
              {/* Story Ring with Gradient */}
              <div className="relative">
                <div className="w-[66px] h-[66px] rounded-full p-[2.5px] bg-gradient-to-br from-purple-600 via-pink-500 via-red-500 to-yellow-400 group-hover:scale-105 transition-all duration-300 ease-out">
                  <div className="w-full h-full rounded-full p-[2.5px] bg-white">
                    <img
                      src={story.avatar}
                      alt={story.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Username */}
              <p className="text-xs text-gray-900 mt-2 text-center w-[70px] truncate font-normal leading-tight">
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
    </div>
  );
};

export default Stories;