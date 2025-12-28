import { validationResult } from "express-validator";
import {
  createChatRoom,
  getUserChatRooms,
  getChatRoom,
} from "../services/chat.service.js";
import { getRoomMessages } from "../services/message.service.js";

/**
 * @desc    Create a new chat room
 * @route   POST /api/chat/create
 * @access  Private
 */
export const createChat = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { userIds } = req.body;
    const currentUserId = req.user.id;

    // Validate userIds array
    if (!Array.isArray(userIds) || userIds.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "userIds must be an array with exactly 2 user IDs",
      });
    }

    // Ensure current user is one of the participants
    if (!userIds.includes(currentUserId)) {
      return res.status(403).json({
        success: false,
        message: "You can only create chat rooms that include yourself",
      });
    }

    // Create chat room
    const chatRoom = await createChatRoom(userIds[0], userIds[1]);

    res.status(201).json({
      success: true,
      message: "Chat room created successfully",
      data: {
        roomId: chatRoom._id,
        participants: chatRoom.participants,
        isActive: chatRoom.isActive,
        createdAt: chatRoom.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in createChat:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create chat room",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get user's chat rooms
 * @route   GET /api/chat/rooms
 * @access  Private
 */
export const getChatRooms = async (req, res) => {
  try {
    const userId = req.user.id;

    const chatRooms = await getUserChatRooms(userId);

    // Format response
    const formattedRooms = chatRooms.map((room) => ({
      roomId: room._id,
      participants: room.participants,
      lastMessage: room.lastMessage,
      lastMessageAt: room.lastMessageAt,
      isActive: room.isActive,
      createdAt: room.createdAt,
    }));

    res.status(200).json({
      success: true,
      message: "Chat rooms retrieved successfully",
      data: {
        rooms: formattedRooms,
        count: formattedRooms.length,
      },
    });
  } catch (error) {
    console.error("Error in getChatRooms:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve chat rooms",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get messages for a chat room
 * @route   GET /api/chat/:roomId/messages
 * @access  Private
 */
export const getRoomMessagesController = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;

    // First verify user has access to this room
    await getChatRoom(roomId, userId);

    // Get messages for the room
    const messages = await getRoomMessages(roomId, limit);

    // Format messages for frontend
    const formattedMessages = messages.map((message) => ({
      id: message._id,
      message: message.message,
      // FIX: Handle populated senderId correctly - extract _id for comparison
      senderId: message.senderId._id || message.senderId,
      senderName: message.senderName,
      timestamp: message.createdAt,
      // FIX: Compare using _id when senderId is populated
      isOwn: (message.senderId._id || message.senderId).toString() === userId,
    }));

    res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      data: {
        messages: formattedMessages,
        count: formattedMessages.length,
      },
    });
  } catch (error) {
    console.error("Error in getRoomMessages:", error);

    if (error.message === "Chat room not found or access denied") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to retrieve messages",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get specific chat room
 * @route   GET /api/chat/:roomId
 * @access  Private
 */
export const getChatRoomById = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { roomId } = req.params;
    const userId = req.user.id;

    const chatRoom = await getChatRoom(roomId, userId);

    res.status(200).json({
      success: true,
      message: "Chat room retrieved successfully",
      data: {
        roomId: chatRoom._id,
        participants: chatRoom.participants,
        lastMessage: chatRoom.lastMessage,
        lastMessageAt: chatRoom.lastMessageAt,
        isActive: chatRoom.isActive,
        createdAt: chatRoom.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in getChatRoomById:", error);

    if (error.message === "Chat room not found or access denied") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to retrieve chat room",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
