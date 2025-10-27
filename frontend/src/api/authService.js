import axios from "./axios";

export const authService = {
  // Send OTP
  sendOTP: async (userData) => {
    const response = await axios.post("/send-otp", userData);
    return response.data;
  },

  // Signup
  signup: async (userData) => {
    const response = await axios.post("/signup", userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await axios.post("/login", credentials);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axios.get("/logout");
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await axios.get("/profile");
    return response.data;
  },

  // Update profile
  updateProfile: async (formData) => {
    const response = await axios.put("/profile/edit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
