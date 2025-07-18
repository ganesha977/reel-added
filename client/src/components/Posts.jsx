import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const { posts } = useSelector(store => store.post);

  return (
    <div className='w-full max-w-md lg:max-w-sm mx-auto px-4 lg:px-0'>
      {
        posts.map((post) => (
          <Post key={post._id} post={post} />
        ))
      }
    </div>
  )
}

export default Posts;