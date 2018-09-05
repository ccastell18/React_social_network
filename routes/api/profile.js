const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Profile Model
const Profile = require('../../models/Profile');
//Load User Profile Model
const User = require('../../models/User');

//@route   GET api/profile/test
//@desc    Tests profile route
//@access  public

//outputs json
//router.get('/test', (req, res) => res.json({ msg: 'Profiles works' }));

//@route   GET api/profile
//@desc    Get current user's profile
//@access  private
//jwt is the strategy from the config file.
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    //user refers to User model user object, which refers to the user id.
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //initialize errors
        const errors = {};
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
