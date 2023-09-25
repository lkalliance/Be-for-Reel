// This components renders a single poll listing on a list of polls

import "./PollListing.css";
import { userPollProps } from "../../utils/interfaces";
import { useNavigate } from "react-router-dom";

interface listProps {
  index: number;
  poll: userPollProps;
}

export function PollListing({ index, poll }: listProps) {
  const navigate = useNavigate();
  const clickHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(poll.urlTitle);
  };
  return (
    <li className="poll-listing">
      <a href="#" onClick={clickHandler}>
        {poll.title}
      </a>{" "}
      ({`${poll.username}, ${poll.votes} votes, ${poll.comments} comments`})
    </li>
  );
}
