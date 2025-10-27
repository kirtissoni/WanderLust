import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listingService } from "../api/listingService";
import { FaSearch, FaFilter } from "react-icons/fa";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    "Trending",
    "Rooms",
    "Iconic Cities",
    "Mountains",
    "Castles",
    "Amazing Pools",
    "Camping",
    "Farms",
    "Arctic",
  ];

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const data = await listingService.getAllListings();
      setListings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category) => {
    try {
      setLoading(true);
      setSelectedCategory(category);
      if (category === "") {
        await fetchListings();
      } else {
        const data = await listingService.filterByCategory(category);
        setListings(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error filtering listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await listingService.searchListings({ q: searchQuery });
      setListings(Array.isArray(data) ? data : data.listings || []);
    } catch (error) {
      console.error("Error searching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destinations..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
          >
            <FaSearch /> Search
          </button>
        </form>
      </div>

      {/* Category Filters */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-gray-600" />
          <h3 className="text-lg font-semibold">Filter by Category</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryFilter("")}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === ""
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-700 border-gray-300 hover:border-red-500"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === category
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-gray-700 border-gray-300 hover:border-red-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Create New Listing Button */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">
          {selectedCategory ? `${selectedCategory} Listings` : "All Listings"}
        </h2>
        <Link
          to="/listings/new"
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          + Create New Listing
        </Link>
      </div>

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No listings found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Link
              key={listing._id}
              to={`/listings/${listing._id}`}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={
                    listing.image?.url || "https://via.placeholder.com/400x300"
                  }
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {listing.category && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    {listing.category}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                  {listing.title}
                </h3>
                <p className="text-gray-600 mb-2 truncate">
                  {listing.location}
                </p>
                <p className="text-lg font-bold text-red-500">
                  ₹{listing.price?.toLocaleString()} / night
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
