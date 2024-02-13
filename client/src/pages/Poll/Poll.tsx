// This component renders a poll

import "./Poll.css";
import { useState, Key } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthService } from "../../utils/auth";
import { optionProps, pollCommentProps } from "../../utils/interfaces";
import { VOTE } from "../../utils/mutations";
import {
  QUERY_SINGLE_POLL,
  QUERY_ALL_POLLS,
  QUERY_SINGLE_USER,
  QUERY_MOVIES,
} from "../../utils/queries";
import { useQuery, useMutation } from "@apollo/client";
import { Question, Option, Comment } from "../../components";

interface pollProps {
  loggedin: boolean;
  currUser: string;
}

export function Poll({ currUser }: pollProps) {
  const auth = new AuthService();
  const loggedIn = auth.loggedIn();
  const { confirmed, votes, _id, lookupName, email } = auth.getProfile();

  // get username and poll name from parameters
  const { lookupname, pollname } = useParams();

  // get the poll
  const { loading, data } = useQuery(QUERY_SINGLE_POLL, {
    variables: { lookupname, pollname },
  });

  const poll = data?.getPoll;
  let opts = loading || !poll ? [] : [...poll.options];
  const thisUser = loading || !poll ? null : _id === poll.user_id;
  if (!loading && poll) {
    // trap for loading
    if (votes[poll._id] || poll.expired) {
      // if the user has voted, or the poll is expired, sort by votes
      opts.sort((a: optionProps, b: optionProps) => {
        return b.votes - a.votes;
      });
    } else {
      // otherwise, sort by year descending
      opts.sort((a: optionProps, b: optionProps) => {
        return a.year - b.year;
      });
    }
  }

  const mostVotes = loading || !poll ? 0 : opts[0].votes;

  const [castVote] = useMutation(VOTE, {
    // when casting a vote, refetch poll directory, user and this poll
    refetchQueries: () => [
      {
        query: QUERY_ALL_POLLS,
        variables: { genre: "all" },
      },
      {
        query: QUERY_SINGLE_USER,
        variables: { lookupname: lookupName },
      },
      {
        query: QUERY_SINGLE_POLL,
        variables: { lookupname, pollname },
      },
      {
        query: QUERY_MOVIES,
        variables: { number: 10 },
      },
    ],
  });
  const [comment, setComment] = useState("");
  const [selected, setSelected] = useState({
    userName: currUser,
    movie: "",
    poll_id: "",
    option_id: "",
    imdb_id: "",
    comment: "",
  });

  const handleComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // keep track of comment as it is typed
    setComment(e.target.value);
  };

  const handleVote = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // handle vote submission
    try {
      const voteVars = { ...selected, comment, poll_id: poll._id };
      const { data } = await castVote({
        variables: voteVars,
      });
      setComment("");

      // after voting, update user token with newly cast vote
      auth.login(data.castVote.token.token);
    } catch (err: any) {
      console.log(err);
    }
  };

  const editPoll = (e: React.MouseEvent<HTMLElement>) => {
    console.log(`Editing poll ${poll._id}`);
  };

  return (
    <section id="poll">
      {loading ? (
        <div>Loading...</div>
      ) : !poll ? (
        <div className="deactivated list-member-20">
          This poll does not exist
        </div>
      ) : poll.deactivated ? (
        <div className="deactivated list-member-20">
          This poll has been removed.
        </div>
      ) : (
        <>
          <div id="question" className="list-member-20">
            <Question
              question={poll.title}
              description={
                poll.description.length > 0 ? poll.description : undefined
              }
              username={poll.username}
            />
            {loggedIn && confirmed ? (
              // valid user is logged in: either show user's vote or comment text area
              votes[poll._id] ? (
                // user has voted on this poll, show their vote
                <p id="yourvote">
                  you voted for <strong>{votes[poll._id]}</strong>
                </p>
              ) : null
            ) : // user is not logged in, or not confirmed
            !loggedIn ? (
              <div className="login-prompt">
                <Link to={"/login"} className="reverse">
                  Log in
                </Link>{" "}
                to vote and to see results and comments
              </div>
            ) : (
              <div className="login-prompt">
                You have not confirmed your email address.
                <br />
                Check your email at {email} and
                <br />
                look for the email with a confirmation link.
              </div>
            )}
            {poll.editable && thisUser && !poll.expired && (
              <div className="edit-poll" onClick={editPoll}>
                <span>Edit this poll</span>
              </div>
            )}
            {poll.expired ? <p className="expired">This poll is closed</p> : ""}
          </div>
          <ul id="options">
            {opts.map((option: optionProps, index: Key | null | undefined) => {
              return (
                <Option
                  key={index}
                  winner={option.votes === mostVotes}
                  opt={option}
                  loggedIn={loggedIn}
                  confirmed={confirmed}
                  expired={poll.expired}
                  selected={selected}
                  select={setSelected}
                  comment={comment}
                  setComment={setComment}
                  voted={votes[poll._id]}
                  votes={votes[poll._id] ? option.votes : undefined}
                  handleVote={handleVote}
                  handleComment={handleComment}
                  editable={poll.editable}
                />
              );
            })}
          </ul>
          {loggedIn && poll.comments.length > 0 ? (
            // user is logged in, show the comments
            <div id="comments" className="container">
              {/* <h3 className="center">User comments</h3> */}
              {poll.comments.map(
                (comment: pollCommentProps, index: Key | null | undefined) => {
                  return <Comment key={index} pollComm={comment}></Comment>;
                }
              )}
            </div>
          ) : (
            //user is not logged in, hide comments
            <div className="hidden"></div>
          )}
        </>
      )}
    </section>
  );
}
