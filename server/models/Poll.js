const { Schema, model } = require("mongoose");

const movieRatings = new Schema({
  imDb: {
    type: String,
    required: false,
  },
  metacritic: {
    type: String,
    required: false,
  },
  theMovieDb: {
    type: String,
    required: false,
  },
  rottenTomatoes: {
    type: String,
    required: false,
  },
  filmAffinity: {
    type: String,
    required: false,
  },
});

const pollOption = new Schema({
  movie: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: false,
  },
  imdb_id: {
    type: String,
    required: true,
  },
  stars: {
    type: String,
    required: false,
  },
  plot: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  wikipedia: {
    type: String,
    required: false,
  },
  contentRating: {
    type: String,
    required: false,
  },
  ratings: movieRatings,
  directors: {
    type: String,
    required: false,
  },
  runtime: {
    type: String,
    required: false,
  },
  genres: {
    type: String,
    required: false,
  },
  companies: {
    type: String,
    required: false,
  },
  worldwide: {
    type: String,
    required: false,
  },
  trailer: {
    type: String,
    required: false,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

const pollComment = new Schema({
  poll_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  username: {
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

const pollSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  urlTitle: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  genre: {
    type: [String],
  },
  user_id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
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
  options: [pollOption],
  comments: [pollComment],
  votes: {
    type: [String],
    required: true,
  },
  voters: {
    type: [String],
    required: true,
  },
  winning: {
    type: [String],
    required: false,
  },
  deactivated: {
    type: Boolean,
    default: false,
  },
});

const Poll = model("Poll", pollSchema);

module.exports = { Poll, pollSchema };
