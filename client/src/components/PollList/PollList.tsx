// This component renders a list of polls

import "./PollList.css";
import { Link } from "react-router-dom";
import { pollListProps } from "../../utils/interfaces";

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
              <li className="list-member-12" key={index}>
                <Link to={poll.urlTitle} className="reverse">
                  {poll.title}
                </Link>
                <em>
                  {`${poll.votes} vote`}
                  {poll.votes !== 1 ? "s" : ""} and {`${poll.comments} comment`}
                  {poll.comments !== 1 ? "s" : ""}
                </em>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
