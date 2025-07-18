import React from 'react'
import Posts from './Posts'
import Reels from './Reels'

const Feed = () => {
  return (
    <div className='flex-1 my-8 flex flex-col items-center lg:pl-[20%] pt-16 lg:pt-0 pb-20 lg:pb-0'>
        <Posts/>
        <Reels/>

    </div>
  )
}

export default Feed 