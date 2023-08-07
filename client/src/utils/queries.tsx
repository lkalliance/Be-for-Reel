import { gql } from "@apollo/client";

export const QUERY_SINGLE_USER = gql`
  query GetUser($username: String!) {
    getUser(username: $username) {
      created
      polls {
        poll_id
        title
      }
      userName
      votes
      comments {
        movie
        poll_id
        text
        title
        urlTitle
      }
    }
  }
`;

export const QUERY_SINGLE_POLL = gql`
  query GetPoll($username: String!, $pollname: String!) {
    getPoll(username: $username, pollname: $pollname) {
      title
      description
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
        votes
      }
      comments {
        text
        username
      }
      created_on
    }
  }
`;
