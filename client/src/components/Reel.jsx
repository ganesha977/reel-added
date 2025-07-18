import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Badge } from './ui/badge'
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Bookmark } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setReels, setSelectedReel } from "@/redux/reelSlice";
import { Link } from "react-router-dom";
import ReelCommentDialog from "./ReelCommentDialog ";

const Reel = ({ reel }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { reels } = useSelector((store) => store.reel);
  const [liked, setLiked] = useState(reel?.likes?.includes(user?._id) || false);
  const [reelLike, setReelLike] = useState(reel?.likes?.length || 0);
  const [comments, setComments] = useState(reel.comments);

  const changeHandler = (e) => {
    const input = e.target.value;
    setText(input.trim() ? input : "");
  };

  const likeOrDislikeHandler = async () => {
    const action = liked ? "dislike" : "like";
    try {
      const res = await axios.post(
        `http://localhost:7777/api/v1/reel/${action}/${reel._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setLiked(prev => !prev);
        setReelLike(prev => liked ? prev - 1 : prev + 1);
        toast.success(res.data.message);

        const updatedData = reels.map(r =>
          r._id === reel._id
            ? { ...r, likes: liked ? r.likes.filter(id => id !== user._id) : [...r.likes, user._id] }
            : r
        );
        dispatch(setReels(updatedData));
      }
    } catch (error) {
        console.error(error);
      toast.error("Something went wrong");
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:7777/api/v1/reel/comment/${reel._id}`,
        { text },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      if (res.data.success) {
        const updatedComments = [...comments, res.data.comment];
        setComments(updatedComments);

        const updatedReels = reels.map(r =>
          r._id === reel._id ? { ...r, comments: updatedComments } : r
        );
        dispatch(setReels(updatedReels));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
        console.error(error);
      toast.error("Comment failed");
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:7777/api/v1/reel/${reel._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) toast.success(res.data.message);
    } catch (error) {
      toast.error("Bookmark failed");
    }
  };

  return (
    <div className="my-8 w-full">
      <div className="flex items-center justify-between mb-3">
        <Link to={`/profile/${reel?.author?._id}`}>
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={reel?.author?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="font-semibold text-sm">{reel?.author?.username}</h1>
          </div>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent>
            <Button variant="ghost">Add to Favorites</Button>
          </DialogContent>
        </Dialog>
      </div>

      <video
        controls
        className="rounded-lg w-full aspect-video object-cover"
        src={reel?.video}
      />

      <div className="flex items-center justify-between my-3">
        <div className="flex items-center gap-4">
          {liked ? (
            <FaHeart size={24} className="text-red-500 cursor-pointer" onClick={likeOrDislikeHandler} />
          ) : (
            <FaRegHeart size={24} className="text-gray-800 cursor-pointer" onClick={likeOrDislikeHandler} />
          )}
          <MessageCircle
            size={24}
            className="cursor-pointer"
            onClick={() => {
              dispatch(setSelectedReel(reel));
              setOpen(true);
            }}
          />
          <Send size={24} className="cursor-pointer" />
        </div>
        <Bookmark
          size={24}
          onClick={bookmarkHandler}
          className="cursor-pointer"
        />
      </div>

      <div className="px-1">
        <span className="font-semibold text-sm">{reelLike} likes</span>
        <p className="text-sm mt-1">
          <span className="font-semibold mr-2">{reel?.author?.username}</span>
          {reel.caption}
        </p>
        {comments.length > 0 && (
          <span
            className="text-sm text-gray-500 mt-2 block cursor-pointer"
            onClick={() => {
              dispatch(setSelectedReel(reel));
              setOpen(true);
            }}
          >
            View all {comments.length} comments
          </span>
        )}
      </div>

      <ReelCommentDialog open={open} setOpen={setOpen} />

      <div className="flex items-center justify-between mt-3 px-1">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeHandler}
          className="outline-none text-sm w-full bg-transparent"
        />
        {text && (
          <span
            className="text-[#3BADF9] cursor-pointer font-semibold text-sm"
            onClick={commentHandler}
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Reel;
