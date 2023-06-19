export interface ratingsProps {
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

export interface pollProps {
  id: string;
  user_id: string;
  username: string;
  created_on: string;
  title: string;
  description: string;
  voted: boolean;
  options: optionProps[];
}

interface userPollProps {
  poll_id: string;
  title: string;
  votes: number;
  comments: number;
}

interface commentProps {
  poll_id: string;
  title: string;
  movie: string;
  text: string;
}

export interface userProps {
  id: string;
  username: string;
  email: string;
  polls: userPollProps[];
  votes: string[];
  comments: commentProps[];
}
