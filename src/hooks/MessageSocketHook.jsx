// hooks/useGlobalSocket.js
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { unreadMessagesActions } from "../store/message-slice";

const useGlobalSocket = () => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  // Get current user data from localStorage
  const getCurrentUser = () => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("role");

    if (!userId || !userName) {
      return null;
    }

    return {
      id: userId,
      first_name: userName,
      role: userRole,
    };
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    const token = localStorage.getItem("token");
    const URL = import.meta.env.VITE_REACT_BACKEND_URL;

    if (!token || !currentUser) {
      return;
    }

    const initSocket = async () => {
      try {
        const { io } = await import("socket.io-client");

        socketRef.current = io(URL, {
          auth: { token: token },
        });

        const socket = socketRef.current;

        socket.on("connect", () => {
          console.log("Connected to server globally");
          socket.emit("join_chats");
        });

        socket.on("disconnect", () => {
          console.log("Disconnected from server globally");
        });

        socket.on("joined_chats", (data) => {
          console.log("Joined chats globally:", data.chatIds);
        });

        // Handle messages being marked as read
        socket.on("messages_read", (data) => {
          const { chatId } = data;
          console.log("Messages marked as read globally:", { chatId });

          dispatch(
            unreadMessagesActions.clearChatUnreadCount({
              chatId,
            })
          );
        });

        socket.on("new_message", (data) => {
          const { chatId, message } = data;
          console.log("New message globally:", { chatId, message });

          // Only increment unread count if the message is from someone else
          if (message.sender_id !== currentUser.id) {
            dispatch(
              unreadMessagesActions.incrementChatUnreadCount({ chatId })
            );
          }
        });

        socket.on("error", (error) => {
          console.error("Global socket error:", error);
          dispatch(unreadMessagesActions.setError(error.message));
        });
      } catch (error) {
        console.error("Failed to load socket.io-client globally:", error);
        dispatch(
          unreadMessagesActions.setError("Failed to connect to chat server")
        );
      }
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        console.log("Disconnecting global socket");
        socketRef.current.disconnect();
      }
    };
  }, [dispatch]);

  // Fetch chats globally to initialize unread counts
  useEffect(() => {
    const fetchChats = async () => {
      const currentUser = getCurrentUser();
      const token = localStorage.getItem("token");
      const URL = import.meta.env.VITE_REACT_BACKEND_URL;

      if (!currentUser || !token) return;

      try {
        dispatch(unreadMessagesActions.setLoading(true));

        const response = await fetch(`${URL}/api/chat/${currentUser.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          // Extract unread counts from chats and update the slice
          const chatCounts = {};
          data.chats.forEach((chat) => {
            chatCounts[chat.id] = chat.unread_count || 0;
          });

          dispatch(
            unreadMessagesActions.updateMultipleChatUnreadCounts({
              chatCounts,
            })
          );

          console.log("Global unread counts initialized:", chatCounts);
        } else if (response.status === 401) {
          dispatch(
            unreadMessagesActions.setError(
              "Unauthorized access - token may be expired"
            )
          );
        } else {
          dispatch(unreadMessagesActions.setError("Failed to fetch chats"));
        }
      } catch (error) {
        console.error("Error fetching chats globally:", error);
        dispatch(unreadMessagesActions.setError("Network error occurred"));
      } finally {
        dispatch(unreadMessagesActions.setLoading(false));
      }
    };

    fetchChats();
  }, [dispatch]);

  return socketRef.current;
};

export default useGlobalSocket;
