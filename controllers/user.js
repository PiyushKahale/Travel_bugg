const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signedUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({email, username});
        const regUser = await User.register(newUser, password);
        console.log(regUser);
        req.login(regUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Travel Bug!");
            res.redirect("/listings");
        });
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signUp");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.loggedIn = async(req, res) => {
    req.flash("success", "welcome to Travel Bug, Login Successful!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.LogoutAbility = (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
    req.flash("success", "You are Logged Out!");
    res.redirect("/listings");
    })
};