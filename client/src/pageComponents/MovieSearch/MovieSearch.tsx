// This component renders the movie search form

import "./MovieSearch.css";
import { Dispatch, SetStateAction } from "react";
import { searchOptions } from "../../utils/interfaces";
import { InputText, Checkbox, Slider, DoubleSlider } from "../../components";

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
          <Slider
            id="decade"
            val={parseInt(options.decade)}
            setValue={handleOptChange}
            min={0}
            max={11}
            label={`Release decade: 
            ${
              options.decade === "0"
                ? "all"
                : `${1910 + 10 * parseInt(options.decade)}'s`
            }`}
          />
        </fieldset>
        <fieldset>
          <legend>Limit to just these US ratings</legend>
          <div>
            <Checkbox
              id="G"
              label="G"
              setValue={handleOptChange}
              val={Boolean(options.G)}
            />
          </div>
          <div>
            <Checkbox
              id="PG"
              label="PG"
              setValue={handleOptChange}
              val={Boolean(options.PG)}
            />
          </div>
          <div>
            <Checkbox
              id="PG13"
              label="PG-13"
              setValue={handleOptChange}
              val={Boolean(options.PG13)}
            />
          </div>
          <div>
            <Checkbox
              id="R"
              label="R"
              setValue={handleOptChange}
              val={Boolean(options.R)}
            />
          </div>
        </fieldset>
        <fieldset>
          <div>
            <Checkbox
              id="oscar"
              label="Nominated for Best Picture"
              setValue={handleOptChange}
              val={Boolean(options.oscar)}
            />
          </div>
        </fieldset>
      </form>
      <button onClick={handleSearchSubmit}>Search for title</button>
    </>
  );
}
