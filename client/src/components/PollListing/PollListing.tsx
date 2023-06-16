import "./PollListing.css";
import { pollProps } from "../../utils/interfaces";

interface listProps {
  index: number;
  poll: pollProps;
}

export function PollListing({ index, poll }: listProps) {
  return (
    <li className="poll-listing">
      <a href={`/poll/${index}`}>{poll.title}</a>
    </li>
  );
}
