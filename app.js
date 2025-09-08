console.log("App starting..");

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

// MongoDB Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to DB"))
.catch((err) => console.log("DB Connection Error:", err));

// EJS & Views Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ===== ROUTES ===== //

// Root
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// Index - Show all listings
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

// New - Show form to create listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Create - Add new listing
app.post("/listings", wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

// Show - Show details of one listing
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show", { listing });
}));

// Edit - Show form to edit listing
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
}));

// Update - Update a listing
app.put("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

// Delete - Delete a listing
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

// ===== ERROR HANDLING ===== //

// Catch all unknown routes
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404,"Page Not Found"));
});

// Global error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).send(message);
});

// Start server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
