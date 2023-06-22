const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Auth {
    token: ID
    user: User
  }

  type User {
    _id: ID
    userName: String!
    email: String!
    password: String!
    created: String
    polls: [userPolls]
  }

  type movieRatings {
    imDb: String
    metacritic: String
    theMovieDb: String
    rottenTomatoes: String
    filmAffinity: String
  }

  type pollOption {
    movie: String!
    imdb_id: String!
    stars: String
    plot: String
    image: String
    wikipedia: String
    contentRating: String
    ratings: movieRatings
    directors: String
    genres: String
    companies: String
    trailer: String
  }

  type pollComment {
    poll_id: String!
    title: String!
    user_id: String!
    username: String!
    text: String!
  }

  type Poll {
    title: String!
    description: String
    user_id: String!
    voted: Boolean
    created_on: String!
    options: [pollOption]
    comments: [pollComment]
  }

  type userPolls {
    poll_id: String!
    title: String!
  }

  type userComments {
    poll_id: String!
    title: String!
    movie: String!
    text: String!
  }

  type Query {
    getPoll(poll_id: String!): Poll
  }

  type Mutation {
    addUser(userName: String!, email: String!, password: String!): Auth
    login(userName: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
