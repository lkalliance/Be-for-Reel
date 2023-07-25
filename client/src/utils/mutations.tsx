import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password) {
      token
      user {
        userName
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($userName: String!, $email: String!, $password: String!) {
    addUser(userName: $userName, email: $email, password: $password) {
      token
      user {
        userName
      }
    }
  }
`;

export const ADD_POLL = gql`
  mutation AddPoll($userId: String!, $title: String!, $movieIds: [String]!, $userName: String, description: String) {
    addPoll(userId: $userId, title: $title, movieIds: $movieIds, userName: $userName, description: $description) {
      poll_id
    }
  }
`;
