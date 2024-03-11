// This component renders a poll directory page

import "./Directory.css";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { listSection } from "../../utils";
import { AuthService } from "../../utils/auth";
import { pollProps } from "../../utils/interfaces";
import { QUERY_ALL_POLLS, QUERY_GENRES } from "../../utils/queries";
import { PollListing, Select, Pagination } from "../../components";

export function Directory() {
  const navigate = useNavigate();
  const auth = new AuthService();
  const [currentPage, setCurrentPage] = useState(1);
  const { votes } = auth.getProfile();
  const { genre } = useParams();

  const lookupGenre = genre || "all";
  const perPage = 10;

  // get the relevant polls and genre list
  const getPolls = useQuery(QUERY_ALL_POLLS, {
    variables: { genre: lookupGenre },
  });
  const getGenres = useQuery(QUERY_GENRES);

  // get all polls
  const list = getPolls.data?.getPolls.polls || [];

  const showThis = listSection(list, currentPage, perPage);

  // generate list of sorted genre objects
  const genres: string[] = getGenres.loading
    ? ["loading"]
    : getGenres.data.getGenres.titles;
  const genreObjs = genres.map((genre) => {
    return {
      value: genre,
      title: genre.charAt(0).toUpperCase() + genre.slice(1),
    };
  });

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    navigate(`/polls/${value}`);
  };

  const handlePageSelect = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    const { id } = e.currentTarget;
    setCurrentPage(parseInt(id.split("-")[1]));
  };

  return (
    <section id="directory">
      <div id="filters" className="col col-12">
        {getGenres.loading ? (
          <div className="doesnt-exist list-member-12">Loading genres...</div>
        ) : (
          <Select
            id="genreSelect"
            options={genreObjs}
            val={genre}
            setValue={handleSelect}
          />
        )}
      </div>
      <ul id="polls">
        {getPolls.loading ? (
          <li className="doesnt-exist list-member-12">Loading polls...</li>
        ) : showThis.length > 0 ? (
          showThis.map((poll: pollProps, index: number) => {
            return (
              <PollListing
                key={index}
                directory={{
                  poll: poll,
                  vote: votes[poll._id] || "",
                }}
              />
            );
          })
        ) : null}
      </ul>
      <Pagination
        navHandler={handlePageSelect}
        currentPage={currentPage}
        totalCount={list.length}
        pageSize={perPage}
        siblingCount={1}
      />
    </section>
  );
}
