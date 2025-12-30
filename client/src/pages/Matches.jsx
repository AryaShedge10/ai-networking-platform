import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { matchingAPI, chatAPI } from "../services/api";
import Container from "../components/common/Container";
import Button from "../components/common/Button";

const Matches = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creatingChat, setCreatingChat] = useState(null);

  useEffect(() => {
    // FIX: Don't redirect while auth is still loading
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    fetchMatches();
  }, [user, authLoading, navigate]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      // Use user.id instead of user._id, as the auth context might normalize the property
      const userId = user._id || user.id;
      if (!userId) {
        setError("User ID not found. Please try logging in again.");
        return;
      }

      const response = await matchingAPI.getUserMatches(userId);
      setMatches(response.data.matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setError("Failed to load matches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async (matchUserId) => {
    try {
      setCreatingChat(matchUserId);

      // Use user.id instead of user._id
      const userId = user._id || user.id;
      if (!userId) {
        setError("User ID not found. Please try logging in again.");
        return;
      }

      // Create chat room
      const response = await chatAPI.createChatRoom([userId, matchUserId]);
      const { roomId } = response.data;

      // Navigate to chat room
      navigate(`/chat/${roomId}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      setError("Failed to start chat. Please try again.");
    } finally {
      setCreatingChat(null);
    }
  };

  // FIX: Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Finding your matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <Container>
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Your Matches</h1>
                <p className="text-slate-300 mt-2">
                  AI-powered compatibility based on your personality quiz
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {matches.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-slate-800 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Matches Yet
              </h3>
              <p className="text-slate-300 mb-6">
                We couldn't find any compatible users above the 75% similarity
                threshold. More users are joining daily!
              </p>
              <Button onClick={fetchMatches}>Refresh Matches</Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <p className="text-slate-300">
                Found {matches.length} compatible user
                {matches.length !== 1 ? "s" : ""}
                with 75%+ similarity
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {matches.map((match) => (
                <div
                  key={match.userId}
                  className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  {/* User Info */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {match.name}
                      </h3>
                    </div>
                  </div>

                  {/* Similarity Score */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">
                        Compatibility
                      </span>
                      <span className="text-sm font-semibold text-indigo-400">
                        {Math.round(match.similarityScore * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-linear-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.round(match.similarityScore * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full"
                    onClick={() => handleStartChat(match.userId)}
                    disabled={creatingChat === match.userId}
                  >
                    {creatingChat === match.userId ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Chat...
                      </div>
                    ) : (
                      "Start Chat"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Matches;
