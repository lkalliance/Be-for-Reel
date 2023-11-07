// This component renders the movie search form

import "./MovieSearch.css";
import { Dispatch, SetStateAction } from "react";
import { searchOptions, dualOptions } from "../../utils/interfaces";
import { convertLengthVals, convertGrossVals } from "../../utils/typeUtils";
import {
  InputText,
  Checkbox,
  Slider,
  DoubleSlider,
  MultiSlider,
} from "../../components";

interface movieSearchProps {
  searchField: string;
  setSearchField: Dispatch<SetStateAction<string>>;
  noResults: boolean;
  setNoResults: Dispatch<SetStateAction<boolean>>;
  options: searchOptions;
  handleReturn: (e: React.KeyboardEvent<HTMLElement>) => void;
  handleOption: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDualOption: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: () => void;
}

export function MovieSearch({
  searchField,
  setSearchField,
  setNoResults,
  options,
  handleReturn,
  handleOption,
  handleDualOption,
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

  const handleDualOptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoResults(false);
    if (handleDualOption) handleDualOption(e);
    else return;
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
        {/* <MultiSlider
          min={0}
          max={1000}
          step={100}
          prefix="$"
          suffix=" M"
          onChange={({ min, max }: { max: number; min: number }) => {
            console.log(`min = ${min}, max = ${max}`);
          }}
        /> */}
        <DoubleSlider
          id="length"
          min={0}
          max={9}
          step={1}
          label={`Length: ${
            options.length.min === 0 && options.length.max === 9
              ? "any"
              : options.length.min === 0
              ? `${convertLengthVals(options.length.max).label} or shorter`
              : options.length.max === 9
              ? `${convertLengthVals(options.length.min).label} or longer`
              : `between ${convertLengthVals(options.length.min).label} and ${
                  convertLengthVals(options.length.max).label
                }`
          }`}
          setValue={handleDualOptChange}
        />
        <DoubleSlider
          id="gross"
          min={0}
          max={7}
          step={1}
          label={`Worldwide gross: ${
            options.gross.min === 0 && options.gross.max === 7
              ? "any"
              : options.gross.min === 0
              ? `${convertGrossVals(options.gross.max).label} or less`
              : options.gross.max === 7
              ? `${convertGrossVals(options.gross.min).label} or more`
              : `between ${convertGrossVals(options.gross.min).label} and ${
                  convertGrossVals(options.gross.max).label
                }`
          }`}
          setValue={handleDualOptChange}
        />
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
