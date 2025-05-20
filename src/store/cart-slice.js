import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
    loading: false,
    error: null,
    productsCount: 0,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    replaceCart(state, action) {
      const cart = action.payload;
      state.items = cart.items || [];
      state.productsCount = cart.products_count || 0;
      state.totalQuantity = cart.items
        ? cart.items.reduce((total, item) => total + item.quantity, 0)
        : 0;
      state.totalPrice = cart.total_price || 0;
      state.loading = false;
      state.error = null;
    },
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.product_id === newItem.product_id
      );

      // Update total quantity
      state.totalQuantity += newItem.quantity;

      if (existingItemIndex === -1) {
        // Add new item
        state.items.push({
          ...newItem,
        });
      } else {
        // Update existing item
        state.items[existingItemIndex].quantity += newItem.quantity;
      }

      // Recalculate total price
      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    removeItemFromCart(state, action) {
      const { itemId, quantity } = action.payload;
      // Fix: Use item.id instead of item.item_id for comparison
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === itemId
      );

      if (existingItemIndex === -1) return;

      const item = state.items[existingItemIndex];

      // Update total quantity
      state.totalQuantity -= Math.min(quantity, item.quantity);

      if (item.quantity <= quantity) {
        // Remove item completely
        state.items = state.items.filter((item) => item.id !== itemId);
      } else {
        // Decrease quantity
        state.items[existingItemIndex].quantity -= quantity;
      }

      // Recalculate total price
      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice;
