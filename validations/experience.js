const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  let errors = {};

  //must check if it's an empty string then isEmpty(data.name)
  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  //checks for password field
  if (Validator.isEmpty(data.title)) {
    errors.title = 'Job title field is required';
  }
  if (Validator.isEmpty(data.company)) {
    errors.company = 'Company field is required';
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = 'From field is required';
  }
  return {
    //objects
    errors,
    isValid: isEmpty(errors)
  };
};
