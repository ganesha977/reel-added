import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearLikeNotifications
} from '@/redux/rtnSlice';
import {
  clearMessageNotifications,
  removeMessageNotification
} from '@/redux/messageNotificationSlice';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPage = () => {
  const dispatch = useDispatch();

  const { likeNotification } = useSelector((state) => state.realTimeNotification);
  const { messageNotification } = useSelector((state) => state.messageNotification);

  const [localLikes, setLocalLikes] = useState([]);
  const [localMessages, setLocalMessages] = useState([]);

  useEffect(() => {
    setLocalLikes(likeNotification || []);
    setLocalMessages(messageNotification || []);
  }, [likeNotification, messageNotification]);

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

  return (
    <div className="ml-[16%] p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-2">Notifications</h2>
      <p className="text-gray-600 mb-6 text-sm">Stay updated with your activity</p>

      {/* Like Notifications */}
      {(localLikes?.length || 0) > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Likes</h3>
          {localLikes.map((notification) => (
            <div
              key={`like-${notification.userId}`}
              className="bg-white border rounded-xl shadow-sm p-4 flex items-center gap-4 mb-4 hover:shadow-md transition cursor-pointer"
              onClick={() => handleLikeClick(notification.userId)}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={notification?.userDetails?.profilePicture} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">
                  <span className="font-bold">{notification.userDetails?.username}</span>{' '}
                  liked your post
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notification.createdAt || new Date()), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Message Notifications */}
      {(localMessages?.length || 0) > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Messages</h3>
          {localMessages.map((notification) => (
            <div
              key={`msg-${notification.userId}`}
              className="bg-white border rounded-xl shadow-sm p-4 flex items-center gap-4 mb-4 hover:shadow-md transition cursor-pointer"
              onClick={() => handleMessageClick(notification.userId)}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={notification.userDetails?.profilePicture} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">
                  <span className="font-bold">{notification.userDetails?.username}</span>{' '}
                  sent you a message
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notification.createdAt || new Date()), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </>
      )}

      {(localLikes?.length || 0) === 0 && (localMessages?.length || 0) === 0 && (
        <p className="text-sm text-gray-500">No new notifications.</p>
      )}
    </div>
  );
};

export default NotificationsPage;
