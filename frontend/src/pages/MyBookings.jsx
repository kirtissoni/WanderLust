import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookingService } from "../api/bookingService";
import { useAuth } from "../context/AuthContext";
import {
  FaCalendar,
  FaUsers,
  FaMapMarkerAlt,
  FaRupeeSign,
} from "react-icons/fa";

export default function MyBookings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      alert("Please login to view your bookings");
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const result = await bookingService.cancelBooking(bookingId);
      alert(result.message);
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold text-gray-600">
          Loading your bookings...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            No bookings yet
          </h2>
          <p className="text-gray-600 mb-6">
            Start exploring and book your perfect stay!
          </p>
          <button
            onClick={() => navigate("/listings")}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Browse Listings
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                {/* Listing Image and Info */}
                <div className="md:col-span-1">
                  <img
                    src={
                      booking.listing?.image?.url ||
                      "https://via.placeholder.com/400x300"
                    }
                    alt={booking.listing?.title}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {booking.listing?.title || "Listing Unavailable"}
                  </h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    {booking.listing?.location}, {booking.listing?.country}
                  </p>
                </div>

                {/* Booking Details */}
                <div className="md:col-span-2">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-semibold text-gray-700">
                      Booking Details
                    </h4>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                        <FaCalendar className="text-red-500" />
                        Check-in
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatDate(booking.checkIn)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                        <FaCalendar className="text-red-500" />
                        Check-out
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatDate(booking.checkOut)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                        <FaUsers className="text-red-500" />
                        Guests
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {booking.numberOfGuests}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                        <FaRupeeSign className="text-red-500" />
                        Total Price
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        ₹{booking.totalPrice?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() =>
                        navigate(`/listings/${booking.listing?._id}`)
                      }
                      className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                    >
                      View Listing
                    </button>

                    {booking.status === "pending" && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
