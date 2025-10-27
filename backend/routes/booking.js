const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");
const wrapAsync = require("../utils/wrapAsync.js");

// Get listing details for booking
router.get("/new", isLoggedIn, wrapAsync(bookingController.getBookingForm));

// Create new booking
router.post("/", isLoggedIn, wrapAsync(bookingController.createBooking));

// Get all bookings for current user
router.get(
  "/my-bookings",
  isLoggedIn,
  wrapAsync(bookingController.showUserBookings)
);

// Cancel booking
router.put(
  "/:bookingId/cancel",
  isLoggedIn,
  wrapAsync(bookingController.cancelBooking)
);

module.exports = router;
