const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  //must check if it's an empty string then isEmpty(data.name)
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  //checks if in email form
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  //checks for password field
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  //checks for email field
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  return {
    //objects
    errors,
    isValid: isEmpty(errors)
  };
};
