import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../api/authService";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [step, setStep] = useState(1); // 1: form, 2: OTP verification
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const result = await authService.sendOTP({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        setSuccess("OTP sent to your email! Please check your inbox.");
        setStep(2);
      } else {
        setError(result.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Error sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        otp: formData.otp,
      });

      if (result.success) {
        alert("Signup successful! Welcome to WanderLust!");
        navigate("/listings");
      } else {
        setError(result.message || "Signup failed");
      }
    } catch (err) {
      setError("Signup failed. Please check your OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Join WanderLust
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your account and start exploring
          </p>
        </div>

        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Create a strong password"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Re-enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:bg-gray-400 font-semibold"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-red-500 hover:text-red-600 font-semibold"
                >
                  Log in here
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="otp"
                className="block text-gray-700 font-semibold mb-2"
              >
                Enter OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                value={formData.otp}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter 6-digit OTP"
              />
              <p className="mt-2 text-sm text-gray-600">
                Check your email ({formData.email}) for the OTP
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:bg-gray-400 font-semibold"
              >
                {loading ? "Verifying..." : "Verify & Sign Up"}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
