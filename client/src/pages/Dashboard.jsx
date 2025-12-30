import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Container from "../components/common/Container";
import Heading from "../components/common/Heading";
import Button from "../components/common/Button";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // FIX: Show loading state while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900">
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                ConnectAI
              </h1>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          {/* Welcome Section */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl mb-8">
            <Heading level={1} className="mb-4">
              Welcome, {user.name}! 🎉
            </Heading>
            <p className="text-xl text-slate-300 mb-6">
              Your account has been successfully created and you're now part of
              the ConnectAI community.
            </p>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-600">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Profile Status
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  Your profile is{" "}
                  {user.profileCompleted ? "complete" : "incomplete"}
                </p>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-green-400 text-sm">
                    Ready for matching
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Features */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <Heading level={2} className="mb-6">
              Available Features
            </Heading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-slate-800/30 rounded-xl border border-slate-600">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  AI Matching
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Get matched with compatible people based on your personality
                  quiz
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/matches")}
                >
                  Find Matches
                </Button>
              </div>

              <div className="text-center p-6 bg-slate-800/30 rounded-xl border border-slate-600">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Real-time Chat
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Start conversations with your matches instantly
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/chats")}
                >
                  View Chats
                </Button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-slate-400 mb-4">
                Start by finding your AI-powered matches and begin meaningful
                conversations!
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
