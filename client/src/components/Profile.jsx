import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';

const Profile = () => {
  const params = useParams();
  const userId = params.id;

  useGetUserProfile(userId);
  const { userProfile, user } = useSelector(store => store.auth);

  const [activeTab, setActiveTab] = useState('posts');
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = false;

  const handleTabChange = (tab) => setActiveTab(tab);

  const displayedPost =
    activeTab === 'posts'
      ? userProfile?.posts
      : activeTab === 'saved'
      ? userProfile?.bookmarks
      : activeTab === 'reels'
      ? userProfile?.reels
      : [];

  // Debugging logs
  console.log("Active Tab: ", activeTab);
  console.log("Displayed Content: ", displayedPost);

  return (
    <div className="ml-64 px-4 max-w-5xl mx-auto">
      <div className="flex flex-col gap-20 py-8">
        {/* Top Profile Info */}
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button variant="secondary" className="hover:bg-gray-200 h-8">Edit profile</Button>
                    </Link>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">View archive</Button>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">Ad tools</Button>
                  </>
                ) : (
                  isFollowing ? (
                    <>
                      <Button variant="secondary" className="h-8">Unfollow</Button>
                      <Button variant="secondary" className="h-8">Message</Button>
                    </>
                  ) : (
                    <Button className="bg-[#0095F6] hover:bg-[#3192d2] h-8">Follow</Button>
                  )
                )}
              </div>
              <div className="flex items-center gap-4">
                <p><span className="font-semibold">{userProfile?.posts?.length || 0} </span>posts</p>
                <p><span className="font-semibold">{userProfile?.followers?.length || 0} </span>followers</p>
                <p><span className="font-semibold">{userProfile?.following?.length || 0} </span>following</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">{userProfile?.bio || 'bio here...'}</span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign /><span className="pl-1">{userProfile?.username}</span>
                </Badge>
                <span>🤯Learn code with patel mernstack style</span>
                <span>🤯Turing code into fun</span>
                <span>🤯DM for collaboration</span>
              </div>
            </div>
          </section>
        </div>

        {/* Tabs */}
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            {['posts', 'saved', 'reels', 'tags'].map(tab => (
              <span
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`py-3 cursor-pointer border-b-2 ${activeTab === tab ? 'border-black font-bold' : 'border-transparent'}`}
              >
                {tab.toUpperCase()}
              </span>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-3 gap-1">
            {displayedPost?.length > 0 ? (
              displayedPost.map(item => (
                <div key={item._id} className="relative group cursor-pointer">
                  {activeTab === 'reels' ? (
                    <>
                      <video
                        src={item.video}
                        muted
                        loop
                        className="rounded-sm my-2 w-full aspect-square object-cover group-hover:brightness-50 transition duration-200"
                      />
                      <p className="text-xs text-center text-gray-600">{item.caption}</p>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center text-white space-x-4">
                          <button className="flex items-center gap-2 hover:text-gray-300">
                            <Heart />
                            <span>{(item?.likes || []).length}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-gray-300">
                            <MessageCircle />
                            <span>{(item?.comments || []).length}</span>
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={item.image}
                        alt="postimage"
                        className="rounded-sm my-2 w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center text-white space-x-4">
                          <button className="flex items-center gap-2 hover:text-gray-300">
                            <Heart />
                            <span>{(item?.likes || []).length}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-gray-300">
                            <MessageCircle />
                            <span>{(item?.comments || []).length}</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center col-span-3 py-10 text-sm text-gray-500">No content to show</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
