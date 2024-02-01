import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($userName: String!, $password: String!, $eToken: String) {
    login(userName: $userName, password: $password, eToken: $eToken) {
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
      eToken
      user {
        userName
      }
    }
  }
`;

export const ADD_POLL = gql`
  mutation AddPoll(
    $title: String!
    $movieIds: [String]!
    $description: String
    $userGenre: String
  ) {
    addPoll(
      title: $title
      movieIds: $movieIds
      description: $description
      userGenre: $userGenre
    ) {
      title
      redirect
    }
  }
`;

export const VOTE = gql`
  mutation CastVote(
    $userName: String!
    $poll_id: String!
    $option_id: String!
    $movie: String
    $imdb_id: String
    $comment: String
  ) {
    castVote(
      userName: $userName
      poll_id: $poll_id
      option_id: $option_id
      movie: $movie
      imdb_id: $imdb_id
      comment: $comment
    ) {
      poll {
        title
        votes
        options {
          companies
          contentRating
          directors
          genres
          image
          imdb_id
          movie
          plot
          ratings {
            rottenTomatoes
            imDb
          }
          stars
          trailer
          wikipedia
        }
      }
      token {
        token
        user {
          userName
          votes {
            poll_id
            option_id
            movie
          }
        }
      }
    }
  }
`;

export const DEACTIVATE_POLL = gql`
  mutation DeactivatePoll($poll_id: String!) {
    deactivatePoll(poll_id: $poll_id) {
      title
      deactivated
    }
  }
`;

export const CONFIRM_EMAIL = gql`
  mutation ConfirmEmail($eToken: String!) {
    confirmEmail(eToken: $eToken) {
      success
      message
    }
  }
`;
