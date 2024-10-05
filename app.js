if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const localStrategy = require("passport-local");

const User = require("./models/user.js");

// ---- Routing
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// ---- DB sessions
const MongoStore = require('connect-mongo');


// ---- Establishing Connection with DataBase
const dbURL = process.env.ATLASTDB_URL;

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });
// ---- Connection to MongoDB
async function main() {
    await mongoose.connect(dbURL);
};


// ---- view engine and folder for EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---- urlencoded for Data Parsing 
app.use(express.urlencoded({ extended: true }));

// ---- Method Override , to override the - put/delete method
app.use(methodOverride("_method"));

// ---- EJS-mate for layout, boilerplates, etc.
app.engine('ejs', ejsMate);

// ---- Path package: to Add path of CSS/JS files to all files as "PUBLiC"
app.use(express.static(path.join(__dirname, "/public")));


const storeMongo = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

storeMongo.on("error", () => {
    console.log("Error in MONGO SESSION", error);
});

// ---- Session Management ----
const sessionOptions = {
    store: storeMongo,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // 7 Days -> 24 hrs -> 60 mins -> 60 sec -> 1000 ms  
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // for 1 week
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};


// ---- get Request on Root route
// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });


// ---- sessions
app.use(session(sessionOptions));
app.use(flash());

// ---- middleWare that initialize passport 
app.use(passport.initialize());
// ---- each req, res know their session
app.use(passport.session());
// ---- Every User (static-method) Authenticate through LocalStrategy
passport.use(new localStrategy(User.authenticate()));

// ---- info of user, to store in Session - "Serialize"
passport.serializeUser(User.serializeUser());
// ---- info of user, to remove from in Session - "Deserialize"
passport.deserializeUser(User.deserializeUser());



// ---- Middleware for Flash 
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
});


// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "sfoosf@gmail.com",
//         username: "sfosfwf",
//     });

//     let registerdUser = await User.register(fakeUser, "helloworld");
//     res.send(registerdUser);
// })


// ---- Restructured Listing Route
app.use("/listings", listingRouter);
// ---- Restructured Review Route
app.use("/listings/:id/reviews", reviewRouter);
// ---- Restructured User Route
app.use("/", userRouter);


// ---- Custom Express Error
app.all("*", (req, res, next) => {
    res.render("listings/index.ejs");
    next(new ExpressError(404, "Page Not Found!"));
});


// ---- Error handler Middleware
app.use((err, req, res, next) => {
    let { statusCode=500, message="Something went Wrong!" } = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs", { message });

    // res.send("Something went wrong!");
});


// ---- Validate Listings ----
// const validateListing = ( req, res, next ) => {
//     let { error } = listingSchema.validate(req.body);
//     if ( error ) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };


// ---- Validate Reviews Schema ----
// const validateReview = ( req, res, next ) => {
//     let { error } = reviewSchema.validate(req.body);
//     if( error ) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };


// ---- Start the Server
app.listen( 8080, () => {
    console.log("Server is Listening to port 8080");
});