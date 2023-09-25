// This component renders a poll directory page

import "./Directory.css";
import { Dispatch, SetStateAction } from "react";
// import { useRecoilState, selector } from "recoil";
// import { pollDirectoryAtom } from "../../recoil/atoms/pollDirectoryAtom";
import { PollListing } from "../../components";
import { QUERY_ALL_POLLS } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import {
  userPollProps,
  userVoteProps,
  pollListProps,
} from "../../utils/interfaces";

interface directoryProps {
  uvotes: userVoteProps[];
  pollList: pollListProps;
  downloaded: boolean;
  setDownloaded: Dispatch<SetStateAction<boolean>>;
}

export function Directory({
  uvotes,
  pollList,
  downloaded,
  setDownloaded,
}: directoryProps) {
  const { loading, data } = useQuery(QUERY_ALL_POLLS, {
    variables: { username: "" },
  });

  const list = data?.getPolls.polls || false;

  return (
    <section id="directory">
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
