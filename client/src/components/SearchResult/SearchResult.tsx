// This component renders a single movie search result or selected film

/* REQUIRED PROPS:
value: an object containing all information about the movie
key: a number of the key value of this list member
dataIndex: a number of the index used later to identify this result during onClick
type: a string used later to identify this result during onClick
onClick: a callback function to reference when the result is clicked (selected) */

import "./SearchResult.css";
import { movieProps } from "../../utils/interfaces";

interface resultProps {
  value: movieProps;
  key: number;
  dataIndex: number;
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  type: string;
}

export function SearchResult({ value, type, onClick, dataIndex }: resultProps) {
  return (
    <li
      className="search-result list-member-20 item-hover"
      data-index={dataIndex}
      data-type={type}
      data-genres={value.genres}
      onClick={onClick}
    >
      <h4>
        {`${value.title}`}
        <span>{`(${value.description})`}</span>
      </h4>
      {type === "search" ? (
        <p>
          {value.stars && value.stars.length > 0 ? (
            <span className="stars">{value.stars}. </span>
          ) : null}
          {value.plot}
        </p>
      ) : (
        ""
      )}
    </li>
  );
}
