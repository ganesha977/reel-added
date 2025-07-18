import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="flex-shrink-0 p-3 md:p-4 border-b border-gray-100">
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <Avatar className="h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20">
              <AvatarImage src={selectedUser?.profilePicture} />
              <AvatarFallback>Fn</AvatarFallback>
            </Avatar>
            <span className="mt-2 font-medium text-sm md:text-base">{selectedUser?.username}</span>
            <Link to={`/profile/${selectedUser?._id}`}>
              <Button className="h-7 md:h-8 my-2 text-xs px-3 md:px-4" variant="secondary">
                view profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 md:p-4">
        <div className="flex flex-col gap-2 md:gap-3">
          {messages &&
            messages.map((msg) => {
              return (
                <div key={msg._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2 md:p-3 rounded-lg max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md break-words text-sm md:text-base ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                    {msg?.message}
                  </div> 
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Messages;