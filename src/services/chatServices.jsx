import axios from "axios";

const URL = import.meta.env.VITE_REACT_BACKEND_URL;

export const initiateChat = async (userId, productId) => {
  try {
    const response = await axios.post(`${URL}/api/chat/initiate/${userId}`, {
      product_id: productId,
    });

    if (response.data.success) {
      // Navigate to /user/chats on success
      window.location.href = "/user/chats";

      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    }
  } catch (error) {
    if (error.message) {
      throw error; // Re-throw if it's already our custom error
    }
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while initiating the chat"
    );
  }
};
export const initiateSellerChat = async (userId, orderItemId) => {
  try {
    const response = await axios.post(
      `${URL}/api/chat/initiateSellerChat/${userId}`,
      {
        orderItemId: orderItemId,
      }
    );

    if (response.data.success) {
      // Navigate to /user/chats on success
      window.location.href = "/seller/chats";

      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    }
  } catch (error) {
    if (error.message) {
      throw error; // Re-throw if it's already our custom error
    }
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while initiating the chat"
    );
  }
};
export const initiateBuyerOrderChat = async (userId, orderItemId) => {
  try {
    const response = await axios.post(
      `${URL}/api/chat/initiateBuyerOrderChat/${userId}`,
      {
        orderItemId: orderItemId,
      }
    );

    if (response.data.success) {
      // Navigate to /user/chats on success
      window.location.href = "/user/chats";

      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    }
  } catch (error) {
    if (error.message) {
      throw error; // Re-throw if it's already our custom error
    }
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while initiating the chat"
    );
  }
};
