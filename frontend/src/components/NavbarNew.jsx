import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaSignOutAlt, FaHome, FaCalendarCheck, FaChevronDown } from "react-icons/fa";

export default function NavbarNew() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-red-500"
          >
            <FaHome />
            <span>WanderLust</span>
          </Link>

          {/* Right side links */}
          <div className="flex items-center gap-6 relative">
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

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 text-gray-700 hover:text-red-500 font-medium transition"
                  >
                    <FaUser className="text-lg" />
                    <span>{user.username}</span>
                    <FaChevronDown
                      className={`transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div
                      onMouseLeave={closeDropdown}
                      className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-50"
                    >
                      <Link
                        to="/profile"
                        onClick={closeDropdown}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-red-500"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={closeDropdown}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-red-500"
                      >
                        Dashboard
                      </Link>
                    </div>
                  )}
                </div>

                {/* Logout button */}
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
