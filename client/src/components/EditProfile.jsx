import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback } from './ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Button } from './ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'; 
import { Textarea } from './ui/textarea'
import { Loader, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
const EditProfile = () => {
    const imageref=useRef();
    const {user}=useSelector(store=>store.auth);
const [loading,setLoading]=useState(false);
const [input ,setInput]=useState({
    profilePhoto:user?.profilePicture,
    bio:user?.bio,
    gender:user?.gender
})
const navigate=useNavigate();
const dispatch=useDispatch();






const selectchangehandler=(value)=>{
  setInput({...input ,gender:value})
}

const filechngehandler=(e)=>{
    
    try {
const file = e.target.files[0];

        if(file){
            setInput({
                ...input,profilePhoto:file
            })
        }

    

        
    } catch (error) {
        console.log(error)
        
    }
}


 const editprofilehandler=async()=>{
    const formdata=new FormData();
    formdata.append('bio',input.bio);
    formdata.append('gender',input.gender);
    
if(input.profilePhoto){
    formdata.append('profilePhoto',input.profilePhoto);

}


try {
    setLoading(true);
const res = await axios.post(`http://localhost:7777/api/v1/user/profile/edit`, formdata, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true
});

if (res.data.success) {
  const updateduserdata = {
    ...user,
    bio: res?.data?.user?.bio,
    profilePicture: res?.data?.user?.profilePicture,
    gender: res?.data?.user?.gender
  };

  dispatch(setAuthUser(updateduserdata));
  navigate(`/profile/${user._id}`);
  toast.success(res.data.message);
}



} catch (error) {
    console.log(error);
    toast.error(error.response.data.message)
    
}    
 }
  return (
    <div className='flex max-w-2xl mx-auto pl-10'>


        <section className='flex flex-col   gap-6  w-full  my-8'>
            <h1 className='font-bold text-xl'>Edit Profile</h1>
            <div className="flex items-center   justify-between bg-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-3">



                    
            <Avatar>
                          <AvatarImage src={user?.profilePicture} alt="post-iamge" />
              
              <AvatarFallback>CN</AvatarFallback>
           </Avatar>    

      <div>

            <h1 className='font-bold text-sm'>{user?.username}</h1>
    <span  className='text-gray-600'>{user?.bio ||'bio here'}</span>

    </div>
                </div>

<input type="file"  ref={imageref} className='hidden'     onChange={filechngehandler} />
<Button       onClick={()=>imageref?.current.click()} className='bg-[#0095F6] h-8 hover:bg-[#318bc7]' >change photo</Button>
          </div>

          <div>
            <h1   className='font-bold text-xl mb-2'>
                bio
            </h1>
            <Textarea        value={input.bio}       onChange={
                (e)=>setInput({...input,bio:e.target.value})
            } className='focus-visible:ring-transparent'  />
          </div>
          <div>
            <h1   className='font-bold  mb-2'>
gender
            </h1>

            <Select   defaultValue={input.gender} onValueChange={selectchangehandler}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
          </div>
         <div  className='flex justify-end'>

       {
        loading ?
        (
                 <Button className='w-fit bg-[#0095F6] h-8 hover:bg-[#318bc7]'>
                    <Loader2  className='mr-2 h-4 w-4 animate-spin'/>
                 please wait ...      
            </Button>
        ) :
             <Button      onClick={editprofilehandler}  className='w-fit bg-[#0095F6] h-8 hover:bg-[#318bc7]'>
                 submit      
            </Button>
       }
         </div>
        </section>

    </div>
  )
}

export default EditProfile