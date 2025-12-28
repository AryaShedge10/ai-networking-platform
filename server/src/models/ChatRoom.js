import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
chatRoomSchema.index({ participants: 1 });
chatRoomSchema.index({ isActive: 1 });
chatRoomSchema.index({ lastMessageAt: -1 });

// Method to check if user is participant
chatRoomSchema.methods.hasParticipant = function (userId) {
  return this.participants.some(
    (participant) => participant.toString() === userId.toString()
  );
};

// Static method to find room between two users
chatRoomSchema.statics.findRoomBetweenUsers = function (userId1, userId2) {
  return this.findOne({
    participants: { $all: [userId1, userId2] },
    isActive: true,
  });
};

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

export default ChatRoom;
