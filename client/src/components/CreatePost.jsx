import React, { useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  // -----------------------
  // File change handler
  // -----------------------
  const filechangehandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  // -----------------------
  // Create post handler (online/offline)
  // -----------------------
  const CreatePostHandler = async () => {
    if (!file) {
      toast.error("Please select an image first");
      return;
    }

    setLoading(true);
    const formdata = new FormData();
    formdata.append("caption", caption);
    formdata.append("image", file);

    if (navigator.onLine) {
      // Online: send to backend
      try {
        const res = await axios.post(
          "http://localhost:7777/api/v1/post/addpost",
          formdata,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setPosts([res.data.post, ...posts]));
          toast.success(res.data.message);
          setOpen(false);
          setFile("");
          setImagePreview(null);
          setCaption("");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Post failed");
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      // Offline: save in localStorage
      const offlinePosts = JSON.parse(localStorage.getItem("offlinePosts")) || [];
      offlinePosts.push({
        id: Date.now(),
        caption,
        image: imagePreview, // store base64
      });
      localStorage.setItem("offlinePosts", JSON.stringify(offlinePosts));

      toast.success(
        "You are offline. Post saved locally and will be uploaded when online."
      );
      setOpen(false);
      setFile("");
      setImagePreview(null);
      setCaption("");
      setLoading(false);
    }
  };

  // -----------------------
  // Sync offline posts when online
  // -----------------------
  useEffect(() => {
    const syncOfflinePosts = async () => {
      const offlinePosts = JSON.parse(localStorage.getItem("offlinePosts")) || [];
      if (offlinePosts.length === 0) return;

      for (const post of offlinePosts) {
        try {
          // convert base64 to Blob
          const blob = await fetch(post.image).then((res) => res.blob());
          const formData = new FormData();
          formData.append("caption", post.caption);
          formData.append("image", blob, "offline-post.jpg");

          const res = await axios.post(
            "http://localhost:7777/api/v1/post/addpost",
            formData,
            { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
          );

          if (res.data.success) {
            dispatch(setPosts([res.data.post, ...posts]));
          }
        } catch (error) {
          console.error("Failed to sync offline post", error);
        }
      }

      localStorage.removeItem("offlinePosts");
    };

    window.addEventListener("online", syncOfflinePosts);
    return () => window.removeEventListener("online", syncOfflinePosts);
  }, [dispatch, posts]);

  // -----------------------
  // RETURN STATEMENT (unchanged)
  // -----------------------
  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-h-[90vh] overflow-y-auto sm:max-w-md rounded-lg"
      >
        <DialogHeader className="text-center font-semibold">
          Create a new post
        </DialogHeader>

        {/* User Info */}
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>
              {user?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <span className="text-gray-600 text-xs">bio here ....</span>
          </div>
        </div>

        {/* Caption (optional) */}
        <Textarea
          className="focus-visible:ring-transparent border-none"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption (optional, AI will auto-generate if empty)"
        />

        {/* Preview */}
        {imagePreview && (
          <div className="flex justify-center items-center w-full">
            <img
              className="object-cover w-full h-64 rounded-md"
              src={imagePreview}
              alt="post-image"
            />
          </div>
        )}

        {/* File input */}
        <input
          type="file"
          ref={imageRef}
          className="hidden"
          onChange={filechangehandler}
        />

        <Button
          className="w-fit mx-auto bg-[#258bcf] hover:bg-[#0095F6]"
          onClick={() => imageRef.current.click()}
        >
          select from your computer
        </Button>

        {/* Post button */}
        {imagePreview &&
          (loading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button className="w-full" onClick={CreatePostHandler}>
              post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
