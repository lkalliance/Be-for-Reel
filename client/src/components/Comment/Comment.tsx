// This component renders a single comment on a poll page

import "./Comment.css";
import { pollCommentProps } from "../../utils/interfaces";
import { createLookupName } from "../../utils/typeUtils";
import { Link } from "react-router-dom";

interface commProps {
  comm: pollCommentProps;
}

export function Comment({ comm }: commProps) {
  return (
    <div className="comment">
      <h4>
        <Link to={`/${createLookupName(comm.username)}`}>{comm.username}</Link>
      </h4>
      {comm.movie ? <h5>{comm.movie}</h5> : ""}
      <p>{comm.text}</p>
    </div>
  );
}
