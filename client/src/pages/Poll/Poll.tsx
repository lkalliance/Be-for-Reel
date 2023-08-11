// This component renders a poll

import "./Poll.css";
import { useParams, Navigate } from "react-router-dom";
import { QUERY_SINGLE_POLL } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import {
  optionProps,
  userPollProps,
  userVoteProps,
} from "../../utils/interfaces";

import { Question } from "../../components";
import { Option } from "../../components";
import { Key } from "react";

interface pollProps {
  uvotes: userVoteProps[];
  loggedin: boolean;
}

type voteStatus = "vote" | "show" | "none";

export function Poll({ uvotes, loggedin }: pollProps) {
  const { username, pollname } = useParams();

  const { loading, data } = useQuery(QUERY_SINGLE_POLL, {
    variables: { username, pollname },
  });

  const poll = data?.getPoll;
  let votable: voteStatus;
  const rnd = Math.random() * 10;
  votable = rnd < 3 ? "vote" : rnd > 8 ? "none" : "show";

  return (
    <section id="poll">
      {poll && votable === "vote" ? (
        <>
          <Question q={poll.title} d={poll.description} />
          {poll.options.map(
            (option: optionProps, index: Key | null | undefined) => {
              return <Option key={index} opt={option} voted={poll.voted} />;
            }
          )}
        </>
      ) : votable === "show" ? (
        <div>Show the results</div>
      ) : (
        <div>Show nothing</div>
      )}
    </section>
  );
}
