// This component renders a list of polls

import "./PollList.css";
import { Link } from "react-router-dom";
import { pollListProps } from "../../utils/interfaces";
import { useMutation } from "@apollo/client";
import { DEACTIVATE_POLL } from "../../utils/mutations";
import { QUERY_ALL_POLLS, QUERY_SINGLE_USER } from "../../utils";

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

  return (
    <div id="user-poll-list">
      <h3>Polls</h3>
      {[polls].length === 0 ? (
        `No polls created`
      ) : (
        <ul>
          {polls.map((poll, index) => {
            const today = new Date();
            const expires = new Date(poll.expires_on);
            const cutoff = new Date(
              expires.getFullYear(),
              expires.getMonth(),
              expires.getDate() - 15
            );
            const canDeactivate =
              thisUser && !poll.deactivated && today < cutoff;
            return (
              <li className="list-member-12" key={index}>
                {!poll.deactivated ? (
                  <>
                    <Link to={poll.urlTitle} className="reverse">
                      {poll.title}
                    </Link>
                    <em>
                      {`${poll.votes} vote`}
                      {poll.votes !== 1 ? "s" : ""} and{" "}
                      {`${poll.comments} comment`}
                      {poll.comments !== 1 ? "s" : ""}
                    </em>

                    {canDeactivate && (
                      <div className="deactivate-link">
                        <span data-id={poll.poll_id} onClick={cancelPoll}>
                          deactivate poll
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="deactivated">
                    <h6>{poll.title}</h6>
                    <div>You deactivated this poll</div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
