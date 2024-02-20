import "./OpenAIRequest.css";
import { useState, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { movieProps } from "../../utils";
import { TextAreaField } from "../../components";

interface openAiReturn {
  MPAA_rating: string;
  imdb_id: string;
  plot: string;
  title: string;
  worldwide_gross: number;
  year: number;
}

interface openAiProps {
  setResults: Dispatch<SetStateAction<movieProps[]>>;
  setSearchField: Dispatch<SetStateAction<string>>;
  setSearchError: Dispatch<SetStateAction<string>>;
  setNoResults: Dispatch<SetStateAction<boolean>>;
  setSourceDown: Dispatch<SetStateAction<boolean>>;
  setSearching: Dispatch<SetStateAction<boolean>>;
  searching: boolean;
  handleReturn: (e: React.KeyboardEvent<HTMLElement>) => void;
}

export function OpenAIRequest({
  setResults,
  setSearchField,
  setSearchError,
  setNoResults,
  setSourceDown,
  searching,
  setSearching,
}: openAiProps) {
  const [request, setRequest] = useState("");

  const convertReturn = (results: openAiReturn[]) => {
    const convertedResults = results.map((result: openAiReturn) => {
      return {
        contentRating: result.MPAA_rating,
        id: result.imdb_id,
        plot: result.plot,
        title: result.title,
        description: result.year.toString(),
        gross: result.worldwide_gross,
      };
    });

    const filteredResults = convertedResults.filter((result) => {
      return (
        result.contentRating !== "NC-17" &&
        result.contentRating !== "X" &&
        result.plot.length > 0
      );
    });

    return filteredResults;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const { value } = e.target;
    setRequest(value);
  };

  const handleSubmit = async () => {
    setSearching(false);
    setResults([]);
    setSearchField("");
    setNoResults(false);
    setSearchError("");

    // first check to see if anything was provided
    if (request.length === 0) {
      console.log("No inputs");
      return;
    }

    setSearching(true);

    try {
      const searchResults = await axios.post("/api/movies/ai-search", {
        userRequest: request,
      });
      setSearching(false);
      const jsonResults = JSON.parse(searchResults.data);
      const movieList = jsonResults.movies || [];
      const convertedResults = convertReturn(movieList);

      console.log(convertedResults);

      setResults(convertedResults);
      if (convertedResults.length === 0) setNoResults(true);
      else setRequest("");
    } catch (err) {
      console.log(err);
      setSearching(false);
      setSearchError("Something went wrong with the search. Please try again.");
    }
  };

  const handleReturn = (e: React.KeyboardEvent<HTMLElement>) => {
    // Handler to assign a keyboard enter to the title search button
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div>
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
    </div>
  );
}
