import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { listingService } from "../api/listingService";
import { reviewService } from "../api/reviewService";
import { useAuth } from "../context/AuthContext";
import { FaMapMarkerAlt, FaEdit, FaTrash, FaStar } from "react-icons/fa";

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const data = await listingService.getListingById(id);
      setListing(data);
    } catch (error) {
      console.error("Error fetching listing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await listingService.deleteListing(id);
        alert("Listing deleted successfully!");
        navigate("/listings");
      } catch (error) {
        console.error("Error deleting listing:", error);
        alert("Failed to delete listing");
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await reviewService.createReview(id, {
        review: {
          comment: reviewText,
          rating: rating,
        },
      });
      setReviewText("");
      setRating(5);
      fetchListing(); // Refresh to show new review
      alert("Review added successfully!");
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Failed to add review. Please login first.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await reviewService.deleteReview(id, reviewId);
        fetchListing();
        alert("Review deleted successfully!");
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Failed to delete review");
      }
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Listing not found
        </h2>
        <Link to="/listings" className="text-red-500 hover:underline">
          Back to Listings
        </Link>
      </div>
    );
  }

  const isOwner = user && listing.owner && user._id === listing.owner._id;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        to="/listings"
        className="text-red-500 hover:underline mb-4 inline-block"
      >
        ← Back to Listings
      </Link>

      {/* Listing Details */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="relative h-96">
          <img
            src={listing.image?.url || "https://via.placeholder.com/800x600"}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          {listing.category && (
            <span className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-lg">
              {listing.category}
            </span>
          )}
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {listing.title}
              </h1>
              <p className="text-gray-600 flex items-center gap-2 text-lg">
                <FaMapMarkerAlt className="text-red-500" />
                {listing.location}, {listing.country}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-red-500">
                ₹{listing.price?.toLocaleString()}
              </p>
              <p className="text-gray-600">per night</p>
            </div>
          </div>

          <p className="text-gray-700 text-lg mb-6">{listing.description}</p>

          {listing.owner && (
            <div className="border-t pt-4 mb-6">
              <p className="text-sm text-gray-600">
                Hosted by:{" "}
                <span className="font-semibold">{listing.owner.username}</span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {/* Book Now Button (for non-owners) */}
            {!isOwner && user && (
              <Link
                to={`/listings/${id}/book${searchParams.get("bookingId") ? `?bookingId=${searchParams.get("bookingId")}` : ""}`}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
              >
                Book Now
              </Link>
            )}

            {/* Edit and Delete Buttons (Only for owner) */}
            {isOwner && (
              <>
                <Link
                  to={`/listings/${id}/edit`}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  <FaEdit /> Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <FaTrash /> Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h2>

        {/* Add Review Form (Only if logged in) */}
        {user && (
          <form onSubmit={handleReviewSubmit} className="mb-8 border-b pb-6">
            <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-3xl"
                  >
                    <FaStar
                      className={
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Comment</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Share your experience..."
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Submit Review
            </button>
          </form>
        )}

        {/* Display Reviews */}
        {listing.reviews && listing.reviews.length > 0 ? (
          <div className="space-y-4">
            {listing.reviews.map((review) => (
              <div key={review._id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {review.author?.username || "Anonymous"}
                    </p>
                    <div className="flex gap-1 my-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  {user && review.author && user._id === review.author._id && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>
    </div>
  );
}
