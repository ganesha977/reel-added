import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearLikeNotifications } from "@/redux/rtnSlice";
import {
  clearMessageNotifications,
  removeMessageNotification,
} from "@/redux/messageNotificationSlice";
import {
  clearCommentNotifications,
  removeCommentNotification,
} from "@/redux/commentSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

const NotificationsPage = () => {
  const dispatch = useDispatch();

  const { likeNotification } = useSelector(
    (state) => state.realTimeNotification
  );
  const { messageNotification } = useSelector(
    (state) => state.messageNotification
  );
  const { commentNotifications } = useSelector(
    (state) => state.commentNotification
  );

  const [localLikes, setLocalLikes] = useState([]);
  const [localMessages, setLocalMessages] = useState([]);
  const [localComments, setLocalComments] = useState([]);

  useEffect(() => {
    setLocalLikes(likeNotification || []);
    setLocalMessages(messageNotification || []);
    setLocalComments(commentNotifications || []);
  }, [likeNotification, messageNotification, commentNotifications]);

  useEffect(() => {
    dispatch(clearMessageNotifications());
  }, [dispatch]);

  const handleLikeClick = (userId) => {
    const updated = localLikes.filter((n) => n.userId !== userId);
    setLocalLikes(updated);
    dispatch(clearLikeNotifications());
  };

  const handleMessageClick = (userId) => {
    const updated = localMessages.filter((n) => n.userId !== userId);
    setLocalMessages(updated);
    dispatch(removeMessageNotification(userId));
  };

 const handleCommentClick = (commentId) => {
  const updated = localComments.filter((n) => n.id !== commentId);
  setLocalComments(updated);
  dispatch(removeCommentNotification(commentId)); // passing commentId
};


  const handleClearAllComments = () => {
    setLocalComments([]);
    dispatch(clearCommentNotifications());
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 ml-7 sm:px-6 md:px-8 lg:pl-72 lg:pr-16">
      <h2 className="text-3xl font-bold mb-2 text-gray-900">Notifications</h2>
      <p className="text-gray-600 mb-6 text-sm">
        Stay updated with your activity
      </p>

      {/* Likes Section */}
      {(localLikes?.length || 0) > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
            Likes
          </h3>
          {localLikes.map((notification) => (
            <div
              key={`like-${notification.userId}`}
              className="bg-white border rounded-xl shadow-sm p-4 ml-7 flex items-center gap-4 mb-4 hover:shadow-md transition cursor-pointer"
              onClick={() => handleLikeClick(notification.userId)}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={notification?.userDetails?.profilePicture}
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">
                    {notification.userDetails?.username}
                  </span>{" "}
                  liked your post
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(
                    new Date(notification.createdAt || new Date()),
                    { addSuffix: true }
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comments Section */}
      {(localComments?.length || 0) > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Comments
            </h3>
            <button
              className="text-sm text-red-500 hover:underline"
              onClick={handleClearAllComments}
            >
              Clear All
            </button>
          </div>
          {localComments.map((notification) => (
            <div
              key={`comment-${notification.id}`} // ✅ Unique id for each comment
              className="bg-white border rounded-xl shadow-sm p-4 flex items-center gap-4 mb-4 hover:shadow-md transition cursor-pointer"
              onClick={() => handleCommentClick(notification.id)}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={notification?.userDetails?.profilePicture}
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">
                    {notification.userDetails?.username}
                  </span>{" "}
                  commented: "{notification?.message}"
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(
                    new Date(notification.createdAt || new Date()),
                    { addSuffix: true }
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Messages Section */}
      {(localMessages?.length || 0) > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
            Messages
          </h3>
          {localMessages.map((notification) => (
            <div
              key={`msg-${notification.userId}`}
              className="bg-white border rounded-xl shadow-sm p-4 flex items-center gap-4 mb-4 hover:shadow-md transition cursor-pointer"
              onClick={() => handleMessageClick(notification.userId)}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={notification.userDetails?.profilePicture}
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">
                    {notification.userDetails?.username}
                  </span>{" "}
                  sent you a message
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(
                    new Date(notification.createdAt || new Date()),
                    { addSuffix: true }
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {(localLikes?.length || 0) === 0 &&
        (localMessages?.length || 0) === 0 &&
        (localComments?.length || 0) === 0 && (
          <p className="text-sm text-gray-500 mt-10">
            No new notifications.
          </p>
        )}
    </div>
  );
};

export default NotificationsPage;
