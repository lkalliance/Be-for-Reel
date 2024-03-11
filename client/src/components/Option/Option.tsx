// This component renders a voting option

/* REQUIRED PROPS:
opt: an object with all properties of this option (movie info, id, number of votes...)
winner: boolean flag, is this the poll's winning option?
voted: a string (or undefined) indicating if the user voted on this poll
votes: a number (or undefined) indicating the number of votes on this option
expired: a boolean flag, has this poll expired?
loggedIn: a boolean indicating if the user is logged in
selected: an object with all the information needed for a vote on this option:
  -- userName: the username of the current user
  -- movie: the movie represented by this option
  -- poll_id: the _id of the current poll
  -- option_id: the _id of this option
  -- imdb_id: this option's movie's IMDb id
  -- comment: the value of any added comment by the user
select: a callback setting the poll's state indicating the selected option
comment: a string containing the current comment
setComment: a callback setting the value of the comment text area
handleComment: a callback for changes to the comment field
handleVote: a callback for the casting of a vote for this option
editable: a boolean flag, is this poll editable? */

import "./Option.css";
import fresh from "./rtfresh.png";
import splat from "./rtsplat.png";
import imdb from "./imdb-icon-14.png";
import gross from "./gross.png";
import Accordion from "react-bootstrap/Accordion";
import { optionProps } from "../../utils/interfaces";
import { TextAreaField } from "../TextAreaField";

interface voteProps {
  userName: string;
  movie: string;
  poll_id: string;
  option_id: string;
  imdb_id: string;
  comment: string;
}

interface optProps {
  winner: boolean;
  opt: optionProps;
  voted: string | undefined;
  votes: number | undefined;
  expired: boolean | null;
  loggedIn: boolean;
  confirmed: boolean;
  selected: voteProps;
  select: (e: React.SetStateAction<voteProps>) => void;
  comment: string;
  setComment: (e: React.SetStateAction<string>) => void;
  handleVote: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleComment: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  editable: boolean | null;
}

export function Option({
  winner,
  opt,
  voted,
  votes,
  loggedIn,
  confirmed,
  expired,
  selected,
  select,
  comment,
  setComment,
  handleVote,
  handleComment,
}: optProps) {
  console.log(winner);
  const isSelected = selected.option_id === opt._id;
  const isFresh = parseInt(opt.ratings.rottenTomatoes) >= 60;

  const handleSelect = (e: React.MouseEvent<HTMLElement>) => {
    // handler for the selection of this option
    e.stopPropagation();

    const { className } = e.currentTarget as HTMLElement;
    const voteObj = {
      ...selected,
      movie: opt.movie,
      option_id: className.indexOf("sel") === -1 ? opt._id : "",
      imdb_id: opt.imdb_id,
    };
    select(voteObj);
    setComment("");
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleVote(e);
    select({
      ...selected,
      option_id: "",
    });
  };

  const grossPieces = opt.worldwide.split(",");
  let grossAbbrev = "";
  switch (grossPieces.length) {
    case 1: {
      grossAbbrev = "none";
      break;
    }
    case 3: {
      grossAbbrev = `${grossPieces[0]}M`;
      break;
    }
    case 4: {
      grossAbbrev = `${grossPieces[0]}${
        grossPieces[1][0] === "0" ? "" : `.${grossPieces[1][0]}`
      }B`;
      break;
    }
    default:
      grossAbbrev = opt.worldwide;
  }

  return (
    <li
      className={`container list-member-12 option${
        selected.option_id === opt._id ? " selected" : ""
      }${!loggedIn || voted ? " nohover" : ""} border-user${
        loggedIn && expired && winner ? " winner" : ""
      }`}
    >
      <div className="row container opt-container">
        <div className="title row col">
          <Accordion flush>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <div>
                  {opt.movie} <span className="year">({opt.year})</span>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <img src={opt.image} alt={opt.movie} className="poster" />
                <div>
                  <strong className="stars">{`${opt.stars}${
                    opt.runtime ? ` (${opt.runtime})` : ""
                  }`}</strong>
                  {`${opt.plot} Directed by ${opt.directors}`}
                  <div className="misc-info">
                    {opt.ratings.rottenTomatoes ? (
                      <span className="rt">
                        <img
                          src={`${isFresh ? fresh : splat}`}
                          alt={
                            isFresh
                              ? "Rotten Tomatoes: Fresh"
                              : "Rotten Tomatoes: Not Fresh"
                          }
                        />{" "}
                        {opt.ratings.rottenTomatoes}%
                      </span>
                    ) : (
                      <span></span>
                    )}
                    <span className="imdb">
                      <img
                        src={imdb}
                        alt={`imDb rating: ${opt.ratings.imDb}`}
                      />{" "}
                      {parseFloat(opt.ratings.imDb).toFixed(1)}
                    </span>
                    {opt.worldwide && !(grossAbbrev === "none") && (
                      <span className="gross">
                        <img
                          src={gross}
                          alt={`Worldwide gross: ${opt.worldwide}`}
                        />{" "}
                        {grossAbbrev}
                      </span>
                    )}
                  </div>

                  <div className="info-links">
                    <a
                      className="reverse"
                      href={`https://www.imdb.com/title/${opt.imdb_id}/`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      IMDb
                    </a>
                    <a
                      className="reverse"
                      href={opt.wikipedia}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Wikipedia
                    </a>
                    <a
                      className="reverse"
                      href={opt.trailer}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Trailer
                    </a>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          {loggedIn && confirmed && !voted && !expired && (
            <fieldset>
              <TextAreaField
                id="comment"
                placeholder="Add an optional comment here, and click to vote!"
                max={400}
                height={60}
                width={250}
                setValue={handleComment}
                val={comment}
                disabled={!(isSelected && loggedIn && !voted)}
              />
              <button
                disabled={!(isSelected && loggedIn && !voted)}
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                Vote!
              </button>
            </fieldset>
          )}
        </div>
        {loggedIn &&
          // user is logged in: show a select button or the vote total
          (voted || expired ? (
            // user has voted or the poll is expired: show the vote total for this option
            <div
              className={`tab user-data col${
                expired && winner ? " winner" : ""
              } bg-user-data`}
            >
              {votes}
            </div>
          ) : confirmed ? (
            // user has not voted: indicate to select
            <button
              className={`picker btn user-data hoverable col${
                selected.option_id === opt._id ? " sel" : ""
              }`}
              onClick={handleSelect}
            >
              {selected.option_id === opt._id ? "de" : ""}select
            </button>
          ) : null)}
      </div>
    </li>
  );
}
