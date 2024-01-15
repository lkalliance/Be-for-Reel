// This component renders a single comment on a poll page

/* REQUIRED PROPS:
comm: an object with three properties:
  -- username (username of the commentor)
  -- movie (title of the movie selected by the commentor
  -- text (the text of the comment */

import "./Comment.css";
import { AuthService } from "../../utils/auth";

import { pollCommentProps } from "../../utils/interfaces";
import { UsernameLink } from "../../components";

interface commProps {
  comm: pollCommentProps;
}

export function Comment({ comm }: commProps) {
  const auth = new AuthService();
  const thisUser = auth.getProfile().userName === comm.username;

  return (
    <div className="comment list-member-12 row">
      <div className="col col-12 col-sm-4 border-end border-sm-0">
        <h3>
          <UsernameLink username={comm.username} />
        </h3>
        {comm.movie ? (
          <h4 className="sub-info">
            {`${thisUser ? "you " : ""}`}voted for{" "}
            <span className="your-vote">{comm.movie}</span>
          </h4>
        ) : (
          ""
        )}
      </div>
      <div className="col col-12 col-sm-8">
        <p className="m-0 text-center text-sm-start">{comm.text}</p>
      </div>
    </div>
  );
}
