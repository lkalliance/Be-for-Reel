// This component renders a poll directory page

import "./Directory.css";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { AuthService } from "../../utils/auth";
import { pollProps } from "../../utils/interfaces";
import { QUERY_ALL_POLLS, QUERY_GENRES } from "../../utils/queries";
import { PollListing, Select } from "../../components";

export function Directory() {
  const navigate = useNavigate();
  const Auth = new AuthService();
  const { votes } = Auth.getProfile();
  const { genre } = useParams();

  const lookupGenre = genre || "all";

  // get the relevant polls and genre list
  const getPolls = useQuery(QUERY_ALL_POLLS, {
    variables: { genre: lookupGenre },
  });
  const getGenres = useQuery(QUERY_GENRES);

  // get all genres
  const list = getPolls.data?.getPolls.polls || [];

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

  return (
    <section id="directory">
      <div id="filters" className="col col-12">
        {getGenres.loading ? (
          <div className="doesnt-exist list-member-20">Loading...</div>
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
        {list.length > 0 &&
          list.map((poll: pollProps, index: number) => {
            return (
              <PollListing
                key={index}
                directory={{
                  poll: poll,
                  vote: votes[poll._id] || "",
                }}
              />
            );
          })}
      </ul>
    </section>
  );
}
