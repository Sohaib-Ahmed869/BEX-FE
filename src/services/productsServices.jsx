import axios from "axios";
const URL = import.meta.env.VITE_REACT_BACKEND_URL;

export const addProduct = async (userId, formData) => {
  try {
    // Make sure we're using the correct URL format

    const response = await axios.post(
      `${URL}/api/products/add/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);

    // Return the error in a consistent format
    if (error.response) {
      // Server responded with an error status
      return {
        success: false,
        error: error.response.data,
        status: error.response.status,
      };
    } else if (error.request) {
      // Request was made but no response
      return {
        success: false,
        error: "No response from server",
        status: 503,
      };
    } else {
      // Error in setting up the request
      return {
        success: false,
        error: error.message,
        status: 400,
      };
    }
  }
};
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${URL}/api/products/${productId}`, {
      headers: {
        // Add authorization header if you're using JWT authentication
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust based on where you store the token
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);

    // Return the error in a consistent format
    if (error.response) {
      // Server responded with an error status
      return {
        success: false,
        error: error.response.data,
        status: error.response.status,
      };
    } else if (error.request) {
      // Request was made but no response
      return {
        success: false,
        error: "No response from server",
        status: 503,
      };
    } else {
      // Error in setting up the request
      return {
        success: false,
        error: error.message,
        status: 400,
      };
    }
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(
      `${URL}/api/products/getproductbyId/${productId}`,
      {
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching product:", error);

    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        error: error.response.data.message || "Failed to fetch product",
        statusCode: error.response.status,
      };
    } else if (error.request) {
      // Network error
      return {
        success: false,
        error: "Network error - please check your connection",
      };
    } else {
      // Other error
      return {
        success: false,
        error: error.message,
      };
    }
  }
};
export const updateProduct = async (productId, productData, newFiles = []) => {
  try {
    // Get auth token from localStorage
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      return {
        success: false,
        error: { message: "Authentication required. Please log in again." },
        status: 401,
      };
    }

    // Create form data object
    const formData = new FormData();

    // Add basic product data fields
    formData.append("title", productData.title);
    formData.append("category", productData.category);
    formData.append("description", productData.description || "");
    formData.append("price", productData.price);
    formData.append("quantity", productData.quantity);
    formData.append("condition", productData.condition);
    formData.append("location", productData.location || "");
    formData.append("list_for_selling", productData.list_for_selling);
    formData.append("is_active", productData.is_active);

    if (productData.subtype) {
      formData.append("subtype", productData.subtype);
    }

    // Handle requires_retipping if present
    if (productData.requires_retipping !== undefined) {
      formData.append("requires_retipping", productData.requires_retipping);
    }

    // Handle images according to the backend's exact processing logic
    if (productData.images && productData.images.length > 0) {
      /*
       * The backend code does:
       * 1. Checks if productData.images exists
       * 2. If it's a string, parses it with JSON.parse
       * 3. Filters for img.isExisting === true
       * 4. Maps to img.url || img
       */

      // We need to send the exact structure expected by the backend
      const frontendImages = productData.images
        .map((img) => {
          if (img.isExisting) {
            return {
              isExisting: true,
              url: img.url,
            };
          }
          return null;
        })
        .filter(Boolean); // Remove null values

      // Send the array of objects with isExisting and url properties
      formData.append("images", JSON.stringify(frontendImages));

      // Append new files - these will be uploaded to S3 by the backend
      const newImages = productData.images.filter(
        (img) => !img.isExisting && img.file
      );
      newImages.forEach((img) => {
        formData.append("files", img.file);
      });
    }

    // Handle newly added files separately if needed
    if (newFiles && newFiles.length > 0) {
      newFiles.forEach((file) => {
        formData.append("files", file);
      });
    }

    // Handle specifications - prioritize specs object over specifications
    const specsToUse = productData.specs || productData.specifications || {};
    formData.append("specifications", JSON.stringify(specsToUse));

    // Handle retipping data for Core Drill Bits
    if (
      productData.category === "Core Drill Bits" &&
      productData.requires_retipping
    ) {
      const retippingData = {
        diameter:
          productData.retippingDetails.diameter || specsToUse.diameter || "",
        enable_diy: productData.retippingDetails.enable_diy || false,
        per_segment_price: productData.retippingDetails.per_segment_price || 0,
        segments: productData.retippingDetails.segments || 0,
        total_price: productData.retippingDetails.total_price || 0,
      };

      formData.append("retipping", JSON.stringify(retippingData));
    }

    // Make API request with authorization header
    const response = await axios.put(
      `${URL}/api/products/update/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("API Error updating product:", error);

    // Return the error in a consistent format
    if (error.response) {
      // Server responded with an error status
      return {
        success: false,
        error: error.response.data,
        status: error.response.status,
      };
    } else if (error.request) {
      // Request was made but no response
      return {
        success: false,
        error: "No response from server",
        status: 503,
      };
    } else {
      // Error in setting up the request
      return {
        success: false,
        error: error.message,
        status: 400,
      };
    }
  }
};
export const fetchSellerProducts = async (userId) => {
  try {
    const response = await axios.get(`${URL}/api/products/${userId}`);

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

// get all products
export const fetchAllProducts = async () => {
  try {
    const response = await axios.get(`${URL}/api/products`);

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
