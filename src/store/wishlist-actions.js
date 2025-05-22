import { wishlistActions } from "./wishlist-slice";
import axios from "axios";
const URL = import.meta.env.VITE_REACT_BACKEND_URL;

/**
 * Fetch a user's wishlist
 */
export const fetchWishlist = (userId) => {
  return async (dispatch) => {
    dispatch(wishlistActions.setLoading(true));

    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(`${URL}/api/wishlist/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("wishlist", response.data.data);
      dispatch(wishlistActions.replaceWishlist(response.data.data));
      console.log("Fetched wishlist:", response.data.data);
    } catch (error) {
      dispatch(
        wishlistActions.setError(
          error.response?.data?.message || "Failed to fetch wishlist"
        )
      );
      console.error("Error fetching wishlist:", error);
    }
  };
};

/**
 * Add a product to the wishlist
 */
export const addToWishlist = (userId, productData) => {
  return async (dispatch) => {
    try {
      // First update local state for immediate UI response
      const newItem = {
        product_id: productData.id,
        title: productData.title,
        brand: productData.brand || null,
        category: productData.category,
        diameter: productData.diameter || null,
        image_link:
          productData.images && productData.images.length
            ? productData.images[0]
            : null,
        price: parseFloat(productData.price),
      };

      dispatch(wishlistActions.addItemToWishlist(newItem));

      // Then send to backend
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(
        `${URL}/api/wishlist/${userId}/add`,
        {
          productData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update with the real data from the backend
      dispatch(wishlistActions.replaceWishlist(response.data.data));
      return response.data;
    } catch (error) {
      dispatch(
        wishlistActions.setError(
          error.response?.data?.message || "Failed to add item to wishlist"
        )
      );
      console.error("Error adding to wishlist:", error);

      // Fetch the wishlist again to sync with backend state
      dispatch(fetchWishlist(userId));
      throw error;
    }
  };
};

/**
 * Remove an item from the wishlist
 */
export const removeFromWishlist = (userId, itemId) => {
  return async (dispatch) => {
    try {
      // First update local state for immediate UI response
      dispatch(wishlistActions.removeItemFromWishlist({ itemId }));

      // Then send to backend
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(
        `${URL}/api/wishlist/${userId}/remove`,
        {
          itemId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update with the real data from the backend
      dispatch(wishlistActions.replaceWishlist(response.data.data));
      return response.data;
    } catch (error) {
      dispatch(
        wishlistActions.setError(
          error.response?.data?.message || "Failed to remove item from wishlist"
        )
      );
      console.error("Error removing from wishlist:", error);

      // Fetch the wishlist again to sync with backend state
      dispatch(fetchWishlist(userId));
      throw error;
    }
  };
};

/**
 * Clear the entire wishlist
 */
export const clearWishlist = (userId) => {
  return async (dispatch) => {
    try {
      // First update local state for immediate UI response
      dispatch(wishlistActions.clearWishlist());

      // Then send to backend
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(
        `${URL}/api/wishlist/${userId}/clear`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Return the empty wishlist data
      return response.data;
    } catch (error) {
      dispatch(
        wishlistActions.setError(
          error.response?.data?.message || "Failed to clear wishlist"
        )
      );
      console.error("Error clearing wishlist:", error);

      // Fetch the wishlist again to sync with backend state
      dispatch(fetchWishlist(userId));
      throw error;
    }
  };
};

/**
 * Check if a product is in the wishlist
 */
export const checkWishlistItem = (userId, productId) => {
  return async () => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(
        `${URL}/api/wishlist/${userId}/check/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error checking wishlist item:", error);
      throw error;
    }
  };
};
