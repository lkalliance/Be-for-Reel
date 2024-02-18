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
        <div className="comment list-member-12">
          <div className="user-info">
            <UsernameLink
              username={pollComm.username}
              noBy={true}
              current={thisUserPoll}
              type="div"
            />
            {pollComm.movie && (
              <span
                className={`${
                  thisUserPoll ? "your-vote you-data" : "your-vote user-data"
                }`}
              >
                voted for <strong>{pollComm.movie}</strong>
              </span>
            )}
          </div>
          <div className="comment-text">
            <p className="m-0 text-center text-sm-start">{pollComm.text}</p>
          </div>
        </div>
      )}
      {userComm && (
        <li className="user-comment list-member-12">
          <Link to={userComm.urlTitle} className="reverse">
            {userComm.title}
          </Link>
          <span className={`${thisUser ? "you-data" : "user-data"}`}>
            {`${thisUser ? "you " : ""}`}voted for{" "}
            <span className="your-vote">{`${userComm.movie}`}</span>
          </span>
          <p className="comment-text">{userComm.text}</p>
        </li>
      )}
    </>
  );
}
