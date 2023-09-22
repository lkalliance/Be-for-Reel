// This component renders a poll directory page

import "./Directory.css";
// import { useState } from "react";
import { PollListing } from "../../components";
import { QUERY_ALL_POLLS } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { userPollProps, userVoteProps } from "../../utils/interfaces";

interface directoryProps {
  uvotes: userVoteProps[];
  // newPoll: number;
}

export function Directory({ uvotes }: directoryProps) {
  // const [reloader, setReloader] = useState(0);
  const { loading, data } = useQuery(QUERY_ALL_POLLS, {
    variables: { username: "" },
  });

  const list = data?.getPolls.polls || false;

  return (
    <section id="directory">
      {/* <div id="sortaState">{newPoll}</div> */}
      <ul>
        {list
          ? list.map((poll: userPollProps, index: number) => {
              return <PollListing key={index} index={index} poll={poll} />;
            })
          : ""}
      </ul>
    </section>
  );
}
