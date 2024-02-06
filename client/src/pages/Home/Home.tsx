// This component renders the home page

import "./Home.css";
import { useQuery } from "@apollo/client";
import { pollProps } from "../../utils/interfaces";
import { QUERY_HOME_POLLS } from "../../utils/queries";
import { Card } from "../../components";

export function Home() {
  const { loading, data: hPolls } = useQuery(QUERY_HOME_POLLS);

  return (
    <section id="home" className="container">
      <h1 className="homepage-title">Be for Reel</h1>
      <p className="lead">
        Be real about your favorite reels.
        <span className="extra">
          Participate in polls about your favorite movies. Create, vote, and
          comment!
        </span>
      </p>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 justify-content-center">
        {loading ? (
          <div className="doesnt-exist">loading...</div>
        ) : (
          hPolls.getHomePolls.polls.map((poll: pollProps, index: number) => {
            if (poll) {
              const whichPoster = Math.trunc(
                Math.random() * poll.options.length
              );
              return (
                <Card
                  key={index}
                  num={index}
                  title={poll.title}
                  urlTitle={poll.urlTitle}
                  poster={poll.options[whichPoster].image}
                  user={poll.username}
                  votes={poll.votes ? poll.votes.length : 0}
                />
              );
            } else return null;
          })
        )}
      </div>
    </section>
  );
}
