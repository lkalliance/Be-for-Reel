import "./SearchingAlert.css";
import searchGif from "./movieGif80.gif";

interface searchingAlertProps {
  message: string;
  stopSearch: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function SearchingAlert({ message, stopSearch }: searchingAlertProps) {
  return (
    <div id="searching-alert" className="list-member-20">
      <img src={searchGif} alt="searching for films" />
      {message} ...
      <button className="btn btn-primary btn-small" onClick={stopSearch}>
        Cancel
      </button>
    </div>
  );
}
