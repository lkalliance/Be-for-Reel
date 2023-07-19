// This component renders a list of polls

import "./PollList.css";
import { userPollProps } from "../../utils/interfaces";
import { Link } from "react-router-dom";

interface pollListProps {
  listData: userPollProps[];
}

export function PollList({ listData }: pollListProps) {
  console.log(listData);
  return (
    <div>
      <h3>Polls</h3>
      {listData.length === 0 ? (
        `No polls created`
      ) : (
        <ul>
          {listData.map((poll, index) => {
            return (
              <li key={index}>
                <Link to={`/poll/${poll.poll_id}`}>{poll.title}</Link>{" "}
                {`${poll.votes} votes and ${poll.comments} comments`}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
