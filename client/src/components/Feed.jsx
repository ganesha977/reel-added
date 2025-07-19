import React from 'react';
import Stories from './Stories';
import Posts from './Posts';
import Reels from './Reels';

const Feed = () => {
  return (
    <div className='flex-1 flex flex-col items-center lg:pl-[20%] pt-16 lg:pt-4 pb-20 lg:pb-0 bg-gray-50 min-h-screen'>
      {/* Stories section - full width on mobile, constrained on desktop */}
      <div className="w-full max-w-[720px] bg-gray-50">
        <Stories />
      </div>

      {/* Posts and Reels - same container width */}
      <div className="w-full max-w-[470px] space-y-4 mt-4">
        <Posts />
        <Reels />
      </div>
    </div>
  );
};

export default Feed;