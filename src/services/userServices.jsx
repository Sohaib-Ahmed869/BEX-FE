// Service function to convert buyer to seller
const URL = import.meta.env.VITE_REACT_BACKEND_URL;
export const convertToSeller = async (userId, sellerData) => {
  try {
    console.log("Converting buyer to seller:", sellerData);

    // Create FormData object
    const formData = new FormData();

    // Append all the text fields
    formData.append("companyName", sellerData.companyName);
    formData.append(
      "companyRegistrationNumber",
      sellerData.companyRegistrationNumber
    );
    formData.append("countryOfRegistration", sellerData.countryOfRegistration);
    formData.append("businessAddress", sellerData.businessAddress);
    formData.append("websiteUrl", sellerData.websiteUrl);

    // Append the file if it exists
    if (sellerData.licenseImage && sellerData.licenseImage instanceof File) {
      formData.append("licenseImage", sellerData.licenseImage);
    }

    const response = await fetch(
      `${URL}/api/user/convert-to-seller/${userId}`,
      {
        method: "PUT",
        headers: {
          // Don't set Content-Type header when sending FormData
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to convert to seller");
    }

    if (data.success) {
      // Update local storage with new role
      localStorage.setItem("role", "seller");
      return data;
    } else {
      throw new Error(data.message || "Failed to convert to seller");
    }
  } catch (error) {
    console.error("Convert to seller error:", error);

    // Return the error in a consistent format
    if (error.response) {
      throw {
        message: error.response.data.message || "Conversion failed",
        error: error.response.data.error || error.response.data,
      };
    } else if (error.request) {
      throw {
        message: "No response from server",
        error: "Server may be down or unreachable",
      };
    } else {
      throw {
        message: error.message || "Request configuration error",
        error: error.message,
      };
    }
  }
};

export const fetchUserDetails = async (userId) => {
  const URL = import.meta.env.VITE_REACT_BACKEND_URL || "http://localhost:5000";

  try {
    const response = await fetch(`${URL}/api/user/${userId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user details");
    }

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || "Failed to fetch user details");
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};
