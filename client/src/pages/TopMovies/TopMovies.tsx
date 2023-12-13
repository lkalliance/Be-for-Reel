import "./TopMovies.css";
import { Table } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { QUERY_MOVIES } from "../../utils/queries";
import { movieListProps } from "../../utils/interfaces";

export function TopMovies() {
  const { loading, data } = useQuery(QUERY_MOVIES, {
    variables: { number: 10 },
  });
  const movieData = loading ? null : data.getMovies.movies;
  return (
    <section id="top-movies">
      <h1>Top-voted Films</h1>
      {loading ? (
        "loading"
      ) : (
        <Table>
          <tbody>
            {movieData.map((movie: movieListProps, index: number) => {
              return movie.votes > 0 ? (
                <tr key={index} className="list-member-12">
                  <td className="rank">
                    {index === 0 || movie.votes !== movieData[index - 1].votes
                      ? `${index + 1}.`
                      : ""}
                  </td>
                  <td className="title">
                    {`${movie.title} (${movie.year})`}{" "}
                    <span className="sub-info">{`${movie.votes} ${
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
              ) : (
                ""
              );
            })}
          </tbody>
        </Table>
      )}
    </section>
  );
}
