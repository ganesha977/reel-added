import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MessageCircle, MoreHorizontal, Send, Bookmark } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDailogue from "./CommentDailogue";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [postlike, setPostlike] = useState(post?.likes?.length || 0);
  const [comment, setComment] = useState(post.comments);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(post?.author?.followers?.includes(user?._id));
  }, [post, user]);

  const changechangehandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const handleFollowOrUnfollow = async () => {
    try {
      const res = await axios.post(
        `http://localhost:7777/api/v1/user/followorunfollow/${post?.author?._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsFollowing((prev) => !prev);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Follow/Unfollow Error:", error);
    }
  };

  const deletePostHandeler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:7777/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter((p) => p._id !== post._id);
        dispatch(setPosts(updatedPostData));
        dispatch(setSelectedPost(null));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("error deleting post", error);
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  const likeordislikeHandler = async () => {
    if (!post || !post._id) {
      toast.error("Post not found or already deleted");
      return;
    }

    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.post(
        `http://localhost:7777/api/v1/post/${post._id}/${action}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setPostlike((prev) => (liked ? prev - 1 : prev + 1));
        setLiked((prev) => !prev);
        toast.success(res.data.message);

        const updatedPostData = posts.map((p) => {
          if (p._id === post._id) {
            return {
              ...p,
              likes: liked
                ? p.likes.filter((id) => id !== user._id)
                : [...p.likes, user._id],
            };
          }
          return p;
        });

        dispatch(setPosts(updatedPostData));
      }
    } catch (error) {
      console.log("error liking post", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:7777/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const bookmarkhandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:7777/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="mb-6 w-full max-w-[470px] mx-auto lg:mx-0">
      <div className="flex items-center justify-between mb-3">
        <Link to={`/profile/${post?.author?._id}`} className="font-medium mr-2 hover:ring-transparent px-3 lg:px-0">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={post?.author?.profilePicture} alt="post-image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-sm">{post?.author?.username}</h1>
              {user?._id === post?.author?._id && (
                <Badge variant='secondary' className="text-xs">Author</Badge>
              )}
            </div>
          </div>
        </Link>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer mr-3 lg:mr-0" />
          </DialogTrigger>
          <DialogContent className="bg-white text-black flex flex-col items-center text-sm text-center">
            {user && user._id !== post?.author?._id && (
              <Button
                onClick={handleFollowOrUnfollow}
                variant="ghost"
                className={`cursor-pointer w-fit font-bold border ${
                  isFollowing
                    ? "text-[#ED4956] hover:bg-[#fce6e9]"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}

            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-black font-medium hover:bg-gray-100"
            >
              Add to favorites
            </Button>

            {user && user._id === post?.author?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-black font-semibold bg-gray-100 hover:bg-gray-200"
                onClick={deletePostHandeler}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <img
        className="w-full aspect-square object-cover border border-gray-200 lg:rounded-lg bg-black"
        src={post.image}
        alt="post_img"
      />

      <div className="flex items-center justify-between my-3 px-3 lg:px-0">
        <div className="flex items-center gap-4">
          {liked ? (
            <FaHeart
              size={24}
              className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
              onClick={likeordislikeHandler}
            />
          ) : (
            <FaRegHeart
              size={24}
              className="text-gray-800 cursor-pointer hover:scale-110 transition-transform"
              onClick={likeordislikeHandler}
            />
          )}

          <MessageCircle
            size={24}
            className="cursor-pointer hover:text-gray-600 hover:scale-110 transition-transform"
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
          />

          <Send
            size={24}
            className="cursor-pointer hover:text-gray-600 hover:scale-110 transition-transform"
          />
        </div>
        <Bookmark
          size={24}
          onClick={bookmarkhandler}
          className="cursor-pointer hover:text-gray-600 hover:scale-110 transition-transform"
        />
      </div>

      <div className="px-3 lg:px-0">
        <span className="font-semibold text-sm">{postlike} likes</span>
        <p className="text-sm mt-1">
          <span className="font-semibold mr-2">{post?.author?.username}</span>
          {post.caption}
        </p>
        {comment.length > 0 && (
          <span
            className="cursor-pointer text-sm text-gray-500 mt-2 block"
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
          >
            View all {comment.length} comments
          </span>
        )}
      </div>

      <CommentDailogue open={open} setOpen={setOpen} />

      <div className="flex items-center justify-between mt-3 px-3 lg:px-0">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changechangehandler}
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

export default Post;
