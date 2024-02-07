// This component renders the home page

import "./Home.css";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { pollProps } from "../../utils/interfaces";
import { QUERY_HOME_POLLS } from "../../utils/queries";
import { Card } from "../../components";
import { AuthService } from "../../utils/auth";
import { convertMonth } from "../../utils/typeUtils";

export function Home() {
  const auth = new AuthService();
  const votes = auth.getProfile().votes;
  const { loading, data: hPolls } = useQuery(QUERY_HOME_POLLS);
  let popCutoff = 4;
  let addToList = true;

  if (!loading) {
    while (addToList && hPolls.getHomePolls.popularPolls.length > popCutoff) {
      if (
        hPolls.getHomePolls.popularPolls[popCutoff + 1] &&
        hPolls.getHomePolls.popularPolls[popCutoff].votes.length ===
          hPolls.getHomePolls.popularPolls[popCutoff + 1].votes.length
      ) {
        popCutoff++;
      } else {
        addToList = false;
      }
    }
  }

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
          hPolls.getHomePolls.featuredPolls.map(
            (poll: pollProps, index: number) => {
              if (poll) {
                const whichPoster = Math.trunc(
                  Math.random() * poll.options.length
                );
                return (
                  <Card
                    key={index}
                    num={index}
                    voted={votes[poll._id]}
                    title={poll.title}
                    urlTitle={poll.urlTitle}
                    poster={poll.options[whichPoster].image}
                    user={poll.username}
                    votes={poll.votes ? poll.votes.length : 0}
                  />
                );
              } else return null;
            }
          )
        )}
      </div>
      <div id="sub-lists">
        {!loading ? (
          <div id="recent-polls">
            <h3>Most recent polls</h3>
            <ul>
              {hPolls.getHomePolls.recentPolls.map(
                (poll: pollProps, index: number) => {
                  return index < 5 ? (
                    <li key={index}>
                      <Link
                        to={poll.urlTitle}
                        className="list-member-12 reverse"
                      >
                        {votes[poll._id] && (
                          <FontAwesomeIcon icon={faCheckCircle} />
                        )}
                        {poll.title}{" "}
                        <span className="sub-poll-info">
                          {convertMonth(poll.created_on)}
                        </span>
                      </Link>
                    </li>
                  ) : null;
                }
              )}
            </ul>
          </div>
        ) : null}

        {!loading ? (
          <div id="popular-polls">
            <h3>Most popular polls</h3>
            <ul>
              {hPolls.getHomePolls.popularPolls.map(
                (poll: pollProps, index: number) => {
                  return index <= popCutoff ? (
                    <li key={index}>
                      <Link
                        to={poll.urlTitle}
                        className="list-member-12 reverse"
                      >
                        {votes[poll._id] && (
                          <FontAwesomeIcon icon={faCheckCircle} />
                        )}
                        {poll.title}{" "}
                        <span className="sub-poll-info">{`${poll.votes.length}${
                          poll.votes.length === 1 ? " vote" : " votes"
                        }`}</span>
                      </Link>
                    </li>
                  ) : null;
                }
              )}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
