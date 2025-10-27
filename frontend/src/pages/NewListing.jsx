import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { listingService } from "../api/listingService";

export default function NewListing() {
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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

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

      await listingService.createListing(data);
      alert("Listing created successfully!");
      navigate("/listings");
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create listing. Please make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Create New Listing
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-8"
      >
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
            placeholder="Enter listing title"
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
            placeholder="Describe your place"
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
              placeholder="1200"
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
              placeholder="City"
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
              placeholder="India"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Upload Image
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
            disabled={loading}
            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:bg-gray-400"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/listings")}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
