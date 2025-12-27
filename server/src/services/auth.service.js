import User from "../models/User.js";
import Onboarding from "../models/Onboarding.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../config/jwt.js";

/**
 * Register a new user with onboarding data
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} User data and token
 */
export const registerUser = async (userData) => {
  const { name, username, email, password, onboardingAnswers } = userData;

  // Check if user already exists with email
  const existingUserByEmail = await User.findOne({ email });
  if (existingUserByEmail) {
    throw new Error("User already exists with this email");
  }

  // Check if username is already taken
  const existingUserByUsername = await User.findOne({ username });
  if (existingUserByUsername) {
    throw new Error("Username is already taken");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = new User({
    name,
    username,
    email,
    password: hashedPassword,
  });

  await user.save();

  // Create onboarding data with quiz answers
  const onboardingData = {
    userId: user._id,
    quizAnswers: new Map(Object.entries(onboardingAnswers)),
  };

  const onboarding = new Onboarding(onboardingData);

  // Derive category values from quiz answers
  onboarding.deriveCategoriesFromAnswers();
  await onboarding.save();

  // Mark profile as completed
  user.profileCompleted = true;
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  // Return user data without password
  const userResponse = user.toJSON();

  return {
    user: userResponse,
    token,
    onboarding: onboarding.toJSON(),
  };
};

/**
 * Login user with email and password
 * @param {Object} loginData - Login credentials
 * @returns {Promise<Object>} User data and token
 */
export const loginUser = async (loginData) => {
  const { email, password } = loginData;

  // Find user by email
  const user = await User.findOne({ email }).populate("onboarding");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check if account is active
  if (!user.isActive) {
    throw new Error("Account is deactivated");
  }

  if (user.isBanned) {
    throw new Error("Account is banned");
  }

  // Compare password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  // Return user data without password
  const userResponse = user.toJSON();

  return {
    user: userResponse,
    token,
  };
};

/**
 * Get user profile with onboarding data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).populate("onboarding");

  if (!user) {
    throw new Error("User not found");
  }

  return user.toJSON();
};
