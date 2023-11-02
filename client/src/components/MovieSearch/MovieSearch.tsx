// This component renders the movie search form

import "./MovieSearch.css";
import { Dispatch, SetStateAction } from "react";
import { searchOptions } from "../../utils/interfaces";

interface movieSearchProps {
  searchField: string;
  setSearchField: Dispatch<SetStateAction<string>>;
  noResults: boolean;
  setNoResults: Dispatch<SetStateAction<boolean>>;
  options: searchOptions;
  handleReturn: (e: React.KeyboardEvent<HTMLElement>) => void;
  handleOption: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: () => void;
}

export function MovieSearch({
  searchField,
  setSearchField,
  setNoResults,
  options,
  handleReturn,
  handleOption,
  handleSearchSubmit,
}: movieSearchProps) {
  return (
    <>
      <fieldset>
        <input
          id="titleSearchBox"
          type="text"
          placeholder="Title"
          onKeyUp={handleReturn}
          value={searchField}
          onChange={(e) => {
            setNoResults(false);
            setSearchField(e.target.value);
          }}
        />
      </fieldset>
      <h3>Search options</h3>
      <form>
        <fieldset id="released">
          <legend>
            Release decade:{" "}
            {options.decade === "0"
              ? "all"
              : `${1910 + 10 * parseInt(options.decade)}'s`}
          </legend>
          <input
            type="range"
            className="form-range"
            min="0"
            max="11"
            id="decade"
            value={parseInt(options.decade)}
            onChange={handleOption}
          ></input>
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
      <button onClick={handleSearchSubmit}>Search for title</button>
    </>
  );
}
