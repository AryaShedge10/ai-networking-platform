import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    similarityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate matches and enable fast lookups
matchSchema.index({ userA: 1, userB: 1 }, { unique: true });

// Index for finding matches for a specific user
matchSchema.index({ userA: 1, similarityScore: -1 });
matchSchema.index({ userB: 1, similarityScore: -1 });

// Static method to find matches for a user
matchSchema.statics.findUserMatches = function (userId) {
  return this.find({
    $or: [{ userA: userId }, { userB: userId }],
  })
    .populate("userA", "name reputationScore")
    .populate("userB", "name reputationScore")
    .sort({ similarityScore: -1 })
    .limit(10);
};

// Static method to upsert a match (avoid duplicates)
matchSchema.statics.upsertMatch = function (userA, userB, similarityScore) {
  // Ensure consistent ordering (smaller ID first)
  const [firstUser, secondUser] = [userA, userB].sort();

  return this.findOneAndUpdate(
    { userA: firstUser, userB: secondUser },
    { similarityScore },
    { upsert: true, new: true }
  );
};

const Match = mongoose.model("Match", matchSchema);

export default Match;
