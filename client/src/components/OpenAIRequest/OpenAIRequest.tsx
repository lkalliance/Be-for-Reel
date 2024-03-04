// This component renders the AI search form

/* REQUIRED PROPS:
setResults: handler for results returned from OpenAI
setNoResults: setter for flag that search returned no results
setAISearch: setter for if a search was done with the AI module
setSearchError: handler for search error state
clearErrors: parent function for clearing all error alerts
active: flag for whether this form is under the selected tab */

import "./OpenAIRequest.css";
import { useState, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { movieProps } from "../../utils";
import { TextAreaField, SearchingAlert } from "../../components";

let controller: AbortController;

interface openAiReturn {
  MPAA_rating: string;
  imdb_id: string;
  plot: string;
  stars: string;
  title: string;
  worldwide_gross: number;
  year: number;
}

interface openAiProps {
  setResults: Dispatch<SetStateAction<movieProps[]>>;
  setSearchError: Dispatch<SetStateAction<string>>;
  setNoResults: Dispatch<SetStateAction<boolean>>;
  clearErrors: (clearAI: boolean) => void;
  setAISearch: Dispatch<SetStateAction<boolean>>;
  active: boolean;
}

export function OpenAIRequest({
  setResults,
  setSearchError,
  setNoResults,
  clearErrors,
  setAISearch,
  active,
}: openAiProps) {
  // make sure any active searches are aborted if need be
  if (!active && controller) controller.abort();

  const [request, setRequest] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);

  const convertReturn = (results: openAiReturn[]) => {
    const convertedResults = results.map((result: openAiReturn) => {
      return {
        contentRating: result.MPAA_rating,
        id: result.imdb_id,
        plot: result.plot,
        stars: result.stars,
        title: result.title,
        description: result.year.toString(),
      };
    });

    const filteredResults: movieProps[] = convertedResults.filter((result) => {
      return (
        result.contentRating !== "NC-17" &&
        result.contentRating !== "X" &&
        result.plot.length > 0 &&
        result.plot !== "N/A"
      );
    });

    return filteredResults;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    clearErrors(false);
    const { value } = e.target;
    const isReturn =
      value.length > 0 &&
      (value[value.length - 1].match(/\n/) ||
        value[value.length - 1].match(/\r/));
    if (!isReturn) setRequest(value);
  };

  const handleSearchCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    // handler for when user cancels search
    controller.abort();
    setSearching(false);
    setRequest("");
  };

  const handleSubmit = async () => {
    controller = new AbortController();
    setResults([]);
    clearErrors(true);
    setNoResults(false);
    setSearchError("");

    if (request.length === 0) {
      // first check to see if anything was provided
      console.log("No inputs");
      return;
    }

    setSearching(true);

    try {
      const searchResults = await axios.post(
        "/api/movies/ai-search",
        {
          userRequest: request,
        },
        { signal: controller.signal }
      );
      const jsonResults = JSON.parse(searchResults.data);
      const movieList = jsonResults.movies || [];
      const convertedResults = convertReturn(movieList);

      setResults(convertedResults);
      if (convertedResults.length === 0) setNoResults(true);
      else {
        setAISearch(true);
      }

      setSearching(false);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request cancelled");
      } else {
        console.log(err);
        setSearchError(
          "Something went wrong with the search. Sometimes rephrasing your request improves the results, or perhaps the AI provider is currently down. Please try again."
        );
      }
      setSearching(false);
    }
  };

  const handleReturn = (e: React.KeyboardEvent<HTMLElement>) => {
    // Handler to assign a keyboard enter to the title search button
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return searching && active ? (
    <SearchingAlert
      message={`Searching for feature films that ${request}`}
      stopSearch={handleSearchCancel}
    />
  ) : active ? (
    <fieldset>
      <TextAreaField
        id="user-request"
        label="Find me feature films that..."
        val={request}
        setValue={handleChange}
        keyUp={handleReturn}
      />
      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={request.length < 3 || searching}
      >
        Search for films
      </button>
    </fieldset>
  ) : null;
}
