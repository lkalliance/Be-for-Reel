import { Dispatch, SetStateAction } from "react";

// These are for users

export interface userPollProps {
  // data stored for each poll on User
  poll_id: string;
  username: string;
  title: string;
  urlTitle: string;
  votes: number;
  comments: number;
}

interface userCommentProps {
  // data stored for each user comment
  poll_id: string;
  username: string;
  title: string;
  urlTitle: string;
  movie: string;
  text: string;
}

export interface userVoteProps {
  // data stored for each user vote
  poll_id: string;
  option_id: string;
  movie: string;
}

export interface userProps {
  // data included with each user
  id: string;
  userName: string;
  email: string;
  polls: userPollProps[];
  votes: userVoteProps[];
  comments: userCommentProps[];
}

// These are for polls

interface ratingsProps {
  // list of ratings returned by IMDb
  imDb: string;
  metacritic: string;
  theMovieDb: string;
  rottenTomatoes: string;
  filmAffinity: string;
}

export interface optionProps {
  // data included with each poll option
  _id: string;
  movie: string;
  imdb_id: string;
  stars: string;
  plot: string;
  image: string;
  wikipedia: string;
  contentRating: string;
  ratings: ratingsProps;
  directors: string;
  genres: string;
  companies: string;
  trailer: string;
  votes: number;
}

interface pollCommentProps {
  // data included with each comment on the poll
  poll_id: string;
  title: string;
  user_id: string;
  username: string;
  movie: string;
  text: string;
}

export interface pollProps {
  // data included with each poll
  _id: string;
  user_id: string;
  username: string;
  created_on: string;
  title: string;
  urlTitle: string;
  description: string;
  votes: string[];
  options: optionProps[];
  comments: pollCommentProps[];
}

export interface pollListProps {
  // data provided for each poll
  polls: userPollProps[];
}

export interface loginState {
  // login boolean
  setLogIn: Dispatch<SetStateAction<boolean>>;
}

export type userData = {
  username: string;
  id: string;
  votes: userVoteProps[];
};

// These interfaces are used for the return from IMDb's title search

interface genreObj {
  // genres attached to films by IMDb
  key: string;
  value: string;
}

interface starObj {
  // stars attached to films by IMDb
  id: string;
  name: string;
}

export interface movieProps {
  // data provided for each film by IMDb
  contentRating: string;
  description: string;
  genreList: genreObj[];
  genres: string;
  id: string;
  imDbRating: string;
  imDbRatingVotes: string;
  image: string;
  metacrtiticRating: string;
  plot: string;
  runtimeStr: string;
  starList: starObj[];
  stars: string;
  title: string;
}
