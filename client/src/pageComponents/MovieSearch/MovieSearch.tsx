// This component renders the movie search form

import "./MovieSearch.css";
import { Dispatch, SetStateAction } from "react";
import { searchOptions } from "../../utils/interfaces";
import { InputText, Checkbox } from "../../components";

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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // on any input, clear the warning that there are no results
    setNoResults(false);
    setSearchField(e.target.value);
  };

  const handleOptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // on any input, clear the warning that there are no results
    setNoResults(false);
    handleOption(e);
  };

  return (
    <>
      <fieldset>
        <InputText
          type="text"
          id="titleSearchBox"
          placeholder="Title"
          capitalize="off"
          val={searchField}
          setValue={handleSearchChange}
          keyUp={handleReturn}
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
            <Checkbox
              id="G"
              setValue={handleOptChange}
              val={Boolean(options.G)}
            />
            <label htmlFor="G">G</label>
          </div>
          <div>
            <Checkbox
              id="PG"
              setValue={handleOptChange}
              val={Boolean(options.PG)}
            />
            <label htmlFor="PG">PG</label>
          </div>
          <div>
            <Checkbox
              id="PG13"
              setValue={handleOptChange}
              val={Boolean(options.PG13)}
            />
            <label htmlFor="PG13">PG-13</label>
          </div>
          <div>
            <Checkbox
              id="R"
              setValue={handleOptChange}
              val={Boolean(options.R)}
            />
            <label htmlFor="R">R</label>
          </div>
        </fieldset>
        <fieldset>
          <div>
            <Checkbox
              id="oscar"
              setValue={handleOptChange}
              val={Boolean(options.oscar)}
            />
            <label htmlFor="oscar">Nominated for Best Picture</label>
          </div>
        </fieldset>
      </form>
      <button onClick={handleSearchSubmit}>Search for title</button>
    </>
  );
}
