const express = require("express");
// ---- pass params to route files
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
// const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
// const { reviewSchema } = require("../schema.js");
const { 
    validateReview, 
    isLoggedIn, 
    isReviewAuthor 
} = require("../middleWare.js");

const reviewController = require("../controllers/reviews.js");

// ---- Creat Reviews Route
router.post("/", 
    validateReview, 
    isLoggedIn,
    wrapAsync(reviewController.createReview));

// ---- Delete Review Route
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview));

module.exports = router;