const bcrypt = require("bcrypt");
const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userPolls = new Schema({
  poll_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  urlTitle: {
    type: String,
    required: true,
  },
  votes: Number,
  comments: Number,
  expires_on: Date,
});

const userVotes = new Schema({
  poll_id: {
    type: String,
    required: true,
  },
  option_id: {
    type: String,
    required: true,
  },
  movie: {
    type: String,
    required: true,
  },
});

const userComments = new Schema({
  poll_id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  urlTitle: {
    type: String,
    required: true,
  },
  movie: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  lookupName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  created: {
    type: String,
    required: false,
  },
  polls: [userPolls],
  votes: [userVotes],
  voted: [String],
  comments: [userComments],
});

// include the unique validator
userSchema.plugin(uniqueValidator);

// set up pre-save middleware to create password
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;
