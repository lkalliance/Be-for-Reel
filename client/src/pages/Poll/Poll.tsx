// This component renders a poll

import "./Poll.css";
import { useParams } from "react-router-dom";
import { QUERY_SINGLE_POLL } from "../../utils/queries";
import { VOTE } from "../../utils/mutations";
import { useQuery, useMutation } from "@apollo/client";
import { optionProps, userVoteProps } from "../../utils/interfaces";

import { Question } from "../../components";
import { Option } from "../../components";
import { Key } from "react";

interface pollProps {
  uvotes: userVoteProps[];
  loggedin: boolean;
  currUser: string;
}

export function Poll({ uvotes, loggedin, currUser }: pollProps) {
  const { username, pollname } = useParams();
  const [castVote] = useMutation(VOTE);

  const handleVote = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const voteData = e.currentTarget.id.split("-");
    try {
      const { data } = await castVote({
        variables: {
          userName: currUser,
          movie: voteData[0],
          poll_id: voteData[1],
          option_id: voteData[2],
        },
      });
    } catch (err: any) {
      console.log(err);
    }
  };

  const { loading, data } = useQuery(QUERY_SINGLE_POLL, {
    variables: { username, pollname },
  });

  const poll = data?.getPoll;

  return (
    <section id="poll">
      {poll ? (
        <>
          <Question q={poll.title} d={poll.description} />
          {poll.options.map(
            (option: optionProps, index: Key | null | undefined) => {
              return (
                <Option
                  key={index}
                  opt={option}
                  poll={poll._id}
                  voted={poll.voted}
                  handleVote={handleVote}
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
