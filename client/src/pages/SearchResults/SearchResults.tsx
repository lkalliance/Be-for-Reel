import "./SearchResults.css";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_SEARCH } from "../../utils/queries";
import { userProps, userPollProps } from "../../utils";
import { UsernameLink } from "../../components";

export function SearchResults() {
  const term = useParams();

  // get the relevant polls
  const getResults = useQuery(QUERY_SEARCH, {
    variables: { term: term.term },
  });

  const users: userProps[] = getResults.data?.getSearch.users.users || [];
  const polls: userPollProps[] = getResults.data?.getSearch.polls.polls || [];

  return (
    <section id="search-results" className="container">
      <p className="sub-info">search for: {`"${term.term}"`}</p>
      <div className="row">
        <div className="col col-12 col-sm-6 container">
          <h3>Polls</h3>
          <div className="results-row row">
            {polls.map((poll, index) => {
              return (
                <div key={index} className="col col-12 col-md-6">
                  <Link to={poll.urlTitle} className="reverse">
                    {poll.title}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col col-12 col-sm-6 container">
          <h3>Users</h3>
          <div className="results-row row">
            {users.map((user, index) => {
              return (
                <div key={index} className="col col-12 col-md-6">
                  <UsernameLink username={user.userName} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
