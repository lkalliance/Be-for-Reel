import "./SearchResults.css";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_SEARCH } from "../../utils/queries";
import { AuthService } from "../../utils/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { userProps, pollProps, movieListProps, listSection } from "../../utils";
import { UsernameLink, Tabs, Pagination } from "../../components";

export function SearchResults() {
  const auth = new AuthService();
  const { term } = useParams();
  const { votes } = auth.getProfile();
  const [tab, setTab] = useState("polls");
  const [currentPollPage, setCurrentPollPage] = useState(1);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [currentFilmPage, setCurrentFilmPage] = useState(1);

  const perPage = 20;

  const switchTab = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { id } = e.currentTarget;
    setTab(id);
  };

  // get the relevant polls
  const getResults = useQuery(QUERY_SEARCH, {
    variables: { term },
  });

  const users: userProps[] = getResults.data?.getSearch.users.users || [];
  const polls: pollProps[] = getResults.data?.getSearch.polls.polls || [];
  const movies: movieListProps[] =
    getResults.data?.getSearch.movies.movies || [];

  const showTheseUsers = listSection(users, currentUserPage, perPage);
  const showThesePolls = listSection(polls, currentPollPage, perPage);
  const showTheseFilms = listSection(movies, currentFilmPage, perPage);

  const handlePollPageSelect = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    const { id } = e.currentTarget;
    setCurrentPollPage(parseInt(id.split("-")[1]));
  };

  const handleUserPageSelect = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    const { id } = e.currentTarget;
    setCurrentUserPage(parseInt(id.split("-")[1]));
  };

  const handleFilmPageSelect = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    const { id } = e.currentTarget;
    setCurrentFilmPage(parseInt(id.split("-")[1]));
  };

  return (
    <section id="search-results" className="container">
      <p className="sub-info">search for: {`"${term}"`}</p>
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
            showThesePolls.map((poll, index) => {
              console.log(poll);
              return (
                <div key={index} className="col col-12 col-md-6 col-lg-4">
                  {votes[poll._id] && <FontAwesomeIcon icon={faCheckCircle} />}
                  <Link to={poll.urlTitle} className="reverse">
                    {poll.title}
                  </Link>
                </div>
              );
            })
          )}
          <Pagination
            navHandler={handlePollPageSelect}
            currentPage={currentPollPage}
            totalCount={polls.length}
            pageSize={perPage}
            siblingCount={1}
          />
        </div>
      )}

      {tab === "users" && (
        <div className="results-row row">
          {users.length === 0 ? (
            <div className="doesnt-exist">
              {getResults.data ? "no users for this search" : "loading..."}
            </div>
          ) : (
            showTheseUsers.map((user, index) => {
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
          <Pagination
            navHandler={handleUserPageSelect}
            currentPage={currentUserPage}
            totalCount={users.length}
            pageSize={perPage}
            siblingCount={1}
          />
        </div>
      )}

      {tab === "movies" && (
        <div className="results-row row">
          {auth.loggedIn() ? (
            movies.length === 0 ? (
              <div className="doesnt-exist">
                {getResults.data ? "no movies for this search" : "loading..."}
              </div>
            ) : (
              showTheseFilms.map((movie, index) => {
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
          <Pagination
            navHandler={handleFilmPageSelect}
            currentPage={currentFilmPage}
            totalCount={movies.length}
            pageSize={perPage}
            siblingCount={1}
          />
        </div>
      )}
    </section>
  );
}
