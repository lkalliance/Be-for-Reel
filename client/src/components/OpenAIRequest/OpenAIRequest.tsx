import "./OpenAIRequest.css";
import { useState, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { movieProps } from "../../utils";
import { TextAreaField } from "../../components";

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
  setSearchField: Dispatch<SetStateAction<string>>;
  setSearchError: Dispatch<SetStateAction<string>>;
  setNoResults: Dispatch<SetStateAction<boolean>>;
  setSourceDown: Dispatch<SetStateAction<boolean>>;
  setSearching: Dispatch<SetStateAction<boolean>>;
  searching: boolean;
  handleReturn: (e: React.KeyboardEvent<HTMLElement>) => void;
  clearErrors: () => void;
  setAISearch: Dispatch<SetStateAction<boolean>>;
}

export function OpenAIRequest({
  setResults,
  setSearchField,
  setSearchError,
  setNoResults,
  setSourceDown,
  searching,
  setSearching,
  clearErrors,
  setAISearch,
}: openAiProps) {
  const [request, setRequest] = useState("");

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
    clearErrors();
    const { value } = e.target;
    const isReturn =
      value.length > 0 &&
      (value[value.length - 1].match(/\n/) ||
        value[value.length - 1].match(/\r/));
    if (!isReturn) setRequest(value);
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

      setResults(convertedResults);
      if (convertedResults.length === 0) setNoResults(true);
      else {
        setRequest("");
        setAISearch(true);
      }
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
