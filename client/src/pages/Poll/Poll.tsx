// This component renders a poll

import "./Poll.css";
import { useParams, Navigate } from "react-router-dom";
import { QUERY_SINGLE_POLL } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { optionProps } from "../../utils";

import { Question } from "../../components";
import { Option } from "../../components";
import { Key } from "react";

export function Poll() {
  const { username, pollname } = useParams();

  const { loading, data } = useQuery(QUERY_SINGLE_POLL, {
    variables: { username, pollname },
  });

  const poll = data?.getPoll;

  console.log(poll);

  return (
    <section id="poll">
      This is the poll page
      {poll ? (
        <>
          <Question q={poll.title} d={poll.description} />
          {poll.options.map(
            (option: optionProps, index: Key | null | undefined) => {
              return <Option key={index} opt={option} voted={poll.voted} />;
            }
          )}
        </>
      ) : (
        <div></div>
      )}
    </section>
  );
}
