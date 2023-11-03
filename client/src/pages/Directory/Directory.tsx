// This component renders a poll directory page

import "./Directory.css";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { userPollProps, QUERY_ALL_POLLS } from "../../utils";
import { PollListing } from "../../components";

export function Directory() {
  const { genre } = useParams();
  const { data } = useQuery(QUERY_ALL_POLLS, {
    variables: { username: "", genre },
  });

  const genreTitle = genre
    ? genre.charAt(0).toUpperCase() + genre.slice(1)
    : "Recent polls";

  const list = data?.getPolls.polls || false;

  return (
    <section id="directory">
      {genreTitle ? <h1>{genreTitle}</h1> : ""}
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
