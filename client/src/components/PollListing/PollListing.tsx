// This components renders a single poll listing on a list of polls

import "./PollListing.css";
import { userPollProps } from "../../utils/interfaces";
import { Link } from "react-router-dom";

interface listProps {
  poll: userPollProps;
}

export function PollListing({ poll }: listProps) {
  return (
    <li className="poll-listing">
      <Link to={poll.urlTitle}>{poll.title}</Link> (
      {`${poll.username}, ${poll.votes} votes, ${poll.comments} comments`})
    </li>
  );
}
