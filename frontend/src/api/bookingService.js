import axios from "./axios";

export const bookingService = {
  // Get listing details for booking
  getListingForBooking: async (listingId) => {
    const response = await axios.get(`/listings/${listingId}/bookings/new`);
    return response.data;
  },

  // Create new booking
  createBooking: async (listingId, bookingData) => {
    const response = await axios.post(
      `/listings/${listingId}/bookings`,
      bookingData
    );
    return response.data;
  },

  // Get all user bookings
  getMyBookings: async () => {
    const response = await axios.get("/bookings/my-bookings");
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    const response = await axios.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  },
};
