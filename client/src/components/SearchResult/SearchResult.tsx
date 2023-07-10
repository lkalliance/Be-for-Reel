import "./SearchResult.css";
import { movieProps } from "../../utils/interfaces";

interface resultProps {
  movie: movieProps;
  key: number;
}

export function SearchResult({ movie }: resultProps) {
  return (
    <li className="search-result">
      <h4>{`${movie.title} ${movie.description}`}</h4>
      <div>{movie.plot}</div>
    </li>
  );
}
