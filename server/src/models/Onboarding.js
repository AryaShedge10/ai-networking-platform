import mongoose from "mongoose";

const onboardingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Quiz answers - storing the selected option index for each question
    quizAnswers: {
      type: Map,
      of: Number, // Stores the selected option index (0, 1, 2, or 3) for each question ID
      required: true,
    },
    // Derived categories from quiz answers for AI matching
    social_usage: {
      type: String,
      enum: ["casual_chat", "learning", "making_friends", "all_purposes"],
    },
    topic_interest: {
      type: String,
      enum: ["technology", "entertainment", "business", "personal_growth"],
    },
    conversation_style: {
      type: String,
      enum: ["short_fun", "deep_meaningful", "qa_style", "mixed"],
    },
    activity_time: {
      type: String,
      enum: ["late_night", "morning", "evening", "anytime"],
    },
    personality_type: {
      type: String,
      enum: [
        "quiet_thoughtful",
        "talkative_energetic",
        "curious_learner",
        "leader_motivator",
      ],
    },
    social_comfort: {
      type: String,
      enum: [
        "very_comfortable",
        "somewhat_comfortable",
        "takes_time",
        "similar_interests_only",
      ],
    },
    matching_preference: {
      type: String,
      enum: ["same_background", "same_interests", "same_goals", "any_positive"],
    },
    free_time_activity: {
      type: String,
      enum: ["learning", "socializing", "outdoor", "creative"],
    },
    conversation_dislikes: {
      type: String,
      enum: [
        "one_word_replies",
        "no_clear_topic",
        "rude_behavior",
        "all_above",
      ],
    },
    app_expectations: {
      type: String,
      enum: ["learn_new", "meet_likeminded", "healthy_community", "everything"],
    },
    // For future AI matching - vector embeddings
    embedding: [
      {
        type: Number,
      },
    ],
    // Completion status
    isCompleted: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
onboardingSchema.index({ userId: 1 });
onboardingSchema.index({ social_usage: 1 });
onboardingSchema.index({ topic_interest: 1 });
onboardingSchema.index({ conversation_style: 1 });
onboardingSchema.index({ personality_type: 1 });

// Static method to get quiz questions
onboardingSchema.statics.getQuizQuestions = function () {
  return [
    {
      id: 1,
      question: "What do you mostly use social apps for?",
      options: [
        "Casual chatting",
        "Learning & discussions",
        "Making new friends",
        "All of the above",
      ],
    },
    {
      id: 2,
      question: "Which topic excites you the most?",
      options: [
        "Technology & AI",
        "Movies & Entertainment",
        "Business & Startups",
        "Personal growth & mindset",
      ],
    },
    {
      id: 3,
      question: "How do you prefer conversations?",
      options: [
        "Short & fun",
        "Deep & meaningful",
        "Question–answer style",
        "Mixed — depends on mood",
      ],
    },
    {
      id: 4,
      question: "When do you feel most active on social or study apps?",
      options: ["Late night", "Morning", "Evening", "Anytime, depends on mood"],
    },
    {
      id: 5,
      question: "Which best describes your personality?",
      options: [
        "Quiet but thoughtful",
        "Talkative & energetic",
        "Curious learner",
        "Leader & motivator",
      ],
    },
    {
      id: 6,
      question: "How comfortable are you talking to new people?",
      options: [
        "Very comfortable",
        "Somewhat comfortable",
        "Takes time",
        "Only with similar interests",
      ],
    },
    {
      id: 7,
      question: "What type of people would you like to match with?",
      options: [
        "Same academic background",
        "Same interests",
        "Same goals",
        "Any positive person",
      ],
    },
    {
      id: 8,
      question: "How do you prefer to spend your free time?",
      options: [
        "Reading books or learning new skills",
        "Socializing with friends and family",
        "Outdoor activities and sports",
        "Creative projects and hobbies",
      ],
    },
    {
      id: 9,
      question: "What makes a conversation boring for you?",
      options: [
        "One-word replies",
        "No clear topic",
        "Rude behavior",
        "All of the above",
      ],
    },
    {
      id: 10,
      question: "What do you expect from this app?",
      options: [
        "Learn something new",
        "Meet like-minded people",
        "Healthy & respectful community",
        "Everything",
      ],
    },
  ];
};

// Method to derive category values from quiz answers
onboardingSchema.methods.deriveCategoriesFromAnswers = function () {
  const answerMap = {
    1: ["casual_chat", "learning", "making_friends", "all_purposes"],
    2: ["technology", "entertainment", "business", "personal_growth"],
    3: ["short_fun", "deep_meaningful", "qa_style", "mixed"],
    4: ["late_night", "morning", "evening", "anytime"],
    5: [
      "quiet_thoughtful",
      "talkative_energetic",
      "curious_learner",
      "leader_motivator",
    ],
    6: [
      "very_comfortable",
      "somewhat_comfortable",
      "takes_time",
      "similar_interests_only",
    ],
    7: ["same_background", "same_interests", "same_goals", "any_positive"],
    8: ["learning", "socializing", "outdoor", "creative"],
    9: ["one_word_replies", "no_clear_topic", "rude_behavior", "all_above"],
    10: ["learn_new", "meet_likeminded", "healthy_community", "everything"],
  };

  const categoryFields = [
    "social_usage",
    "topic_interest",
    "conversation_style",
    "activity_time",
    "personality_type",
    "social_comfort",
    "matching_preference",
    "free_time_activity",
    "conversation_dislikes",
    "app_expectations",
  ];

  // Derive category values from quiz answers
  for (const [questionId, answerIndex] of this.quizAnswers) {
    const qId = parseInt(questionId);
    const fieldIndex = qId - 1; // Convert to 0-based index

    if (
      answerMap[qId] &&
      answerIndex >= 0 &&
      answerIndex < answerMap[qId].length &&
      categoryFields[fieldIndex]
    ) {
      this[categoryFields[fieldIndex]] = answerMap[qId][answerIndex];
    }
  }
};

const Onboarding = mongoose.model("Onboarding", onboardingSchema);

export default Onboarding;
