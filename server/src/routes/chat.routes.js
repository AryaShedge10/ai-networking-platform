import express from "express";
import { body, param } from "express-validator";
import {
  createChat,
  getChatRooms,
  getChatRoomById,
  getRoomMessagesController,
} from "../controllers/chat.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Validation rules for creating chat
const createChatValidation = [
  body("userIds")
    .isArray({ min: 2, max: 2 })
    .withMessage("userIds must be an array with exactly 2 user IDs"),

  body("userIds.*")
    .isMongoId()
    .withMessage("Each user ID must be a valid MongoDB ObjectId"),
];

// Validation for room ID parameter
const roomIdValidation = [
  param("roomId").isMongoId().withMessage("Invalid room ID format"),
];

/**
 * @route   POST /api/chat/create
 * @desc    Create a new chat room between two users
 * @access  Private
 */
router.post("/create", authenticateToken, createChatValidation, createChat);

/**
 * @route   GET /api/chat/rooms
 * @desc    Get current user's chat rooms
 * @access  Private
 */
router.get("/rooms", authenticateToken, getChatRooms);

/**
 * @route   GET /api/chat/:roomId/messages
 * @desc    Get messages for a specific chat room
 * @access  Private
 */
router.get(
  "/:roomId/messages",
  authenticateToken,
  roomIdValidation,
  getRoomMessagesController
);

/**
 * @route   GET /api/chat/:roomId
 * @desc    Get specific chat room by ID
 * @access  Private
 */
router.get("/:roomId", authenticateToken, roomIdValidation, getChatRoomById);

export default router;
