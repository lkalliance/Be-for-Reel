import "./PollListing.css";
import { pollProps } from "../../utils/interfaces";

interface listProps {
  index: number;
  poll: pollProps;
  voted: boolean;
}

export function PollListing({ index, poll, voted }: listProps) {
  return (
    <li className="poll-listing">
      <a href={`/poll/${index}`}>{poll.title}</a>
      {voted ? <span>You have voted on this poll</span> : ""}
    </li>
  );
}
