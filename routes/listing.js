const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
// const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleWare.js"); 
const listingController = require("../controllers/listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// All Routes are store in "controllers/listing.js";


router.route("/")
// ---- Index Route
.get(wrapAsync (listingController.index))
// ---- Create Route (validateListing) 
.post(
    isLoggedIn,
    upload.single("listing[image.url]"), 
    wrapAsync ( listingController.createRoute),
);


// ---- New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
// ---- Show Route
.get(wrapAsync(listingController.renderShowListing))
// ---- Update Route (validatListing)
.put(
    isLoggedIn,
    isOwner, 
    upload.single("listing[image.url]"), 
    wrapAsync(listingController.updateListing ,
))
// ---- delete Route
.delete(isLoggedIn, isOwner, wrapAsync (listingController.deleteListing));


// ---- Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm));


module.exports = router;

// ---- Testing Route to Save the sample listing
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing ({
//         title: "New Villa",
//         description: "Bitch is beach",
//         image: "",
//         price: 1500,
//         location: "Nashik",
//         country: "India",
//     })

//     await sampleListing.save();
//     console.log(sampleListing);
//     res.send("Data Saved");
// });