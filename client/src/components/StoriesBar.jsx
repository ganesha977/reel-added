import React, { useState } from 'react';
import StoryItem from './StoryItem';
import useStories from '@/hooks/useStories';
import StoryPopup from './StoryPopup';

const StoriesBar = () => {
  const { stories } = useStories(); // Custom hook to get stories
  const [selectedStory, setSelectedStory] = useState(null);

  return (
    <>
      <div className="flex gap-2 overflow-x-auto px-3 py-2 border-b">
        {stories.map(story => (
          <StoryItem key={story._id} story={story} onClick={setSelectedStory} />
        ))}
      </div>

      {selectedStory && (
        <StoryPopup story={selectedStory} onClose={() => setSelectedStory(null)} />
      )}
    </>
  );
};

export default StoriesBar;
