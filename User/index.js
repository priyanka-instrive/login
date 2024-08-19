const { Schema, default: mongoose } = require("mongoose");
const { dbConn } = require("../system/db/mongo");

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const UserRegistrationSchema = dbConn.model("User", userSchema, "Users");

module.exports = {
  UserRegistrationSchema,
};
