const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Create headers with auth token
const createHeaders = (includeAuth = true) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: createHeaders(options.includeAuth !== false),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (credentials) =>
    apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      includeAuth: false,
    }),

  register: (userData) =>
    apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
      includeAuth: false,
    }),

  getProfile: () => apiRequest("/api/auth/profile"),
};

// Matching API
export const matchingAPI = {
  getUserMatches: (userId) => apiRequest(`/api/matching/${userId}`),
};

// Chat API
export const chatAPI = {
  createChatRoom: (userIds) =>
    apiRequest("/api/chat/create", {
      method: "POST",
      body: JSON.stringify({ userIds }),
    }),

  getChatRooms: () => apiRequest("/api/chat/rooms"),

  getChatRoom: (roomId) => apiRequest(`/api/chat/${roomId}`),

  // FIX: Add endpoint to get messages for a room
  getRoomMessages: (roomId, limit = 50) =>
    apiRequest(`/api/chat/${roomId}/messages?limit=${limit}`),
};

// Users API
export const usersAPI = {
  getQuizQuestions: () =>
    apiRequest("/api/users/quiz/questions", { includeAuth: false }),
};
