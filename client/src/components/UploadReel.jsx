import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadReel = () => {
  const [caption, setCaption] = useState('');
  const [video, setVideo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const videoRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleReelUpload = async (e) => {
    e.preventDefault();

    if (!caption || !video) {
      toast.error('Caption and video are required');
      return;
    }

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('video', video);

    try {
      setUploading(true);
      setSuccess(false);

      const res = await axios.post(
        'http://localhost:7777/api/v1/reel/add',
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percent);
          },
        }
      );

      toast.success(res.data.message);
      setCaption('');
      setVideo(null);
      setPreviewUrl('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100">
      <form
        onSubmit={handleReelUpload}
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">📤 Upload New Reel</h2>

        <input
          type="text"
          placeholder="Write a cool caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="w-full text-sm"
        />

        {previewUrl && (
          <motion.video
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            ref={videoRef}
            src={previewUrl}
            controls
            className="w-full rounded-lg mt-2 max-h-72 object-cover border"
          />
        )}

        {uploading && (
          <>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.2 }}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full rounded-full shadow-md"
              />
            </div>
            <motion.p
              className="text-center text-blue-600 font-semibold animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Uploading... {progress}%
            </motion.p>
          </>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Uploading...
            </>
          ) : (
            'Upload Reel'
          )}
        </button>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-2 justify-center text-green-600 font-semibold"
            >
              <CheckCircle className="w-5 h-5" /> Upload Successful!
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default UploadReel;
