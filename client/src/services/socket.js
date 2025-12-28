import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    // FIX: Only create new connection if none exists or is disconnected
    if (this.socket && this.isConnected) {
      console.log("🔄 Reusing existing socket connection:", this.socket.id);
      return this.socket;
    }

    console.log("🆕 Creating new socket connection...");
    this.socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      timeout: 20000,
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket.id);
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinRoom(roomId) {
    if (this.socket) {
      if (this.isConnected) {
        this.socket.emit("join-room", roomId);
        console.log(`🏠 Joined room: ${roomId}`);
      } else {
        console.log(`⏳ Waiting for connection to join room: ${roomId}`);
        // Wait for connection then join
        this.socket.once("connect", () => {
          this.socket.emit("join-room", roomId);
          console.log(`🏠 Joined room after connection: ${roomId}`);
        });
      }
    } else {
      console.warn("⚠️ Cannot join room - no socket instance");
    }
  }

  leaveRoom(roomId) {
    if (this.socket && this.isConnected) {
      this.socket.emit("leave-room", roomId);
      console.log(`🚪 Left room: ${roomId}`);
    }
  }

  sendMessage(roomId, message, senderId, senderName) {
    if (this.socket && this.isConnected) {
      console.log(`📤 Sending message to room ${roomId}:`, message);
      this.socket.emit("send-message", {
        roomId,
        message,
        senderId,
        senderName,
      });
    } else {
      console.warn("⚠️ Cannot send message - socket not connected");
    }
  }

  onReceiveMessage(callback) {
    if (this.socket) {
      this.socket.on("receive-message", callback);
    }
  }

  offReceiveMessage() {
    if (this.socket) {
      this.socket.off("receive-message");
    }
  }

  onError(callback) {
    if (this.socket) {
      this.socket.on("error", callback);
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
