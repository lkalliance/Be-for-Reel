const bcrypt = require("bcrypt");
const { Schema, model } = require("mongoose");

const userPolls = new Schema({
  poll_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  // votes: Number,
  // comments: Number,
});

const userComments = new Schema({
  poll_id: {
    type: String,
    required: true,
  },
  title: {
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
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  polls: [userPolls],
  votes: [String],
  comments: [userComments],
});

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
