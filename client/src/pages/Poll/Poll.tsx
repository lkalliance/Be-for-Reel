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

  const expires = loading ? null : new Date(poll.expires_on);
  const expired = loading || !expires ? null : new Date() > expires;

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

  return (
    <section id="poll">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div id="question">
            <Question
              question={poll.title}
              description={poll.description}
              username={poll.username}
            />

            {loggedIn ? (
              // user is logged in: either show user's vote or comment text area
              userInfo.votes[poll._id] ? (
                // user has voted on this poll, show their vote
                <p id="yourvote">You voted for "{userInfo.votes[poll._id]}"</p>
              ) : !expired ? (
                // user has not voted on this poll, show comment form
                <fieldset>
                  <TextAreaField
                    id="comment"
                    placeholder="Make a selection, add an optional comment, and click to vote!"
                    max={400}
                    setValue={handleComment}
                    val={comment}
                    disabled={selected.option_id === ""}
                  />
                  <button
                    disabled={selected.option_id === ""}
                    onClick={handleVote}
                  >
                    Vote!
                  </button>
                </fieldset>
              ) : (
                ""
              )
            ) : (
              // user is not logged in, prompt them to
              <div>
                <Link to={"/login"}>Log in</Link> to vote and to see results and
                comments
              </div>
            )}
            {expired ? <p className="expired">This poll is closed</p> : ""}
          </div>
          {poll.options.map(
            (option: optionProps, index: Key | null | undefined) => {
              return (
                <Option
                  key={index}
                  opt={option}
                  loggedIn={loggedIn}
                  selected={selected}
                  select={setSelected}
                  comment={setComment}
                  voted={userInfo.votes[poll._id]}
                  votes={
                    userInfo.votes[poll._id]
                      ? poll.votes.filter((vote: string) => vote === option._id)
                          .length
                      : undefined
                  }
                  handleVote={handleVote}
                />
              );
            }
          )}
          {loggedIn && poll.comments.length > 0 ? (
            // user is logged in, show the comments
            <div>
              <h2>User comments</h2>
              {poll.comments.map(
                (comment: pollCommentProps, index: Key | null | undefined) => {
                  return <Comment key={index} comm={comment}></Comment>;
                }
              )}
            </div>
          ) : (
            //user is not logged in, hide comments
            <div></div>
          )}
        </>
      )}
    </section>
  );
}
