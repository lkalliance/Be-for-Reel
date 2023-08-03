// This component renders the Create a Poll page

import "./Create.css";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import auth from "../../utils/auth";
import { SearchResult } from "../../components/SearchResult";
import { movieProps, userData } from "../../utils/interfaces";
import { ADD_POLL } from "../../utils/mutations";

interface searchOptions {
  from: string;
  to: string;
  years: boolean;
  G: boolean;
  PG: boolean;
  PG13: boolean;
  R: boolean;
  oscar: boolean;
}

interface pollOptions {
  title: string;
  description: string;
}

export function Create() {
  // used to reset options values
  const blankOptions = {
    from: "",
    to: "",
    years: false,
    G: false,
    PG: false,
    PG13: false,
    R: false,
    oscar: false,
  };

  const userInfo: userData = auth.getProfile();

  const [searchField, setSearchField] = useState("");
  const [options, setOptions] = useState(blankOptions as searchOptions);
  const [results, setResults] = useState<movieProps[]>([]);
  const [selected, setSelected] = useState<movieProps[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pollData, setPollData] = useState<pollOptions>({
    title: "",
    description: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [building, setBuilding] = useState<boolean>(false);

  /* WHERE I LEFT OFF: Create error message for duplicate title use,
using state variable errorMessage, and set a building status using
state variable building */

  const [addPoll] = useMutation(ADD_POLL);

  const handleCreate = async () => {
    // handler for submission of quiz to be created

    // poll title must exist and at least two films selected
    if (!(pollData.title.length > 0 && selected.length > 1)) return;
    try {
      const { data } = await addPoll({
        variables: {
          userName: userInfo.username,
          userId: userInfo.id,
          title: pollData.title,
          description: pollData.description,
          movieIds: selectedIds,
        },
      });
    } catch (err: any) {
      if (err.message.indexOf("urlTitle") > -1) {
        setErrorMessage(
          `You already have a quiz with the title "${pollData.title}"`
        );
      }
    }
  };

  const handleSubmit = async () => {
    // handler for movie title search submission

    if (searchField === "") return;

    // erase existing results and show that we're searching
    setResults([]);
    setSearching(true);

    // set up items to use in constructing the URL
    const { to, from, years, G, PG, PG13, R, oscar } = options;
    let searchUrl = `/api/search/${searchField}`;
    let paramParts = [];

    if (years) {
      // if there are years to search, add the parameters for from and to
      if (Number(from) > 0) paramParts.push(`from=${from}`);
      if (Number(to) > 0) paramParts.push(`to=${to}`);
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

    // create the search URL from the base plus the parameters
    searchUrl += paramParts.length > 0 ? `?${paramParts.join("&")}` : "";

    const movieData = await fetch(searchUrl);
    const result = await movieData.json();

    // sort results by number of IMDb rating votes
    result.sort((a: movieProps, b: movieProps) => {
      return Number(b.imDbRatingVotes) - Number(a.imDbRatingVotes);
    });

    // put the results to the screen and reset everything else
    setResults(result);
    setSearching(false);
    setSearchField("");
    setOptions(blankOptions);
  };

  const handleOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handler to track changes to search options
    const { id, value } = e.target;
    const today = new Date();
    const thisYear = Number(today.getFullYear());
    let changeYear = id === "from" || id === "to";

    // if it's a year field, set the new value as the text in the field
    // if it's a checkbox, set the new value as the opposite of before
    const newValue = changeYear ? value : !options[id as keyof searchOptions];
    const newOptions = { ...options, [id]: newValue };

    // make sure year range isn't before 1927 or after current
    newOptions.years =
      !(newOptions.from === "" && newOptions.to === "") &&
      (newOptions.from === "" ||
        (Number(newOptions.from) >= 1927 &&
          Number(newOptions.from) <= thisYear)) &&
      (newOptions.to === "" ||
        (Number(newOptions.to) >= 1927 && Number(newOptions.to) <= thisYear));

    setOptions(newOptions);
  };

  const handleReturn = (e: React.KeyboardEvent<HTMLElement>) => {
    // Handler to assign a keyboard enter to the title search button
    if (e.key === "Enter") {
      console.log(searchField);
      console.log(options);
      console.log(pollData);
      handleSubmit();
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
    <section id="create" className="container">
      <h2>Create a Poll</h2>
      <div className="row">
        <div id="selected" className="col-6">
          <form>
            <fieldset>
              <input
                type="text"
                id="title"
                placeholder="Poll title"
                value={pollData.title}
                onChange={(e) => {
                  setErrorMessage("");
                  setPollData({
                    title: e.target.value,
                    description: pollData.description,
                  });
                }}
              />
              <textarea
                id="description"
                placeholder="Poll description"
                value={pollData.description}
                onChange={(e) => {
                  setPollData({
                    title: pollData.title,
                    description: e.target.value,
                  });
                }}
              ></textarea>
            </fieldset>
          </form>
          <button
            onClick={handleCreate}
            disabled={!(pollData.title.length > 0 && selected.length > 1)}
          >
            Create poll
          </button>
          {errorMessage.length > 0 ? (
            <div className="alert alert-danger">{errorMessage}</div>
          ) : (
            ""
          )}
          <h3>Selected Films</h3>
          <ul>
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
        <div id="titleSearch" className="col-6">
          <h2>Search for a title</h2>
          <input
            id="titleSearchBox"
            type="text"
            onKeyUp={handleReturn}
            value={searchField}
            onChange={(e) => {
              setSearchField(e.target.value);
            }}
          />
          <h3>Search options</h3>
          <form>
            <fieldset>
              <legend>Released</legend>
              <input
                type="text"
                id="from"
                placeholder="From"
                onChange={handleOption}
                value={String(options.from)}
              />
              <input
                type="text"
                id="to"
                placeholder="To"
                onChange={handleOption}
                value={String(options.to)}
              />
            </fieldset>
            <fieldset>
              <legend>Limit to just these US ratings</legend>
              <div>
                <input
                  type="checkbox"
                  id="G"
                  name="G"
                  onChange={handleOption}
                  checked={Boolean(options.G)}
                />
                <label htmlFor="G">G</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="PG"
                  name="PG"
                  onChange={handleOption}
                  checked={Boolean(options.PG)}
                />
                <label htmlFor="PG">PG</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="PG13"
                  name="PG13"
                  onChange={handleOption}
                  checked={Boolean(options.PG13)}
                />
                <label htmlFor="PG13">PG-13</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="R"
                  name="R"
                  onChange={handleOption}
                  checked={Boolean(options.R)}
                />
                <label htmlFor="R">R</label>
              </div>
            </fieldset>
            <fieldset>
              <div>
                <input
                  type="checkbox"
                  id="oscar"
                  name="oscar"
                  onChange={handleOption}
                  checked={Boolean(options.oscar)}
                />
                <label htmlFor="oscar">Nominated for Best Picture</label>
              </div>
            </fieldset>
          </form>
          <button onClick={handleSubmit}>Search for title</button>

          <div id="results">
            <h3>Search Results</h3>
            <ul>
              {searching ? (
                <li>Searching...</li>
              ) : results.length === 0 ? (
                <li>No search results</li>
              ) : (
                ""
              )}
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
      </div>
    </section>
  );
}
