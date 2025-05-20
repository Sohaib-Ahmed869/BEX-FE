import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cart-slice";
import orderSlice from "./Order-Slice";
const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});
export default store;
