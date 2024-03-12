const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  type Auth {
    token: ID
    user: User
    id: ID
    eToken: String
    message: String
  }

  type Confirm {
    success: Boolean
    message: String
  }

  type currentAuth {
    userName: String!
    id: ID!
  }

  type User {
    userName: String!
    lookupName: String!
    email: String!
    password: String!
    created: String
    confirmed: Boolean
    polls: [userPolls]
    comments: [userComments]
    votes: [userVotes]
    voted: [String]
  }

  type listUser {
    user_id: ID
    userName: String!
    lookupName: String!
    created: String!
    polls: Int
    votes: Int
    comments: Int
  }

  type movieRatings {
    imDb: String
    metacritic: String
    theMovieDb: String
    rottenTomatoes: String
    filmAffinity: String
  }

  type pollOption {
    _id: ID
    movie: String!
    year: Int
    imdb_id: String!
    stars: String
    plot: String
    image: String
    wikipedia: String
    contentRating: String
    ratings: movieRatings
    worldwide: String
    directors: String
    runtime: String
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
    _id: ID
    title: String!
    urlTitle: String!
    description: String
    user_id: String!
    username: String!
    created_on: Date!
    expires_on: Date
    expired: Boolean!
    editable: Boolean!
    options: [pollOption]
    comments: [pollComment]
    votes: [String]
    voters: [String]
    deactivated: Boolean
  }

  type homePolls {
    featuredPolls: [Poll]
    recentPolls: [Poll]
    popularPolls: [Poll]
  }

  type userPolls {
    poll_id: String!
    username: String!
    title: String!
    description: String
    urlTitle: String!
    votes: Int
    comments: Int
    expires_on: Date
    expired: Boolean
    editable: Boolean
    deactivatable: Boolean
    deactivated: Boolean
  }

  type userComments {
    poll_id: String!
    username: String!
    title: String!
    urlTitle: String!
    movie: String!
    text: String!
    deactivated: Boolean
  }

  type userVotes {
    poll_id: String!
    option_id: String!
    movie: String
  }

  type pollReturn {
    poll_id: String
    title: String
    redirect: String
    deactivated: Boolean
    message: String
    token: Auth
  }

  type voteReturn {
    poll: Poll
    token: Auth
  }

  type Genre {
    title: String
    polls: [Poll]
  }

  type GenreList {
    titles: [String]
  }

  type pollList {
    polls: [Poll]
  }

  type userList {
    users: [listUser]
  }

  type Movie {
    imdb_id: String!
    title: String!
    image: String
    year: Int
    votes: Int
  }

  type movieList {
    movies: [Movie]
  }

  type searchReturn {
    users: userList
    polls: pollList
    movies: movieList
    usersDef: Boolean
  }

  type Query {
    getPoll(lookupname: String!, pollname: String!): Poll
    getUser(lookupname: String!): User
    getUsers: userList
    getPolls(username: String, genre: String): pollList
    getHomePolls: homePolls
    getGenres: GenreList
    getMovies(number: Int): movieList
    getSearch(term: String!): searchReturn
  }

  type Mutation {
    addUser(userName: String!, email: String!, password: String!): Auth
    newEmailCode(user_id: String!, email: String!): Confirm
    forgotPwd(email: String!): Confirm
    resetPwd(newPwd: String!, eToken: String!): Confirm
    login(userName: String!, password: String!, eToken: String): Auth
    addPoll(
      title: String!
      description: String
      movieIds: [String]!
      movieTitles: [String]!
      userGenre: String
    ): pollReturn
    castVote(
      userName: String!
      poll_id: String!
      option_id: String!
      movie: String
      imdb_id: String
      comment: String
    ): voteReturn
    deactivatePoll(poll_id: String!): pollReturn
  }
`;

module.exports = typeDefs;
