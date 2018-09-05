const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
//users is on the bottom of the User Schema
const User = mongoose.model('users');
const keys = require('../config/keys');

//empty object for options
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//get key to authorize user
opts.secretOrKey = keys.secretOrKey;

//passport is a variable from server.js
module.exports = passport => {
  //jwt_payload contains info from users.js payload variable
  //Needs to be run on a protected route on users.js
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      //findById is a mongoose action.  It looks for the id in a payload.
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            //done is a parameter function. parameters of done are (err, user). if there is a user, than err is null.
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
