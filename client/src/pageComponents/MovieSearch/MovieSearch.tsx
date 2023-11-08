// This component renders the movie search form

import "./MovieSearch.css";
import { Dispatch, SetStateAction } from "react";
import { searchOptions } from "../../utils/interfaces";
import { convertLengthVals, convertGrossVals } from "../../utils/typeUtils";
import { InputText, Checkbox, Slider, DoubleSlider } from "../../components";

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
  console.log(options);
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

  // count all the options configured, to determine if search button is live
  const usedRatings =
    (options.G ? 1 : 0) +
    (options.PG ? 1 : 0) +
    (options.PG13 ? 1 : 0) +
    (options.R ? 1 : 0);
  const usedOpts =
    (options.decade === "0" ? 0 : 1) +
    (options.length.min === 0 && options.length.max === 0 ? 0 : 1) +
    (options.oscar ? 1 : 0) +
    (usedRatings === 1 || usedRatings === 2 ? 1 : 0);

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
            val={+options.decade}
            setValue={handleOptChange}
            min={0}
            max={11}
            label="Release decade"
            labelVal={`${
              options.decade === "0"
                ? "all"
                : `${1910 + 10 * parseInt(options.decade)}'s`
            }`}
            sliderKey={{ min: "earlier", max: "later" }}
          />
        </fieldset>
        <DoubleSlider
          id="length"
          min={0}
          max={8}
          step={1}
          startVal={{ min: options.length.min, max: options.length.max }}
          label={"Length"}
          labelVal={`${
            options.length.min === 0 && options.length.max === 8
              ? "any"
              : options.length.min === 0
              ? `${convertLengthVals(options.length.max).label} or shorter`
              : options.length.max === 8
              ? `${convertLengthVals(options.length.min).label} or longer`
              : `between ${convertLengthVals(options.length.min).label} and ${
                  convertLengthVals(options.length.max).label
                }`
          }`}
          sliderKey={{ min: "shorter", max: "longer" }}
          setValue={handleDualOptChange}
        />
        {/* <DoubleSlider
          id="gross"
          min={0}
          max={7}
          step={1}
          startVal={{ min: options.gross.min, max: options.gross.max }}
          label={"Worldwide gross"}
          labelVal={`${
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
          sliderKey={{ min: "less", max: "more" }}
          setValue={handleDualOptChange}
        /> */}
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
      <button
        onClick={handleSearchSubmit}
        disabled={searchField.length === 0 && usedOpts < 2}
      >
        Search for films
      </button>
    </>
  );
}
