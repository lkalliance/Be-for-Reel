// This component renders a column in a directory

import "./DirectoryColumn.css";
import { pollProps, userPollProps } from "../../utils";
import { PollListing } from "../../components";

interface directoryColumnProps {
  polls: [userPollProps];
  votes: { [x: string]: string | undefined };
}

export function DirectoryColumn({ polls, votes }: directoryColumnProps) {
  return (
    <div className="directory-column">
      <ul>
        {polls
          ? polls.map((poll: userPollProps, index: number) => {
              return (
                <PollListing
                  key={index}
                  directory={{
                    poll: poll,
                    vote: votes[poll.poll_id] || "",
                  }}
                />
              );
            })
          : ""}
      </ul>
    </div>
  );
}
