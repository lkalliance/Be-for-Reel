// This component renders the home page

import "./Home.css";
import { Card } from "../../components";
import { pollProps } from "../../utils";
import { useQuery } from "@apollo/client";
import { QUERY_HOME_POLLS } from "../../utils/queries";

interface homeProps {
  polls: pollProps[];
}

export function Home({ polls }: homeProps) {
  const { loading, data } = useQuery(QUERY_HOME_POLLS);
  return (
    <section id="home">
      {loading ? (
        <div>loading...</div>
      ) : (
        data.getHomePolls.polls.map((poll: pollProps, index: number) => {
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
        })
      )}
    </section>
  );
}
