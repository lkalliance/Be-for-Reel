// This component renders a list of polls

import "./PollList.css";
import { pollListProps } from "../../utils/interfaces";
import { Link } from "react-router-dom";

export function PollList({ polls }: pollListProps) {
  return (
    <div>
      <h3>Polls</h3>
      {[polls].length === 0 ? (
        `No polls created`
      ) : (
        <ul>
          {polls.map((poll, index) => {
            return (
              <li key={index}>
                <Link to={poll.urlTitle}>{poll.title}</Link>{" "}
                {`${poll.votes} votes and ${poll.comments} comments`}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
