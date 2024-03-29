import { gql } from "@apollo/client";

export const QUERY_SINGLE_USER = gql`
  query GetUser($lookupname: String!) {
    getUser(lookupname: $lookupname) {
      created
      confirmed
      polls {
        poll_id
        title
        urlTitle
        votes
        comments
        deactivated
        expired
        editable
        deactivatable
      }
      userName
      lookupName
      votes {
        poll_id
        option_id
        movie
      }
      comments {
        movie
        poll_id
        text
        title
        urlTitle
        deactivated
      }
    }
  }
`;

export const QUERY_SINGLE_POLL = gql`
  query GetPoll($lookupname: String!, $pollname: String!) {
    getPoll(lookupname: $lookupname, pollname: $pollname) {
      _id
      title
      description
      username
      user_id
      options {
        _id
        companies
        contentRating
        directors
        runtime
        genres
        image
        imdb_id
        year
        movie
        plot
        ratings {
          rottenTomatoes
          imDb
        }
        worldwide
        stars
        trailer
        wikipedia
        votes
      }
      comments {
        text
        username
        movie
      }
      votes
      voters
      created_on
      expires_on
      expired
      editable
      deactivated
    }
  }
`;

export const QUERY_MOVIES = gql`
  query GetMovies($number: Int) {
    getMovies(number: $number) {
      movies {
        imdb_id
        title
        image
        year
        votes
      }
    }
  }
`;

export const QUERY_ALL_POLLS = gql`
  query GetPolls($username: String, $genre: String) {
    getPolls(username: $username, genre: $genre) {
      polls {
        _id
        title
        description
        urlTitle
        username
        votes
        comments {
          poll_id
        }
        expires_on
        expired
        editable
        deactivated
      }
    }
  }
`;

export const QUERY_ALL_USERS = gql`
  query GetUsers {
    getUsers {
      users {
        user_id
        userName
        lookupName
        created
        polls
        comments
        votes
      }
    }
  }
`;

export const QUERY_HOME_POLLS = gql`
  query GetHomePolls {
    getHomePolls {
      featuredPolls {
        _id
        title
        urlTitle
        username
        description
        options {
          image
        }
        votes
        created_on
      }
      recentPolls {
        _id
        title
        urlTitle
        username
        created_on
      }
      popularPolls {
        _id
        title
        urlTitle
        username
        votes
      }
    }
  }
`;

export const QUERY_GENRES = gql`
  query GetGenres {
    getGenres {
      titles
    }
  }
`;

export const QUERY_SEARCH = gql`
  query GetSearch($term: String!) {
    getSearch(term: $term) {
      polls {
        polls {
          _id
          title
          urlTitle
          username
        }
      }
      users {
        users {
          userName
        }
      }
      movies {
        movies {
          title
          year
          votes
        }
      }
      usersDef
    }
  }
`;
