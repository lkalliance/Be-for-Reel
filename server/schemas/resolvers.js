const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const { User, Poll, Movie } = require("../models");
const fetch = require("axios");

const resolvers = {
  Query: {
    getUser: async (parent, { username }) => {
      const user = await User.findOne({ compareUserName: username });
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
      console.log(polls);
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
    getHomePolls: async (parent) => {
      console.log("I'm getting home polls");
      const polls = await Poll.find();

      // create a list of random indexes
      const pollList = [];
      while (pollList.length < 6) {
        const rand = Math.trunc(Math.random() * polls.length);
        if (pollList.indexOf(rand) === -1) pollList.push(rand);
      }

      const list = pollList.map((pollIndex) => {
        return {
          _id: polls[pollIndex]._id,
          title: polls[pollIndex].title,
          urlTitle: polls[pollIndex].urlTitle,
          username: polls[pollIndex].username,
          options: polls[pollIndex].options,
          created_on: polls[pollIndex].created_on,
        };
      });

      console.log(list);

      return list ? { polls: list } : { polls: false };
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const { userName, email, password } = args;

      const today = Date();
      const alteredUserName = userName
        .replaceAll(/\s+/g, " ")
        .replace(/[^A-Za-z0-9\s\'\‘]/g, "");
      const comparisonUserName = alteredUserName
        .replace(/[\'\‘']/g, "")
        .replaceAll(" ", "-")
        .toLowerCase();
      const newUser = {
        userName: alteredUserName,
        compareUserName: comparisonUserName,
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
      const alteredUserName = userName
        .replace(/\s+/g, " ")
        .replace(/[^A-Za-z0-9\s]/g, "")
        .replace(/[\s]/g, "-")
        .toLowerCase();

      const userUname = await User.findOne({
        compareUserName: alteredUserName,
      });
      const userEmail = await User.findOne({ email: userName });

      if (!userUname && !userEmail) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const user = userUname || userEmail;
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    addPoll: async (parent, { title, description, movieIds }, context) => {
      // make sure the user is actually logged in
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
        const pathUserName = context.user.userName
          .replaceAll(/\s+/g, " ")
          .replace(/[^A-Za-z0-9\s]/g, "")
          .replaceAll(" ", "-")
          .toLowerCase();
        const urlTitle = `/${pathUserName}/${title
          .toLowerCase()
          .replace(/[^a-zA-Z\d\s\-]/g, "")
          .replace(/[\s]+/g, "-")}`;

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
      // make sure the user is actually logged in
      if (context.user) {
        let updatedUser, whichPoll, pollUser;

        console.log(comment);
        console.log(movie);
        console.log(imdb_id);
        console.log(poll_id);
        console.log(option_id);
        console.log(userName);

        // if the user has already voted on this poll, leave
        console.log(context.user);
        const pollCheck = await Poll.findOne({ _id: poll_id });
        if (pollCheck.voters.includes(context.user._id))
          return new Error("You have already voted in this poll");

        // first: update the poll
        if (comment.length > 0) {
          // if there's a comment, add the vote and the comment
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
          // if there's no comment, just add the vote
          whichPoll = await Poll.findOneAndUpdate(
            { _id: poll_id },
            { $push: { votes: option_id, voters: context.user._id } },
            { new: true, useFindAndModify: false }
          );
        }

        // second: update the user that voted
        if (comment.length > 0) {
          // if there's a comment, add it and the vote
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
          // if there's no comment, just add the vote
          updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $addToSet: { votes: { poll_id, option_id, movie } },
              $push: { voted: poll_id },
            },
            { useFindAndModify: false }
          );
        }

        // third: update the poll stored on the user record
        if (comment.length > 0) {
          // if there's a comment, add it and the vote
          pollUser = await User.findOneAndUpdate(
            { _id: whichPoll.user_id, "polls.poll_id": whichPoll._id },
            { $inc: { "polls.$.votes": 1, "polls.$.comments": 1 } },
            { new: true, useFindAndModify: false }
          );
        } else {
          // if there's no comment, just add the vote
          pollUser = await User.findOneAndUpdate(
            { _id: whichPoll.user_id, "polls.poll_id": whichPoll._id },
            { $inc: { "polls.$.votes": 1 } },
            { new: true, useFindAndModify: false }
          );
        }

        // fourth: update the movie's overall vote count
        const updatedMovie = await Movie.findOneAndUpdate(
          { imdb_id: imdb_id },
          { $inc: { votes: 1 } },
          { new: true, useFindAndModify: false, upsert: true }
        );
      }
    },
  },
};

module.exports = resolvers;
