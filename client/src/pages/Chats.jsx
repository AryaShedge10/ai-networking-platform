import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChatSidebar from "../components/chat/ChatSidebar";
import Container from "../components/common/Container";
import Button from "../components/common/Button";

const Chats = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // FIX: Don't redirect while auth is still loading
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, authLoading, navigate]);

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

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Header - visible on mobile, hidden on desktop when sidebar shows */}
      <div className="md:hidden bg-slate-800 border-b border-slate-700 shrink-0">
        <Container>
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-white">Chats</h1>
                <p className="text-sm text-slate-400">Your conversations</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop: Show sidebar with header, Mobile: Show full-width sidebar */}
        <div className="w-full md:w-80 flex flex-col">
          {/* Desktop header - hidden on mobile */}
          <div className="hidden md:block bg-slate-800 border-b border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-white">Chats</h1>
                <p className="text-sm text-slate-400">Your conversations</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="flex-1 overflow-hidden">
            <ChatSidebar />
          </div>
        </div>

        {/* Desktop: Empty state for when no chat is selected */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-slate-900">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Select a chat to start messaging
            </h2>
            <p className="text-slate-400 mb-6">
              Choose a conversation from the sidebar to begin chatting
            </p>
            <Button onClick={() => navigate("/matches")}>
              Find New Matches
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
