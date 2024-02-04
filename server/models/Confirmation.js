const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const confirmationSchema = new Schema({
  confirmation_token: {
    type: String,
    default: uuidv4,
  },
  confirmation_type: {
    type: String,
    default: "confirm",
  },
  user_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: "2h" },
  },
});

const Confirmation = model("Confirmation", confirmationSchema);

module.exports = Confirmation;
