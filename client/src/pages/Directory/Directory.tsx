// This component renders a poll directory page

import "./Directory.css";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { AuthService } from "../../utils/auth";
import { userPollProps, genreProps } from "../../utils/interfaces";
import { QUERY_ALL_POLLS, QUERY_GENRES } from "../../utils/queries";
import { PollListing } from "../../components";

export function Directory() {
  const navigate = useNavigate();
  const Auth = new AuthService();
  const { votes } = Auth.getProfile();

  const { genre } = useParams();
  const { loading, data } = useQuery(QUERY_ALL_POLLS, {
    variables: { username: "", genre },
  });

  const list = data?.getPolls.polls || false;
  const genres: string[] = loading ? ["loading"] : data.getPolls.genres;
  const sortedGenres = ["all", ...genres.slice(1).sort()];

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    navigate(`/polls/${value}`);
  };

  return (
    <section id="directory">
      <select
        className="titleSelect form-select"
        value={genre}
        onChange={handleSelect}
      >
        {sortedGenres.map((thisGenre: string, index: number) => {
          return (
            <option value={thisGenre} key={index}>
              {thisGenre.charAt(0).toUpperCase() + thisGenre.slice(1)}
            </option>
          );
        })}
      </select>
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
