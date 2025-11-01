const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Review = require("../models/review");

// Middleware to ensure user is logged in
const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Please login to access dashboard" });
  }
  next();
};

// Dashboard route
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");
    const listings = await Listing.find({ owner: userId }).populate("reviews");
    const bookings = await Booking.find({ user: userId }).populate("listing");
    const reviews = await Review.find({ author: userId }).populate("listing");

    res.json({
      user,
      listings,
      bookings,
      reviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
