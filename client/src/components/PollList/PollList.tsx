// This component renders a list of polls

import "./PollList.css";
import { Link } from "react-router-dom";
import { pollListProps } from "../../utils/interfaces";
import { useMutation } from "@apollo/client";
import { DEACTIVATE_POLL } from "../../utils/mutations";
import { QUERY_ALL_POLLS, QUERY_SINGLE_USER } from "../../utils";
import { PollListing } from "../../components/PollListing";

export function PollList({ polls, thisUser, uName }: pollListProps) {
  const [deactivatePoll] = useMutation(DEACTIVATE_POLL, {
    refetchQueries: () => [
      {
        query: QUERY_ALL_POLLS,
        variables: { username: "" },
      },
      {
        query: QUERY_SINGLE_USER,
        variables: { lookupname: uName },
      },
    ],
  });

  const cancelPoll = async (e: React.MouseEvent<HTMLElement>) => {
    // this handler deactivates a poll
    e.preventDefault();
    const id = e.currentTarget.dataset.id;
    try {
      const { data } = await deactivatePoll({
        variables: {
          poll_id: id,
        },
      });
    } catch (err: any) {
      console.log(err);
    }
  };

  const editPoll = async (e: React.MouseEvent<HTMLElement>) => {
    // this handler sets to edit a poll
    e.preventDefault();
    const id = e.currentTarget.dataset.id;
    try {
      console.log(`Editing poll ${id}`);
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div id="user-poll-list">
      <h3>Polls</h3>
      {polls.length === 0 ? (
        `No polls created`
      ) : (
        <ul>
          {polls.map((poll, index) => {
            return (
              <PollListing
                user={{ poll, thisUser, editPoll, cancelPoll }}
                key={index}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}
