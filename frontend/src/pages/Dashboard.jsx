import React, { useEffect, useState } from "react";
import { Home, Calendar, Star, MapPin, Users } from "lucide-react";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/dashboard", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setDashboard(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading dashboard:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">No data available</p>
      </div>
    );
  }

  const { user, listings, bookings, reviews } = dashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to <span className="font-serif italic font-normal text-5xl text-red-500">Wanderlust</span>
          </h1>
          <p className="text-gray-600">Manage your listings, bookings, and reviews</p>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-500 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12">
              <img
                src={user.profileImage}
                alt={user.username}
                className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
              />
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                <h2 className="text-3xl font-bold text-gray-900">{user.username}</h2>
                <p className="text-gray-600 mt-1">{user.email}</p>
                {user.bio && (
                  <p className="text-gray-700 mt-2 max-w-2xl">{user.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase">Total Listings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{listings.length}</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <Home className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{bookings.length}</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <Calendar className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{reviews.length}</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <Star className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Home className="w-6 h-6 text-red-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">Your Listings</h3>
          </div>
          {listings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((l) => (
                <div
                  key={l._id}
                  className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white border border-gray-100"
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={l.image?.url}
                      alt={l.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{l.title}</h4>
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="line-clamp-1">{l.location}, {l.country}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-red-600">₹{l.price}</p>
                      <span className="text-sm text-gray-500">per night</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">You haven't created any listings yet.</p>
              <button className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Create Your First Listing
              </button>
            </div>
          )}
        </section>

        {/* Bookings Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Calendar className="w-6 h-6 text-red-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">Your Bookings</h3>
          </div>
          {bookings.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-lg text-gray-900">{b.listing?.title}</h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        b.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{b.listing?.location}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-red-600" />
                      <span>
                        {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Users className="w-4 h-4 mr-2 text-red-600" />
                      <span>{b.numberOfGuests} Guests</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Total Price</span>
                      <span className="text-2xl font-bold text-red-600">₹{b.totalPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">You haven't made any bookings yet.</p>
              <button className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Explore Listings
              </button>
            </div>
          )}
        </section>

        {/* Reviews Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Star className="w-6 h-6 text-red-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">Your Reviews</h3>
          </div>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="bg-gradient-to-r from-red-50 to-white rounded-xl p-6 border border-red-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < r.rating ? "text-red-500 fill-red-500" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-bold text-gray-900">{r.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 leading-relaxed">{r.comment}</p>
                  <p className="text-sm text-gray-500">
                    Review for <span className="font-semibold text-gray-700">{r.listing?.title || "Deleted listing"}</span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No reviews yet.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;