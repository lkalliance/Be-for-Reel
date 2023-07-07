const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Auth {
    token: ID
    user: User
    id: ID
  }

  type currentAuth {
    userName: String!
    id: ID!
  }

  type User {
    _id: ID
    userName: String!
    email: String!
    password: String!
    created: String
    polls: [userPolls]
    comments: [userComments]
    votes: [String]
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
    Me(token: String!): currentAuth
    getPoll(poll_id: String!): Poll
    getUser(user_id: String!): User
  }

  type Mutation {
    addUser(userName: String!, email: String!, password: String!): Auth
    login(userName: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
