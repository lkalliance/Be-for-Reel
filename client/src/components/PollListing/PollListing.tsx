// This component renders a single poll listing on a list of polls

/* REQUIRED PROPS:
either a directory object or a user object, based on where it is displayed.
with directory:
  -- poll object with all poll data
  -- vote string: what the current user voted on this poll
with user:
  -- poll object with abbreviated poll data
  -- thisUser: boolean flag, are we looking at the profile of current user?
  -- editPoll: handler if the user clicks the "edit" link
  -- cancelPoll: handler if the user clicks the "deactivate" link */

import "./PollListing.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { ActionLink, UsernameLink } from "../../components";
import { pollProps, userPollProps } from "../../utils/interfaces";
import { convertMonth } from "../../utils/typeUtils";
import { AuthService } from "../../utils/auth";

interface directoryPollListingProps {
  poll: pollProps;
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
  const { userName, votes } = auth.getProfile();
  const currentUser = userName === directory?.poll.username;
  const userVote = user ? votes[user.poll.poll_id] : undefined;
  const numVotes = directory?.poll.votes.length || 0;
  const numComments = directory?.poll.comments.length || 0;

  return directory ? (
    <li
      className={
        directory.poll.expired
          ? "poll-listing list-member-12 expired"
          : "poll-listing list-member-12"
      }
    >
      <p className="title-and-user">
        {
          // if the user has voted on this poll, include the checkmark
          directory.vote.length > 0 && <FontAwesomeIcon icon={faCheckCircle} />
        }
        <Link to={directory.poll.urlTitle} className="reverse">
          {directory.poll.title}
        </Link>
        <UsernameLink
          username={directory.poll.username}
          current={currentUser}
          blockContainer={true}
        />
        {
          // if the user has voted on this poll, include the text of their vote
          directory.vote.length > 0 && (
            <span className="sub-info">
              you voted for <strong>{`${directory.vote}`}</strong>
            </span>
          )
        }
      </p>
      <p className="poll-info">
        {` ${numVotes} vote${
          numVotes !== 1 ? "s" : ""
        } and ${numComments} comment${numComments !== 1 ? "s" : ""}`}
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
          <p className="user-poll">
            {
              // if the user voted on the poll, show the checkmark
              userVote && <FontAwesomeIcon icon={faCheckCircle} />
            }
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
              {
                // if the user voted on the poll, show the text
                userVote && (
                  <span className="sub-info">
                    you voted for <strong>{`${userVote}`}</strong>
                  </span>
                )
              }
            </Link>
          </p>

          {
            // if the poll can be deactiated, provide the link
            user.poll.deactivatable && user.thisUser && (
              <ActionLink
                text="deactivate"
                handler={user.cancelPoll}
                pollId={user.poll.poll_id}
              />
            )
          }
          {
            // if the poll can be edited, provide the link
            user.poll.editable && user.thisUser && (
              <ActionLink
                text="edit"
                handler={user.editPoll}
                pollId={user.poll.poll_id}
              />
            )
          }
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
