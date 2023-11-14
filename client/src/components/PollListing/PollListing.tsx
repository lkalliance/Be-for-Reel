// This components renders a single poll listing on a list of polls

/* REQUIRED PROPS:
poll: an object containing all data for the poll's display:
  -- poll_id: the _id of this poll
  -- username: a string of the username of the user that created the poll
  -- title: a string of the poll's title
  -- urlTitle: a string of the poll's url
  -- votes: a number indicating the total number of votes on this poll
  -- comments: a number indicated the total number of comments on this poll */

import "./PollListing.css";
import { Link } from "react-router-dom";
import { userPollProps } from "../../utils/interfaces";
import { convertMonth } from "../../utils/typeUtils";
import { UsernameLink } from "../../components";

interface listProps {
  poll: userPollProps;
  vote?: string;
}

export function PollListing({ poll, vote }: listProps) {
  const expires = new Date(poll.expires_on);
  const expired = new Date(poll.expires_on) < new Date();
  console.log(poll);
  return (
    <li
      className={
        new Date(poll.expires_on) < new Date()
          ? "poll-listing expired"
          : "poll-listing"
      }
    >
      <Link to={poll.urlTitle}>{poll.title}</Link>
      <span>
        <UsernameLink username={poll.username} />
      </span>
      {vote ? (
        <em>
          you voted for <strong>{`${vote}`}</strong>
        </em>
      ) : null}
      <em>
        {` ${poll.votes} vote`}
        {poll.votes !== 1 ? "s" : ""} and {`${poll.comments} comment`}
        {poll.comments !== 1 ? "s" : ""}
        {expired ? " (expired)" : ` (expires ${convertMonth(expires)})`}
      </em>
    </li>
  );
}
