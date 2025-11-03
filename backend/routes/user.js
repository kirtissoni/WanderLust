const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { isLoggedIn } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js"); // Cloudinary storage setup
const upload = multer({ storage });
const userController = require("../controllers/users.js");

// ================== Auth Routes ==================

// SignUp with OTP verification
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

// Send OTP API (AJAX)
router.post("/send-otp", wrapAsync(userController.sendOTP));

// Login
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post((req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          success: false,
          message: info?.message || "Invalid username or password",
        });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return userController.login(req, res);
      });
    })(req, res, next);
  });

// Logout
router.get("/logout", userController.logout);

// ================== Profile Routes ==================

// View Profile
router.get("/profile", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Unable to load profile!" });
  }
});

// Edit Profile Form
router.get("/profile/edit", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Unable to load edit profile page!" });
  }
});

// Handle Profile Edit
router.put(
  "/profile/edit",
  isLoggedIn,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { username, email, bio } = req.body;
      const updateData = { username, email, bio };
      if (req.file) {
        updateData.profileImage = req.file.path;
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true }
      );
      res.json({
        success: true,
        message: "Profile updated successfully!",
        user: updatedUser,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, error: "Unable to update profile!" });
    }
  }
);

module.exports = router;
