import { cartActions } from "./cart-slice";
import axios from "axios";
const URL = import.meta.env.VITE_REACT_BACKEND_URL;

export const fetchCart = (userId) => {
  return async (dispatch) => {
    dispatch(cartActions.setLoading(true));

    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(`${URL}/api/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(cartActions.replaceCart(response.data.data));
      dispatch(cartActions.setLoading(false));
      console.log("Fetched cart:", response.data.data);
    } catch (error) {
      dispatch(
        cartActions.setError(
          error.response?.data?.message || "Failed to fetch cart"
        )
      );
      dispatch(cartActions.setLoading(false));
      console.error("Error fetching cart:", error);
    }
  };
};

// Thunk action to add item to cart
export const addToCart = (userId, productData, quantity = 1) => {
  return async (dispatch) => {
    try {
      console.log(productData);
      // First update local state for immediate UI response
      const newItem = {
        item_id: Date.now().toString(), // Temporary ID until backend response
        product_id: productData.id,
        title: productData.title,
        image_link:
          productData.images && productData.images.length
            ? productData.images[0]
            : null,
        diameter: productData.diameter || null,
        category: productData.category,
        price: parseFloat(productData.price),
        quantity: parseInt(quantity),
      };

      dispatch(cartActions.addItemToCart(newItem));

      // Then send to backend
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(
        `${URL}/api/cart/${userId}/add`,
        {
          productData,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update with the real data from the backend
      dispatch(cartActions.replaceCart(response.data.data));
    } catch (error) {
      dispatch(
        cartActions.setError(
          error.response?.data?.message || "Failed to add item to cart"
        )
      );
      console.error("Error adding to cart:", error);

      // Fetch the cart again to sync with backend state
      dispatch(fetchCart(userId));
    }
  };
};

// Thunk action to remove item from cart
export const removeFromCart = (userId, itemId, quantity = 1) => {
  return async (dispatch) => {
    try {
      console.log(
        `Removing from cart - itemId: ${itemId}, quantity: ${quantity}`
      );

      // First update local state for immediate UI response
      dispatch(cartActions.removeItemFromCart({ itemId, quantity }));

      // Then send to backend
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(
        `${URL}/api/cart/${userId}/remove`,
        {
          itemId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Backend response after removing:", response.data);

      // Update with the real data from the backend
      dispatch(cartActions.replaceCart(response.data.data));
    } catch (error) {
      console.error("Error removing from cart:", error);
      dispatch(
        cartActions.setError(
          error.response?.data?.message || "Failed to remove item from cart"
        )
      );

      // Fetch the cart again to sync with backend state
      dispatch(fetchCart(userId));
    }
  };
};
// Thunk action to clear cart
export const clearCart = (userId) => {
  return async (dispatch) => {
    try {
      // First update local state for immediate UI response
      dispatch(cartActions.clearCart());

      // Then send to backend
      const token = sessionStorage.getItem("jwtToken");
      await axios.post(
        `${URL}/api/cart/${userId}/clear`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      dispatch(
        cartActions.setError(
          error.response?.data?.message || "Failed to clear cart"
        )
      );
      console.error("Error clearing cart:", error);

      // Fetch the cart again to sync with backend state
      dispatch(fetchCart(userId));
    }
  };
};
