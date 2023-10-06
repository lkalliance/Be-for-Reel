// This component renders a single comment on a poll page

import "./Comment.css";
import { pollCommentProps } from "../../utils/interfaces";

interface commProps {
  comm: pollCommentProps;
}

export function Comment({ comm }: commProps) {
  console.log(comm);
  return (
    <div className="comment">
      <h4>{comm.username}</h4>
      {comm.movie ? <h5>{comm.movie}</h5> : ""}
      <p>{comm.text}</p>
    </div>
  );
}
