import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import Heading from "../components/common/Heading";
import { usersAPI } from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);

  // Basic registration data
  const [basicData, setBasicData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Quiz answers - storing question ID as key and selected option (A, B, C, D) as value
  const [quizAnswers, setQuizAnswers] = useState({});

  // Load quiz questions on component mount
  useEffect(() => {
    const loadQuizQuestions = async () => {
      try {
        const response = await usersAPI.getQuizQuestions();
        if (response.success) {
          setQuizQuestions(response.data.questions);
        }
      } catch (err) {
        console.error("Failed to load quiz questions:", err);
        setError("Failed to load quiz questions. Please refresh the page.");
      }
    };

    loadQuizQuestions();
  }, []);

  const handleBasicDataChange = (e) => {
    setBasicData({
      ...basicData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleQuizAnswerChange = (questionId, selectedIndex) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: selectedIndex,
    });
  };

  const validateStep1 = () => {
    if (
      !basicData.name ||
      !basicData.username ||
      !basicData.email ||
      !basicData.password ||
      !basicData.confirmPassword
    ) {
      setError("Please fill in all fields");
      return false;
    }
    if (basicData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    if (basicData.username.length > 20) {
      setError("Username cannot exceed 20 characters");
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(basicData.username)) {
      setError("Username can only contain letters, numbers, and underscores");
      return false;
    }
    if (basicData.password !== basicData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (basicData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    // Check if all 10 questions are answered
    const answeredQuestions = Object.keys(quizAnswers).length;
    if (answeredQuestions < 10) {
      setError(
        `Please answer all questions (${answeredQuestions}/10 completed)`
      );
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError("");
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    setError("");

    try {
      await register({
        name: basicData.name,
        username: basicData.username,
        email: basicData.email,
        password: basicData.password,
        onboardingAnswers: quizAnswers,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message || "Network error. Please check if the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <Container className="relative z-10 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                ConnectAI
              </h1>
            </Link>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                1
              </div>
              <div
                className={`w-16 h-1 ${
                  currentStep >= 2 ? "bg-indigo-600" : "bg-slate-700"
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                2
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-slate-400">
              <span>Basic Info</span>
              <span>Personality Quiz</span>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
            {currentStep === 1 ? (
              // Step 1: Basic Information
              <>
                <div className="text-center mb-6">
                  <Heading level={2} className="mb-2">
                    Create Your Account
                  </Heading>
                  <p className="text-slate-400">Let's start with the basics</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                <form className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={basicData.name}
                      onChange={handleBasicDataChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={basicData.username}
                      onChange={handleBasicDataChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Choose a unique username (3-20 characters)"
                      pattern="[a-zA-Z0-9_]+"
                      minLength="3"
                      maxLength="20"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Only letters, numbers, and underscores allowed
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={basicData.email}
                      onChange={handleBasicDataChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={basicData.password}
                      onChange={handleBasicDataChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Create a password (min 6 characters)"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={basicData.confirmPassword}
                      onChange={handleBasicDataChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Confirm your password"
                    />
                  </div>

                  <Button
                    type="button"
                    size="lg"
                    className="w-full"
                    onClick={handleNext}
                  >
                    Continue to Quiz
                  </Button>
                </form>
              </>
            ) : (
              // Step 2: Personality Quiz
              <>
                <div className="text-center mb-6">
                  <Heading level={2} className="mb-2">
                    Personality Quiz
                  </Heading>
                  <p className="text-slate-400">
                    Help our AI find your perfect conversation partners
                  </p>
                  <div className="mt-2 text-sm text-slate-500">
                    {Object.keys(quizAnswers).length}/10 questions completed
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {quizQuestions.map((question) => (
                    <div
                      key={question.id}
                      className="p-6 bg-slate-800/30 rounded-xl border border-slate-600"
                    >
                      <h3 className="text-lg font-medium text-white mb-4">
                        {question.id}. {question.question}
                      </h3>
                      <div className="space-y-3">
                        {question.options.map((option, index) => (
                          <label
                            key={index}
                            className="flex items-start cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={index}
                              checked={quizAnswers[question.id] === index}
                              onChange={() =>
                                handleQuizAnswerChange(question.id, index)
                              }
                              className="mt-1 mr-3 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                            />
                            <div className="flex-1">
                              <span className="text-slate-300 group-hover:text-white transition-colors duration-200">
                                <span className="font-medium text-indigo-400 mr-2">
                                  {String.fromCharCode(65 + index)}.
                                </span>
                                {option}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  {error && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="secondary"
                      size="lg"
                      className="flex-1"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1"
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </div>
                </form>
              </>
            )}

            {currentStep === 1 && (
              <div className="mt-6 text-center">
                <p className="text-slate-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-slate-500 hover:text-slate-400 text-sm transition-colors duration-200"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Register;
