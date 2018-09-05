const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  //must check if it's an empty string then isEmpty(data.name)
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  //checks registration name is certain length.
  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }
  //must be a string for isEmpty to work
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }
  //checks for email field
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }
  //checks if in email form
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  //checks for password field
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }
  //password length
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }
  //checks for password2 field
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password field is required';
  }
  //checks passwords match
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    //objects
    errors,
    isValid: isEmpty(errors)
  };
};
