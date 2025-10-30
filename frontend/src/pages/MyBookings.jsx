import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      const storageKey = `wl_bookings_${user?._id || "guest"}`;
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const sorted = stored.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(sorted);
    } catch (error) {
      console.error("Error fetching bookings (frontend):", error);
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
      const storageKey = `wl_bookings_${user?._id || "guest"}`;
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const updated = stored.map((b) =>
        b._id === bookingId ? { ...b, status: "cancelled" } : b
      );
      localStorage.setItem(storageKey, JSON.stringify(updated));
      alert("Booking cancelled successfully.");
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking (frontend):", error);
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
        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-medium text-gray-600">
          Loading your bookings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendar className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              No bookings yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring and book your perfect stay!
            </p>
            <button
              onClick={() => navigate("/listings")}
              className="px-6 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Browse Listings
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
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
                      className="w-full h-52 object-cover rounded-xl mb-4"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {booking.listing?.title || "Listing Unavailable"}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-500 text-xs" />
                      {booking.listing?.location}, {booking.listing?.country}
                    </p>
                  </div>

                  {/* Booking Details */}
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="text-lg font-bold text-gray-900">
                        Booking Details
                      </h4>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-2 uppercase tracking-wide font-semibold">
                          <FaCalendar className="text-red-500" />
                          Check-in
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {formatDate(booking.checkIn)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-2 uppercase tracking-wide font-semibold">
                          <FaCalendar className="text-red-500" />
                          Check-out
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {formatDate(booking.checkOut)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-2 uppercase tracking-wide font-semibold">
                          <FaUsers className="text-red-500" />
                          Guests
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {booking.numberOfGuests}
                        </p>
                      </div>

                      {booking.fullName && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">Name</p>
                          <p className="text-base font-semibold text-gray-900">
                            {booking.fullName}
                          </p>
                        </div>
                      )}

                      {booking.contact && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">Contact</p>
                          <p className="text-base font-semibold text-gray-900">
                            {booking.contact}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-2 uppercase tracking-wide font-semibold">
                          <FaRupeeSign className="text-red-500" />
                          Total Price
                        </p>
                        <p className="text-lg font-bold text-red-600">
                          ₹{booking.totalPrice?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
                      <button
                        onClick={() =>
                          navigate(
                            booking.status !== "cancelled"
                              ? `/listings/${booking.listing?._id}?bookingId=${booking._id}`
                              : `/listings/${booking.listing?._id}`
                          )
                        }
                        className="px-5 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition"
                      >
                        View Listing
                      </button>

                      {booking.status !== "cancelled" && (
                        <button
                          onClick={() =>
                            navigate(`/listings/${booking.listing?._id}/book?bookingId=${booking._id}`)
                          }
                          className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
                        >
                          Update
                        </button>
                      )}

                      {booking.status !== "cancelled" && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition"
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
    </div>
  );
}