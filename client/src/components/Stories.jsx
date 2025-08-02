  import React, { useState, useRef } from 'react';
  import { Plus } from 'lucide-react';
  import StoryViewer from './StoryViewer';

  const Stories = () => {
    const [selectedGroupIndex, setSelectedGroupIndex] = useState(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const storyGroups = [
      {
        id: '1',
        username: 'sanjanaa_anand',
        profilePicture: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
        timeAgo: '23h',
        stories: [
          {
            id: '1a',
            type: 'image',
            url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=720',
            caption: 'Sunkissed Sunday 🌞'
          },
          {
            id: '1b',
            type: 'image',
            url: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=720',
            caption: 'Morning vibes ✨'
          }
        ]
      },
      {
        id: '2',
        username: 'varnita_sati',
        profilePicture: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
        timeAgo: '1h',
        stories: [
          {
            id: '2a',
            type: 'image',
            url: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=720',
            caption: 'That golden hour glow ✨'
          }
        ]
      },
      {
        id: '3',
        username: 'hiyabomb',
        profilePicture: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=150',
        timeAgo: '2h',
        stories: [
          {
            id: '3a',
            type: 'image',
            url: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=720',
            caption: 'Mirror moments 🪞'
          }
        ]
      },
      {
        id: '4',
        username: 'sonunigam',
        profilePicture: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
        timeAgo: '16h',
        stories: [
          {
            id: '4a',
            type: 'image',
            url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=720',
            caption: 'Peace & playlists 🎧'
          }
        ]
      },
      {
        id: '5',
        username: 'mayank',
        profilePicture: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=150',
        timeAgo: '7h',
        stories: [
          {
            id: '5a',
            type: 'image',
            url: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=720',
            caption: 'On top of the world 🌍'
          }
        ]
      },
      {
        id: '6',
        username: 'dr.rebecca',
        profilePicture: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
        timeAgo: '3h',
        stories: [
          {
            id: '6a',
            type: 'image',
            url: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=720',
            caption: 'Clinic to coffee ☕'
          }
        ]
      }
    ];

    const handleStoryClick = (index) => {
      setSelectedGroupIndex(index);
      setIsViewerOpen(true);
    };

    const handleCloseViewer = () => {
      setIsViewerOpen(false);
      setSelectedGroupIndex(null);
    };

    const handleNextGroup = () => {
      if (selectedGroupIndex !== null && selectedGroupIndex < storyGroups.length - 1) {
        setSelectedGroupIndex(selectedGroupIndex + 1);
      }
    };

    const handlePrevGroup = () => {
      if (selectedGroupIndex !== null && selectedGroupIndex > 0) {
        setSelectedGroupIndex(selectedGroupIndex - 1);
      }
    };

    const handleFileUpload = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
      const file = event.target.files?.[0];
      if (file) {
        setIsUploading(true);
        setTimeout(() => {
          setIsUploading(false);
          console.log('Story uploaded:', file.name);
        }, 3000);
      }
    };

    return (
      <>
        <div className="w-full ">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-4">
            {/* Your Story */}
            <div className="flex-shrink-0 flex flex-col items-center cursor-pointer group">
              <div className="relative" onClick={handleFileUpload}>
                <div className="w-[66px] h-[66px] rounded-full p-[2px] transition-transform group-hover:scale-105 bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]">
                  {isUploading ? (
                    <div className="w-full h-full rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                  ) : (
                    <>
                      <div className="w-full h-full rounded-full bg-white p-[2px]">
                        <img
                          src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150"
                          alt="Your story"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 w-[20px] h-[20px] bg-[#0095f6] rounded-full border-3 border-white flex items-center justify-center">
                        <Plus size={12} className="text-white font-bold" />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <span className="text-xs text-black mt-1 max-w-[66px] truncate font-normal">
                Your story
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Other Stories */}
            {storyGroups.map((group, index) => (
              <div
                key={group.id}
                className="flex-shrink-0 flex flex-col items-center cursor-pointer group"
                onClick={() => handleStoryClick(index)}
              >
                <div className="relative">
                  <div className="w-[66px] h-[66px] rounded-full p-[2px] transition-transform group-hover:scale-105 bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]">
                    <div className="w-full h-full rounded-full bg-white p-[2px]">
                      <img
                        src={group.profilePicture}
                        alt={group.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                  {group.stories.length > 1 && (
                    <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] bg-[#0095f6] rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">{group.stories.length}</span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-black mt-1 max-w-[66px] truncate font-normal">
                  {group.username}
                </span>
              </div>
            ))}
          </div>
        </div>

        {isViewerOpen && selectedGroupIndex !== null && (
          <StoryViewer
            storyGroups={storyGroups}
            currentGroupIndex={selectedGroupIndex}
            onClose={handleCloseViewer}
            onNextGroup={handleNextGroup}
            onPrevGroup={handlePrevGroup}
          />
        )}
      </>
    );
  };

  export default Stories;