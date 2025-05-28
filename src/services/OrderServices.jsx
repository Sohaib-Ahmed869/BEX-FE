import axios from "axios";
const URL = import.meta.env.VITE_REACT_BACKEND_URL;
export const confirmOrder = async (itemId) => {
  try {
    const response = await axios.put(`${URL}/api/orders/confirm/${itemId}`);

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } else {
      throw new Error(response.data.message || "Failed to confirm order");
    }
  } catch (error) {
    if (error.message) {
      throw error; // Re-throw if it's already our custom error
    }
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while confirming the order"
    );
  }
};
export const rejectOrder = async (itemId) => {
  try {
    const response = await axios.put(`${URL}/api/orders/reject/${itemId}`);

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } else {
      throw new Error(response.data.message || "Failed to confirm order");
    }
  } catch (error) {
    if (error.message) {
      throw error; // Re-throw if it's already our custom error
    }
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while confirming the order"
    );
  }
};
export const getSingleOrderItem = async (itemId) => {
  try {
    const response = await axios.get(`${URL}/api/orders/order-item/${itemId}`);

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } else {
      throw new Error(response.data.message || "Failed to fetch order item");
    }
  } catch (error) {
    if (error.message) {
      throw error; // Re-throw if it's already our custom error
    }
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while fetching the order item"
    );
  }
};
