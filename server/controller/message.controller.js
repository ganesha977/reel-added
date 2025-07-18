const Conversation = require("../model/conversation.model");
const Message = require("../model/message.model");
const User = require("../model/user.model");
const { getReceiverSocketId, io } = require("../Socket");
const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { textMessage: message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message
    });

    conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);

      const senderUser = await User.findById(senderId).select("username profilePicture");

      // 🆕 Send message notification separately on "message" event (not "notification")
      io.to(receiverSocketId).emit("message", {
        userId: senderId,
        userDetails: senderUser,
        message: message
      });
    }

    return res.status(201).json({
      success: true,
      newMessage
    });

  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({ success: true, messages: [] });
    }

    return res.status(200).json({ success: true, messages: conversation.messages });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendMessage,
  getMessage
};
