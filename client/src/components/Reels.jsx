import React from 'react'
import Reel from './Reel.jsx'
import { useSelector } from 'react-redux'

const Reels = () => {
  const { reels } = useSelector(store => store.reel)

  return (
    <div className='w-full max-w-md lg:max-w-sm mx-auto px-4 lg:px-0'>
      {
        reels.map((reel) => (
          <Reel key={reel._id} reel={reel} />
        ))
      }
    </div>
  )
}

export default Reels
