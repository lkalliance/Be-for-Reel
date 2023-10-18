// This component renders a list of polls

import "./PollList.css";
import { pollListProps } from "../../utils/interfaces";
import { Link } from "react-router-dom";

export function PollList({ polls }: pollListProps) {
  return (
    <div>
      <h2>Polls</h2>
      {[polls].length === 0 ? (
        `No polls created`
      ) : (
        <ul>
          {polls.map((poll, index) => {
            return (
              <li key={index}>
                <Link to={poll.urlTitle}>{poll.title}</Link>{" "}
                {`${poll.votes} vote`}
                {poll.votes !== 1 ? "s" : ""} and {`${poll.comments} comment`}
                {poll.comments !== 1 ? "s" : ""}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
