import axios from "./axios";

export const listingService = {
  // Get all listings
  getAllListings: async () => {
    const response = await axios.get("/listings");
    return response.data;
  },

  // Get listing by ID
  getListingById: async (id) => {
    const response = await axios.get(`/listings/${id}`);
    return response.data;
  },

  // Create new listing
  createListing: async (formData) => {
    const response = await axios.post("/listings", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update listing
  updateListing: async (id, formData) => {
    const response = await axios.put(`/listings/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete listing
  deleteListing: async (id) => {
    const response = await axios.delete(`/listings/${id}`);
    return response.data;
  },

  // Filter by category
  filterByCategory: async (category) => {
    const response = await axios.get(`/listings/category/${category}`);
    return response.data;
  },

  // Search listings
  searchListings: async (params) => {
    const response = await axios.get("/listings/search", { params });
    return response.data;
  },
};
