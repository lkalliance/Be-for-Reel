// This component renders a poll directory page

import "./Directory.css";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { AuthService } from "../../utils/auth";
import { userPollProps } from "../../utils/interfaces";
import { QUERY_ALL_POLLS, QUERY_GENRES } from "../../utils/queries";
import { PollListing, Select } from "../../components";

export function Directory() {
  const navigate = useNavigate();
  const Auth = new AuthService();
  const { votes } = Auth.getProfile();
  const { genre } = useParams();

  // get the relevant polls
  const getPolls = useQuery(QUERY_ALL_POLLS, {
    variables: { username: "", genre },
  });
  // get all genres
  const getGenres = useQuery(QUERY_GENRES, {
    variables: { username: "", genre },
  });

  const list = getPolls.data?.getPolls.polls || [];
  console.log(list);

  // generate list of sorted genre objects
  const genres: string[] = getGenres.loading
    ? ["loading"]
    : getGenres.data.getGenres.titles;
  const sortedGenres = ["all", ...genres.slice(1).sort()];
  const genreObjs = sortedGenres.map((genre) => {
    return {
      value: genre,
      title: genre.charAt(0).toUpperCase() + genre.slice(1),
    };
  });

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    navigate(`/polls/${value}`);
  };

  return (
    <section id="directory">
      {getGenres.loading ? (
        ""
      ) : (
        <Select
          id="genreSelect"
          options={genreObjs}
          val={genre}
          setValue={handleSelect}
        />
      )}
      <ul>
        {list
          ? list.map((poll: userPollProps, index: number) => {
              return (
                <PollListing
                  key={index}
                  poll={poll}
                  vote={votes[poll.poll_id] ? votes[poll.poll_id] : undefined}
                />
              );
            })
          : ""}
      </ul>
    </section>
  );
}
