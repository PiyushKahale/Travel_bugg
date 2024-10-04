const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    let reviewBody = req.body.review;
    let newReview = new Review(reviewBody);
    newReview.author = req.user._id;
    console.log(req.body.review);

    // ---- push it into listing's review array
    listing.reviews.push(newReview);
    console.log(newReview);

    await newReview.save();
    await listing.save();
    console.log("Review was saved!");

    req.flash("success", "Review Created!");

    // res.send("Review was saved!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyReview = async(req, res) => {
        
    let { id , reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    let deletedReview = await Review.findByIdAndDelete(reviewId);

    console.log(deletedReview, "Review was Delete!!");
    
    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
};