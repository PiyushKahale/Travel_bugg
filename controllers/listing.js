const Listing = require("../models/listing.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res ) => {
    // await Listing.find({}).then((res) => {
    //     console.log(res);
    // })

    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    // console.log(req.user);
    
    res.render("listings/new.ejs");
};

module.exports.renderShowListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: { 
            path: "author",
        },
    })
    .populate("owner");

    if(!listing) {
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }

    // console.log()
    res.render("listings/show.ejs", {listing});
};

module.exports.createRoute = async (req, res, next) => {

    // if(!req.body.listing) {
    //     throw new ExpressError(404, "Send Valid Data!");
    // }

    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if( result.error ) {
    //     throw new ExpressError( 400, result.error );
    // };

    // const listing = req.body.listing;

    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    console.log(newListing,"New Listing Created!!");
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }

    let orignalUrl = listing.image.url;
    orignalUrl = orignalUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, orignalUrl });
};

module.exports.updateListing = async (req, res) => {

    // if(!req.body.listing) {
    //     throw new ExpressError(404, "Data must be valid!");
    // }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing has Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing =  async ( req, res ) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing,"Listing Deleted!!");
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};