import axios from "axios";
const URL = import.meta.env.VITE_REACT_BACKEND_URL;
export const authenticate = async (email, password) => {
  try {
    const response = await axios.post(`${URL}/api/auth/login`, {
      email,
      password,
    });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.user.role);
    localStorage.setItem("userId", response.data.user.id);
    localStorage.setItem("userName", response.data.user.first_name);
    sessionStorage.setItem("jwtToken", response.data.token);

    return response.data;
  } catch (error) {
    console.log(error);
    // Important: Re-throw the error so it can be caught by handleLogin
    throw error;
  }
};

export const registerBuyer = async (buyerData) => {
  try {
    // Format data according to backend expectations
    const formattedData = {
      email: buyerData.email,
      password: buyerData.password,
      first_name: buyerData.first_name,
      last_name: buyerData.last_name,
      phone: buyerData.phone,
      role: "buyer", // Set the role explicitly for the backend
    };
    console.log("formattedData", formattedData);
    const response = await axios.post(
      `${URL}/api/auth/register-buyer`,
      formattedData
    );
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.user.role);
    localStorage.setItem("userId", response.data.user.id);
    localStorage.setItem("userName", response.data.user.first_name);
    sessionStorage.setItem("jwtToken", response.token);

    return response.data;
  } catch (error) {
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
export const registerSeller = async (sellerData) => {
  try {
    console.log("Sending seller data:", sellerData);

    // Create FormData object
    const formData = new FormData();

    // Append all the text fields
    formData.append("email", sellerData.email);
    formData.append("password", sellerData.password);
    formData.append("name", sellerData.name);
    formData.append("companyName", sellerData.companyName);
    formData.append(
      "companyRegistrationNumber",
      sellerData.companyRegistrationNumber
    );
    formData.append("countryOfRegistration", sellerData.countryOfRegistration);
    formData.append("businessAddress", sellerData.businessAddress);
    formData.append("websiteUrl", sellerData.websiteUrl);
    formData.append("city", sellerData.city);
    formData.append("postalCode", sellerData.postalCode);
    // Append the file if it exists
    if (sellerData.licenseImage && sellerData.licenseImage instanceof File) {
      formData.append("licenseImage", sellerData.licenseImage);
    }

    const response = await axios.post(
      `${URL}/api/auth/register-seller`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.user.role);
    localStorage.setItem("userId", response.data.user.id);
    localStorage.setItem("userName", response.data.user.first_name);
    sessionStorage.setItem("jwtToken", response.data.token); // Fixed: was response.token

    return response.data;
  } catch (error) {
    console.error("Registration error details:", error.response || error);

    // Return the error in a consistent format
    if (error.response) {
      // Server responded with an error status
      throw {
        message: error.response.data.message || "Registration failed",
        error: error.response.data.error || error.response.data,
      };
    } else if (error.request) {
      // Request was made but no response
      throw {
        message: "No response from server",
        error: "Server may be down or unreachable",
      };
    } else {
      // Error in setting up the request
      throw {
        message: "Request configuration error",
        error: error.message,
      };
    }
  }
};
