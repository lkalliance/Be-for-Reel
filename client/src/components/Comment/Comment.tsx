// This component renders a single comment on a poll or user page

/* OPTIONAL PROPS:
thisUser: is the user looking at their own profile page
either pollComm or userComm...
pollComm:
  -- username (username of the commentor)
  -- movie (title of the movie selected by the commentor)
  -- text (the text of the comment)
userComm:
  -- title (title of the poll)
  -- urlTitle (url for the poll)
  -- movie (title of themovie selected by the commentor)
  -- text (the text of the comment) */

import "./Comment.css";
import { Link } from "react-router-dom";
import { AuthService } from "../../utils/auth";

import { pollCommentProps, userCommentProps } from "../../utils/interfaces";
import { UsernameLink } from "../../components";

interface commProps {
  thisUser?: boolean;
  pollComm?: pollCommentProps;
  userComm?: userCommentProps;
}

export function Comment({ pollComm, userComm, thisUser }: commProps) {
  const auth = new AuthService();
  const { userName } = auth.getProfile();
  const thisUserPoll = pollComm ? userName === pollComm.username : false;

  return (
    <>
      {pollComm && (
        <div className={`comment list-member-12 row${thisUser ? " self" : ""}`}>
          <div className="col col-12 col-sm-4 border-end border-sm-0">
            <h3>
              <UsernameLink username={pollComm.username} noBy={true} />
            </h3>
            {pollComm.movie ? (
              <h4 className="sub-info">
                {`${thisUserPoll ? "you " : ""}`}voted for{" "}
                <span className="your-vote">{pollComm.movie}</span>
              </h4>
            ) : (
              ""
            )}
          </div>
          <div className="col col-12 col-sm-8">
            <p className="m-0 text-center text-sm-start">{pollComm.text}</p>
          </div>
        </div>
      )}
      {userComm && (
        <li className="user-comment list-member-12">
          <Link to={userComm.urlTitle} className="reverse">
            {userComm.title}
            <p className="sub-info">
              {`${thisUser ? "you " : ""}`}voted for{" "}
              <span className="your-vote">{`${userComm.movie}`}</span>
            </p>
            <p className="comment-text">{userComm.text}</p>
          </Link>
        </li>
      )}
    </>
  );
}
