const fetch = require("node-fetch");
const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.json(allListings);
};

module.exports.renderNewForm = (req, res) => {
  // No longer needed - frontend will handle the form
  res.json({ message: "Use frontend to create new listing" });
};

module.exports.filterByCategory = async (req, res) => {
  const { category } = req.params;
  const allListings = await Listing.find({ category });

  if (allListings.length === 0) {
    return res.json({
      message: `No listings found in category: ${category}`,
      listings: [],
    });
  }

  res.json(allListings);
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    return res
      .status(404)
      .json({ error: "Listing you requested for does not exist!" });
  }

  res.json(listing);
};

module.exports.createListing = async (req, res, next) => {
  try {
    console.log("req.file:", req.file);
    console.log("req.body.listing:", req.body.listing);

    let url = req.file?.path;
    let filename = req.file?.filename;

    // --- Geocoding ---
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        req.body.listing.location
      )}`,
      {
        headers: {
          "User-Agent": "Airbnb-Clone-App/1.0 (kibhumi@gmail.com)",
        },
      }
    );

    let geoData = [];
    try {
      geoData = await geoResponse.json();
    } catch (err) {
      console.error("Error parsing geocoding JSON:", err);
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // --- Image handling ---
    if (url && filename) {
      newListing.image = { url, filename };
    } else {
      newListing.image = {
        url: "https://via.placeholder.com/600x400?text=No+Image+Available",
        filename: "default",
      };
    }

    // --- Save coordinates if available ---
    if (geoData.length > 0) {
      newListing.geometry = {
        type: "Point",
        coordinates: [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)],
      };
    } else {
      newListing.geometry = {
        type: "Point",
        coordinates: [0, 0],
      };
    }

    await newListing.save();
    res
      .status(201)
      .json({ message: "New Listing Created!", listing: newListing });
  } catch (err) {
    next(err);
  }
};

module.exports.searchListings = async (req, res) => {
  const { country, q } = req.query;

  let filter = {};

  if (country && country !== "") {
    filter.country = country; // filter based on country
  }

  if (q && q.trim() !== "") {
    filter.title = { $regex: q, $options: "i" }; // filter based on title/ destination
  }

  const allListings = await Listing.find(filter);

  if (allListings.length === 0) {
    return res.json({
      message: "No Listings found for your search",
      listings: [],
    });
  }

  res.json(allListings);
};

module.exports.renderEditFrom = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    return res
      .status(404)
      .json({ error: "Listing you requested for does not exist!" });
  }
  res.json(listing);
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  res.json({ message: "Listing Updated!", listing });
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.json({ message: "Listing Deleted!", listing: deletedListing });
};
