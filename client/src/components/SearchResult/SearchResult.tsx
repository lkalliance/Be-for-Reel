// This component renders a single search result or selected film

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
      className="search-result list-member-20"
      data-index={dataIndex}
      data-type={type}
      onClick={onClick}
    >
      <h4>{`${value.title} (${value.description})`}</h4>
      {type === "search" ? (
        <p>
          <span>{value.stars} </span>
          {value.plot}
        </p>
      ) : (
        ""
      )}
    </li>
  );
}
