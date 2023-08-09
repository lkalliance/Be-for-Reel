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
    userName: String!
    email: String!
    password: String!
    created: String
    polls: [userPolls]
    comments: [userComments]
    votes: [userVotes]
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
    votes: Int
  }

  type pollComment {
    poll_id: String!
    title: String
    movie: String!
    user_id: String!
    username: String!
    text: String!
  }

  type Poll {
    title: String!
    urlTitle: String!
    description: String
    user_id: String!
    username: String!
    created_on: String!
    options: [pollOption]
    comments: [pollComment]
    votes: Int
  }

  type userPolls {
    poll_id: String!
    title: String!
    urlTitle: String!
    username: String!
    votes: Int
    comments: Int
  }

  type userComments {
    poll_id: String!
    username: String!
    title: String!
    urlTitle: String!
    movie: String!
    text: String!
  }

  type userVotes {
    poll_id: String!
    option_id: String!
    movie: String
  }

  type pollReturn {
    poll_id: String!
    poll_title: String!
    redirect: String!
  }

  type pollList {
    polls: [userPolls]
  }

  type Query {
    getPoll(username: String!, pollname: String!): Poll
    getUser(username: String!): User
    getPolls(username: String): pollList
  }

  type Mutation {
    addUser(userName: String!, email: String!, password: String!): Auth
    login(userName: String!, password: String!): Auth
    addPoll(
      title: String!
      description: String
      movieIds: [String]!
    ): pollReturn
  }
`;

module.exports = typeDefs;
