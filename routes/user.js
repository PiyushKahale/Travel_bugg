const express = require("express");
const router = express.Router();
// const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleWare.js");

const userController = require("../controllers/user.js");
// All routes are stored in "controllers/user.js"



router.route("/signup")
.get(userController.renderSignupForm )
.post(wrapAsync ( userController.signedUp));


router.route("/login")
.get(userController.renderLoginForm )
.post( 
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    userController.loggedIn
);


router.get("/logout", userController.LogoutAbility);

module.exports = router;
