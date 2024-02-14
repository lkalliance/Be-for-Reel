import "./TopMovies.css";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { listSection } from "../../utils";
import { QUERY_MOVIES } from "../../utils/queries";
import { movieListProps, movieProps } from "../../utils/interfaces";
import { Pagination } from "../../components";

export function TopMovies() {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 15;
  const { loading, data } = useQuery(QUERY_MOVIES);
  const movieData = loading ? [] : data.getMovies.movies;

  // add ranking to each film
  const list = movieData.map((movie: movieListProps, index: number) => {
    return { ...movie, rank: index + 1 };
  });
  // now adjust for ties
  list.forEach((movie: movieListProps, index: number) => {
    movie.rank =
      index === 0
        ? 1
        : movie.votes === list[index - 1].votes
        ? list[index - 1].rank
        : index + 1;
  });

  const showThis = listSection(list, currentPage, perPage);

  const handlePageSelect = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    const { id } = e.currentTarget;
    setCurrentPage(parseInt(id.split("-")[1]));
  };

  return (
    <section id="top-movies">
      <h1>Top-voted Films</h1>
      {loading ? (
        "loading"
      ) : (
        <Table>
          <tbody>
            {showThis.map((movie: movieListProps, index: number) => {
              return (
                <tr key={index} className="list-member-12">
                  <td className="rank">
                    {index > 0 && movie.rank === showThis[index - 1].rank
                      ? ""
                      : `${movie.rank}.`}
                  </td>
                  <td className="title">
                    {`${movie.title} (${movie.year})`}{" "}
                    <span className="user-data">{`${movie.votes} ${
                      movie.votes === 1 ? "vote" : "votes"
                    }`}</span>
                  </td>
                  <td className="imdb-link">
                    <a
                      href={`https://imdb.com/title/${movie.imdb_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="reverse"
                    >
                      IMDb
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      <Pagination
        navHandler={handlePageSelect}
        currentPage={currentPage}
        totalCount={movieData.length}
        pageSize={perPage}
        siblingCount={1}
      />
    </section>
  );
}
