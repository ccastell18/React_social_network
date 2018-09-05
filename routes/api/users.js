const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load input Validation
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');

//load user model
const User = require('../../models/User');

//@route   GET api/users/test
//@desc    Tests users route
//@access  public
//outputs json
router.get('/test', (req, res) => res.json({ msg: 'Users works' }));

//@route   POST api/users/register
//@desc    Register user
//@access  public
router.post('/register', (req, res) => {
  //errors and isValid from register.js
  const { errors, isValid } = validateRegisterInput(req.body);
  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  //findOne will search for matching email with a promise. Object form in req format.
  User.findOne({ email: req.body.email }).then(user => {
    //checks if email exists.  if so, 400
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      //uses email to see if an avatar has been used by Gravatar.
      const avatar = gravatar.url(req.body.email, {
        s: '200', //size
        r: 'pg', //rating
        d: 'mm' // default
      });
      //pass the data as an object when creating new user.
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      //10 is the salt number.
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          //sets password to new hash
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route   GET api/users/login
//@desc    Login user/ Return JWT token
//@access  public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({ email }).then(user => {
    //check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
      //original error
      //return res.status(404).json({ email: 'User not found' });
    } //check password. unhash password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User Matched. jwt payload(user information)
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        //sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.password = 'Password Incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

//This is a protected route
//@route   GET api/users/current
//@desc    Return current user
//@access  private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    //if success,user is in req.user
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
