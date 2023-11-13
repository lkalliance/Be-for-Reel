// This component renders the home page

import "./Home.css";
import { useQuery } from "@apollo/client";
import { pollProps } from "../../utils/interfaces";
import { QUERY_HOME_POLLS } from "../../utils/queries";
import { Card } from "../../components";

export function Home() {
  const { loading, data } = useQuery(QUERY_HOME_POLLS);
  return (
    <section id="home">
      {loading ? (
        <div>loading...</div>
      ) : (
        data.getHomePolls.polls.map((poll: pollProps, index: number) => {
          if (poll) {
            const whichPoster = Math.trunc(Math.random() * poll.options.length);
            return (
              <Card
                key={index}
                title={poll.title}
                urlTitle={poll.urlTitle}
                poster={poll.options[whichPoster].image}
                user={poll.username}
              />
            );
          }
        })
      )}
    </section>
  );
}
