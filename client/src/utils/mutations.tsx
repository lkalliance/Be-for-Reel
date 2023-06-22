import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Mutation($userName: String!, $password: String!) {
    login(username: $userName, password: $password) {
      token
      user {
        _id
        userName
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation Mutation($userName: String!, $email: String!, $password: String!) {
    addUser(userName: $userName, email: $email, password: $password) {
      token
      user {
        userName
        _id
      }
    }
  }
`;
