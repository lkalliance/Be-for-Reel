// This component renders a poll

import "./Poll.css";
import { useParams } from "react-router-dom";
import { QUERY_SINGLE_POLL } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { optionProps, userVoteProps } from "../../utils/interfaces";

import { Question } from "../../components";
import { Option } from "../../components";
import { Key } from "react";

interface pollProps {
  uvotes: userVoteProps[];
  loggedin: boolean;
}

export function Poll({ uvotes, loggedin }: pollProps) {
  const { username, pollname } = useParams();

  const { loading, data } = useQuery(QUERY_SINGLE_POLL, {
    variables: { username, pollname },
  });

  const poll = data?.getPoll;

  console.log(poll);

  return (
    <section id="poll">
      {poll ? (
        <>
          <Question q={poll.title} d={poll.description} />
          {poll.options.map(
            (option: optionProps, index: Key | null | undefined) => {
              console.log(option);
              return (
                <Option
                  key={index}
                  opt={option}
                  poll={poll._id}
                  voted={poll.voted}
                />
              );
            }
          )}
        </>
      ) : (
        <div>Show nothing</div>
      )}
    </section>
  );
}
