const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Auth {
    token: ID
    user: User
  }

  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    polls: [userPolls]
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
   
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(username: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
