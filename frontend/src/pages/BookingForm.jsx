import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookingService } from "../api/bookingService";
import { useAuth } from "../context/AuthContext";
import { FaCalendar, FaUsers, FaRupeeSign } from "react-icons/fa";

export default function BookingForm() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    numberOfGuests: 1,
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);

  useEffect(() => {
    if (!user) {
      alert("Please login to book a listing");
      navigate("/login");
      return;
    }
    fetchListing();
  }, [listingId, user]);

  useEffect(() => {
    calculatePrice();
  }, [formData.checkIn, formData.checkOut, listing]);

  const fetchListing = async () => {
    try {
      const data = await bookingService.getListingForBooking(listingId);
      setListing(data);
    } catch (error) {
      console.error("Error fetching listing:", error);
      alert("Failed to load listing");
      navigate("/listings");
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (formData.checkIn && formData.checkOut && listing) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const nightsCount = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
      );

      if (nightsCount > 0) {
        setNights(nightsCount);
        setTotalPrice(nightsCount * listing.price);
      } else {
        setNights(0);
        setTotalPrice(0);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nights <= 0) {
      alert("Please select valid check-in and check-out dates");
      return;
    }

    setSubmitting(true);

    try {
      const result = await bookingService.createBooking(listingId, formData);
      alert(result.message);
      navigate("/bookings/my-bookings");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Listing not found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Book Your Stay</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Listing Info */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <img
            src={listing.image?.url || "https://via.placeholder.com/400x300"}
            alt={listing.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {listing.title}
          </h2>
          <p className="text-gray-600 mb-2">
            {listing.location}, {listing.country}
          </p>
          <p className="text-xl font-bold text-red-500">
            ₹{listing.price?.toLocaleString()} / night
          </p>
          {listing.description && (
            <p className="text-gray-700 mt-4">{listing.description}</p>
          )}
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <FaCalendar className="text-red-500" />
                Check-in Date *
              </label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <FaCalendar className="text-red-500" />
                Check-out Date *
              </label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                required
                min={formData.checkIn || new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <FaUsers className="text-red-500" />
                Number of Guests *
              </label>
              <input
                type="number"
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Price Summary */}
            {nights > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Price Summary</h3>
                <div className="flex justify-between mb-2">
                  <span>
                    ₹{listing.price?.toLocaleString()} × {nights} night
                    {nights > 1 ? "s" : ""}
                  </span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-red-500 flex items-center">
                      <FaRupeeSign className="text-sm" />
                      {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting || nights <= 0}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:bg-gray-400 font-semibold"
              >
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/listings/${listingId}`)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
