const URL = import.meta.env.VITE_REACT_BACKEND_URL;
import axios from "axios";
// Get all listings
export const getAllListings = async () => {
  try {
    const response = await fetch(`${URL}/api/product-listings`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
};

// Get listings by user ID
export const getUserListings = async (userId) => {
  try {
    const response = await fetch(`${URL}/api/product-listings/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user listings:", error);
    throw error;
  }
};

// Add new listing
export const addListing = async (userId, formData) => {
  try {
    const response = await fetch(`${URL}/api/product-listings/add/${userId}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding listing:", error);
    throw error;
  }
};

// Delete listing
export const deleteListing = async (listingId) => {
  try {
    const response = await fetch(`${URL}/api/product-listings/${listingId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
};

// Get listing by ID
export const getListingById = async (listingId) => {
  try {
    const response = await fetch(`${URL}/api/product-listings/${listingId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching listing:", error);
    throw error;
  }
};

export const fetchListingSpecificProducts = async (listingId) => {
  try {
    const response = await axios.get(
      `${URL}/api/listing/inventory/${listingId}`
    );

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        count: response.data.count,
      };
    } else {
      throw new Error(response.data.message || "Failed to fetch products");
    }
  } catch (error) {
    if (error.message) {
      throw error; // Re-throw if it's already our custom error
    }
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while fetching products"
    );
  }
};
