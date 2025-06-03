import React, { useState, useEffect, useRef } from "react";
import { Search, Send, MoreVertical, ArrowLeft } from "lucide-react";
const URL = import.meta.env.VITE_REACT_BACKEND_URL;

const MessagingComponent = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  const userId = localStorage.getItem("userId");
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch user's chats
  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${URL}/api/chat/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your auth token
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChats(data.chats);
      } else {
        console.error("Failed to fetch chats");
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected chat
  const fetchMessages = async (chatId) => {
    try {
      const response = await fetch(
        `${URL}/api/chat/${chatId}/messages/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      } else {
        console.error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || sendingMessage) return;

    try {
      setSendingMessage(true);
      const response = await fetch(
        `${URL}/api/chat/${selectedChat.id}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_id: userId,
            message: newMessage,
            message_type: "text",
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
        // Update chat list to reflect new last message
        fetchChats();
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle chat selection
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat.id);
  };

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) => {
    const otherUser = chat.buyer.id === userId ? chat.seller : chat.buyer;
    const productTitle = chat.product.title.toLowerCase();
    const userName =
      `${otherUser.first_name} ${otherUser.last_name}`.toLowerCase();
    return (
      productTitle.includes(searchQuery.toLowerCase()) ||
      userName.includes(searchQuery.toLowerCase())
    );
  });

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5;

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chat List Sidebar */}
      <div
        className={`${
          selectedChat ? "hidden md:flex" : "flex"
        } flex-col w-full md:w-80 bg-white border-r border-gray-200`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Messages</h1>

          <div className="flex items-center justify-between mb-4">
            <select className="text-sm text-gray-600 bg-transparent border-none outline-none">
              <option>All messages</option>
              <option>Unread</option>
              <option>Read</option>
            </select>
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search a chat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Loading chats...
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No chats found</div>
          ) : (
            filteredChats.map((chat) => {
              const otherUser =
                chat.buyer.id === userId ? chat.seller : chat.buyer;
              const isSelected = selectedChat?.id === chat.id;

              return (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat)}
                  className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 ${
                    isSelected
                      ? "bg-orange-50 border-r-2 border-r-orange-500"
                      : ""
                  }`}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
                    {otherUser.first_name.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {otherUser.first_name} {otherUser.last_name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(chat.last_message_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {chat.last_message || `Chat about ${chat.product.title}`}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat View */}
      <div
        className={`${
          selectedChat ? "flex" : "hidden md:flex"
        } flex-col flex-1 bg-white`}
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden mr-3 p-1 hover:bg-gray-100 rounded"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
                  {selectedChat.buyer.id === userId
                    ? selectedChat.seller.first_name.charAt(0)
                    : selectedChat.buyer.first_name.charAt(0)}
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {selectedChat.buyer.id === userId
                      ? `${selectedChat.seller.first_name} ${selectedChat.seller.last_name}`
                      : `${selectedChat.buyer.first_name} ${selectedChat.buyer.last_name}`}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedChat.product.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwn = message.sender_id === userId;

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        isOwn
                          ? "bg-gray-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwn ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message here..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={sendingMessage}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  className="flex-shrink-0 w-10 h-10 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a chat to start messaging
              </h3>
              <p className="text-gray-500">
                Choose from your existing conversations or start a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingComponent;
