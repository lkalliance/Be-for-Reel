// This component renders a poll

import "./Poll.css";
import { TextareaHTMLAttributes, useState } from "react";
import { useParams } from "react-router-dom";
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
  userVoteProps,
  userData,
  pollCommentProps,
} from "../../utils/interfaces";

import { Question, Option, Comment } from "../../components";
import { Key } from "react";

interface pollProps {
  loggedin: boolean;
  currUser: string;
}

export function Poll({ loggedin, currUser }: pollProps) {
  const Auth = new AuthService();
  const loggedIn = Auth.loggedIn();

  const { lookupname, pollname } = useParams();
  const userInfo: userData = Auth.getProfile();

  const [castVote] = useMutation(VOTE, {
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
    setComment(e.target.value);
  };

  const handleVote = async (e: React.MouseEvent<HTMLButtonElement>) => {
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

      await Auth.login(data.castVote.token.token);
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
      {poll ? (
        <>
          <Question q={poll.title} d={poll.description} />
          {loggedIn ? (
            userInfo.votes[poll._id] ? (
              <div>You voted for "{userInfo.votes[poll._id]}"</div>
            ) : (
              <textarea
                id="comment"
                onChange={handleComment}
                value={comment}
              ></textarea>
            )
          ) : (
            <div>Log in to vote and to see results and comments</div>
          )}
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
            <div>
              <h3>User comments</h3>
              {poll.comments.map(
                (comment: pollCommentProps, index: Key | null | undefined) => {
                  return <Comment key={index} comm={comment}></Comment>;
                }
              )}
            </div>
          ) : (
            <div></div>
          )}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </section>
  );
}
