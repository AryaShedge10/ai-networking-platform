import ChatRoom from "../models/ChatRoom.js";
import User from "../models/User.js";

/**
 * Create a new chat room between two users
 * @param {string} userId1 - First user ID
 * @param {string} userId2 - Second user ID
 * @returns {Object} - Created chat room
 */
export async function createChatRoom(userId1, userId2) {
  try {
    // Check if both users exist
    const users = await User.find({
      _id: { $in: [userId1, userId2] },
      isActive: true,
      isBanned: false,
    });

    if (users.length !== 2) {
      throw new Error("One or both users not found or inactive");
    }

    // Check if room already exists
    const existingRoom = await ChatRoom.findRoomBetweenUsers(userId1, userId2);
    if (existingRoom) {
      return existingRoom;
    }

    // Create new room
    const chatRoom = new ChatRoom({
      participants: [userId1, userId2],
      isActive: true,
    });

    await chatRoom.save();
    await chatRoom.populate("participants", "name");

    return chatRoom;
  } catch (error) {
    console.error("Error creating chat room:", error);
    throw error;
  }
}

/**
 * Get user's chat rooms
 * @param {string} userId - User ID
 * @returns {Array} - Array of chat rooms
 */
export async function getUserChatRooms(userId) {
  try {
    const chatRooms = await ChatRoom.find({
      participants: userId,
      isActive: true,
    })
      .populate("participants", "name")
      .sort({ lastMessageAt: -1 });

    return chatRooms;
  } catch (error) {
    console.error("Error getting user chat rooms:", error);
    throw error;
  }
}

/**
 * Get specific chat room by ID
 * @param {string} roomId - Chat room ID
 * @param {string} userId - User ID (to verify access)
 * @returns {Object} - Chat room
 */
export async function getChatRoom(roomId, userId) {
  try {
    const chatRoom = await ChatRoom.findOne({
      _id: roomId,
      participants: userId,
      isActive: true,
    }).populate("participants", "name");

    if (!chatRoom) {
      throw new Error("Chat room not found or access denied");
    }

    return chatRoom;
  } catch (error) {
    console.error("Error getting chat room:", error);
    throw error;
  }
}

/**
 * Update last message in chat room
 * @param {string} roomId - Chat room ID
 * @param {string} message - Last message content
 * @returns {Object} - Updated chat room
 */
export async function updateLastMessage(roomId, message) {
  try {
    const chatRoom = await ChatRoom.findByIdAndUpdate(
      roomId,
      {
        lastMessage: message.substring(0, 100), // Limit to 100 chars
        lastMessageAt: new Date(),
      },
      { new: true }
    );

    return chatRoom;
  } catch (error) {
    console.error("Error updating last message:", error);
    throw error;
  }
}
