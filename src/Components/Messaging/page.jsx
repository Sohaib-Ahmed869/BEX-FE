import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  MoreVertical,
  ArrowLeft,
  Phone,
  Video,
  User,
  MessageCircle,
  Users,
  Settings,
  ShoppingBag,
  Heart,
  Star,
  Zap,
  Crown,
  Shield,
  Coffee,
  Camera,
  Music,
} from "lucide-react";
import { ChatSkeleton, MessageSkeleton } from "./MessageSkeletonUi";
import BuyerHeader from "../Buyer/buyerHeader.jsx/buyerHeader";
import { unreadMessagesActions } from "../../store/message-slice";
import { useDispatch } from "react-redux";

// User avatar icons for differentiation
const getIconComponent = (index) => {
  const icons = [
    User,
    MessageCircle,
    Users,
    Settings,
    ShoppingBag,
    Heart,
    Star,
    Zap,
    Crown,
    Shield,
    Coffee,
    Camera,
    Music,
  ];
  return icons[index % icons.length];
};
// Color variations of #f47458
const colors = {
  primary: "#f47458",
  primaryLight: "#f6896f",
  primaryDark: "#e55a3f",
  primaryVeryLight: "#fde6e0",
  secondary: "#f47458",
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
};
const UserAvatar = ({ user, isOnline = false, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  // Generate consistent icon based on user ID
  const iconIndex = user?.id
    ? Math.abs(
        user.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      ) % 13
    : 0;
  const IconComponent = getIconComponent(0);

  return (
    <div
      className={`relative flex-shrink-0 ${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-medium shadow-md`}
      style={{
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
      }}
    >
      <IconComponent
        className={`${
          size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"
        }`}
      />{" "}
      {isOnline && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
      )}
    </div>
  );
};

// Chat Header Component
const ChatHeader = ({
  selectedChat,
  currentUser,
  onlineUsers,
  onBackClick,
}) => {
  const otherUser =
    selectedChat.buyer.id === currentUser.id
      ? selectedChat.seller
      : selectedChat.buyer;
  const isOnline = onlineUsers.has(otherUser.id);

  return (
    <div
      className="flex items-center rounded-b-lg justify-between p-4 border-b border-gray-200 text-white shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
      }}
    >
      <div className="flex items-center">
        <button
          onClick={onBackClick}
          className=" mr-3 p-2 cursor-pointer hover:bg-opacity-20 rounded-full transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* <UserAvatar user={otherUser} isOnline={isOnline} size="lg" /> */}

        <div className="ml-4">
          <h2 className="text-lg font-semibold">
            {otherUser.first_name} {otherUser.last_name}
          </h2>
          <p className="text-sm text-white text-opacity-80">
            {selectedChat.product.title}
          </p>
          {isOnline && (
            <p className="text-xs text-white text-opacity-60">Online now</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* <Phone className="w-5 h-5 text-white opacity-70 hover:opacity-100 cursor-pointer transition-opacity duration-200" />
        <Video className="w-5 h-5 text-white opacity-70 hover:opacity-100 cursor-pointer transition-opacity duration-200" />
        <Search className="w-5 h-5 text-white opacity-70 hover:opacity-100 cursor-pointer transition-opacity duration-200" />
        <MoreVertical className="w-5 h-5 text-white opacity-70 hover:opacity-100 cursor-pointer transition-opacity duration-200" /> */}
      </div>
    </div>
  );
};

