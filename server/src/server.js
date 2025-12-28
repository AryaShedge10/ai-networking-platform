import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { updateLastMessage } from "./services/chat.service.js";
import { saveMessage } from "./services/message.service.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a chat room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`✅ User ${socket.id} successfully joined room ${roomId}`);

    // Confirm room joining to client
    socket.emit("room-joined", { roomId, socketId: socket.id });
  });

  // Handle sending messages
  socket.on("send-message", async (data) => {
    try {
      const { roomId, message, senderId, senderName } = data;

      // FIX: Save message to database for persistence
      const savedMessage = await saveMessage({
        roomId,
        senderId,
        senderName,
        message,
      });

      // FIX: Broadcast message to ALL users in the room (including sender)
      // Using io.to() instead of socket.to() to include sender
      io.to(roomId).emit("receive-message", {
        message,
        senderId,
        senderName,
        timestamp: savedMessage.createdAt,
      });

      // Update last message in chat room
      await updateLastMessage(roomId, message);

      console.log(
        `💾 Message saved and broadcasted to room ${roomId}: ${message.substring(
          0,
          50
        )}...`
      );
    } catch (error) {
      console.error("Error handling message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Handle leaving room
  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Connect to database
connectDB();

// Start server
server.listen(PORT, () => {
  console.log(`ConnectAI Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Socket.io enabled for real-time chat`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error("Unhandled Promise Rejection:", err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  console.error(err.stack);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
  });
});
