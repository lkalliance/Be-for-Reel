const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const { DateResolver } = require("graphql-scalars");
const {
  cleanUsername,
  createLookupName,
  createUrlTitle,
  condenseGenres,
  createGenreList,
} = require("../utils/typeUtils");
const { User, Poll, Movie, Genre } = require("../models");
const fetch = require("axios");
const today = new Date();

const resolvers = {
  Date: DateResolver,
  Query: {
    getUser: async (parent, { lookupname }) => {
      const user = await User.findOne({ lookupName: lookupname });
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
    getPoll: async (parent, { lookupname, pollname }) => {
      const poll = await Poll.findOne({
        urlTitle: `/${lookupname}/${pollname}`,
      });
      return poll ? poll : false;
    },
    getPolls: async (parent, { genre }) => {
      const lookupGenre = genre || "all";
      const rawPolls =
        lookupGenre === "all"
          ? await Poll.find().sort({
              created_on: -1,
            })
          : await Genre.find({ title: genre });

      const polls = lookupGenre === "all" ? rawPolls : rawPolls[0].polls;

      // const genres = createGenreList(polls);
      const list = polls
        ? polls.map((poll) => {
            return {
              poll_id: poll._id,
              title: poll.title,
              urlTitle: poll.urlTitle,
              username: poll.username,
              genre: poll.genre,
              votes: lookupGenre === "all" ? poll.votes.length : poll.votes,
              comments:
                lookupGenre === "all" ? poll.comments.length : poll.comments,
              expires_on: poll.expires_on,
            };
          })
        : [];

      return list ? { polls: list } : null;
    },
    getHomePolls: async (parent) => {
      const polls = await Poll.find({
        expires_on: {
          $gt: new Date(),
        },
      });
      // create a list of random indexes
      const pollList = [];
      const limit = polls.length >= 6 ? 6 : polls.length;
      while (pollList.length < limit) {
        const rand = Math.trunc(Math.random() * polls.length);
        if (pollList.indexOf(rand) === -1) pollList.push(rand);
      }

      const list = pollList.map((pollIndex) => {
        // generate list of polls from random indexes
        return {
          _id: polls[pollIndex]._id,
          title: polls[pollIndex].title,
          urlTitle: polls[pollIndex].urlTitle,
          username: polls[pollIndex].username,
          options: polls[pollIndex].options,
          created_on: polls[pollIndex].created_on,
          expires_on: polls[pollIndex].expires_on,
        };
      });

      return list ? { polls: list } : { polls: false };
    },
    getGenres: async (parent) => {
      const genres = await Genre.find();
      const titles = ["all"];
      // iterate over each genre
      for (let i = 0; i < genres.length; i++) {
        titles.push(genres[i].title);
      }
      return { titles };
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const { userName, email, password } = args;
      const today = Date();

      // remove double-spaces and most non-alphanumeric characters
      const cleanedUserName = cleanUsername(userName);
      // confert username to lookup name
      // (all lower case, alphanumeric, and hyphens for spaces)
      const lookupName = createLookupName(userName);

      const newUser = {
        userName: cleanedUserName,
        lookupName,
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
      // convert input username to cleansed lookupname
      const lookupName = createLookupName(userName);

      // search for user both by username and by email
      const userUname = await User.findOne({
        lookupName,
      });
      const userEmail = await User.findOne({ email: userName });

      // if neither succeeds, indicate
      if (!userUname && !userEmail) {
        throw new AuthenticationError("Incorrect credentials");
      }

      // use whichever search succeeded and check password
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
        const optGenres = [];
        const options = await Promise.all(
          movieIds.map(async (id) => {
            // for each given movie id, get the info from IMDb
            const getMovies = {
              method: "GET",
              url: `https://imdb-api.com/en/API/Title/${process.env.IMDB_API_KEY}/${id}/Trailer,Ratings,Wikipedia`,
            };
            const movieData = await fetch.request(getMovies);
            const movie = movieData.data;
            const gList = movie.genreList.map((genre) => {
              return genre.value.toLowerCase();
            });

            gList.push("all");
            optGenres.push(gList);

            const option = {
              movie: movie.title,
              year: movie.year,
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
                year: movie.year,
                title: movie.title,
              });
            }

            return option;
          })
        );

        const today = new Date();
        const expires = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 14,
          today.getHours()
        );
        const urlTitle = `/${context.user.lookupName}/${createUrlTitle(title)}`;

        const lookupGenre = condenseGenres(optGenres);

        // construct the object to be stored to the Polls collection
        const newPoll = {
          title,
          urlTitle,
          description,
          genre: lookupGenre.length > 0 ? lookupGenre : ["all"],
          user_id: context.user._id,
          username: context.user.userName,
          created_on: today,
          expires_on: expires,
          options,
          comments: [],
          votes: [],
          voters: [],
        };

        // construct the object to be stored to the User and Genre
        const newUserPoll = {
          title,
          urlTitle,
          username: context.user.userName,
          expires_on: expires,
          votes: 0,
          comments: 0,
        };

        // create the poll, and if it fails return
        const poll = await Poll.create(newPoll);
        if (!poll) return { message: "Operation failed" };

        // add the new poll's id to the object we're attaching to the user...
        newUserPoll.poll_id = poll._id;

        // add the poll to the currently logged-in user's document
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { polls: newUserPoll },
          },
          { new: true, useFindAndModify: false }
        );

        // add the poll to its genres
        if (newPoll.genre.length > 0) {
          for (let i = 0; i < newPoll.genre.length; i++) {
            if (newPoll.genre[i] !== "all") {
              const updatedGenre = await Genre.findOneAndUpdate(
                { title: poll.genre[i] },
                { $addToSet: { polls: newUserPoll } },
                { upsert: true, new: true, useFindAndModify: false }
              );
            }
          }
        }

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
        let updatedUser, whichPoll;

        // if the user has already voted on this poll, leave
        const pollCheck = await Poll.findOne({ _id: poll_id });
        if (pollCheck.voters.includes(context.user._id))
          return new Error("You have already voted in this poll");

        // first: update the poll
        if (comment.length > 0) {
          // if there's a comment, add the vote and the comment
          whichPoll = await Poll.findOneAndUpdate(
            { _id: poll_id, "options._id": option_id },
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
              $inc: { "options.$.votes": 1 },
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
            { new: true, useFindAndModify: false }
          );
        }
        // update his token with added vote
        const token = signToken(updatedUser);

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

        // fourth: update the poll on each of its genres
        for (let i = 0; i < whichPoll.genre.length; i++) {
          if (whichPoll.genre[i] !== "all") {
            // don't update "all"
            if (comment.length > 0) {
              pollGenre = await Genre.findOneAndUpdate(
                { title: whichPoll.genre[i], "polls.poll_id": whichPoll._id },
                { $inc: { "polls.$.votes": 1, "polls.$.comments": 1 } },
                { new: true, useFindAndModify: false }
              );
            } else {
              // if there's no comment, just add the vote
              pollGenre = await Genre.findOneAndUpdate(
                { title: whichPoll.genre[i], "polls.poll_id": whichPoll._id },
                { $inc: { "polls.$.votes": 1 } },
                { new: true, useFindAndModify: false }
              );
            }
          }
        }

        // fifth: update the movie's overall vote count
        const updatedMovie = await Movie.findOneAndUpdate(
          { imdb_id: imdb_id },
          { $inc: { votes: 1 } },
          { new: true, useFindAndModify: false, upsert: true }
        );

        // return the updated Poll and token
        return { poll: whichPoll, token: { token } };
      }
    },
  },
};

module.exports = resolvers;
