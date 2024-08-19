const express = require("express");
const router = express.Router();
const { celebrate } = require("celebrate");
const schema = require("./schema.js");

const controller = require("./controller.js");

router.post(
  "/user_registration",
  celebrate(schema.userRegistrationValidationSchema, schema.options),
  controller.registerUser
);

router.post(
  "/sign_in",
  celebrate(schema.signin, schema.options),
  controller.login
);

module.exports = router;
