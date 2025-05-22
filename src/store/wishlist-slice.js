import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    totalItems: 0,
    loading: false,
    error: null,
    isNew: false,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    replaceWishlist(state, action) {
      const wishlist = action.payload;
      state.items = wishlist.items || [];
      state.totalItems = wishlist.items_count || 0;
      state.isNew = wishlist.isNew || false;
      state.loading = false;
      state.error = null;
    },
    addItemToWishlist(state, action) {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.product_id === newItem.product_id
      );

      if (existingItemIndex === -1) {
        // Add new item
        state.items.push({
          ...newItem,
        });
        // Increment total items count
        state.totalItems += 1;
      }
    },
    removeItemFromWishlist(state, action) {
      const { itemId } = action.payload;
      // Filter out the removed item
      state.items = state.items.filter((item) => item.id !== itemId);
      // Update total items count
      state.totalItems = state.items.length;
    },
    clearWishlist(state) {
      state.items = [];
      state.totalItems = 0;
    },
  },
});

export const wishlistActions = wishlistSlice.actions;
export default wishlistSlice;
