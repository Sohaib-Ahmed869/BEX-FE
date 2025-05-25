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
      // Map the items to ensure consistent property names
      state.items = cart.items
        ? cart.items.map((item) => ({
            ...item,
            // Normalize the retip properties - keep both for compatibility
            retipAdded: item.retip_added || item.retipAdded || false,
            retipPrice: item.retip_price || item.retipPrice || 0,
            retip_added: item.retip_added || item.retipAdded || false,
            retip_price: item.retip_price || item.retipPrice || 0,
          }))
        : [];

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
        // Add new item with retip properties (both formats for compatibility)
        state.items.push({
          ...newItem,
          retipAdded: false,
          retipPrice: 0,
          retip_added: false,
          retip_price: 0,
        });
      } else {
        // Update existing item
        state.items[existingItemIndex].quantity += newItem.quantity;
      }

      // Recalculate total price (excluding retip prices)
      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    removeItemFromCart(state, action) {
      const { itemId, quantity } = action.payload;
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

      // Recalculate total price (excluding retip prices)
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
    // Updated action to add retip service to an item
    addRetipToItem(state, action) {
      const { itemId, retipPrice } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === itemId
      );

      if (existingItemIndex !== -1) {
        // Update both property formats for consistency
        state.items[existingItemIndex].retipAdded = true;
        state.items[existingItemIndex].retipPrice = retipPrice;
        state.items[existingItemIndex].retip_added = true;
        state.items[existingItemIndex].retip_price = retipPrice;
      }
    },
    // Updated action to remove retip service from an item
    removeRetipFromItem(state, action) {
      const { itemId } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === itemId
      );

      if (existingItemIndex !== -1) {
        // Update both property formats for consistency
        state.items[existingItemIndex].retipAdded = false;
        state.items[existingItemIndex].retipPrice = 0;
        state.items[existingItemIndex].retip_added = false;
        state.items[existingItemIndex].retip_price = 0;
      }
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice;
