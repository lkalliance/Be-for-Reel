// This component renders the movie search form

/* REQUIRED PROPS:
searchField: state that tracks search field contents
setResults: handler for results returned from OpenAI
setSearchField: handler for changes in the search field
setSearchError: handler for search error state
setNoResults: setter for flag that search returned no results
setSourceDown: setter for flag that there was no response from API
searching: state that tracks if a search is in progress
setSearching: setter for flat for ChatGPT searching status
options: state object that tracks search criteria
handleReturn: handler to sniff for keyboard return
handleOption: generic handler for changes to most search criteria
handleDoublOption: handler for changes to double-slider option
handleSelectOption: handler for changes to a menu selection
handleSearchSubmit: handler for submitting the search */

import "./MovieSearch.css";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
// import Accordion from "react-bootstrap/Accordion";
import { movieProps, searchOptions } from "../../utils/interfaces";
import { convertLengthVals } from "../../utils/typeUtils";
import {
  // InputText,
  // Checkbox,
  // Slider,
  // DoubleSlider,
  // Select,
  OpenAIRequest,
  Tabs,
  TitleSearch,
} from "../../components";

let controller: AbortController;

interface movieSearchProps {
  // searchField: string;
  setResults: Dispatch<SetStateAction<movieProps[]>>;
  // setSearchField: Dispatch<SetStateAction<string>>;
  setSearchError: Dispatch<SetStateAction<string>>;
  setNoResults: Dispatch<SetStateAction<boolean>>;
  sourceDown: boolean;
  setSourceDown: Dispatch<SetStateAction<boolean>>;
  // searching: boolean;
  // setSearching: Dispatch<SetStateAction<boolean>>;
  // options: searchOptions;
  // handleReturn: (
  //   e: React.KeyboardEvent<HTMLElement>,
  //   controller: AbortController
  // ) => void;
  // handleOption: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // handleDualOption: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // handleSelectOption: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  // aiSearch: boolean;
  setAISearch: Dispatch<SetStateAction<boolean>>;
  // handleSearchSubmit: (controller: AbortController) => void;
}

