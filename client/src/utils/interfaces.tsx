export interface ratingsProps {
  imDb: string;
  metacritic: string;
  theMovieDb: string;
  rottenTomatoes: string;
  filmAffinity: string;
}

export interface optionProps {
  id: string;
  title: string;
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
  options: optionProps[];
}
