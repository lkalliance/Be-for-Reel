// This components renders a single poll listing on a list of polls

import "./PollListing.css";
import { Link } from "react-router-dom";
import { userPollProps } from "../../utils";
import { UsernameLink } from "../../components";

interface listProps {
  poll: userPollProps;
}

export function PollListing({ poll }: listProps) {
  return (
    <li className="poll-listing">
      <Link to={poll.urlTitle}>{poll.title}</Link>
      <span>
        <UsernameLink username={poll.username} />
      </span>
      <em>
        {` ${poll.votes} vote`}
        {poll.votes !== 1 ? "s" : ""} and {`${poll.comments} comment`}
        {poll.comments !== 1 ? "s" : ""}
      </em>
    </li>
  );
}
