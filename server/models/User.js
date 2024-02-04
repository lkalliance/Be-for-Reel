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
  username: {
    type: String,
    required: true,
  },
  urlTitle: {
    type: String,
    required: true,
  },
  expires_on: {
    type: Date,
    required: true,
  },
  edit_deadline: {
    type: Date,
    required: true,
  },
  deactivate_deadline: {
    type: Date,
    required: true,
  },
  winning: {
    type: String,
    required: false,
  },
  votes: Number,
  comments: Number,
  expires_on: Date,
  deactivated: {
    type: Boolean,
    default: false,
  },
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
  deactivated: {
    type: Boolean,
    default: false,
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
  confirmed: {
    type: Boolean,
    default: false,
  },
  polls: [userPolls],
  votes: [userVotes],
  voted: [String],
  comments: [userComments],
});

// include the unique validator
userSchema.plugin(uniqueValidator);

// set up pre-save middleware to create password
userSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = bcrypt.hashSync(this.password, saltRounds);
  }
  next();
});

// set up pre-update middleware to hash new password
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  // check if the password was modified
  if (update.$set && update.$set.password) {
    // if it was, overwrite the password with the hash
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(update.$set.password, saltRounds);
    update.$set.password = hashedPassword;
  }
  next();
});

// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = { User, userPolls };
