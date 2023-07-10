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
