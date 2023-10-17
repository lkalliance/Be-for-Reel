// This component renders a poll directory page

import "./Directory.css";
import { PollListing } from "../../components";
import { QUERY_ALL_POLLS } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { userPollProps } from "../../utils/interfaces";

export function Directory() {
  const { data } = useQuery(QUERY_ALL_POLLS, {
    variables: { username: "" },
  });

  const list = data?.getPolls.polls || false;

  return (
    <section id="directory">
      <ul>
        {list
          ? list.map((poll: userPollProps, index: number) => {
              return <PollListing key={index} poll={poll} />;
            })
          : ""}
      </ul>
    </section>
  );
}
