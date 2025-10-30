import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { listingService } from "../api/listingService";
import { useAuth } from "../context/AuthContext";
import { FaCalendar, FaUsers, FaRupeeSign } from "react-icons/fa";

export default function BookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    numberOfGuests: 1,
    fullName: "",
    contact: "",
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const bookingIdParam = searchParams.get("bookingId");
  const isEditing = !!bookingIdParam;
  const [allowEdit, setAllowEdit] = useState(!!bookingIdParam);

  useEffect(() => {
    if (!user) {
      alert("Please login to book a listing");
      navigate("/login");
      return;
    }
    fetchListing();
    if (user?.username) {
      setFormData((prev) => ({ ...prev, fullName: user.username }));
    }
    // Prefill when editing
    if (bookingIdParam) {
      const storageKey = `wl_bookings_${user?._id || "guest"}`;
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const existing = stored.find((b) => b._id === bookingIdParam);
      if (existing && existing.status !== "cancelled") {
        setAllowEdit(true);
        setFormData((prev) => ({
          ...prev,
          checkIn: existing.checkIn || "",
          checkOut: existing.checkOut || "",
          numberOfGuests: existing.numberOfGuests || 1,
          fullName: existing.fullName || user?.username || "",
          contact: existing.contact || "",
        }));
      } else {
        // missing or cancelled -> treat as new booking (no edit)
        setAllowEdit(false);
      }
    }
  }, [id, user, bookingIdParam]);

  useEffect(() => {
    calculatePrice();
  }, [formData.checkIn, formData.checkOut, listing]);

  const fetchListing = async () => {
    try {
      const data = await listingService.getListingById(id);
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
      const storageKey = `wl_bookings_${user?._id || "guest"}`;
      const arr = JSON.parse(localStorage.getItem(storageKey) || "[]");

      if (allowEdit) {
        const updated = arr.map((b) =>
          b._id === bookingIdParam
            ? {
                ...b,
                listing: {
                  _id: listing._id,
                  title: listing.title,
                  location: listing.location,
                  country: listing.country,
                  image: listing.image,
                  price: listing.price,
                },
                checkIn: formData.checkIn,
                checkOut: formData.checkOut,
                numberOfGuests: Number(formData.numberOfGuests) || 1,
                totalPrice,
                nights,
                fullName: formData.fullName,
                contact: formData.contact,
              }
            : b
        );
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } else {
        const bookingId = `${Date.now()}`;
        const booking = {
          _id: bookingId,
          listing: {
            _id: listing._id,
            title: listing.title,
            location: listing.location,
            country: listing.country,
            image: listing.image,
            price: listing.price,
          },
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          numberOfGuests: Number(formData.numberOfGuests) || 1,
          totalPrice,
          status: "confirmed",
          userId: user?._id,
          createdAt: new Date().toISOString(),
          nights,
          fullName: formData.fullName,
          contact: formData.contact,
        };
        arr.push(booking);
        localStorage.setItem(storageKey, JSON.stringify(arr));
      }

      setConfirmed(true);
    } catch (error) {
      console.error("Error creating booking (frontend):", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Listing not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Book Your Stay</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Listing Info */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-fit sticky top-8">
            <img
              src={listing.image?.url || "https://via.placeholder.com/400x300"}
              alt={listing.title}
              className="w-full h-72 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {listing.title}
              </h2>
              <p className="text-gray-600 mb-3">
                {listing.location}, {listing.country}
              </p>
              <p className="text-2xl font-bold text-red-600">
                ₹{listing.price?.toLocaleString()} / night
              </p>
              {listing.description && (
                <p className="text-gray-700 mt-4 leading-relaxed text-sm">{listing.description}</p>
              )}
            </div>
          </div>

          {/* Booking Form / Confirmation */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {!confirmed ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact (Email or Phone) *
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com or +91-xxxxxxxxxx"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaCalendar className="text-red-500 text-xs" />
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaCalendar className="text-red-500 text-xs" />
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    required
                    min={formData.checkIn || new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaUsers className="text-red-500 text-xs" />
                    Number of Guests *
                  </label>
                  <input
                    type="number"
                    name="numberOfGuests"
                    value={formData.numberOfGuests}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Price Summary */}
                {nights > 0 && (
                  <div className="p-5 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100">
                    <h3 className="text-base font-bold mb-3 text-gray-900">Price Summary</h3>
                    <div className="flex justify-between mb-2 text-sm text-gray-700">
                      <span>
                        ₹{listing.price?.toLocaleString()} × {nights} night{nights > 1 ? "s" : ""}
                      </span>
                      <span className="font-semibold">₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-red-200 pt-3 mt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-gray-900">Total</span>
                        <span className="text-red-600 flex items-center">
                          <FaRupeeSign className="text-base" />
                          {totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting || nights <= 0}
                    className="flex-1 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {submitting ? (allowEdit ? "Saving..." : "Booking...") : allowEdit ? "Save Changes" : "Confirm Booking"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/listings/${id}`)}
                    className="px-5 py-2.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  {allowEdit && (
                    <button
                      type="button"
                      onClick={() => navigate(`/listings?bookingId=${bookingIdParam}`)}
                      className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                      Change Listing
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  A confirmation email has been sent to your registered email address. (Mock message)
                </p>
                <div className="mb-6 p-5 bg-gray-50 rounded-xl text-left space-y-2">
                  <h4 className="text-base font-bold mb-3 text-gray-900">Booking Summary</h4>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Check-in:</span> {new Date(formData.checkIn).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Check-out:</span> {new Date(formData.checkOut).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Guests:</span> {formData.numberOfGuests}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Name:</span> {formData.fullName}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Contact:</span> {formData.contact}
                  </p>
                  <p className="font-bold mt-3 text-red-600 text-base">
                    Total Paid: ₹{totalPrice.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => navigate("/bookings/my-bookings")}
                    className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition"
                  >
                    Go to My Bookings
                  </button>
                  <button
                    onClick={() => navigate(`/listings/${id}`)}
                    className="px-5 py-2.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition"
                  >
                    View Listing
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}