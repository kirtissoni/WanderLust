import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaSignOutAlt, FaHome, FaCalendarCheck } from "react-icons/fa";

export default function NavbarNew() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-red-500"
          >
            <FaHome />
            <span>WanderLust</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/listings"
              className="text-gray-700 hover:text-red-500 font-medium transition"
            >
              Explore
            </Link>

            {user ? (
              <>
                <Link
                  to="/bookings/my-bookings"
                  className="flex items-center gap-2 text-gray-700 hover:text-red-500 font-medium transition"
                >
                  <FaCalendarCheck />
                  My Bookings
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-red-500 font-medium transition"
                >
                  <FaUser />
                  {user.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-red-500 font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
