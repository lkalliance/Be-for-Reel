// This component renders the Create a Poll page

import "./Create.css";
import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { AuthService } from "../../utils/auth";
import {
  movieProps,
  pollListProps,
  userData,
  searchOptions,
} from "../../utils/interfaces";
import { ADD_POLL } from "../../utils/mutations";
import { QUERY_ALL_POLLS, QUERY_SINGLE_USER } from "../../utils/queries";
import { convertLengthVals, thisYear } from "../../utils/typeUtils";
import { MovieSearch, AboutPoll } from "../../pageComponents";
import { SearchResult } from "../../components";

interface pollOptions {
  [key: string]: string;
  title: string;
  description: string;
}

interface createProps {
  updateList: Dispatch<SetStateAction<pollListProps>>;
  currentList: pollListProps;
}

export function Create({ updateList, currentList }: createProps) {
  const Auth = new AuthService();

  // used to reset options values
  const blankOptions = {
    decade: "0",
    // years: false,
    years: {
      min: 1910,
      max: thisYear(),
    },
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
  }); // tracks text in poll title and description fields
  const [errorMessage, setErrorMessage] = useState<string>(""); // tracks error message for poll submission
  const [searching, setSearching] = useState<boolean>(false); // tracks message that search is in progress
  const [noResults, setNoResults] = useState<boolean>(false); // tracks error message stating no search results
  const [building, setBuilding] = useState<boolean>(false); // tracks message that poll is being built

  const userInfo: userData = Auth.getProfile();

  const [addPoll] = useMutation(ADD_POLL, {
    refetchQueries: () => [
      {
        query: QUERY_ALL_POLLS,
        variables: { username: "" },
      },
      {
        query: QUERY_SINGLE_USER,
        variables: { lookupname: userInfo.lookupName },
      },
    ],
  });

  const handleCreate = async () => {
    // handler for submission of quiz to be created

    // poll title must exist and at least two films selected
    if (!(pollData.title.length > 0 && selected.length > 1)) return;

    // display the alert that poll is being built
    setBuilding(true);

    try {
      const { data } = await addPoll({
        variables: {
          title: pollData.title,
          description: pollData.description,
          movieIds: selectedIds,
        },
      });

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

  const handleSearchSubmit = async () => {
    // handler for movie title search submission

    // if (searchField === "") return;

    // erase existing results and show that we're searching
    setResults([]);
    setSearching(true);

    // set up items to use in constructing the URL
    const { decade, years, G, PG, PG13, R, oscar, length, genre } = options;
    const mathDecade = parseInt(decade);
    let searchUrl = `/api/search/${
      searchField.length > 0 ? searchField : "noTitle"
    }`;
    let paramParts = [];

    // if (mathDecade > 0) {
    //   // if there are years to search, add the parameters for from and to
    //   paramParts.push(`from=${1910 + 10 * mathDecade}`);
    //   paramParts.push(`to=${1919 + 10 * mathDecade}`);
    // }
    if (years.min > 1910 || years.max < thisYear()) {
      // if there are years to search, add the parameters for from and to
      paramParts.push(`from=${years.min}`);
      paramParts.push(`to=${years.max}`);
    }
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
    if (oscar) paramParts.push("groups=oscar_best_picture_nominees");
    if (length.min > 0 || length.max < 8) {
      // if there is a time range, add that parameter
      paramParts.push(
        `runtime=${
          length.min === 0 ? "" : convertLengthVals(length.min).minutes
        },${length.max === 8 ? "" : convertLengthVals(length.max).minutes}}`
      );
    }
    // if a genre has been chosen, add that parameter
    if (genre !== "all") {
      paramParts.push(`genres=${genre}`);
    }

    // create the search URL from the base plus the parameters
    searchUrl += paramParts.length > 0 ? `?${paramParts.join("&")}` : "";

    let result: movieProps[] = [],
      tries = 0;
    while (tries < maxTries && result.length === 0) {
      result = await getFilms(searchUrl);
      tries++;
    }

    // sort results by number of IMDb rating votes
    result.sort((a: movieProps, b: movieProps) => {
      return Number(b.imDbRatingVotes) - Number(a.imDbRatingVotes);
    });

    // put the results to the screen and reset everything else
    setResults(result);
    setSearching(false);
    setNoResults(result.length === 0);
    // setSearchField("");
    // setOptions(blankOptions);
  };

  const handleOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handler to track single-value changes to search options
    const { id, value } = e.target;

    // if it's a year field, set the new value as the text in the field
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
  ) => {
    // clear any error message
    setErrorMessage("");
    // update the poll data
    setPollData({ ...pollData, [e.target.id]: e.target.value });
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
  };

  return (
    <section id="create">
      <div className="container">
        <h1>Create a Poll</h1>
        <div className="row">
          <div id="titleSearch" className="col-12 col-sm-6">
            <h3>Search for a title</h3>

            <MovieSearch
              searchField={searchField}
              setSearchField={setSearchField}
              noResults={noResults}
              setNoResults={setNoResults}
              options={options}
              handleOption={handleOption}
              handleDualOption={handleDualOption}
              handleSelectOption={handleSelectOption}
              handleReturn={handleReturn}
              handleSearchSubmit={handleSearchSubmit}
            />

            <div id="results">
              <h5 className="center">Search Results</h5>
              {searching ? (
                <div className="alert alert-primary">
                  Searching for titles...
                </div>
              ) : (
                ""
              )}
              {noResults ? (
                <div className="alert alert-danger">No search results</div>
              ) : (
                ""
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
            <AboutPoll pollData={pollData} handlePollData={handlePollData} />
            <button
              onClick={handleCreate}
              className="btn btn-primary"
              disabled={!(pollData.title.length > 0 && selected.length > 1)}
            >
              Create poll
            </button>
            {errorMessage.length > 0 ? (
              <div className="alert alert-danger">{errorMessage}</div>
            ) : (
              ""
            )}
            {building ? (
              <div className="alert alert-primary">Building your poll...</div>
            ) : (
              ""
            )}
            <h5 className="center">Selected Films</h5>
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
    </section>
  );
}
