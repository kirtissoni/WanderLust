const Booking = require("../models/booking");
const Listing = require("../models/listing");

// Get booking form data (listing details)
module.exports.getBookingForm = async (req, res) => {
  const listing = await Listing.findById(req.params.listingId);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found!" });
  }
  res.json(listing);
};

// Create new booking
module.exports.createBooking = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found!" });
    }

    const { checkIn, checkOut, numberOfGuests } = req.body;

    // Calculate total price
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) {
      return res.status(400).json({ error: "Invalid date range" });
    }

    const totalPrice = nights * listing.price;

    const booking = new Booking({
      listing: listing._id,
      user: req.user._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      numberOfGuests,
      totalPrice,
      status: "confirmed",
    });

    await booking.save();
    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully!",
      booking,
      nights,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Show user's bookings
module.exports.showUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("listing")
      .sort("-createdAt");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch bookings" });
  }
};

// Cancel booking
module.exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
