// This component renders a poll

import "./Poll.css";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  QUERY_SINGLE_POLL,
  QUERY_ALL_POLLS,
  QUERY_SINGLE_USER,
} from "../../utils/queries";
import { VOTE } from "../../utils/mutations";
import { AuthService } from "../../utils/auth";

import { useQuery, useMutation } from "@apollo/client";
import {
  optionProps,
  userData,
  pollCommentProps,
} from "../../utils/interfaces";

import { Question, Option, Comment } from "../../components";
import { Key } from "react";

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

  const [castVote] = useMutation(VOTE, {
    // when casting a vote, refetch poll directory, user and this poll
    refetchQueries: () => [
      {
        query: QUERY_ALL_POLLS,
        variables: { username: "" },
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

  const handleComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // keep track of comment as it is typed
    setComment(e.target.value);
  };

  const handleVote = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // handle vote submission

    // parse the option id for values
    const voteData = e.currentTarget.id.split("&&&");
    try {
      const { data } = await castVote({
        variables: {
          userName: currUser,
          movie: voteData[0],
          poll_id: voteData[1],
          option_id: voteData[2],
          imdb_id: voteData[3],
          comment,
        },
      });
      setComment("");

      // after voting, update user token with newly cast vote
      Auth.login(data.castVote.token.token);
    } catch (err: any) {
      console.log(err);
    }
  };

  const { loading, data } = useQuery(QUERY_SINGLE_POLL, {
    variables: { lookupname, pollname },
  });

  const poll = data?.getPoll;

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
              ) : (
                // user has not voted on this poll, show comment form
                <textarea
                  id="comment"
                  onChange={handleComment}
                  value={comment}
                ></textarea>
              )
            ) : (
              // user is not logged in, prompt them to
              <div>
                <Link to={"/login"}>Log in</Link> to vote and to see results and
                comments
              </div>
            )}
          </div>
          {poll.options.map(
            (option: optionProps, index: Key | null | undefined) => {
              return (
                <Option
                  key={index}
                  opt={option}
                  poll={poll._id}
                  loggedIn={loggedIn}
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
