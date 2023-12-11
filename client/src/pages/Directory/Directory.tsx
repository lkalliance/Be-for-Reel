// This component renders a poll directory page

import "./Directory.css";
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
  // divide list into expired and not-expired
  const notExpiredPolls: userPollProps[] = [];
  const expiredPolls: userPollProps[] = [];

  list.map((poll: userPollProps) => {
    const expired = new Date(poll.expires_on) < new Date();
    if (!expired) notExpiredPolls.push(poll);
    else expiredPolls.push(poll);
  });

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
    <section id="directory" className="container">
      <div className="row">
        <div className="col col-12">
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
        </div>
        <div className="poll-type">
          <h3 className="col col-12 center">Active polls</h3>
        </div>
        {notExpiredPolls.length > 0
          ? notExpiredPolls.map((poll: userPollProps, index: number) => {
              return (
                <PollListing
                  key={index}
                  poll={poll}
                  vote={votes[poll.poll_id] ? votes[poll.poll_id] : undefined}
                />
              );
            })
          : ""}
        <div className="poll-type">
          <h3 className="col col-12 center">Expired polls</h3>
        </div>
        {expiredPolls.length > 0
          ? expiredPolls.map((poll: userPollProps, index: number) => {
              return (
                <PollListing
                  key={index}
                  poll={poll}
                  vote={votes[poll.poll_id] ? votes[poll.poll_id] : undefined}
                />
              );
            })
          : ""}
      </div>
    </section>
  );
}
