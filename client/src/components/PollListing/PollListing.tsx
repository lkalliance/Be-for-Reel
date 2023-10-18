// This components renders a single poll listing on a list of polls

import "./PollListing.css";
import { userPollProps } from "../../utils/interfaces";
import { Link } from "react-router-dom";
import { UsernameLink } from "../../components";

interface listProps {
  poll: userPollProps;
}

export function PollListing({ poll }: listProps) {
  return (
    <li className="poll-listing">
      <Link to={poll.urlTitle}>{poll.title}</Link> (
      <UsernameLink username={poll.username} />,{` ${poll.votes} vote`}
      {poll.votes !== 1 ? "s" : ""}, {`${poll.comments} comment`}
      {poll.comments !== 1 ? "s" : ""})
    </li>
  );
}
