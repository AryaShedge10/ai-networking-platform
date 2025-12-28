import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
      index: true, // Index for faster queries
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for efficient message retrieval by room and time
messageSchema.index({ roomId: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
