import { Dispatch, SetStateAction } from "react";

// These are for users

export interface userPollProps {
  // data stored for each poll on User
  poll_id: string;
  username: string;
  title: string;
  description: string;
  urlTitle: string;
  votes: number;
  comments: number;
  expires_on: Date;
  expired: Boolean;
  editable: Boolean;
  deactivatable: Boolean;
  winner?: string;
  deactivated: boolean;
}

export interface userCommentProps {
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

export interface userListProps {
  user_id: string;
  userName: string;
  lookupName: string;
  created: string;
  polls: number;
  votes: number;
  comments: number;
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
  year: number;
  imdb_id: string;
  stars: string;
  plot: string;
  image: string;
  wikipedia: string;
  contentRating: string;
  ratings: ratingsProps;
  worldwide: string;
  directors: string;
  runtime: string;
  genres: string;
  companies: string;
  trailer: string;
  votes: number;
}

export interface pollCommentProps {
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
  created_on: Date;
  expired: Boolean;
  expires_on: Date;
  editable: Boolean;
  deactivatable: Boolean;
  deactivated: Boolean;
  title: string;
  urlTitle: string;
  description: string;
  winning?: string;
  votes: string[];
  options: optionProps[];
  comments: pollCommentProps[];
}

export interface genreProps {
  // data provided for each genre
  title: string;
}

export interface pollListProps {
  // data provided for each poll
  polls: userPollProps[];
  genres?: string[];
  thisUser: Boolean;
  uName: string | undefined;
  currentPage: number;
  perPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

export interface loginState {
  // login boolean and passing handlers
  setLogIn: Dispatch<SetStateAction<boolean>>;
  stateObj?: { [key: string]: string };
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clear?: (form: string) => void;
  formSetter?: Dispatch<SetStateAction<any>>;
  boolErr?: boolean;
  strErr?: string;
  setBoolErr?: Dispatch<SetStateAction<boolean>>;
  setStrErr?: Dispatch<SetStateAction<string>>;
}

type pollKey = string;

type activePoll = {
  poll_id: string;
  expires: string;
};

export type userData = {
  // user info stored in token
  userName: string;
  lookupName: string;
  _id: string;
  confirmed: boolean;
  email: string;
  votes: { [key in pollKey]?: string };
  activePolls: activePoll[];
};

// These interfaces are used for the return from IMDb's title search

export interface searchOptions {
  // search option form elements
  [key: string]: string | boolean | { min: number; max: number };
  decade: string;
  years: {
    min: number;
    max: number;
  };
  length: {
    min: number;
    max: number;
  };
  gross: {
    min: number;
    max: number;
  };
  G: boolean;
  PG: boolean;
  PG13: boolean;
  R: boolean;
  oscar: boolean;
  oscarWin: boolean;
  genre: string;
}

export interface dualOptions {
  min: number;
  max: number;
}

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
  genreList?: genreObj[];
  genres?: string;
  id: string;
  imDbRating?: string;
  imDbRatingVotes?: string;
  image?: string;
  metacrtiticRating?: string;
  plot: string;
  runtimeStr?: string;
  starList?: starObj[];
  stars?: string;
  title: string;
}

export interface movieListProps {
  imdb_id: string;
  title: string;
  image: string;
  year: number;
  votes: number;
  rank?: number;
}
