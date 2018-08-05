const passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User/model-User.js");

function passwordValidator(user, passwordCandidate){
	if(user.password === passwordCandidate) return true
		else return false
}


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy(
	function(username,password,done){
		User.findOne({ username: username }, function(err, user) {
      console.log("found the user")
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Such user does not exist' });
      }
      if (!passwordValidator(user,password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
	}))