// Message Input Component
const MessageInput = ({
  newMessage,
  setNewMessage,
  onSendMessage,
  sendingMessage,
  onTyping,
}) => {
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    onTyping(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSendMessage();
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 shadow-inner"
            style={{
              "--tw-ring-color": colors.primary,
              color: colors.gray[800],
            }}
            disabled={sendingMessage}
          />
        </div>
        <button
          onClick={onSendMessage}
          disabled={!newMessage.trim() || sendingMessage}
          className="flex-shrink-0 w-12 h-12 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background:
              newMessage.trim() && !sendingMessage
                ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`
                : colors.gray[300],
          }}
        >
          {sendingMessage ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

// Typing Indicator Component
const TypingIndicator = ({ typingUsers, currentUser }) => {
  // Filter out the current user from typing users
  const otherTypingUsers = Array.from(typingUsers).filter(
    (user) => user !== currentUser?.first_name && user !== currentUser?.id
  );

  // If no other users are typing, don't show the indicator
  if (otherTypingUsers.length === 0) return null;

  return (
    <div className="flex justify-start animate-pulse">
      <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-2xl max-w-xs shadow-md">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <p className="text-sm italic ml-2">
            {otherTypingUsers.join(", ")}{" "}
            {otherTypingUsers.length === 1 ? "is" : "are"} typing...
          </p>
        </div>
      </div>
    </div>
  );
};

// Message Component
const Message = ({ message, currentUser, formatTime }) => {
  const isOwn = message.sender_id === currentUser.id;

  return (
    <div
      className={`flex ${
        isOwn ? "justify-end" : "justify-start"
      } animate-slideInUp`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg transform hover:scale-105 ${
          isOwn ? "text-white" : "bg-white text-gray-900 border border-gray-200"
        }`}
        style={
          isOwn
            ? {
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
              }
            : {}
        }
      >
        <p className="text-sm leading-relaxed">{message.message}</p>
        <div className="flex items-center justify-between mt-2">
          <p
            className={`text-xs ${
              isOwn ? "text-white text-opacity-70" : "text-gray-500"
            }`}
          >
            {formatTime(message.created_at)}
          </p>
          {isOwn && (
            <span
              className={`text-xs ml-2 ${
                message.is_read
                  ? "text-white text-opacity-70"
                  : "text-white text-opacity-50"
              }`}
            >
              {message.is_read ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Chat List Item Component
const ChatListItem = ({
  chat,
  currentUser,
  onlineUsers,
  isSelected,
  onClick,
  index,
  formatTime,
}) => {
  const otherUser = chat.buyer.id === currentUser.id ? chat.seller : chat.buyer;
  const isOnline = onlineUsers.has(otherUser.id);
  const unreadCount = chat.unread_count || 0;

  // Debug logging - remove this after confirming the fix works
  console.log(`Chat ${chat.id} unread count:`, unreadCount, "Chat data:", chat);

  return (
    <div
      onClick={() => onClick(chat)}
      className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-md ${
        isSelected ? "text-white shadow-lg" : "hover:bg-gray-50"
      }`}
      style={{
        animationDelay: `${index * 0.1}s`,
        animation: `slideInLeft 0.5s ease-out ${index * 0.1}s both`,
        background: isSelected
          ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`
          : "transparent",
      }}
    >
      <UserAvatar user={otherUser} isOnline={isOnline} />

      <div className="flex-1 min-w-0 ml-3">
        <div className="flex items-center justify-between mb-1">
          <h3
            className={`text-sm font-medium truncate ${
              isSelected ? "text-white" : "text-gray-900"
            }`}
          >
            {otherUser.first_name} {otherUser.last_name}
          </h3>
          <div className="flex items-center space-x-2">
            <span
              className={`text-xs ${
                isSelected ? "text-white text-opacity-80" : "text-gray-500"
              }`}
            >
              {formatTime(chat.last_message_at)}
            </span>
            {unreadCount > 0 && (
              <div
                className="text-white text-xs font-bold px-2 py-1 rounded-full min-w-5 h-5 flex items-center justify-center animate-bounce shadow-md"
                style={{
                  backgroundColor: isSelected
                    ? "rgba(255,255,255,0.3)"
                    : colors.primary,
                  color: "white",
                  border: isSelected
                    ? "1px solid rgba(255,255,255,0.5)"
                    : "none",
                }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </div>
            )}
          </div>
        </div>
        <p
          className={`text-sm truncate ${
            isSelected ? "text-white text-opacity-80" : "text-gray-600"
          } ${unreadCount > 0 && !isSelected ? "font-semibold" : ""}`}
        >
          {chat.last_message || `Chat about ${chat.product.title}`}
        </p>
        <p
          className={`text-xs mt-1 truncate ${
            isSelected ? "text-white text-opacity-60" : "text-gray-400"
          }`}
        >
          {chat.product.title}
        </p>
      </div>
    </div>
  );
};
// Chat Sidebar Component
const ChatSidebar = ({
  chats,
  currentUser,
  onlineUsers,
  selectedChat,
  onChatSelect,
  loading,
  searchQuery,
  setSearchQuery,
  messageFilter,
  setMessageFilter,
  totalUnreadCount,
  formatTime,
}) => {
  const filteredChats = chats.filter((chat) => {
    const otherUser =
      chat.buyer.id === currentUser.id ? chat.seller : chat.buyer;
    const productTitle = chat.product.title.toLowerCase();
    const userName =
      `${otherUser.first_name} ${otherUser.last_name}`.toLowerCase();

    const searchMatch =
      productTitle.includes(searchQuery.toLowerCase()) ||
      userName.includes(searchQuery.toLowerCase());

    const filterMatch =
      messageFilter === "all" ||
      (messageFilter === "unread" && (chat.unread_count || 0) > 0) ||
      (messageFilter === "read" && (chat.unread_count || 0) === 0);

    return searchMatch && filterMatch;
  });

  return (
    <div
      className={`${
        selectedChat ? "hidden md:flex" : "flex"
      } flex-col w-full md:w-80  border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out`}
    >
      {/* Header */}
      <div
        className="p-4 border-b border-gray-100 rounded-b-lg text-white"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Messages</h1>
          {totalUnreadCount > 0 && (
            <div
              className="bg-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse shadow-lg"
              style={{ color: colors.primary }}
            >
              {totalUnreadCount} new
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <select
            value={messageFilter}
            onChange={(e) => setMessageFilter(e.target.value)}
            className="text-smbg-opacity-20 text-white border border-white border-opacity-30 rounded-lg px-3 py-2 outline-none focus:bg-opacity-30 transition-all duration-200 backdrop-blur-sm"
            style={{
              color: "white",
            }}
          >
            <option
              value="all"
              style={{ color: colors.gray[900], backgroundColor: "white" }}
            >
              All messages
            </option>
            <option
              value="unread"
              style={{ color: colors.gray[900], backgroundColor: "white" }}
            >
              Unread
            </option>
            <option
              value="read"
              style={{ color: colors.gray[900], backgroundColor: "white" }}
            >
              Read
            </option>
          </select>
          {/* <MoreVertical className="w-5 h-5 text-white opacity-70 hover:opacity-100 cursor-pointer transition-opacity duration-200" /> */}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white opacity-70" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-opacity-20 border border-white border-opacity-30 rounded-lg text-sm placeholder-white placeholder-opacity-70 focus:outline-none focus:bg-opacity-30 focus:border-white focus:border-opacity-50 transition-all duration-200 backdrop-blur-sm"
            style={{
              color: "white",
            }}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <ChatSkeleton />
        ) : filteredChats.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p>No chats found</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredChats.map((chat, index) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                currentUser={currentUser}
                onlineUsers={onlineUsers}
                isSelected={selectedChat?.id === chat.id}
                onClick={onChatSelect}
                index={index}
                formatTime={formatTime}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MessagingComponent = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [messageFilter, setMessageFilter] = useState("all");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const dispatch = useDispatch();
  // Get current user data from localStorage
  const getCurrentUser = () => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("role");

    if (!userId || !userName) {
      console.error("User not authenticated");
      return null;
    }

    return {
      id: userId,
      first_name: userName,
      role: userRole,
    };
  };

  const currentUser = getCurrentUser();

  // Early return if user is not authenticated
  if (!currentUser) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${colors.primaryVeryLight}, ${colors.primaryLight})`,
        }}
      >
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl animate-pulse">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: colors.primaryVeryLight }}
          >
            <div
              className="w-8 h-8 rounded-full animate-bounce"
              style={{ backgroundColor: colors.primary }}
            ></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-500">Please log in to access your messages</p>
        </div>
      </div>
    );
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Debug effect to monitor chats state changes
  useEffect(() => {
    console.log(
      "Chats updated:",
      chats.map((chat) => ({
        id: chat.id,
        unread_count: chat.unread_count,
        last_message: chat.last_message,
      }))
    );
  }, [chats]);

  // Initialize Socket.io connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    const URL = import.meta.env.VITE_REACT_BACKEND_URL;

    if (!token) {
      console.error("No authentication token found");
      return;
    }

    // Dynamically import socket.io-client
    const initSocket = async () => {
      try {
        const { io } = await import("socket.io-client");

        socketRef.current = io(URL, {
          auth: {
            token: token,
          },
        });

        const socket = socketRef.current;

        // Socket event listeners
        socket.on("connect", () => {
          console.log("Connected to server");
          socket.emit("join_chats");
          // Add user to online users
          setOnlineUsers((prev) => new Set([...prev, currentUser.id]));
        });

        socket.on("disconnect", () => {
          console.log("Disconnected from server");
          // Remove user from online users
          setOnlineUsers((prev) => {
            const updated = new Set(prev);
            updated.delete(currentUser.id);
            return updated;
          });
        });

        socket.on("joined_chats", (data) => {
          console.log("Joined chats:", data.chatIds);
        });

        // FIXED: Single state update for new messages to prevent unread count override
        socket.on("new_message", (data) => {
          const { message, chatId } = data;

          console.log("New message received:", {
            chatId,
            message,
            selectedChatId: selectedChat?.id,
          });

          // Update chats state with proper unread count logic
          setChats((prevChats) => {
            return prevChats
              .map((chat) => {
                if (chat.id === chatId) {
                  // Check if this chat is currently selected AND visible
                  const isChatCurrentlySelected =
                    selectedChat && selectedChat.id === chatId;

                  // Only increment unread count if:
                  // 1. Chat is not currently selected, AND
                  // 2. Message is not from current user
                  const shouldIncrementUnread =
                    !isChatCurrentlySelected &&
                    message.sender_id !== currentUser.id;
                  if (shouldIncrementUnread) {
                    dispatch(
                      unreadMessagesActions.incrementChatUnreadCount({
                        chatId,
                        increment: 1,
                      })
                    );
                  }
                  const newUnreadCount = shouldIncrementUnread
                    ? (chat.unread_count || 0) + 1 // INCREMENT by 1, don't keep same value
                    : chat.unread_count || 0;

                  console.log(`Chat ${chatId} unread update:`, {
                    isChatCurrentlySelected,
                    shouldIncrementUnread,
                    oldCount: chat.unread_count || 0,
                    newCount: newUnreadCount,
                    messageFromCurrentUser:
                      message.sender_id === currentUser.id,
                  });

                  return {
                    ...chat,
                    last_message: message.message,
                    last_message_at: message.created_at,
                    unread_count: newUnreadCount,
                  };
                }
                return chat;
              })
              .sort(
                (a, b) =>
                  new Date(b.last_message_at) - new Date(a.last_message_at)
              );
          });

          // Add message to current chat if it's selected
          if (selectedChat && selectedChat.id === chatId) {
            setMessages((prev) => [...prev, message]);

            // Mark as read immediately if chat is active and message is not from current user
            if (message.sender_id !== currentUser.id) {
              setTimeout(() => {
                socket.emit("mark_messages_read", { chatId });
              }, 100);
            }
          }
        });
        // Alternative fix in MessagingComponent - modify the chat_updated handler
        socket.on("chat_updated", (data) => {
          const { chat } = data;
          console.log(
            "Chat updated event received - IGNORING to prevent double count"
          );
        });

        socket.on("user_typing", (data) => {
          const { userId, userName, isTyping } = data;

          // Don't add current user to typing users
          if (
            userId === currentUser?.id ||
            userName === currentUser?.first_name
          ) {
            return;
          }

          if (isTyping) {
            setTypingUsers((prev) => new Set([...prev, userName]));
          } else {
            setTypingUsers((prev) => {
              const updated = new Set(prev);
              updated.delete(userName);
              return updated;
            });
          }
        });

        socket.on("user_joined_chat", (data) => {
          console.log("User joined:", data.userId);
          setOnlineUsers((prev) => new Set([...prev, data.userId]));
        });

        socket.on("user_left_chat", (data) => {
          console.log("User left:", data.userId);
          setOnlineUsers((prev) => {
            const updated = new Set(prev);
            updated.delete(data.userId);
            return updated;
          });
        });

        socket.on("user_online", (data) => {
          console.log("User online:", data.userId);
          setOnlineUsers((prev) => new Set([...prev, data.userId]));
        });

        socket.on("user_offline", (data) => {
          console.log("User offline:", data.userId);
          setOnlineUsers((prev) => {
            const updated = new Set(prev);
            updated.delete(data.userId);
            return updated;
          });
        });

        socket.on("messages_read", (data) => {
          const { chatId, userId } = data;

          console.log("Messages marked as read:", {
            chatId,
            userId,
            currentUserId: currentUser.id,
          });

          // Update messages if this is the current chat
          if (selectedChat && selectedChat.id === chatId) {
            setMessages((prev) =>
              prev.map((msg) => ({
                ...msg,
                is_read: true, // Mark all messages as read
                read_at: msg.read_at || new Date().toISOString(),
              }))
            );
          }
          dispatch(
            unreadMessagesActions.clearChatUnreadCount({
              chatId: data.chatId,
            })
          );
          // Always update chat unread count to 0 when messages are read
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === chatId ? { ...chat, unread_count: 0 } : chat
            )
          );
        });

        socket.on("error", (error) => {
          console.error("Socket error:", error);
          alert(error.message);
        });
      } catch (error) {
        console.error("Failed to load socket.io-client:", error);
      }
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [selectedChat, currentUser.id]);

  // Fetch user's chats
  const fetchChats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const URL = import.meta.env.VITE_REACT_BACKEND_URL;

      const response = await fetch(`${URL}/api/chat/${currentUser.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Chats fetched:", data.chats);
        setChats(data.chats);
      } else if (response.status === 401) {
        console.error("Unauthorized access - token may be expired");
      } else {
        console.error("Failed to fetch chats");
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected chat - DON'T clear unread count immediately
  const fetchMessages = async (chatId) => {
    try {
      setLoadingMessages(true);
      const token = localStorage.getItem("token");
      const URL = import.meta.env.VITE_REACT_BACKEND_URL;

      const response = await fetch(
        `${URL}/api/chat/${chatId}/messages/${currentUser.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        const chatCounts = {};
        data.chats.forEach((chat) => {
          chatCounts[chat.id] = chat.unread_count || 0;
        });
        dispatch(
          unreadMessagesActions.updateMultipleChatUnreadCounts({
            chatCounts,
          })
        );
        // Mark messages as read via socket AFTER messages are loaded
        setTimeout(() => {
          if (socketRef.current) {
            socketRef.current.emit("mark_messages_read", { chatId });
          }
        }, 500); // Small delay to ensure messages are displayed
      } else if (response.status === 401) {
        console.error("Unauthorized access - token may be expired");
      } else {
        console.error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send message via WebSocket
  const sendMessage = async () => {
    if (
      !newMessage.trim() ||
      !selectedChat ||
      sendingMessage ||
      !socketRef.current
    )
      return;

    setSendingMessage(true);

    // Send via WebSocket
    socketRef.current.emit("send_message", {
      chatId: selectedChat.id,
      message: newMessage,
      messageType: "text",
    });

    setNewMessage("");
    setSendingMessage(false);

    // Stop typing indicator
    socketRef.current.emit("typing", {
      chatId: selectedChat.id,
      isTyping: false,
    });
  };

  // FIXED: Handle chat selection with immediate unread count clearing
  const handleChatSelect = (chat) => {
    console.log(
      "Selecting chat:",
      chat.id,
      "Current unread:",
      chat.unread_count
    );

    // Leave previous chat
    if (selectedChat && socketRef.current) {
      socketRef.current.emit("leave_chat", selectedChat.id);
    }

    setSelectedChat(chat);
    setMessages([]);

    // IMMEDIATELY clear unread count for selected chat
    setChats((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unread_count: 0 } : c))
    );

    // Fetch messages
    fetchMessages(chat.id);

    // Join new chat
    if (socketRef.current) {
      socketRef.current.emit("join_chat", chat.id);

      // Mark messages as read after a short delay to ensure chat is properly joined
      setTimeout(() => {
        socketRef.current.emit("mark_messages_read", { chatId: chat.id });
      }, 200);
    }
  };
  // Handle typing
  const handleTyping = (value) => {
    if (!selectedChat || !socketRef.current) return;

    // Emit typing indicator
    socketRef.current.emit("typing", {
      chatId: selectedChat.id,
      isTyping: value.length > 0,
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    if (value.length > 0) {
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit("typing", {
          chatId: selectedChat.id,
          isTyping: false,
        });
      }, 1000);
    }
  };

  // Format time helper
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 168) {
      // Less than a week
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Calculate total unread count
  const totalUnreadCount = chats.reduce(
    (total, chat) => total + (chat.unread_count || 0),
    0
  );

  // Handle back button for mobile
  const handleBackClick = () => {
    setSelectedChat(null);
    setMessages([]);
  };

  // Load chats on component mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const userRole = localStorage.getItem("role");

  return (
    <>
      {userRole === "buyer" && (
        <div className="mb-1">
          <BuyerHeader />
        </div>
      )}
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <style jsx>{`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slideInLeft {
            animation: slideInLeft 0.5s ease-out forwards;
          }

          .animate-slideInUp {
            animation: slideInUp 0.3s ease-out forwards;
          }

          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
          }

          ::-webkit-scrollbar-track {
            background: #f1f5f9;
          }

          ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}</style>

        {/* Chat Sidebar */}
        <ChatSidebar
          chats={chats}
          currentUser={currentUser}
          onlineUsers={onlineUsers}
          selectedChat={selectedChat}
          onChatSelect={handleChatSelect}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          messageFilter={messageFilter}
          setMessageFilter={setMessageFilter}
          totalUnreadCount={totalUnreadCount}
          formatTime={formatTime}
        />

        {/* Chat Area */}
        <div
          className={`${
            selectedChat ? "flex" : "hidden md:flex"
          } flex-1 flex-col bg-white shadow-lg transition-all duration-300 ease-in-out`}
        >
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <ChatHeader
                selectedChat={selectedChat}
                currentUser={currentUser}
                onlineUsers={onlineUsers}
                onBackClick={handleBackClick}
              />

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {loadingMessages ? (
                  <MessageSkeleton />
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-8">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${colors.primaryVeryLight}, ${colors.primaryLight})`,
                        }}
                      >
                        <MessageCircle
                          className="w-10 h-10"
                          style={{ color: colors.primary }}
                        />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Start the conversation
                      </h3>
                      <p className="text-gray-500">
                        Send a message to get started
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <Message
                        key={message.id}
                        message={message}
                        currentUser={currentUser}
                        formatTime={formatTime}
                      />
                    ))}
                    <TypingIndicator
                      currentUser={currentUser}
                      typingUsers={typingUsers}
                    />
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <MessageInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                onSendMessage={sendMessage}
                sendingMessage={sendingMessage}
                onTyping={handleTyping}
              />
            </>
          ) : (
            // No chat selected - Welcome screen
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-white">
              <div className="text-center p-12 max-w-md">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  }}
                >
                  <MessageCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to Messages
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Select a conversation from the sidebar to start chatting with
                  buyers and sellers.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: colors.primary }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: colors.primary,
                      animationDelay: "0.1s",
                    }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: colors.primary,
                      animationDelay: "0.2s",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessagingComponent;
