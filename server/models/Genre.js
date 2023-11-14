const { Schema, model } = require("mongoose");
const { userPolls } = require("./User");

const genreSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  polls: [userPolls],
});

const Genre = model("Genre", genreSchema);

module.exports = Genre;
