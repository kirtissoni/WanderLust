const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.listingId);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  res
    .status(201)
    .json({ success: true, message: "New Review Created!", review: newReview });
};

module.exports.destroyReview = async (req, res) => {
  let { reviewId } = req.params;
  let listingId = req.params.listingId;
  await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.json({ success: true, message: "Review Deleted!" });
};
