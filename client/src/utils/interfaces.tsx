import { Dispatch, SetStateAction } from "react";

interface ratingsProps {
  imDb: string;
  metacritic: string;
  theMovieDb: string;
  rottenTomatoes: string;
  filmAffinity: string;
}

export interface optionProps {
  id: string;
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
}

interface pollCommentProps {
  poll_id: string;
  title: string;
  user_id: string;
  username: string;
  movie: string;
  text: string;
}

export interface pollProps {
  id: string;
  user_id: string;
  username: string;
  created_on: string;
  title: string;
  description: string;
  voted: boolean;
  options: optionProps[];
  comments: pollCommentProps[];
}

export interface userPollProps {
  poll_id: string;
  title: string;
  votes: number;
  comments: number;
}

interface userCommentProps {
  poll_id: string;
  title: string;
  urlTitle: string;
  movie: string;
  text: string;
}

export interface userProps {
  id: string;
  userName: string;
  email: string;
  polls: userPollProps[];
  votes: string[];
  comments: userCommentProps[];
}

export interface loginState {
  setLogIn: Dispatch<SetStateAction<boolean>>;
}

interface genreObj {
  key: string;
  value: string;
}

interface starObj {
  id: string;
  name: string;
}

export interface movieProps {
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
