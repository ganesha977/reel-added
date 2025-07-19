import React from 'react';
import { X } from 'lucide-react';

const StoryPopup = ({ story, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <button onClick={onClose} className="absolute top-4 right-4 text-white">
        <X size={28} />
      </button>
      <div className="max-w-md w-full flex flex-col items-center">
        <video
          src={story.video}
          controls
          autoPlay
          className="rounded-lg w-full max-h-[80vh]"
        />
        <p className="text-white mt-2">{story.caption}</p>
      </div>
    </div>
  );
};

export default StoryPopup;
