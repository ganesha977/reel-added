import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  // ✅ If no suggested users, show message
  if (!suggestedUsers || suggestedUsers.length === 0) {
    return (
      <div className="hidden md:block my-10 w-full max-w-xs text-sm text-gray-500">
        No suggested users
      </div>
    );
  }

  return (
    <div className="hidden md:block my-10 w-full max-w-xs">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer hover:underline">See All</span>
      </div>

      {suggestedUsers.map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between my-5 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Link to={`/profile/${user._id}`}>
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.profilePicture} alt="post-image" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>

            <div className="overflow-hidden">
              <h1 className="font-semibold text-sm truncate">
                <Link to={`/profile/${user._id}`}>{user?.username}</Link>
              </h1>
              <span className="text-gray-600 text-sm truncate block">
                {user?.bio || 'bio here'}
              </span>
            </div>
          </div>

          <span className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:underline whitespace-nowrap ml-4">
            Follow
          </span>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUsers;
