import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import MainLayout from './components/MainLayout'; // removed double slash
import Signup from './components/Signup';
import Home from './components/Home';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import ChatPage from './components/ChatPage';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice';
import { setLikeNotification } from './redux/rtnSlice';
import { setMessageNotification } from './redux/messageNotificationSlice';
import ProtectedRoutes from './components/ProtectedRoutes';
import NotificationsPage from './components/NotificationsPage';
import Stories from './components/Stories';
import ReelsPage from './components/ReelsPage';
import Reel from './components/Reel';
import Reels from './components/Reels';
import UploadReel from './components/UploadReel';

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: '/',
        element: <ProtectedRoutes><Home /></ProtectedRoutes>
      },
      {
        path: '/profile/:id',
        element: <ProtectedRoutes> <Profile /></ProtectedRoutes>
      },
      {
        path: '/account/edit',
        element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
      },
      {
        path: '/chat',
        element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>
      },
       {
        path: '/notifications',
        element: <ProtectedRoutes><NotificationsPage /></ProtectedRoutes>
      },
      {
        path: '/stories',
        element: <ProtectedRoutes><Stories /></ProtectedRoutes>
      },
      {
        path: '/reels',
        element: <ProtectedRoutes><Reels /></ProtectedRoutes>
      },
      {
        path: '/reelspage',
        element: <ProtectedRoutes><ReelsPage/></ProtectedRoutes>
      },
       {
        path: '/ureel',
        element: <ProtectedRoutes><UploadReel/></ProtectedRoutes>
      },
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
])


function App() {
  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio); // important to handle else part
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:7777', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });

      dispatch(setSocket(socketio));

      // listening all the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification',(notification)=>{
        dispatch(setLikeNotification(notification));

      })

   socketio.on("message", (message) => {
  dispatch(setMessageNotification(message));
});


      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      // clean up existing socket if user logs out
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
