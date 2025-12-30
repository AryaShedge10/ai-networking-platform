import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { chatAPI } from "../../services/api";

const ChatSidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { roomId: activeRoomId } = useParams();
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchChatRooms();
    }
  }, [user]);

  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getChatRooms();
      setChatRooms(response.data.rooms || []);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      setError("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (roomId) => {
    // FIX: Pass navigation state to enable smart back navigation
    navigate(`/chat/${roomId}`, { state: { from: "/chats" } });
  };

  const getOtherParticipant = (participants) => {
    if (!user || !participants) return null;
    const userId = user._id || user.id;
    return participants.find((p) => p._id !== userId);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const truncateMessage = (message, maxLength = 30) => {
    if (!message) return "No messages yet";
    return message.length > maxLength
      ? `${message.substring(0, maxLength)}...`
      : message;
  };

  if (loading) {
    return (
      <div className="w-full md:w-80 bg-slate-800 border-r border-slate-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-2"></div>
          <p className="text-slate-400 text-sm">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col w-full md:w-80 bg-slate-800 border-r border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 shrink-0">
        <h2 className="text-lg font-semibold text-white">Chats</h2>
        <p className="text-sm text-slate-400">
          {chatRooms.length} conversations
        </p>
      </div>

      {/* Chat List - FIX: Use flex-1 overflow-y-auto for proper full height scrolling */}
      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="p-4 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {chatRooms.length === 0 ? (
          <div className="p-4 text-center">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-slate-400 text-sm">No chats yet</p>
            <p className="text-slate-500 text-xs mt-1">
              Start a conversation from your matches
            </p>
          </div>
        ) : (
          chatRooms.map((room) => {
            const otherParticipant = getOtherParticipant(room.participants);
            const isActive = activeRoomId === room.roomId;

            return (
              <div
                key={room.roomId}
                onClick={() => handleChatClick(room.roomId)}
                className={`p-4 border-b border-slate-700 cursor-pointer transition-colors hover:bg-slate-700/50 ${
                  isActive ? "bg-slate-700 border-l-4 border-l-indigo-500" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* User Name */}
                    <div className="flex items-center mb-1">
                      <h3
                        className={`font-medium truncate ${
                          isActive ? "text-white" : "text-slate-200"
                        }`}
                      >
                        {otherParticipant?.name || "Unknown User"}
                      </h3>
                    </div>

                    {/* Last Message */}
                    <p
                      className={`text-sm truncate ${
                        isActive ? "text-slate-300" : "text-slate-400"
                      }`}
                    >
                      {truncateMessage(room.lastMessage)}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <div className="ml-2 shrink-0">
                    <p
                      className={`text-xs ${
                        isActive ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {formatTime(room.lastMessageAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 shrink-0">
        <button
          onClick={() => navigate("/matches")}
          className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Find New Matches
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;
