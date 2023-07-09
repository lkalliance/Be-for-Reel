const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const { User } = require("../models");
const resolvers = {
  Query: {
    getPoll: async (parent, args) => {
      console.log("Got the poll data");
    },
    getUser: async (parent, { user_id }) => {
      return User.findOne({ _id: user_id });
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
  },
};

module.exports = resolvers;
