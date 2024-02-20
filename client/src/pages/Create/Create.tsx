// This component renders the Create a Poll page

import "./Create.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { cloneDeep } from "@apollo/client/utilities";
import { AuthService } from "../../utils/auth";
import { movieProps, searchOptions } from "../../utils/interfaces";
import { ADD_POLL } from "../../utils/mutations";
import { QUERY_ALL_POLLS, QUERY_SINGLE_USER } from "../../utils/queries";
import { convertLengthVals, pollLimit } from "../../utils/typeUtils";
import { MovieSearch, AboutPoll } from "../../pageComponents";
import { SearchResult } from "../../components";

interface genreObj {
  [key: string]: number;
}

interface pollOptions {
  [key: string]: string;
  title: string;
  description: string;
  userGenre: string;
}

export function Create() {
  const auth = new AuthService();

  // used to reset options values
  const blankOptions = {
    decade: "0",
    // years: false,
    // years: {
    //   min: 1910,
    //   max: thisYear(),
    // },
    length: {
      min: 1,
      max: 8,
    },
    gross: {
      min: 1,
      max: 7,
    },
    G: false,
    PG: false,
    PG13: false,
    R: false,
    oscar: false,
    oscarWin: false,
    genre: "all",
  };

  const navigate = useNavigate();
  const maxTries = 3; // maximum number of times we'll query IMDb for one search

  const [searchField, setSearchField] = useState(""); // tracks text in movie title search field
  const [options, setOptions] = useState(blankOptions as searchOptions); // tracks title search options
  const [results, setResults] = useState<movieProps[]>([]); // tracks results from most recent search
  const [selected, setSelected] = useState<movieProps[]>([]); // tracks movies selected for poll
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // tracks IMDb ids of selected movies
  const [pollData, setPollData] = useState<pollOptions>({
    title: "",
    description: "",
    userGenre: "all",
  }); // tracks text in poll title and description fields
  const [noResults, setNoResults] = useState<boolean>(false); // flag for this kind of error message
  const [sourceDown, setSourceDown] = useState<boolean>(false); // flag for this kind of error message
  const [errorMessage, setErrorMessage] = useState<string>(""); // tracks error message for poll submission
  const [searchError, setSearchError] = useState<string>(""); // tracks error message for search results
  const [searching, setSearching] = useState<boolean>(false); // tracks message that search is in progress
  const [searchingAI, setSearchingAI] = useState<boolean>(false); // tracks message that AI search is in progress
  const [profError, setProfError] = useState<boolean>(false); // profanity alert
  const [building, setBuilding] = useState<boolean>(false); // tracks message that poll is being built
  const [genreTracker, setGenreTracker] = useState<genreObj>({}); // tracks available genre submissions

  const { lookupName, activePolls, email, confirmed } = auth.getProfile();
  const [addPoll] = useMutation(ADD_POLL, {
    refetchQueries: () => [
      {
        query: QUERY_ALL_POLLS,
        variables: { username: "" },
      },
      {
        query: QUERY_SINGLE_USER,
        variables: { lookupname: lookupName },
      },
    ],
  });

  const handleCreate = async () => {
    // handler for submission of quiz to be created

    // poll title must exist and at least two films selected
    if (!(pollData.title.length > 0 && selected.length > 1)) return;

    const profaneTitle = await axios.get(
      `https://www.purgomalum.com/service/containsprofanity?text=${pollData.title}`
    );
    const profaneDesc = await axios.get(
      `https://www.purgomalum.com/service/containsprofanity?text=${pollData.description}`
    );

    if (profaneTitle.data || profaneDesc.data) {
      setProfError(true);
      setPollData({ ...pollData, title: "", description: "" });
      return;
    }

    // display the alert that poll is being built
    setBuilding(true);

    try {
      const { data } = await addPoll({
        variables: {
          title: pollData.title,
          description: pollData.description,
          movieIds: selectedIds,
          userGenre: pollData.userGenre,
        },
      });

      // after creating, update user with newly created poll
      auth.login(data.addPoll.token.token);
      // once poll is created, navigate the browser to it
      navigate(data.addPoll.redirect);
    } catch (err: any) {
      if (err.message.indexOf("urlTitle") > -1) {
        setBuilding(false);
        setErrorMessage(
          `You already have a quiz with the title "${pollData.title}"`
        );
      }
    }
  };

  const getFilms = async (url: string) => {
    const movieData = await fetch(url);
    const result = await movieData.json();
    return result;
  };

  const genreValid = () => {
    // checks to make sure the current user-selected genre still good

    return !(
      selected.length === 0 ||
      genreTracker[pollData.userGenre] / selected.length < 0.5
    );
  };

  const handleSearchSubmit = async () => {
    // handler for movie title search submission

    // erase existing results and show that we're searching
    setResults([]);
    setSearching(true);
    setNoResults(false);
    setSourceDown(false);

    // set up items to use in constructing the URL
    const { decade, G, PG, PG13, R, oscar, oscarWin, length, genre } = options;
    const mathDecade = parseInt(decade);
    let searchUrl = `/api/movies/search/${
      searchField.length > 0 ? searchField : "noTitle"
    }`;
    let paramParts = [];

    if (mathDecade > 0) {
      const from = 1920 + (mathDecade - 1) * 10;
      const to = from + 9;
      // a decade has been selected, add those parameters
      paramParts.push(`from=${from}`);
      paramParts.push(`to=${to}`);
    }

    // if (years.min > 1910 || years.max < thisYear()) {
    //   // if there are years to search, add the parameters for from and to
    //   paramParts.push(`from=${years.min}`);
    //   paramParts.push(`to=${years.max}`);
    // }

    if (G || PG || PG13 || R) {
      // if there are limits on ratings, add those parameters
      const ratings = [];
      if (G) ratings.push("us:G");
      if (PG) ratings.push("us:PG");
      if (PG13) ratings.push("us:PG-13");
      if (R) ratings.push("us:R");
      paramParts.push(`certificates=${ratings.join(",")}`);
    }

    // if Best Pic Winner is checked, add that parameter
    if (oscar && oscarWin)
      paramParts.push("groups=oscar_best_picture_nominees,oscar_winners");
    else if (oscar) paramParts.push("groups=oscar_best_picture_nominees");
    else if (oscarWin) paramParts.push("groups=oscar_winners");

    if (length.min > 0 || length.max < 8) {
      // if there is a time range, add that parameter
      paramParts.push(
        `runtime=${
          length.min === 0 ? "" : convertLengthVals(length.min).minutes
        },${length.max === 8 ? "" : convertLengthVals(length.max).minutes}`
      );
    }
    if (genre !== "all") {
      // if a genre has been chosen, add that parameter
      paramParts.push(`genres=${genre}`);
    }

    // create the search URL from the base plus the parameters
    searchUrl += paramParts.length > 0 ? `?${paramParts.join("&")}` : "";

    let result: movieProps[] = [],
      tries = 0;
    while (tries < maxTries && result.length === 0) {
      try {
        const searchResults = await getFilms(searchUrl);
        if (searchResults.message) {
          // there was an error instead of a return
          setSearching(false);
          setSourceDown(true);
          setNoResults(false);
          setSearchError(searchResults.message);
          tries = maxTries;
          break;
        }
        result = searchResults;
        tries++;
      } catch (err) {
        console.log(err);
        break;
      }
    }

    // if there was no response from API, abandon
    if (sourceDown) return;
    if (result.length === 0 && !sourceDown) {
      // if there were no results, set the error
      setNoResults(true);
      setNoResults(true);
      setSearching(false);
      return;
    }

    // sort results by number of IMDb rating votes
    result.sort((a: movieProps, b: movieProps) => {
      return Number(b.imDbRatingVotes) - Number(a.imDbRatingVotes);
    });

    // put the results to the screen and reset everything else
    setResults(result);
    setSearching(false);
    setSourceDown(false);
    setNoResults(false);

    // setSearchField("");
    // setOptions(blankOptions);
  };

  const handleOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handler to track single-value changes to search options
    const { id, value } = e.target;

    // if it's a checkbox, set the new value as the opposite of before
    const newValue =
      id === "decade" ? value : !options[id as keyof searchOptions];
    const newOptions = { ...options, [id]: newValue };

    setOptions(newOptions);
  };

  const handleDualOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Special hander to track changes to search options for double-sliders
    const { id, value } = e.target;

    // id will be created from option identifier and min/max designation
    const pieces = id.split("-");
    const optionPiece = options[pieces[0]];
    if (typeof optionPiece === "object") {
      const newOptionPiece = { ...optionPiece, [pieces[1]]: +value };
      const newOptions = { ...options, [pieces[0]]: newOptionPiece };
      setOptions(newOptions);
    }
  };

  const handleSelectOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Handler to track select menu changes to search options
    const { id, value } = e.target;
    const newOptions = { ...options, [id]: value };
    setOptions(newOptions);
  };

  const handlePollData = (
    // Handler for managing changes to poll title and description
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    // clear any error message
    setErrorMessage("");
    setProfError(false);
    // update the poll data
    setPollData({
      ...pollData,
      [id]: value,
    });
  };

  const handleReturn = (e: React.KeyboardEvent<HTMLElement>) => {
    // Handler to assign a keyboard enter to the title search button
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const selectResult = (e: React.MouseEvent<HTMLElement>) => {
    // Handler to move a clicked search result to saved, or vice versa

    // determine origin and destination, remove clicked from origin and put in destination
    const type = e.currentTarget.dataset.type;
    // if this is an attempt to add a 13th film, forget it.
    if (type === "search" && selected.length >= 12) return;

    const genres = e.currentTarget.dataset.genres;
    const originList = type === "search" ? [...results] : [...selected];
    const clicked = originList.splice(Number(e.currentTarget.dataset.index), 1);
    const destinationList =
      type === "search" ? [...selected, ...clicked] : [...results, ...clicked];

    // set states based on which list was the origin
    if (type === "search") {
      setResults(originList);
      setSelected(destinationList);
    } else {
      setResults(destinationList);
      setSelected(originList);
    }

    // add or remove IMDb id to or from list of selected films
    if (type === "search")
      setSelectedIds([...selectedIds, String(clicked[0].id)]);
    else {
      const whichOne = selectedIds.indexOf(clicked[0].id);
      let newList = [...selectedIds];
      newList.splice(whichOne, 1);
      setSelectedIds(newList);
    }

    // adjust genreTracker
    const genreList = genres?.split(", ");
    let genreTemp = cloneDeep(genreTracker);
    const incrementer = type === "search" ? 1 : -1;
    genreList?.forEach((genre) => {
      if (!genreTemp[genre]) genreTemp[genre] = type === "search" ? 1 : 0;
      else genreTemp[genre] += incrementer;
    });
    setGenreTracker(genreTemp);

    // check if user genre selection needs to be nulled
    if (!genreValid()) setPollData({ ...pollData, userGenre: "all" });
  };

  return (
    <section id="create">
      {!confirmed ? (
        <div className="container">
          <h1>Create a Poll</h1>
          <p className="list-member-12">
            Your account's email address has not been confirmed. Check your
            email at {email}, and look for an email with a confirmation link.
          </p>
        </div>
      ) : activePolls.length < pollLimit("standard") ? (
        <div className="container">
          <h1>Create a Poll</h1>
          <div className="row">
            <div id="titleSearch" className="col-12 col-sm-6">
              <h3>Search for films</h3>

              <div className="create-container">
                <MovieSearch
                  searchField={searchField}
                  setSearchField={setSearchField}
                  options={options}
                  setResults={setResults}
                  setSearchError={setSearchError}
                  setNoResults={setNoResults}
                  setSourceDown={setSourceDown}
                  searching={searchingAI}
                  setSearching={setSearchingAI}
                  handleOption={handleOption}
                  handleDualOption={handleDualOption}
                  handleSelectOption={handleSelectOption}
                  handleReturn={handleReturn}
                  handleSearchSubmit={handleSearchSubmit}
                />
              </div>

              <div id="results">
                <h5 className="center">
                  Search Results<span>(click or tap to add to your poll)</span>
                </h5>

                {searching && (
                  <div className="alert alert-primary">
                    Searching for titles...
                  </div>
                )}
                {searchingAI && (
                  <div className="alert alert-primary">
                    Asking ChatGPT for its opinion...
                  </div>
                )}
                {noResults && !sourceDown && (
                  <div className="alert alert-danger">No search results</div>
                )}
                {searchError.length > 0 && !sourceDown && (
                  <div className="alert alert-danger">
                    Something went wrong with the search. Please try again.
                  </div>
                )}
                {sourceDown && (
                  <div className="alert alert-danger">{searchError}</div>
                )}
                <ul>
                  {results.map((result, index) => {
                    if (selectedIds.indexOf(result.id) >= 0) return "";
                    return (
                      <SearchResult
                        value={result}
                        key={index}
                        dataIndex={index}
                        type="search"
                        onClick={selectResult}
                      />
                    );
                  })}
                </ul>
              </div>
            </div>
            <div id="about" className="col-12 col-sm-6">
              <h3>About your poll</h3>
              <div className="create-container">
                <AboutPoll
                  pollData={pollData}
                  handlePollData={handlePollData}
                  genreObj={genreTracker}
                  totalSelect={selected.length}
                />
                <button
                  onClick={handleCreate}
                  className="btn btn-primary"
                  disabled={!(pollData.title.length > 0 && selected.length > 1)}
                >
                  Create poll
                </button>
              </div>
              {errorMessage.length > 0 ? (
                <div className="alert alert-danger">{errorMessage}</div>
              ) : profError ? (
                <div className="alert alert-danger">
                  Please no profanity in poll titles or descriptions.
                </div>
              ) : (
                ""
              )}
              {building ? (
                <div className="alert alert-primary">Building your poll...</div>
              ) : (
                ""
              )}
              <h5 className="center">
                Selected Films
                <span>(click or tap to remove from your poll)</span>
              </h5>
              {selected.length >= 12 ? (
                <div className="alert alert-primary">
                  Maximum poll options reached.
                </div>
              ) : (
                ""
              )}
              <ul id="selected">
                {selected.map((selected, index) => {
                  return (
                    <SearchResult
                      value={selected}
                      key={index}
                      dataIndex={index}
                      type="selected"
                      onClick={selectResult}
                    />
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          <h1>Create a Poll</h1>
          <p className="list-member-12">
            You have reached your creation limit for the most recent month. You
            will need to wait for one of your polls to expire before you can
            create a new one.
          </p>
        </div>
      )}
    </section>
  );
}
