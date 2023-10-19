const { Schema, model } = require("mongoose");

const movieSchema = new Schema({
  imdb_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  year: {
    type: Number,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

const Movie = model("Movie", movieSchema);

module.exports = Movie;
