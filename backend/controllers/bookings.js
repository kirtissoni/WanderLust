const Booking = require("../models/booking");
const Listing = require("../models/listing");
const {
  sendBookingConfirmation,
  sendBookingCancellation,
} = require("../utils/emailService");

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
  console.log("🔵 CREATE BOOKING REQUEST RECEIVED");
  console.log("Request body:", req.body);
  console.log("User:", req.user?.email);
  
  try {
    const listing = await Listing.findById(req.params.listingId).populate(
      "owner"
    );
    if (!listing) {
      return res.status(404).json({ error: "Listing not found!" });
    }

    const { checkIn, checkOut, numberOfGuests, fullName, contact } = req.body;

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
    console.log("📝 Booking saved successfully, ID:", booking._id);

    // Send confirmation email
    console.log("📧 Attempting to send email to:", req.user.email);
    try {
      const emailData = {
        userEmail: req.user.email,
        userName: req.user.username,
        listingTitle: listing.title,
        listingLocation: `${listing.location}, ${listing.country}`,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        numberOfGuests,
        totalPrice,
        nights,
        bookingId: booking._id,
        fullName: fullName || req.user.username,
        contact: contact || "",
      };
      console.log("📧 Email data prepared:", emailData.userEmail);
      await sendBookingConfirmation(emailData);
      console.log("✅ Email sent successfully!");
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError.message);
      console.error("Full error:", emailError);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully! Confirmation email sent.",
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
    const booking = await Booking.findById(req.params.bookingId).populate(
      "listing"
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Send cancellation email
    try {
      await sendBookingCancellation({
        userEmail: req.user.email,
        userName: req.user.username,
        listingTitle: booking.listing.title,
        bookingId: booking._id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
      });
    } catch (emailError) {
      console.error("Cancellation email failed:", emailError);
      // Continue even if email fails
    }

    res.json({
      success: true,
      message: "Booking cancelled successfully. Confirmation email sent.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
