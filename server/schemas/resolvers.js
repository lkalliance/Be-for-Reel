const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const { User, Poll } = require("../models");
const fetch = require("axios");

const resolvers = {
  Query: {
    getPoll: async (parent, args) => {
      console.log("Got the poll data");
    },
    getUser: async (parent, { username }) => {
      const user = User.findOne({ userName: username });
      return user ? user : false;
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const { userName, email, password } = args;

      const today = Date();
      const newUser = {
        userName,
        email,
        password,
        created: today,
        polls: [],
        votes: [],
        comments: [],
      };

      const user = await User.create(newUser);

      if (!user) return { message: "Operation failed" };

      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { userName, password }) => {
      const user = await User.findOne({ userName });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    addPoll: async (
      parent,
      { userName, userId, title, description, movieIds }
    ) => {
      const options = await Promise.all(
        movieIds.map(async (id) => {
          const getMovies = {
            method: "GET",
            url: `https://imdb-api.com/en/API/Title/${process.env.IMDB_API_KEY}/${id}/Trailer,Ratings,Wikipedia`,
          };
          const movieData = await fetch.request(getMovies);
          const movie = movieData.data;
          const option = {
            movie: movie.title,
            imdb_id: movie.id,
            stars: movie.stars,
            plot: movie.plot,
            image: movie.image,
            wikipedia: movie.wikipedia.url,
            contentRating: movie.contentRating,
            ratings: {
              imDb: movie.ratings.imDb,
              metacritic: movie.ratings.metacritic,
              theMovieDb: movie.ratings.theMovieDb,
              rottenTomatoes: movie.ratings.rottenTomatoes,
              filmAffinity: movie.ratings.filmAffinity,
            },
            directors: movie.directors,
            genres: movie.genres,
            companies: movie.companies,
            trailer: movie.trailer.link,
          };
          return option;
        })
      );

      const today = Date();
      const urlTitle = `/poll/${userName}/${title
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s:]/g, "")
        .replace(/[\s]/g, "-")}`;

      const newPoll = {
        title,
        urlTitle,
        description,
        user_id: userId,
        username: userName,
        created_on: today,
        options,
        comments: [],
        votes: 0,
      };

      const poll = await Poll.create(newPoll);
      console.log(poll);
      if (!poll) return { message: "Operation failed" };

      return { poll_id: poll._id, poll_title: title };
    },
  },
};

module.exports = resolvers;
