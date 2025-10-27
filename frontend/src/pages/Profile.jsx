import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../api/authService";
import { FaEdit, FaUser } from "react-icons/fa";

export default function Profile() {
  const { user, checkAuth } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("bio", formData.bio);
      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      const result = await authService.updateProfile(data);
      if (result.success) {
        alert("Profile updated successfully!");
        setEditing(false);
        checkAuth(); // Refresh user data
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Please log in to view your profile
        </h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>

        <div className="flex items-center gap-6 mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="text-6xl text-gray-400" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {user.username}
            </h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Profile Image
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
                {loading ? "Updating..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Bio</h3>
              <p className="text-gray-600">{user.bio || "No bio added yet."}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
