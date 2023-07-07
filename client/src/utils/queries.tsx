import { gql } from "@apollo/client";

export const QUERY_SINGLE_USER = gql`
  query GetUser($userId: String!) {
    getUser(user_id: $userId) {
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
      }
    }
  }
`;