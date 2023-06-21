import { gql } from "apollo-server-express";

export const typeDefs = gql`
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
    votes: [String]
    comments: [userComments]
  }

  type userPolls {
    poll_id: String!
    title: String!
    votes: Number
    comments: Number
  }

  type userComments {
    poll_id: String!
    title: String!
    movie: String!
    text: String!
  }
`;
