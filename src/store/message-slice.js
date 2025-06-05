import { createSlice } from "@reduxjs/toolkit";

const unreadMessagesSlice = createSlice({
  name: "unreadMessages",
  initialState: {
    // Total unread count across all chats
    totalUnreadCount: 0,
    // Individual chat unread counts - object with chatId as key
    chatUnreadCounts: {},
    // Loading state for when fetching unread counts
    loading: false,
    // Error state
    error: null,
    // Last updated timestamp
    lastUpdated: null,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    // Set the total unread count directly
    setTotalUnreadCount(state, action) {
      state.totalUnreadCount = action.payload;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    // Set unread count for a specific chat
    setChatUnreadCount(state, action) {
      const { chatId, count } = action.payload;
      state.chatUnreadCounts[chatId] = count;

      // Recalculate total from individual chat counts
      state.totalUnreadCount = Object.values(state.chatUnreadCounts).reduce(
        (total, chatCount) => total + (chatCount || 0),
        0
      );
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    // Increment unread count for a specific chat
    incrementChatUnreadCount(state, action) {
      const { chatId, increment = 1 } = action.payload;
      const currentCount = state.chatUnreadCounts[chatId] || 0;
      state.chatUnreadCounts[chatId] = currentCount + increment;

      // Update total count
      state.totalUnreadCount += increment;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    // Decrement unread count for a specific chat
    decrementChatUnreadCount(state, action) {
      const { chatId, decrement = 1 } = action.payload;
      const currentCount = state.chatUnreadCounts[chatId] || 0;
      const newCount = Math.max(0, currentCount - decrement);

      state.chatUnreadCounts[chatId] = newCount;

      // Recalculate total from individual chat counts
      state.totalUnreadCount = Object.values(state.chatUnreadCounts).reduce(
        (total, chatCount) => total + (chatCount || 0),
        0
      );
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    // Clear unread count for a specific chat (mark as read)
    clearChatUnreadCount(state, action) {
      const { chatId } = action.payload;
      const previousCount = state.chatUnreadCounts[chatId] || 0;

      state.chatUnreadCounts[chatId] = 0;
      state.totalUnreadCount = Math.max(
        0,
        state.totalUnreadCount - previousCount
      );
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    // Bulk update multiple chat unread counts
    updateMultipleChatUnreadCounts(state, action) {
      const { chatCounts } = action.payload; // Expected format: { chatId1: count1, chatId2: count2, ... }

      // Update individual chat counts
      Object.entries(chatCounts).forEach(([chatId, count]) => {
        state.chatUnreadCounts[chatId] = count;
      });

      // Recalculate total
      state.totalUnreadCount = Object.values(state.chatUnreadCounts).reduce(
        (total, chatCount) => total + (chatCount || 0),
        0
      );
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    // Reset all unread counts
    resetUnreadCounts(state) {
      state.totalUnreadCount = 0;
      state.chatUnreadCounts = {};
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    // Remove a chat from unread counts (when chat is deleted)
    removeChatFromUnreadCounts(state, action) {
      const { chatId } = action.payload;
      const removedCount = state.chatUnreadCounts[chatId] || 0;

      delete state.chatUnreadCounts[chatId];
      state.totalUnreadCount = Math.max(
        0,
        state.totalUnreadCount - removedCount
      );
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const unreadMessagesActions = unreadMessagesSlice.actions;
export default unreadMessagesSlice;
