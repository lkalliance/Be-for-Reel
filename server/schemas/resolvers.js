const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const { User } = require("../models");
const resolvers = {
  Query: {},
  Mutation: {
    addUser: async (parent, args) => {
      const { username, email, password } = args;
      const newUser = {
        username,
        email,
        password,
        polls: [],
        votes: [],
        comments: [],
      };

      const user = await User.create(newUser);
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

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
