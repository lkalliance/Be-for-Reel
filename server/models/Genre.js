const { Schema, model } = require("mongoose");
const { pollSchema } = require("./Poll");

const genreSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  polls: [pollSchema],
});

const Genre = model("Genre", genreSchema);

module.exports = Genre;
