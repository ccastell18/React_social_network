const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load validation
const validateProfileInput = require('../../validations/profile');
const validateExperienceInput = require('../../validations/experience');
const validateEducationInput = require('../../validations/education');
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
      //populate the fields from 'users' on Profile Schema.  multiple objects need to be in an array.
      .populate('user', ['name', 'avatar'])
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

//@route   GET api/profile/profile/all
//@desc    Get all profiles
//@access  public
router.get('/all', (req, res) => {
  const errors = {};
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: 'There are no profiles' }));
});

//@route   GET api/profile/handle/:handle
//@desc    Get profile by handle
//@access  public
router.get('/handle/:handle', (req, res) => {
  const errors = {};
  //finds handle in the URL
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

//@route   GET api/profile/user/:user_id
//@desc    Get profile by user ID
//@access  public
router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: 'There is no profile for this user' })
    );
});

//@route   GET api/profile
//@desc    Create or Edit user Profile
//@access  private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    //deconstruct the exported objects in ValidateProfileInput
    const { errors, isValid } = validateProfileInput(req.body);
    //check validation
    if (!isValid) {
      //return any errors
      return res.status(400).json(errors);
    }
    //get fields from profile model
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    //Skills - split into array
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }
    //Social is an object filled with objects. Initiate the social object before making fields for individual social media and adding to social object.
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.handle) profileFields.handle = req.body.handle;

    //check for profile
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //Update all fields and return the profile
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //Create
        //Check if handle exists. Can't have duplicates.
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = 'That handle already exists';
            res.status(400).json(errors);
          }
          //Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

//@route   POST api/profile/experience
//@desc    Add experience to profile
//@access  private
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    //check validation
    if (!isValid) {
      //return any errors
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      //Add to experience array
      profile.experience.unshift(newExp);
      profile.save().then(profile => res.json(profile));
    });
  }
);

//@route   POST api/profile/education
//@desc    Add education to profile
//@access  private
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    //check validation
    if (!isValid) {
      //return any errors
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      //Add to education array
      profile.education.unshift(newEdu);
      profile.save().then(profile => res.json(profile));
    });
  }
);

module.exports = router;
