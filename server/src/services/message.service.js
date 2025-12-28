import Message from "../models/Message.js";

/**
 * Save a message to the database
 * @param {Object} messageData - Message data
 * @returns {Promise<Object>} Saved message
 */
export const saveMessage = async (messageData) => {
  const { roomId, senderId, senderName, message } = messageData;

  const newMessage = new Message({
    roomId,
    senderId,
    senderName,
    message,
  });

  const savedMessage = await newMessage.save();
  return savedMessage.toJSON();
};

/**
 * Get messages for a chat room
 * @param {string} roomId - Chat room ID
 * @param {number} limit - Number of messages to retrieve (default: 50)
 * @returns {Promise<Array>} Array of messages
 */
export const getRoomMessages = async (roomId, limit = 50) => {
  const messages = await Message.find({ roomId })
    .sort({ createdAt: -1 }) // Latest first
    .limit(limit)
    .populate("senderId", "name")
    .lean();

  // Reverse to show oldest first in chat
  return messages.reverse();
};
