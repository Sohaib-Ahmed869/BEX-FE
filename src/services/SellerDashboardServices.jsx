const URL = import.meta.env.VITE_REACT_BACKEND_URL;

export const fetchProductIds = async (userId) => {
  try {
    const response = await fetch(
      `${URL}/api/sellerdashboard/products/${userId}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch products");
    }

    if (data.success) {
      return data.data; // This returns the array of products
    } else {
      throw new Error(data.message || "Failed to fetch products");
    }
  } catch (error) {
    console.error("Error fetching user products:", error);
    throw error;
  }
};
