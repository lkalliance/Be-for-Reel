const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const { DateResolver } = require("graphql-scalars");
const {
  cleanUsername,
  createLookupName,
  createUrlTitle,
  condenseGenres,
  createDates,
  setStatuses,
} = require("../utils/typeUtils");
const { User, Poll, Movie, Genre, Confirmation } = require("../models");
const fetch = require("axios");

const resolvers = {
  Date: DateResolver,
  Query: {
    getUser: async (parent, { lookupname }) => {
      // returns a specific user's document
      const user = await User.findOne({ lookupName: lookupname });
      // sort their polls by expiration
      user.polls.sort((a, b) => {
        if (a.deactivated && !b.deactivated) return 1;
        else if (b.deactivated && !a.deactivated) return -1;
        return a.expires_on - b.expires_on;
      });
      // sort their comments by most recent first
      user.comments.reverse();
      // augment the user with flags for editing, deactivating, expired
      const newUser = {
        ...user._doc,
        polls: setStatuses(user._doc.polls),
        comments: user.comments.filter((comment) => {
          return !comment.deactivated;
        }),
      };

      return newUser || false;
    },

    getUsers: async () => {
      // returns full list of users
      const users = await User.find().sort({
        userName: 1,
      });
      // convert arrays into lengths for return
      const list = users
        ? users.map((user) => {
            return {
              user_id: user._id,
              userName: user.userName,
              lookupName: user.lookupName,
              created: user.created,
              polls: user.polls.filter((poll) => {
                return !poll.deactivated;
              }).length,
              votes: user.votes.length,
              comments: user.comments.filter((comment) => {
                return !comment.deactivated;
              }).length,
            };
          })
        : [];
      return { users: list };
    },

    getPoll: async (parent, { lookupname, pollname }) => {
      // returns one specific poll
      const poll = await Poll.findOne({
        urlTitle: `/${lookupname}/${pollname}`,
      });
      const updatedPoll = setStatuses([poll]);
      return poll ? updatedPoll[0] : false;
    },

    getPolls: async (parent, { genre }) => {
      // returns a list of all polls

      const polls =
        genre === "expired"
          ? await Poll.find({
              deactivated: false,
              genre,
              expires_on: {
                $lt: new Date(),
              },
            }).sort({
              created_on: -1,
            })
          : await Poll.find({
              deactivated: false,
              genre,
              expires_on: {
                $gt: new Date(),
              },
            }).sort({
              created_on: -1,
            });

      // set various flags
      const updatedPolls = polls ? setStatuses(polls) : [];

      return polls ? { polls: updatedPolls } : null;
    },

    getHomePolls: async (parent, {}, context) => {
      // returns polls for the home page

      const polls = await Poll.find({
        expires_on: {
          $gt: new Date(),
        },
        deactivated: false,
      });

      // filter the polls to remove the ones the user has voted in
      const filteredPolls = context.user
        ? polls.filter((poll) => !context.user.votes[poll._id])
        : [...polls];

      // create a list of random indexes
      const pollList = [];
      const limit = filteredPolls.length >= 6 ? 6 : filteredPolls.length;
      while (pollList.length < limit) {
        const rand = Math.trunc(Math.random() * filteredPolls.length);
        if (pollList.indexOf(rand) === -1) pollList.push(rand);
      }

      const list = pollList.map((pollIndex) => {
        // generate list of polls from random indexes
        return {
          _id: filteredPolls[pollIndex]._id,
          title: filteredPolls[pollIndex].title,
          urlTitle: filteredPolls[pollIndex].urlTitle,
          username: filteredPolls[pollIndex].username,
          options: filteredPolls[pollIndex].options,
          created_on: filteredPolls[pollIndex].created_on,
          expires_on: filteredPolls[pollIndex].expires_on,
          votes: filteredPolls[pollIndex].votes,
        };
      });

      // clone the full filtered list for popular and recent lists
      const recentPolls = [...filteredPolls];
      const popularPolls = [...filteredPolls];

      // sort popular and recent appropriately
      recentPolls.sort((a, b) => {
        return b.created_on - a.created_on;
      });
      popularPolls.sort((a, b) => {
        return b.votes.length - a.votes.length;
      });

      return polls
        ? { featuredPolls: list, recentPolls, popularPolls }
        : { featuredPolls: [], recentPolls: [], popularPolls: [] };
    },

    getGenres: async () => {
      // returns list of genres
      const genres = await Genre.find();
      const titles = ["all"];

      // iterate over each genre
      for (let i = 0; i < genres.length; i++) {
        const polls = genres[i].polls.filter((poll) => {
          return !poll.deactivated;
        });
        // if this genre has unexpired, active polls add to the list
        if (polls.length > 0) titles.push(genres[i].title);
      }
      return { titles };
    },

    getMovies: async (parent, { number }) => {
      // returns a list of all movies, sorted by votes received, up to a number
      const movies = await Movie.find().sort({
        votes: -1,
        year: 1,
      });

      // iterate until reach number, then continue to iterate until all ties resolved
      const list = [];
      let counter = 0;
      let adding = true;
      while (adding) {
        // add this movie to the list
        list.push(movies[counter]);

        counter++;
        // does the NEXT movie have the same votes?
        if (
          movies[counter].votes !== movies[counter - 1].votes &&
          counter >= number
        ) {
          adding = false;
        }

        // trap against infinite loop
        if (counter === 100 || counter === movies.length - 1) adding = false;
      }
      return { movies: list };
    },

    getSearch: async (parent, { term }) => {
      const users = await User.find({
        userName: { $regex: term, $options: "i" },
      }).sort({
        userName: 1,
      });

      const polls = await Poll.find({
        $or: [
          { title: { $regex: term, $options: "i" } },
          { description: { $regex: term, $options: "i" } },
          { "options.movie": { $regex: term, $options: "i" } },
          { "options.plot": { $regex: term, $options: "i" } },
          { "options.stars": { $regex: term, $options: "i" } },
          { "options.directors": { $regex: term, $options: "i" } },
        ],
        deactivated: false,
        expires_on: {
          $gt: new Date(),
        },
      }).sort({
        title: 1,
      });

      const movies = await Movie.find({
        title: { $regex: term, $options: "i" },
      }).sort({
        title: 1,
      });

      return {
        users: { users },
        polls: { polls },
        movies: { movies },
        usersDef: polls.length === 0 && users.length > 0,
      };
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const { userName, email, password } = args;
      const today = Date();

      // remove double-spaces and most non-alphanumeric characters
      const cleanedUserName = cleanUsername(userName);
      // convert username to lookup name
      // (all lower case, alphanumeric, and hyphens for spaces)
      const lookupName = createLookupName(userName);

      // create random token for email validation

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

      const eConfirm = await Confirmation.create({
        user_id: user._id,
        email,
      });

      const token = signToken(user);
      return { token, eToken: eConfirm.confirmation_token, user };
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

    addPoll: async (
      parent,
      { title, description, movieIds, userGenre },
      context
    ) => {
      // make sure the user is actually logged in
      if (context.user) {
        const optGenres = [];
        const options = await Promise.all(
          movieIds.map(async (id) => {
            // for each given movie id, get the info from IMDb
            const getMovies = {
              method: "GET",
              url: `https://tv-api.com/en/API/Title/${process.env.IMDB_API_KEY}/${id}/Trailer,Ratings,Wikipedia`,
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
              worldwide: movie.boxOffice.cumulativeWorldwideGross,
              directors: movie.directors,
              runtime: movie.runtimeStr,
              genres: movie.genres,
              companies: movie.companies,
              trailer: movie.trailer.link,
              votes: 0,
            };

            const isMovie = await Movie.findOne({ imdb_id: movie.id });
            if (!isMovie) {
              await Movie.create({
                imdb_id: movie.id,
                image: movie.image,
                year: movie.year,
                title: movie.title,
              });
            }

            return option;
          })
        );

        const cutoffs = createDates();
        const urlTitle = `/${context.user.lookupName}/${createUrlTitle(title)}`;
        const lookupGenre = condenseGenres(optGenres, userGenre);

        // construct the object to be stored to the Polls collection
        const newPoll = {
          title,
          urlTitle,
          description,
          genre: lookupGenre.length > 0 ? lookupGenre : ["all"],
          user_id: context.user._id,
          username: context.user.userName,
          created_on: cutoffs.today,
          expires_on: cutoffs.exp,
          edit_deadline: cutoffs.edit,
          deactivate_deadline: cutoffs.deac,
          options,
          comments: [],
          votes: [],
          voters: [],
          deactivated: false,
        };

        // construct the object to be stored to the User and Genre
        const newUserPoll = {
          title,
          urlTitle,
          username: context.user.userName,
          expires_on: cutoffs.exp,
          edit_deadline: cutoffs.edit,
          deactivate_deadline: cutoffs.deac,
          votes: 0,
          comments: 0,
          deactivated: false,
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
        const genres = [...new Set(newPoll.genre)];
        if (genres.length > 0) {
          for (let i = 0; i < genres.length; i++) {
            if (genres[i] !== "all") {
              await Genre.findOneAndUpdate(
                { title: genres[i] },
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
                  deactivated: false,
                },
              },
              $inc: { "options.$.votes": 1 },
            },
            { new: true, useFindAndModify: false }
          );
        } else {
          // if there's no comment, just add the vote
          whichPoll = await Poll.findOneAndUpdate(
            { _id: poll_id, "options._id": option_id },
            {
              $push: { votes: option_id, voters: context.user._id },
              $inc: { "options.$.votes": 1 },
            },
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

        // fourth: update the movie's overall vote count
        await Movie.findOneAndUpdate(
          { imdb_id: imdb_id },
          { $inc: { votes: 1 } },
          { new: true, useFindAndModify: false, upsert: true }
        );

        // return the updated Poll and token
        return { poll: whichPoll, token: { token } };
      }
    },

    newEmailCode: async (parent, { user_id, email }, context) => {
      if (!user_id || !email || user_id.length === 0 || email.length === 0) {
        // not enough credentials, never mind
        return;
      }
      try {
        const conf = await Confirmation.findOne({
          user_id,
          confirmation_type: "confirm",
        });

        if (conf) {
          // confirmation already exists, re-send it
          return {
            success: true,
            message: "Re-sending original confirmation token",
          };
        } else {
          // generate a new confirmation
          await Confirmation.create({
            user_id,
            email,
          });
          return { success: true, message: "Sending new confirmation token" };
        }
      } catch (err) {
        console.log(err);
        return { success: false, message: "Error sending confirmation" };
      }
    },

    forgotPwd: async (parent, { email }) => {
      if (!email) return { success: false, message: "No email provided" };

      // get the user first
      const user = await User.findOne({ email });
      if (!user)
        return {
          success: false,
          message: "There is no registered user with that email address.",
        };

      // delete any existing confirmations for this email account
      await Confirmation.deleteMany({
        email,
        confirmation_type: "forgot",
      });

      // create a new Confirmation
      const forgot = await Confirmation.create({
        user_id: user._id,
        email,
        confirmation_type: "forgot",
      });

      return forgot
        ? { success: true, message: "Sending forgotten email" }
        : { success: false, message: "Confirmation not created" };
    },

    resetPwd: async (parent, { newPwd, eToken }) => {
      if (!newPwd || !eToken || newPwd.length < 8 || eToken.length === 0) {
        return {
          success: false,
          message: "This link has expired. Request a new reset.",
        };
      }

      // find the confirmation first
      const conf = await Confirmation.findOne({ confirmation_token: eToken });
      // if it doesn't exist, say so
      if (!conf)
        return {
          success: false,
          message: "This link has expired. Request a new reset.",
        };

      // get the user
      const user = await User.findOneAndUpdate(
        { _id: conf.user_id },
        { $set: { password: newPwd } },
        { new: true, upsert: false, runValidators: true }
      );
      // if it doesn't exist, say so
      if (!user) return { success: false, message: "This user doesn't exist." };

      // delete the confirmation
      await Confirmation.deleteOne({
        confirmation_type: "forgot",
        confirmation_token: eToken,
      });
      return { success: true, message: "Password was reset" };
    },

    deactivatePoll: async (parent, { poll_id }, context) => {
      if (context.user) {
        try {
          const deactivation = `/${context.user.lookupName}/deactivated-${poll_id}`;
          // update the given poll to be deactivated
          const pollUpdate = await Poll.findOneAndUpdate(
            { _id: poll_id },
            { deactivated: true, urlTitle: deactivation },
            { new: true, useFindAndModity: false }
          );

          // update the user's poll list
          await User.findOneAndUpdate(
            { lookupName: context.user.lookupName, "polls.poll_id": poll_id },
            { "polls.$.deactivated": true, "polls.$.urlTitle": deactivation },
            { new: true, useFindAndModify: false }
          );

          // update each genre document
          pollUpdate.genre.forEach(async (genre) => {
            if (genre !== "all") {
              await Genre.findOneAndUpdate(
                { title: genre, "polls.poll_id": poll_id },
                {
                  "polls.$.deactivated": true,
                  "polls.$.urlTitle": deactivation,
                },
                { new: true, useFindAndModify: false, upsert: false }
              );
            }
          });

          // deactivate users' comments on poll
          await User.updateMany(
            { "comments.poll_id": poll_id },
            { "comments.$.deactivated": true },
            { new: true, useFindAndModify: false }
          );

          return {
            title: pollUpdate.title,
            deactivated: pollUpdate.deactivated,
          };
        } catch (err) {
          console.log(err);
        }

        // return the updated poll
      }
    },
  },
};

module.exports = resolvers;
