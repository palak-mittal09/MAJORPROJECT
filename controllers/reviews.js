const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  console.log("REQ.BODY =", req.body);   // 👈 add this line

  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "NEW REVIEW CREATED!");
  return res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req,res) => {
  let {id, reviewId } = req.params;

  await Listing.findByIdAndUpdate( id, {$pull: { reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success" , "REVIEW DELETED!");
  return res.redirect(`/listings/${id}`);


 };