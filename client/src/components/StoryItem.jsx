import React from 'react';
import { Avatar, AvatarImage } from './ui/avatar';

const StoryItem = ({ story, onClick }) => {
  return (
    <div onClick={() => onClick(story)} className="flex flex-col items-center mx-2 cursor-pointer">
      <div className="w-16 h-16 rounded-full border-2 border-pink-500 p-[2px]">
        <Avatar className="w-full h-full">
          <AvatarImage src={story?.author?.profilePicture} alt={story?.author?.username} />
        </Avatar>
      </div>
      <p className="text-xs text-center mt-1 truncate w-16">{story?.author?.username}</p>
    </div>
  );
};

export default StoryItem;
