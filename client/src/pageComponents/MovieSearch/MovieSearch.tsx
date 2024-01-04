// This component renders the movie search form

import "./MovieSearch.css";
import { Dispatch, SetStateAction } from "react";
import Accordion from "react-bootstrap/Accordion";
import { searchOptions } from "../../utils/interfaces";
import { convertLengthVals, thisYear } from "../../utils/typeUtils";
import {
  InputText,
  Checkbox,
  Slider,
  DoubleSlider,
  Select,
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
  handleSelectOption: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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
  handleSelectOption,
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

  const handleMenuChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNoResults(false);
    if (handleSelectOption) handleSelectOption(e);
  };

  const genreList = [
    "All",
    "Action",
    "Adventure",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Film-Noir",
    "History",
    "Horror",
    "Musical",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "War",
    "Western",
  ];

  const genreObjs = genreList.map((genre) => {
    return { value: genre, title: genre };
  });

  // count all the options configured, to determine if search button is live
  const usedRatings =
    (options.G ? 1 : 0) +
    (options.PG ? 1 : 0) +
    (options.PG13 ? 1 : 0) +
    (options.R ? 1 : 0);
  const usedOpts =
    (options.years.max - options.years.min > 10 ? 0 : 1) +
    (options.length.max - options.length.min < 3 ? 1 : 0) +
    (options.oscar ? 1 : 0) +
    (usedRatings === 1 || usedRatings === 2 ? 1 : 0) +
    (options.genre !== "all" ? 1 : 0);

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
      <Accordion flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Search Options</Accordion.Header>
          <Accordion.Body>
            <form>
              <fieldset id="released" className="list-member-20">
                {/* <Slider
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
                /> */}
                <DoubleSlider
                  id="years"
                  min={1910}
                  max={thisYear()}
                  step={1}
                  startVal={{
                    min: options.years.min,
                    max: options.years.max,
                  }}
                  label={"Release Year"}
                  labelVal={`${
                    options.years.min === 1910 &&
                    options.years.max === thisYear()
                      ? "any"
                      : options.years.min === 1910
                      ? `${options.years.max} or earlier`
                      : options.years.max === thisYear()
                      ? `${options.years.min} or later`
                      : `${options.years.min} to ${options.years.max}`
                  }`}
                  sliderKey={{ min: "earlier", max: "later" }}
                  setValue={handleDualOptChange}
                />
              </fieldset>
              <fieldset className="list-member-20">
                <DoubleSlider
                  id="length"
                  min={0}
                  max={8}
                  step={1}
                  startVal={{
                    min: options.length.min,
                    max: options.length.max,
                  }}
                  label={"Length"}
                  labelVal={`${
                    options.length.min === 0 && options.length.max === 8
                      ? "any"
                      : options.length.min === 0
                      ? `${
                          convertLengthVals(options.length.max).label
                        } or shorter`
                      : options.length.max === 8
                      ? `${
                          convertLengthVals(options.length.min).label
                        } or longer`
                      : `between ${
                          convertLengthVals(options.length.min).label
                        } and ${convertLengthVals(options.length.max).label}`
                  }`}
                  sliderKey={{ min: "shorter", max: "longer" }}
                  setValue={handleDualOptChange}
                />
              </fieldset>
              <fieldset id="ratings" className="list-member-20">
                <legend>Limit to just these US ratings</legend>
                <div>
                  <Checkbox
                    id="G"
                    label="G"
                    setValue={handleOptChange}
                    val={Boolean(options.G)}
                  />
                  <Checkbox
                    id="PG"
                    label="PG"
                    setValue={handleOptChange}
                    val={Boolean(options.PG)}
                  />
                  <Checkbox
                    id="PG13"
                    label="PG-13"
                    setValue={handleOptChange}
                    val={Boolean(options.PG13)}
                  />
                  <Checkbox
                    id="R"
                    label="R"
                    setValue={handleOptChange}
                    val={Boolean(options.R)}
                  />
                </div>
              </fieldset>
              <fieldset id="oscars" className="list-member-20">
                <div>
                  <Checkbox
                    id="oscar"
                    label="Nominated for Best Picture"
                    setValue={handleOptChange}
                    val={Boolean(options.oscar)}
                  />
                </div>
              </fieldset>
              <fieldset id="genres" className="list-member-20">
                <legend>Limit to just this genre</legend>
                <Select
                  id="genre"
                  options={genreObjs}
                  val={options.genre}
                  setValue={handleMenuChange}
                />
              </fieldset>
            </form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <button
        onClick={handleSearchSubmit}
        className="btn btn-primary"
        disabled={searchField.length < 3 && usedOpts < 3}
      >
        Search for films
      </button>
    </>
  );
}
