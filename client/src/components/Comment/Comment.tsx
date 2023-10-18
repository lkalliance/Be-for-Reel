// This component renders a single comment on a poll page

import "./Comment.css";
import { pollCommentProps } from "../../utils/interfaces";
import { Link } from "react-router-dom";
import { UsernameLink } from "../../components";

interface commProps {
  comm: pollCommentProps;
}

export function Comment({ comm }: commProps) {
  return (
    <div className="comment">
      <h4>
        <UsernameLink username={comm.username} />
      </h4>
      {comm.movie ? <h5>{comm.movie}</h5> : ""}
      <p>{comm.text}</p>
    </div>
  );
}
