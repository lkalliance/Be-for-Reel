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
      className="search-result"
      data-index={dataIndex}
      data-type={type}
      onClick={onClick}
    >
      {type === "search" ? (
        <>
          <h4>{`${value.title} ${value.description}`}</h4>
          <div>{value.plot}</div>
        </>
      ) : (
        <h4>{`${value.title} ${value.description}`}</h4>
      )}
    </li>
  );
}
