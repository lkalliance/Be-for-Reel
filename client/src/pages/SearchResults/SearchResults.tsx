import "./SearchResults.css";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_SEARCH } from "../../utils/queries";
import { AuthService } from "../../utils/auth";
import { userProps, userPollProps, movieListProps } from "../../utils";
import { UsernameLink, Tabs } from "../../components";

export function SearchResults() {
  const Auth = new AuthService();
  const term = useParams();
  const [tab, setTab] = useState("polls");

  const switchTab = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { id } = e.currentTarget;
    setTab(id);
    console.log(tab);
  };

  // get the relevant polls
  const getResults = useQuery(QUERY_SEARCH, {
    variables: { term: term.term },
  });

  const users: userProps[] = getResults.data?.getSearch.users.users || [];
  const polls: userPollProps[] = getResults.data?.getSearch.polls.polls || [];
  const movies: movieListProps[] =
    getResults.data?.getSearch.movies.movies || [];

  return (
    <section id="search-results" className="container">
      <p className="sub-info">search for: {`"${term.term}"`}</p>
      <Tabs
        list={["polls", "users", "movies"]}
        current={tab}
        handler={switchTab}
      />
      {tab === "polls" && (
        <div className="results-row row">
          {polls.length === 0 ? (
            <div className="doesnt-exist">
              {getResults.data ? "no polls for this search" : "loading..."}
            </div>
          ) : (
            polls.map((poll, index) => {
              return (
                <div key={index} className="col col-12 col-md-6 col-lg-4">
                  <Link to={poll.urlTitle} className="reverse">
                    {poll.title}
                  </Link>
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === "users" && (
        <div className="results-row row">
          {users.length === 0 ? (
            <div className="doesnt-exist">
              {getResults.data ? "no users for this search" : "loading..."}
            </div>
          ) : (
            users.map((user, index) => {
              return (
                <div key={index} className="col col-12 col-md-6 col-lg-4">
                  <UsernameLink
                    username={user.userName}
                    original={true}
                    noBy={true}
                  />
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === "movies" && (
        <div className="results-row row">
          {Auth.loggedIn() ? (
            movies.length === 0 ? (
              <div className="doesnt-exist">
                {getResults.data ? "no movies for this search" : "loading..."}
              </div>
            ) : (
              movies.map((movie, index) => {
                return (
                  <div key={index} className="movie-result col col-12 col-md-6">
                    {`${movie.title} (${movie.year})`}
                    <span className="sub-info">{` ${movie.votes} ${
                      movie.votes === 1 ? "vote" : "votes"
                    }`}</span>
                  </div>
                );
              })
            )
          ) : (
            <div className="doesnt-exist">
              Log in to search for films used in polls
            </div>
          )}
        </div>
      )}
    </section>
  );
}
