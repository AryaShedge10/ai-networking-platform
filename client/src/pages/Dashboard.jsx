import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/common/Container";
import Heading from "../components/common/Heading";
import Button from "../components/common/Button";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-600">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Reputation Score
                </h3>
                <p className="text-2xl font-bold text-indigo-400 mb-2">
                  {user.reputationScore}
                </p>
                <p className="text-slate-400 text-sm">
                  Start conversations to build your reputation
                </p>
              </div>
            </div>
          </div>

          {/* Coming Soon Features */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <Heading level={2} className="mb-6">
              Coming Soon Features
            </Heading>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-800/30 rounded-xl border border-slate-600">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  AI Matching
                </h3>
                <p className="text-slate-400 text-sm">
                  Get matched with compatible people based on your interests and
                  goals
                </p>
              </div>

              <div className="text-center p-6 bg-slate-800/30 rounded-xl border border-slate-600">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Smart Chat
                </h3>
                <p className="text-slate-400 text-sm">
                  AI-powered conversation starters and real-time messaging
                </p>
              </div>

              <div className="text-center p-6 bg-slate-800/30 rounded-xl border border-slate-600">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Learning Groups
                </h3>
                <p className="text-slate-400 text-sm">
                  Join curated groups based on your learning goals and interests
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-slate-400 mb-4">
                We're working hard to bring you these features. Stay tuned!
              </p>
              <Button variant="outline">Notify Me When Ready</Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
