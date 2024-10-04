const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        filename: {
            type: String,
        },
        url: {
            default:
                "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
            set: (v) => v === ""
                ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                : v,
            type: String,
        }
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    // category: {
    //     type: String,
    //     enum: ['mountain', "arctic", "farms", "pools"],
    // }
});


listingSchema.post("findOneAndDelete", async(listing) => {
    if (listing) {
        await Review.deleteMany({ _id: {$in: listing.reviews }});
    }
});
// Mongoose Middleware - works for post functions
// delete all entire review array, after deleting whole listing
// define post method , pass listing in argument, and aply deleteMany on Reviews array for listing , who comes in listings's review array, with "$in" operator.


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;