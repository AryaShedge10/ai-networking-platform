import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { chatAPI } from "../services/api";
import socketService from "../services/socket";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import ChatSidebar from "../components/chat/ChatSidebar";

const Chat = () => {
  const { roomId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // FIX: Don't redirect while auth is still loading
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    fetchChatRoom();

    // FIX: Only setup socket once when component mounts
    const timeoutId = setTimeout(() => {
      setupSocket();
    }, 100); // Small delay to ensure socket is ready

    return () => {
      clearTimeout(timeoutId);
      if (roomId) {
        console.log(`🚪 Leaving room: ${roomId}`);
        socketService.leaveRoom(roomId);
      }
      socketService.offReceiveMessage();
    };
  }, [user, authLoading, roomId, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatRoom = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getChatRoom(roomId);
      setChatRoom(response.data);

      // FIX: Load existing messages from database
      console.log(`📥 Loading messages for room ${roomId}`);
      const messagesResponse = await chatAPI.getRoomMessages(roomId);
      const existingMessages = messagesResponse.data.messages || [];

      console.log(`📋 Loaded ${existingMessages.length} existing messages`);
      setMessages(existingMessages);
    } catch (error) {
      console.error("Error fetching chat room:", error);
      setError("Failed to load chat room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = () => {
    // FIX: Initialize socket connection outside component to ensure singleton
    console.log("🔌 Initializing socket connection...");
    const socket = socketService.connect();

    if (socket && roomId) {
      // FIX: Join room (socket service will handle connection timing)
      console.log(`🏠 Attempting to join room: ${roomId}`);
      socketService.joinRoom(roomId);

      // FIX: Set up message listener with proper cleanup
      const handleReceiveMessage = (messageData) => {
        console.log(`📨 Message received in room ${roomId}:`, messageData);

        // Check if message is from current user to set isOwn flag correctly
        const userId = user._id || user.id;
        const isOwnMessage = messageData.senderId === userId;

        // FIX: Update state immediately when message is received
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(), // Ensure unique ID
            message: messageData.message,
            senderId: messageData.senderId,
            senderName: messageData.senderName,
            timestamp: messageData.timestamp,
            isOwn: isOwnMessage,
          },
        ]);
      };

      // FIX: Clean up any existing listeners before adding new one
      socketService.offReceiveMessage();
      socketService.onReceiveMessage(handleReceiveMessage);

      socketService.onError((error) => {
        console.error("❌ Socket error:", error);
        setError("Connection error. Please refresh the page.");
      });

      console.log("✅ Socket setup complete for room:", roomId);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      const userId = user._id || user.id;

      // FIX: Don't add message locally - let it come back via socket
      // This ensures both users see the message at the same time
      console.log(`📤 Sending message to room ${roomId}: ${messageText}`);

      // Send via socket - message will come back via receive-message event
      socketService.sendMessage(roomId, messageText, userId, user.name);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const getOtherParticipant = () => {
    if (!chatRoom || !user) return null;
    const userId = user._id || user.id;
    return chatRoom.participants.find((p) => p._id !== userId);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
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
          <p className="text-slate-300">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error && !chatRoom) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Chat Not Found
          </h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <Button onClick={() => navigate("/matches")}>Back to Matches</Button>
        </div>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant();

  return (
    <div className="h-screen bg-slate-900 flex">
      {/* FIX: Add WhatsApp-style chat sidebar */}
      <ChatSidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-slate-800 border-b border-slate-700 shrink-0">
          <Container>
            <div className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate("/matches")}
                  >
                    ← Back
                  </Button>
                  <div>
                    <h1 className="text-lg font-semibold text-white">
                      {otherParticipant?.name || "Chat"}
                    </h1>
                    <p className="text-sm text-slate-400">
                      ⭐ {otherParticipant?.reputationScore || 0} reputation
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-300">Online</span>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* Messages Area - FIX: Proper flex layout for scrolling */}
        <div className="flex-1 overflow-hidden">
          <Container className="h-full">
            <div className="h-full flex flex-col">
              {/* Messages Container - FIX: Scrollable area */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">💬</div>
                    <p className="text-slate-400">
                      Start your conversation with {otherParticipant?.name}!
                    </p>
                  </div>
                ) : (
                  messages.map((message) => {
                    // FIX: Handle senderId correctly - it might be an object or string after population
                    const currentUserId = user._id || user.id;
                    const messageSenderId =
                      message.senderId._id || message.senderId;
                    const isCurrentUser =
                      message.isOwn || messageSenderId === currentUserId;

                    console.log(
                      `Message from ${message.senderName}: senderId=${messageSenderId}, currentUserId=${currentUserId}, isOwn=${message.isOwn}, isCurrentUser=${isCurrentUser}`
                    );

                    return (
                      <div
                        key={message.id}
                        className={`flex mb-4 ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-md ${
                            isCurrentUser
                              ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-br-sm"
                              : "bg-slate-700 text-slate-100 rounded-bl-sm"
                          }`}
                        >
                          {/* FIX: Show sender name for other users only */}
                          {!isCurrentUser && (
                            <p className="text-xs text-slate-400 mb-1 font-medium">
                              {message.senderName}
                            </p>
                          )}
                          <p className="text-sm leading-relaxed">
                            {message.message}
                          </p>
                          <p
                            className={`text-xs mt-2 ${
                              isCurrentUser
                                ? "text-indigo-200"
                                : "text-slate-400"
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input - FIX: Sticky at bottom */}
              <div className="shrink-0 py-4 border-t border-slate-700">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={sending}
                  />
                  <Button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="px-6"
                  >
                    {sending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      "Send"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </Container>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border-t border-red-500 p-4 shrink-0">
            <Container>
              <p className="text-red-200 text-sm">{error}</p>
            </Container>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
