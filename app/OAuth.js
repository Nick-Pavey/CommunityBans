var express = require("express");
var passport = require("passport");
var twitchStrategy = require("passport-twitch").Strategy;
var app = express();
app.set("views", "./views");
app.set("view engine", "ejs");

//If you have the target user’s login/username, you can request their user id with this endpoint:
//GET https://api.twitch.tv/helix/users?login=<username>
//Include the Client ID for your application in the header, no other authorization is needed.

// Middlewares
app.use(passport.initialize());
app.use(express.static("./public"));
 
passport.use(new twitchStrategy({
    clientID: "clientid",
    clientSecret: "clientsecret",
    callbackURL: "http://127.0.0.1:3000/auth/twitch/callback",
    scope: "user_read"
  },
  function(accessToken, refreshToken, profile, done) {
    // Suppose we are using mongo..
   // User.findOrCreate({ twitchId: profile.id }, function (err, user) {
    //  return done(err, user);
   // });
  }
));
 
passport.serializeUser(function(user, done) {
    done(null, user);
});
 
passport.deserializeUser(function(user, done) {
    done(null, user);
});
 
app.get("/", function (req, res) {
    res.render("index");
});
 
app.get("/auth/twitch", passport.authenticate("twitch"));
app.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});
 
