const Joi = require("joi");

module.exports.options = {
  abortEarly: false,
  convert: true,
  stripUnknown: true,
};

const userRegistrationValidationSchema = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8) // Minimum length of 8 characters
      .pattern(new RegExp("(?=.*[a-z])")) // At least one lowercase letter
      .pattern(new RegExp("(?=.*[A-Z])")) // At least one uppercase letter
      .pattern(new RegExp("(?=.*[0-9])")) // At least one digit
      .pattern(new RegExp("(?=.*[!@#$%^&*])")) // At least one special character
      .required(),
    phone_number: Joi.string().optional().allow(null, ""),
  }),
};

const signin = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

module.exports = { userRegistrationValidationSchema, signin };
