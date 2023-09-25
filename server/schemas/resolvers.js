const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const { User, Poll, Movie } = require("../models");
const fetch = require("axios");

const resolvers = {
  Query: {
    getUser: async (parent, { username }) => {
      const user = await User.findOne({ userName: username });
      return user ? user : false;
    },
    getMyVotes: async (parent, { username }) => {
      const empty = { votes: [] };
      if (username === "") return empty;
      const user = await User.findOne({ userName: username }, (err, user) => {
        if (err) {
          return empty;
        }
        return user.votes;
      });
      return user ? { votes: user.votes } : false;
    },
    getPoll: async (parent, { username, pollname }) => {
      const poll = await Poll.findOne({ urlTitle: `/${username}/${pollname}` });
      return poll ? poll : false;
    },
    getPolls: async (parent) => {
      console.log("I'm getting polls");
      const polls = await Poll.find();
      const list = polls.map((poll) => {
        return {
          poll_id: poll._id,
          title: poll.title,
          urlTitle: poll.urlTitle,
          username: poll.username,
          votes: poll.votes.length,
          comments: poll.comments.length,
        };
      });

      return list ? { polls: list } : { polls: false };
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

    addPoll: async (parent, { title, description, movieIds }, context) => {
      // make sure the user is actually logged in
      console.log(title);
      console.log(description);
      console.log(movieIds);
      if (context.user) {
        const options = await Promise.all(
          movieIds.map(async (id) => {
            // for each given movie id, get the info from IMDb
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
              votes: 0,
            };

            const isMovie = await Movie.findOne({ imdb_id: movie.id });
            if (!isMovie) {
              const newMovie = await Movie.create({
                imdb_id: movie.id,
                image: movie.image,
                title: movie.title,
              });
            }

            return option;
          })
        );

        const today = Date();
        const urlTitle = `/${context.user.userName}/${title
          .toLowerCase()
          .replace(/[^a-zA-Z\d\s:]/g, "")
          .replace(/[\s]/g, "-")}`;

        // construct the object to be stored to the Polls collection
        const newPoll = {
          title,
          urlTitle,
          description,
          user_id: context.user._id,
          username: context.user.userName,
          created_on: today,
          options,
          comments: [],
          votes: [],
          voters: [],
        };

        // construct the object to be stored to the User
        const newUserPoll = {
          title,
          urlTitle,
          username: context.user.userName,
          votes: 0,
          comments: 0,
        };

        // create the poll, and if it fails return
        const poll = await Poll.create(newPoll);
        if (!poll) return { message: "Operation failed" };

        // add the new poll's id to the object we're attaching to the user
        newUserPoll.poll_id = poll._id;

        // add the poll to the currently logged-in user's document
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { polls: newUserPoll },
          },
          { new: true, useFindAndModify: false }
        );

        return { poll_id: poll._id, title, redirect: urlTitle };
      }
    },
    castVote: async (
      parent,
      { userName, poll_id, option_id, movie, imdb_id, comment },
      context
    ) => {
      let updatedUser, whichPoll;
      console.log(option_id);
      console.log(imdb_id);
      if (comment.length > 0) {
        console.log("adding a vote and a comment to poll");
        whichPoll = await Poll.findOneAndUpdate(
          { _id: poll_id },
          {
            $push: { voters: context.user._id, votes: option_id },
            $addToSet: {
              comments: {
                poll_id,
                user_id: context.user._id,
                username: userName,
                movie,
                text: comment,
              },
            },
          },
          { new: true, useFindAndModify: false }
        );
      } else {
        whichPoll = await Poll.findOneAndUpdate(
          { _id: poll_id },
          { $push: { votes: option_id, voters: context.user._id } },
          { new: true, useFindAndModify: false }
        );
      }
      if (comment.length > 0) {
        updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              votes: { poll_id, option_id, movie },
              comments: {
                poll_id,
                username: context.user.userName,
                title: whichPoll.title,
                urlTitle: whichPoll.urlTitle,
                movie,
                text: comment,
              },
            },
            $push: { voted: poll_id },
          },
          { new: true, useFindAndModify: false }
        );
      } else {
        console.log("adding a vote only to user");
        updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { votes: { poll_id, option_id, movie } },
            $push: { voted: poll_id },
          },
          { useFindAndModify: false }
        );
      }
      const updatedMovie = await Movie.findOneAndUpdate(
        { imdb_id: imdb_id },
        { $inc: { votes: 1 } },
        { new: true, useFindAndModify: false, upsert: true }
      );
    },
  },
};

module.exports = resolvers;
