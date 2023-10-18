// This components renders a single poll listing on a list of polls

import "./PollListing.css";
import { userPollProps } from "../../utils/interfaces";
import { createLookupName } from "../../utils/typeUtils";
import { Link } from "react-router-dom";

interface listProps {
  poll: userPollProps;
}

export function PollListing({ poll }: listProps) {
  return (
    <li className="poll-listing">
      <Link to={poll.urlTitle}>{poll.title}</Link> (
      <Link to={`/${createLookupName(poll.username)}`}>{poll.username}</Link>,
      {` ${poll.votes} vote`}
      {poll.votes !== 1 ? "s" : ""}, {`${poll.comments} comment`}
      {poll.comments !== 1 ? "s" : ""})
    </li>
  );
}
