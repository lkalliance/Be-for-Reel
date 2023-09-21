import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password) {
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
  mutation AddPoll(
    $title: String!
    $movieIds: [String]!
    $description: String
  ) {
    addPoll(title: $title, movieIds: $movieIds, description: $description) {
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
      title
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
  }
`;
