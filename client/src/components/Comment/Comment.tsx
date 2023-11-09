// This component renders a single comment on a poll page

/* REQUIRED PROPS:
comm: an object with three properties:
  -- username (username of the commentor)
  -- movie (title of the movie selected by the commentor
  -- text (the text of the comment */

import "./Comment.css";
import { pollCommentProps } from "../../utils/interfaces";
import { UsernameLink } from "../../components";

interface commProps {
  comm: pollCommentProps;
}

export function Comment({ comm }: commProps) {
  return (
    <div className="comment">
      <h3>
        <UsernameLink username={comm.username} />
      </h3>
      {comm.movie ? <h4>"{comm.movie}"</h4> : ""}
      <p>{comm.text}</p>
    </div>
  );
}