export function MovieSearch({
  // searchField,
  setResults,
  // setSearchField,
  setSearchError,
  setNoResults,
  sourceDown,
  setSourceDown,
  // searching,
  // setSearching,
  // handleReturn,
  // aiSearch,
  setAISearch,
}: movieSearchProps) {
  // // used to reset options values
  // const blankOptions = {
  //   decade: "0",
  //   // years: false,
  //   // years: {
  //   //   min: 1910,
  //   //   max: thisYear(),
  //   // },
  //   length: {
  //     min: 1,
  //     max: 8,
  //   },
  //   gross: {
  //     min: 1,
  //     max: 7,
  //   },
  //   G: false,
  //   PG: false,
  //   PG13: false,
  //   R: false,
  //   oscar: false,
  //   oscarWin: false,
  //   genre: "all",
  // };

  // const maxTries = 3; // maximum number of times we'll query IMDb for one search

  const [whichTab, setTab] = useState<"title" | "AI">("title");
  const [searchField, setSearchField] = useState<string>("");
  // const [options, setOptions] = useState(blankOptions as searchOptions); // tracks title search options
  // const [searching, setSearching] = useState<boolean>(false);

  // const getFilms = async (url: string) => {
  //   // queries the TV-API
  //   const movieData = await fetch(url);
  //   const result = await movieData.json();
  //   return result;
  // };

  const tabHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = e.currentTarget;
    if (id === "title" || id === "AI") setTab(id);
  };

  const clearErrors = () => {
    setSearchError("");
    setNoResults(false);
    setSourceDown(false);
    setAISearch(false);
  };
  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // on any input, clear the warning that there are no results
  //   clearErrors();
  //   setSearchField(e.target.value);
  // };

  // const handleOptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // Handler to track single-value changes to search options

  //   // on any input, clear the warning that there are no results
  //   clearErrors();
  //   const { id, value } = e.target;

  //   // if it's a checkbox, set the new value as the opposite of before
  //   const newValue =
  //     id === "decade" ? value : !options[id as keyof searchOptions];
  //   const newOptions = { ...options, [id]: newValue };

  //   setOptions(newOptions);
  // };

  // const handleDualOptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // Special hander to track changes to search options for double-sliders

  //   clearErrors();
  //   const { id, value } = e.target;

  //   // id will be created from option identifier and min/max designation
  //   const pieces = id.split("-");
  //   const optionPiece = options[pieces[0]];
  //   if (typeof optionPiece === "object") {
  //     const newOptionPiece = { ...optionPiece, [pieces[1]]: +value };
  //     const newOptions = { ...options, [pieces[0]]: newOptionPiece };
  //     setOptions(newOptions);
  //   }
  // };

  // const handleSelectOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   // Handler to track select menu changes to search options

  //   clearErrors();
  //   const { id, value } = e.target;
  //   const newOptions = { ...options, [id]: value };
  //   setOptions(newOptions);
  // };

  // const handleSearchSubmit = async (controller: AbortController) => {
  //   // handler for movie title search submission

  //   // erase existing results and show that we're searching
  //   setResults([]);
  //   setSearching(true);
  //   setNoResults(false);
  //   setSourceDown(false);
  //   setAISearch(false);

  //   // set up items to use in constructing the URL
  //   const { decade, G, PG, PG13, R, oscar, oscarWin, length, genre } = options;
  //   const mathDecade = parseInt(decade);
  //   let searchUrl = `/api/movies/search/${
  //     searchField.length > 0 ? searchField : "noTitle"
  //   }`;
  //   let paramParts = [];

  //   if (mathDecade > 0) {
  //     const from = 1920 + (mathDecade - 1) * 10;
  //     const to = from + 9;
  //     // a decade has been selected, add those parameters
  //     paramParts.push(`from=${from}`);
  //     paramParts.push(`to=${to}`);
  //   }

  //   // if (years.min > 1910 || years.max < thisYear()) {
  //   //   // if there are years to search, add the parameters for from and to
  //   //   paramParts.push(`from=${years.min}`);
  //   //   paramParts.push(`to=${years.max}`);
  //   // }

  //   if (G || PG || PG13 || R) {
  //     // if there are limits on ratings, add those parameters
  //     const ratings = [];
  //     if (G) ratings.push("us:G");
  //     if (PG) ratings.push("us:PG");
  //     if (PG13) ratings.push("us:PG-13");
  //     if (R) ratings.push("us:R");
  //     paramParts.push(`certificates=${ratings.join(",")}`);
  //   }

  //   // if Best Pic Winner is checked, add that parameter
  //   if (oscar && oscarWin)
  //     paramParts.push("groups=oscar_best_picture_nominees,oscar_winners");
  //   else if (oscar) paramParts.push("groups=oscar_best_picture_nominees");
  //   else if (oscarWin) paramParts.push("groups=oscar_winners");

  //   if (length.min > 0 || length.max < 8) {
  //     // if there is a time range, add that parameter
  //     paramParts.push(
  //       `runtime=${
  //         length.min === 0 ? "" : convertLengthVals(length.min).minutes
  //       },${length.max === 8 ? "" : convertLengthVals(length.max).minutes}`
  //     );
  //   }
  //   if (genre !== "all") {
  //     // if a genre has been chosen, add that parameter
  //     paramParts.push(`genres=${genre}`);
  //   }

  //   // create the search URL from the base plus the parameters
  //   searchUrl += paramParts.length > 0 ? `?${paramParts.join("&")}` : "";

  //   let result: movieProps[] = [],
  //     tries = 0;
  //   while (tries < maxTries && result.length === 0) {
  //     try {
  //       const searchResults = await getFilms(searchUrl);
  //       if (searchResults.message) {
  //         // there was an error instead of a return
  //         setSearching(false);
  //         setSourceDown(true);
  //         setNoResults(false);
  //         setSearchError(searchResults.message);
  //         tries = maxTries;
  //         break;
  //       }
  //       if (searching) result = searchResults;
  //       tries++;
  //     } catch (err) {
  //       console.log(err);
  //       break;
  //     }
  //   }

  //   // if there was no response from API, abandon
  //   if (sourceDown) return;
  //   if (result.length === 0 && !sourceDown) {
  //     // if there were no results, set the error
  //     setNoResults(true);
  //     setNoResults(true);
  //     setSearching(false);
  //     return;
  //   }

  //   // sort results by number of IMDb rating votes
  //   result.sort((a: movieProps, b: movieProps) => {
  //     return Number(b.imDbRatingVotes) - Number(a.imDbRatingVotes);
  //   });

  //   // put the results to the screen and reset everything else
  //   setResults(result);
  //   setSearching(false);
  //   setSourceDown(false);
  //   setNoResults(false);

  //   // setSearchField("");
  //   // setOptions(blankOptions);
  // };

  // const handleMenuChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   clearErrors();
  //   if (handleSelectOption) handleSelectOption(e);
  // };

  // const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   controller = new AbortController();
  //   handleSearchSubmit(controller);
  // };

  // const handleReturn = (
  //   e: React.KeyboardEvent<HTMLElement>,
  //   controller: AbortController
  // ) => {
  //   // Handler to assign a keyboard enter to the title search button
  //   if (e.key === "Enter") {
  //     handleSearchSubmit(controller);
  //   }
  // };

  // const handleReturnKey = (e: React.KeyboardEvent<HTMLElement>) => {
  //   handleReturn(e, controller);
  // };

  // const genreList = [
  //   "All",
  //   "Action",
  //   "Adventure",
  //   "Animation",
  //   "Biography",
  //   "Comedy",
  //   "Crime",
  //   "Documentary",
  //   "Drama",
  //   "Family",
  //   "Fantasy",
  //   "Film-Noir",
  //   "History",
  //   "Horror",
  //   "Musical",
  //   "Mystery",
  //   "Romance",
  //   "Sci-Fi",
  //   "Thriller",
  //   "War",
  //   "Western",
  // ];

  // const genreObjs = genreList.map((genre) => {
  //   return { value: genre, title: genre };
  // });

  // // count all the options configured, to determine if search button is live
  // const usedRatings =
  //   (options.G ? 1 : 0) +
  //   (options.PG ? 1 : 0) +
  //   (options.PG13 ? 1 : 0) +
  //   (options.R ? 1 : 0);
  // const usedOpts =
  //   (parseInt(options.decade) > 0 ? 1.5 : 0) +
  //   (options.length.max - options.length.min === 1
  //     ? 2
  //     : options.length.max - options.length.min < 3
  //     ? 1
  //     : 0) +
  //   (options.oscar ? 0.5 : 0) +
  //   (options.oscarWin ? 0.5 : 0) +
  //   (usedRatings === 1 || usedRatings === 2 ? 1 : 0) +
  //   (usedRatings === 3 ? 0.5 : 0) +
  //   (options.genre !== "all" ? 1 : 0);

  return (
    <>
      <Tabs
        list={["title", "AI"]}
        current={whichTab}
        handler={tabHandler}
        beta="AI"
      />
      {whichTab === "title" && (
        <TitleSearch
          setResults={setResults}
          setNoResults={setNoResults}
          sourceDown={sourceDown}
          setSourceDown={setSourceDown}
          setAIsearch={setAISearch}
          setSearchError={setSearchError}
        />

        // <>
        //   <fieldset>
        //     <InputText
        //       type="text"
        //       label="Find titles containing..."
        //       id="titleSearchBox"
        //       placeholder="Title"
        //       capitalize="off"
        //       val={searchField}
        //       setValue={handleSearchChange}
        //       keyUp={handleReturnKey}
        //     />
        //   </fieldset>

        //   <Accordion flush>
        //     <Accordion.Item eventKey="0">
        //       <Accordion.Header>Search Options</Accordion.Header>
        //       <Accordion.Body>
        //         <form>
        //           <fieldset id="released" className="list-member-20">
        //             <Slider
        //               id="decade"
        //               val={+options.decade}
        //               setValue={handleOptChange}
        //               min={0}
        //               max={11}
        //               label="Release decade"
        //               labelVal={`${
        //                 options.decade === "0"
        //                   ? "all"
        //                   : `${1910 + 10 * parseInt(options.decade)}'s`
        //               }`}
        //               sliderKey={{ min: "earlier", max: "later" }}
        //             />
        //             {/* <DoubleSlider
        //           id="years"
        //           min={1910}
        //           max={thisYear()}
        //           step={1}
        //           startVal={{
        //             min: options.years.min,
        //             max: options.years.max,
        //           }}
        //           label={"Release Year"}
        //           labelVal={`${
        //             options.years.min === 1910 &&
        //             options.years.max === thisYear()
        //               ? "any"
        //               : options.years.min === 1910
        //               ? `${options.years.max} or earlier`
        //               : options.years.max === thisYear()
        //               ? `${options.years.min} or later`
        //               : `${options.years.min} to ${options.years.max}`
        //           }`}
        //           sliderKey={{ min: "earlier", max: "later" }}
        //           setValue={handleDualOptChange}
        //         /> */}
        //           </fieldset>
        //           <fieldset className="list-member-20">
        //             <DoubleSlider
        //               id="length"
        //               min={0}
        //               max={8}
        //               step={1}
        //               startVal={{
        //                 min: options.length.min,
        //                 max: options.length.max,
        //               }}
        //               label={"Length"}
        //               labelVal={`${
        //                 options.length.min === 0 && options.length.max === 8
        //                   ? "any"
        //                   : options.length.min === 0
        //                   ? `${
        //                       convertLengthVals(options.length.max).label
        //                     } or shorter`
        //                   : options.length.max === 8
        //                   ? `${
        //                       convertLengthVals(options.length.min).label
        //                     } or longer`
        //                   : `between ${
        //                       convertLengthVals(options.length.min).label
        //                     } and ${
        //                       convertLengthVals(options.length.max).label
        //                     }`
        //               }`}
        //               sliderKey={{ min: "shorter", max: "longer" }}
        //               setValue={handleDualOptChange}
        //             />
        //           </fieldset>
        //           <fieldset id="ratings" className="list-member-20">
        //             <legend>Limit to just these US ratings</legend>
        //             <div>
        //               <Checkbox
        //                 id="G"
        //                 label="G"
        //                 setValue={handleOptChange}
        //                 val={Boolean(options.G)}
        //               />
        //               <Checkbox
        //                 id="PG"
        //                 label="PG"
        //                 setValue={handleOptChange}
        //                 val={Boolean(options.PG)}
        //               />
        //               <Checkbox
        //                 id="PG13"
        //                 label="PG-13"
        //                 setValue={handleOptChange}
        //                 val={Boolean(options.PG13)}
        //               />
        //               <Checkbox
        //                 id="R"
        //                 label="R"
        //                 setValue={handleOptChange}
        //                 val={Boolean(options.R)}
        //               />
        //             </div>
        //           </fieldset>
        //           <fieldset id="oscars" className="list-member-20">
        //             <div>
        //               <Checkbox
        //                 id="oscar"
        //                 label="Nominated for Best Picture"
        //                 setValue={handleOptChange}
        //                 val={Boolean(options.oscar)}
        //               />
        //             </div>
        //             <div>
        //               <Checkbox
        //                 id="oscarWin"
        //                 label="Won any Oscar"
        //                 setValue={handleOptChange}
        //                 val={Boolean(options.oscarWin)}
        //               />
        //             </div>
        //           </fieldset>
        //           <fieldset id="genres" className="list-member-20">
        //             <legend>Limit to just this genre</legend>
        //             <Select
        //               id="genre"
        //               options={genreObjs}
        //               val={options.genre}
        //               setValue={handleMenuChange}
        //             />
        //           </fieldset>
        //         </form>
        //       </Accordion.Body>
        //     </Accordion.Item>
        //   </Accordion>

        //   <button
        //     onClick={handleSubmit}
        //     className="btn btn-primary"
        //     disabled={searchField.length < 3 && usedOpts < 3}
        //   >
        //     Search for films
        //   </button>
        // </>
      )}
      {whichTab === "AI" && (
        <fieldset>
          <OpenAIRequest
            setResults={setResults}
            setSearchField={setSearchField}
            setSearchError={setSearchError}
            setNoResults={setNoResults}
            // setSourceDown={setSourceDown}
            // searching={searching}
            // setSearching={setSearching}
            // handleReturn={handleReturn}
            clearErrors={clearErrors}
            setAISearch={setAISearch}
          />
        </fieldset>
      )}
    </>
  );
}
