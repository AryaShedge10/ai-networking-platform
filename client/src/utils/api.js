// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Make API request with proper error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} API response
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Add auth token if available
  const token = localStorage.getItem("token");
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

/**
 * Authentication API calls
 */
export const authAPI = {
  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  getProfile: () => apiRequest("/auth/profile"),
};

/**
 * User API calls
 */
export const userAPI = {
  getQuizQuestions: () => apiRequest("/users/quiz/questions"),

  getOnboarding: () => apiRequest("/users/onboarding"),

  updateOnboarding: (data) =>
    apiRequest("/users/onboarding", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getSimilarUsers: (limit = 10, category = "interests") =>
    apiRequest(`/users/similar?limit=${limit}&category=${category}`),
};
