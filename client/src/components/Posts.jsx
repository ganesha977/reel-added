import React from 'react';
import { useSelector } from 'react-redux';
import Post from './Post';

const Posts = () => {
  const { posts } = useSelector(store => store.post);

  return (
    <div className='w-full'>
      {posts?.map(post => (
        post && post._id && <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
