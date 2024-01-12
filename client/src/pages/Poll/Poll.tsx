// This component renders a poll

import "./Poll.css";
import { useState, Key } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthService } from "../../utils/auth";
import {
  optionProps,
  userData,
  pollCommentProps,
} from "../../utils/interfaces";
import { VOTE } from "../../utils/mutations";
import {
  QUERY_SINGLE_POLL,
  QUERY_ALL_POLLS,
  QUERY_SINGLE_USER,
} from "../../utils/queries";
import { useQuery, useMutation } from "@apollo/client";
import { Question, Option, Comment, TextAreaField } from "../../components";

interface pollProps {
  loggedin: boolean;
  currUser: string;
}

export function Poll({ currUser }: pollProps) {
  const Auth = new AuthService();
  const loggedIn = Auth.loggedIn();

  // get username and poll name from parameters
  const { lookupname, pollname } = useParams();
  // get all user info
  const userInfo: userData = Auth.getProfile();

  // get the poll
  const { loading, data } = useQuery(QUERY_SINGLE_POLL, {
    variables: { lookupname, pollname },
  });

  const poll = data?.getPoll;
  console.log(loading ? "loading" : poll);
  let opts = loading ? [] : [...poll.options];
  const thisUser = loading ? null : userInfo._id === poll.user_id;

  if (!loading) {
    // trap for loading
    if (userInfo.votes[poll._id] || poll.expired) {
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

  const mostVotes = loading ? 0 : opts[0].votes;

  const [castVote] = useMutation(VOTE, {
    // when casting a vote, refetch poll directory, user and this poll
    refetchQueries: () => [
      {
        query: QUERY_ALL_POLLS,
        variables: { genre: poll.genre },
      },
      {
        query: QUERY_SINGLE_USER,
        variables: { lookupname: userInfo.lookupName },
      },
      {
        query: QUERY_SINGLE_POLL,
        variables: { lookupname, pollname },
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
      Auth.login(data.castVote.token.token);
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
      ) : poll.deactivated ? (
        <div className="deactivated list-member-20">
          This poll has been removed.
        </div>
      ) : poll.editable && !thisUser ? (
        // the poll is still editable and it isn't this user
        <div className="edit-poll">
          <span>This poll is not yet public.</span>
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

            {loggedIn ? (
              // user is logged in: either show user's vote or comment text area
              userInfo.votes[poll._id] ? (
                // user has voted on this poll, show their vote
                <p id="yourvote">
                  you voted for <strong>{userInfo.votes[poll._id]}</strong>
                </p>
              ) : !poll.expired && !poll.editable ? (
                // user has not voted on this poll, and it can't be edited, show the form
                <fieldset>
                  <TextAreaField
                    id="comment"
                    placeholder="Make a selection, add an optional comment, and click to vote!"
                    max={400}
                    height={60}
                    width={250}
                    setValue={handleComment}
                    val={comment}
                    disabled={selected.option_id === ""}
                  />
                  <button
                    disabled={selected.option_id === ""}
                    onClick={handleVote}
                    className="btn btn-primary"
                  >
                    Vote!
                  </button>
                </fieldset>
              ) : poll.editable && thisUser ? (
                // the poll is editable, show the link
                <div className="edit-poll" onClick={editPoll}>
                  <span>Edit this poll</span>
                </div>
              ) : (
                ""
              )
            ) : (
              // user is not logged in, prompt them to
              <div className="login-prompt">
                <Link to={"/login"} className="reverse">
                  Log in
                </Link>{" "}
                to vote and to see results and comments
              </div>
            )}
            {poll.expired ? <p className="expired">This poll is closed</p> : ""}
          </div>
          <div id="options">
            {opts.map((option: optionProps, index: Key | null | undefined) => {
              return (
                <Option
                  key={index}
                  winner={option.votes === mostVotes}
                  opt={option}
                  loggedIn={loggedIn}
                  expired={poll.expired}
                  selected={selected}
                  select={setSelected}
                  comment={setComment}
                  voted={userInfo.votes[poll._id]}
                  votes={userInfo.votes[poll._id] ? option.votes : undefined}
                  handleVote={handleVote}
                  editable={poll.editable}
                />
              );
            })}
          </div>
          {loggedIn && poll.comments.length > 0 ? (
            // user is logged in, show the comments
            <div id="comments" className="container">
              <h3 className="center">User comments</h3>
              {poll.comments.map(
                (comment: pollCommentProps, index: Key | null | undefined) => {
                  return <Comment key={index} comm={comment}></Comment>;
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
