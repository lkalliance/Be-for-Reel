// This component renders a single poll listing on a list of polls

/* REQUIRED PROPS:
either a directory object or a user object, based on where it is displayed:
  -- poll_id: the _id of this poll
  -- username: a string of the username of the user that created the poll
  -- title: a string of the poll's title
  -- urlTitle: a string of the poll's url
  -- votes: a number indicating the total number of votes on this poll
  -- comments: a number indicated the total number of comments on this poll */

import "./PollListing.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { ActionLink, UsernameLink } from "../../components";
import { userPollProps } from "../../utils/interfaces";
import { convertMonth } from "../../utils/typeUtils";
import { AuthService } from "../../utils/auth";

interface directoryPollListingProps {
  poll: userPollProps;
  vote: string;
}

interface userPollListingProps {
  poll: userPollProps;
  thisUser: Boolean;
  editPoll: (e: React.MouseEvent<HTMLElement>) => void;
  cancelPoll: (e: React.MouseEvent<HTMLElement>) => void;
}

interface listProps {
  user?: userPollListingProps;
  directory?: directoryPollListingProps;
}

export function PollListing({ user, directory }: listProps) {
  const auth = new AuthService();
  const currentUser = auth.getProfile().userName === directory?.poll.username;
  const votes = auth.getProfile().votes;
  const userVote = user ? votes[user.poll.poll_id] : undefined;

  return directory ? (
    <li
      className={
        directory.poll.expired
          ? "poll-listing list-member-12 expired"
          : "poll-listing list-member-12"
      }
    >
      <p className="title-and-user">
        {directory.vote.length > 0 && <FontAwesomeIcon icon={faCheckCircle} />}
        <Link to={directory.poll.urlTitle} className="reverse">
          {directory.poll.title}
        </Link>
        <UsernameLink
          username={directory.poll.username}
          current={currentUser}
          blockContainer={true}
        />
        {directory.vote.length > 0 && (
          <span className="sub-info">
            you voted for <strong>{`${directory.vote}`}</strong>
          </span>
        )}
      </p>
      <p className="poll-info">
        {` ${directory.poll.votes} vote`}
        {directory.poll.votes !== 1 ? "s" : ""} and{" "}
        {`${directory.poll.comments} comment`}
        {directory.poll.comments !== 1 ? "s" : ""}
        {directory.poll.expired
          ? ""
          : ` (expires ${convertMonth(directory.poll.expires_on)})`}
      </p>
    </li>
  ) : user ? (
    <li
      className={
        // if poll is deactivated and this isn't the poll's creator, hide it
        !user.thisUser && user.poll.deactivated
          ? "hidden"
          : "user-poll list-member-12"
      }
    >
      {!user.poll.deactivated ? (
        // poll is not deactivated
        <>
          <div className="user-poll">
            <Link to={user.poll.urlTitle} className="reverse">
              {user.poll.title}
              <span className="poll-info">
                {`${user.poll.votes} ${
                  user.poll.votes !== 1 ? "votes" : "vote"
                }, `}
                {`${user.poll.comments} ${
                  user.poll.comments !== 1 ? "comments" : "comment"
                }`}
              </span>
              {userVote && (
                <span className="sub-info">
                  you voted for <strong>{`${userVote}`}</strong>
                </span>
              )}
            </Link>
          </div>

          {user.poll.deactivatable && user.thisUser && (
            <ActionLink
              text="deactivate"
              handler={user.cancelPoll}
              pollId={user.poll.poll_id}
            />
          )}
          {user.poll.editable && user.thisUser && (
            <ActionLink
              text="edit"
              handler={user.editPoll}
              pollId={user.poll.poll_id}
            />
          )}
        </>
      ) : (
        // poll is deactivated
        <div className="deactivated">
          <h6>{user.poll.title}</h6>
          <div>You deactivated this poll</div>
        </div>
      )}
    </li>
  ) : (
    <li className="hidden"></li>
  );
}
