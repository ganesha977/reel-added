import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MessageCircleCode, ArrowLeft } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const ChatPage = () => {
  const { onlineUsers,messages } = useSelector((store) => store.chat);

  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const dispatch = useDispatch();
const [textMessage,settextMessage]=useState('');




 const sendmsg = async (receiverId) => {
  try {
    if (!textMessage.trim()) return; // prevent sending empty message

    const res = await axios.post(
      `http://localhost:7777/api/v1/message/send/${receiverId}`,
      { textMessage },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    if (res.data.success) {
      dispatch(setMessages([...messages, res.data.newMessage]));
      settextMessage(''); // clear input
    }
  } catch (error) {
    console.error("Send Message Error:", error);
  }
};


  useEffect(() => {

    return () => {
      dispatch(setSelectedUser(null))
    };
  }, []);

  return (
    <div className="flex ml-[16%] h-screen">
      <section className={`${selectedUser ? 'hidden md:block' : 'block'} w-full md:w-1/4 my-8`}>
        <h1 className="font-bold px-3   mb-4  text-xl">{user?.username}</h1>
        <hr className="mb-4  border-gray-300" />
        <div className="overflow-y-auto h-[calc(100vh-160px)] scrollbar-hide">
          {suggestedUsers?.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);

            return (
              <div
                key={suggestedUser._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>Fn</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font font-medium">
                    {suggestedUser?.username}
                  </span>
                  <span
                    className={`text-xs ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedUser ? (
        <section className="flex-1 md:border-l border-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 bg-white z-10">
            <button 
              onClick={() => dispatch(setSelectedUser(null))}
              className="md:hidden p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} />
              <AvatarFallback>Fn</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.username}</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <Messages selectedUser={selectedUser} />
          </div>
          <div className="flex items-center p-4 border-t border-gray-300 bg-white">
            <Input
              type="text"
              value={textMessage}
              onChange={(e) => settextMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendmsg(selectedUser?._id)}
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Type a message..."
            />
            <Button 
              onClick={() => sendmsg(selectedUser?._id)}
              disabled={!textMessage.trim()}
            >
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="hidden md:flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1 className="font-medium text-xl">Your messages</h1>
          <span>Send your message</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
