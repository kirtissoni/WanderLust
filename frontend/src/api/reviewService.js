import axios from "./axios";

export const reviewService = {
  // Create review
  createReview: async (listingId, reviewData) => {
    const response = await axios.post(
      `/listings/${listingId}/reviews`,
      reviewData
    );
    return response.data;
  },

  // Delete review
  deleteReview: async (listingId, reviewId) => {
    const response = await axios.delete(
      `/listings/${listingId}/reviews/${reviewId}`
    );
    return response.data;
  },
};
