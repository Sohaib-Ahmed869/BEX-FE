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
    return response.data;
  } catch (error) {
    console.log(error);
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

    const response = await axios.post(
      `${URL}/api/auth/register-seller`,
      sellerData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.user.role);
    localStorage.setItem("userId", response.data.user.id);
    localStorage.setItem("userName", response.data.user.first_name);
    sessionStorage.setItem("jwtToken", response.token);

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
