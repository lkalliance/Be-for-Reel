// This component renders a poll

import "./Poll.css";
import axios from "axios";
import { useState, Key } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthService } from "../../utils/auth";
import { optionProps, pollCommentProps } from "../../utils/interfaces";
import { VOTE, NEW_CODE } from "../../utils/mutations";
import {
  QUERY_SINGLE_POLL,
  QUERY_ALL_POLLS,
  QUERY_SINGLE_USER,
  QUERY_MOVIES,
} from "../../utils/queries";
import { useQuery, useMutation } from "@apollo/client";
import { Question, Option, Comment, EmailVerifyModal } from "../../components";

interface pollProps {
  loggedin: boolean;
  currUser: string;
}

export function Poll({ currUser }: pollProps) {
  const auth = new AuthService();
  const loggedIn = auth.loggedIn();
  const {
    confirmed,
    votes,
    _id: user_id,
    lookupName,
    email,
    userName,
  } = auth.getProfile();

  // get username and poll name from parameters
  const { lookupname, pollname } = useParams();

  // get the poll
  const { loading, data } = useQuery(QUERY_SINGLE_POLL, {
    variables: { lookupname, pollname },
  });

  const poll = data?.getPoll;

  let opts = loading || !poll ? [] : [...poll.options];
  const thisUser = loading || !poll ? null : user_id === poll.user_id;
  if (!loading && poll) {
    // trap for loading
    if (votes[poll._id] || (poll.expired && loggedIn)) {
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
  // is the poll author also the current user?
  const current = loading || !poll ? false : userName === poll.username;

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
        variables: { number: 100 },
      },
    ],
  });
  const [newEmailCode] = useMutation(NEW_CODE);

  const [comment, setComment] = useState("");
  const [selected, setSelected] = useState({
    userName: currUser,
    movie: "",
    poll_id: "",
    option_id: "",
    imdb_id: "",
    comment: "",
  });
  const [newCodeSent, setNewCodeSent] = useState(false);

  const closeModal = () => {
    try {
      setNewCodeSent(false);
    } catch (err) {
      console.log(err);
    }
  };

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

  const resendHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // handler to re-send verification link

    // if there is no email, never mind
    if (!email || !user_id || email.length === 0 || user_id.length === 0)
      return;

    try {
      // request new code if needed
      const newCode = await newEmailCode({
        variables: {
          user_id,
          email,
        },
      });

      if (newCode.data.newEmailCode.success) {
        // if the operation succeeded, pass it along to the email API
        await axios.post("/api/email/validate-send", {
          email,
        });
      }
      console.log(newCode.data?.newEmailCode.message);
      setNewCodeSent(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <section id="poll">
        {loading ? (
          <div className="list-member-12 doesnt-exist">Loading poll...</div>
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
                current={current}
              />
              {loggedIn && confirmed ? (
                // valid user is logged in: either show user's vote or comment text area
                votes[poll._id] && (
                  // user has voted on this poll, show their vote
                  <p id="yourvote" className="you-data">
                    you voted for <strong>{votes[poll._id]}</strong>
                  </p>
                )
              ) : loggedIn && !confirmed ? (
                // user is logged in, but not confirmed
                <div className="list-member-12" id="resend-alert">
                  <button
                    className="btn btn-danger btn-sm"
                    id="resend"
                    onClick={resendHandler}
                  >
                    resend
                  </button>
                  <p>
                    Your account's email address <strong>{email}</strong> has
                    not been confirmed. Look for a confirmation email at that
                    address. If you have confirmed your account, try logging out
                    and logging back in.
                  </p>
                </div>
              ) : !loggedIn ? (
                // user is not logged in
                <div className="login-prompt">
                  <Link to={"/login"}>Log in</Link> to vote and to see results
                  and comments
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
              {poll.expired && (
                <p className="doesnt-exist">This poll is closed</p>
              )}
            </div>
            <ul id="options">
              {opts.map(
                (option: optionProps, index: Key | null | undefined) => {
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
                      votes={
                        votes[poll._id] || poll.expired
                          ? option.votes
                          : undefined
                      }
                      handleVote={handleVote}
                      handleComment={handleComment}
                      editable={poll.editable}
                    />
                  );
                }
              )}
            </ul>
            {loggedIn && poll.comments.length > 0 && (
              // user is logged in, show the comments
              <div id="comments">
                {poll.comments.map(
                  (
                    comment: pollCommentProps,
                    index: Key | null | undefined
                  ) => {
                    return <Comment key={index} pollComm={comment}></Comment>;
                  }
                )}
              </div>
            )}
          </>
        )}
      </section>
      {newCodeSent && (
        <EmailVerifyModal
          close={closeModal}
          email={email.length > 0 ? email : "the provided email address"}
        />
      )}
    </>
  );
}
