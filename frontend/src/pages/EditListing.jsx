import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { listingService } from "../api/listingService";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
    category: "Trending",
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const data = await listingService.getListingById(id);
      setFormData({
        title: data.title || "",
        description: data.description || "",
        price: data.price || "",
        location: data.location || "",
        country: data.country || "",
        category: data.category || "Trending",
      });
      setCurrentImage(data.image?.url || "");
    } catch (error) {
      console.error("Error fetching listing:", error);
      alert("Failed to load listing");
      navigate("/listings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("listing[title]", formData.title);
      data.append("listing[description]", formData.description);
      data.append("listing[price]", formData.price);
      data.append("listing[location]", formData.location);
      data.append("listing[country]", formData.country);
      data.append("listing[category]", formData.category);
      if (image) {
        data.append("listing[image]", image);
      }

      await listingService.updateListing(id, data);
      alert("Listing updated successfully!");
      navigate(`/listings/${id}`);
    } catch (error) {
      console.error("Error updating listing:", error);
      alert("Failed to update listing");
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Listing</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        {currentImage && (
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Current Image
            </label>
            <img
              src={currentImage}
              alt="Current listing"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Price (₹/night) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Country *
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Upload New Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:bg-gray-400"
          >
            {submitting ? "Updating..." : "Update Listing"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/listings/${id}`)}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
