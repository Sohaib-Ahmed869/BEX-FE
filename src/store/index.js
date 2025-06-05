import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cart-slice";
import wishlistSlice from "./wishlist-slice";
import unreadMessagesSlice from "./message-slice";
const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    wishlist: wishlistSlice.reducer,
    unreadMessages: unreadMessagesSlice.reducer,
  },
});
export default store;
