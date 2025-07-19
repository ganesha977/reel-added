import React from 'react';
import Posts from './Posts';
import Reels from './Reels';
import StoriesBar from './StoriesBar';

const Feed = () => {
  return (
    <div className='flex-1 flex flex-col items-center lg:pl-[20%] pt-16 lg:pt-0 pb-20 lg:pb-0'>
      <StoriesBar />
      <Posts />
      <Reels />
    </div>
  );
};

export default Feed;
