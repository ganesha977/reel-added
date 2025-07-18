const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const usersocketMap = {}; // userId -> socket.id
 
const getReceiverSocketId=(receiverId)=>usersocketMap[receiverId]

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    usersocketMap[userId] = socket.id;
    console.log(` User connected: userId=${userId}, socketId=${socket.id}`);
  }

  // Emit online users list to all clients
  io.emit("getOnlineUsers", Object.keys(usersocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      console.log(` User disconnected: userId=${userId}, socketId=${socket.id}`);
      delete usersocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(usersocketMap));
  });
});

module.exports = { app, server, io,getReceiverSocketId };
