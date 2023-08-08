// This components renders a single poll listing on a list of polls

import "./PollListing.css";
import { userPollProps } from "../../utils/interfaces";

interface listProps {
  index: number;
  poll: userPollProps;
}

export function PollListing({ index, poll }: listProps) {
  return (
    <li className="poll-listing">
      <a href={poll.urlTitle}>{poll.title}</a>
    </li>
  );
}
