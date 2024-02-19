import "./OpenAIRequest.css";
import { useState, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { movieProps } from "../../utils";
import { TextAreaField } from "../../components";

interface openAiReturn {
  MPAA_rating: string;
  imdb_id: string;
  imdb_plot_synopsis: string;
  title: string;
  worldwide_gross: string;
  year: number;
}

interface openAiProps {
  setResults: Dispatch<SetStateAction<movieProps[]>>;
}

export function OpenAIRequest({ setResults }: openAiProps) {
  const [request, setRequest] = useState("");

  const convertReturn = (results: openAiReturn[]) => {
    const convertedResults = results.map((result: openAiReturn) => {
      return {
        contentRating: result.MPAA_rating,
        id: result.imdb_id,
        plot: result.imdb_plot_synopsis || "",
        title: result.title,
        description: result.year.toString(),
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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // first check to see if anything was provided
    if (request.length === 0) {
      console.log("No inputs");
      return;
    }
    const searchResults = await axios.post("/api/movies/ai-search", {
      userRequest: request,
    });
    const jsonResults = JSON.parse(searchResults.data);

    const convertedResults = jsonResults.movies
      ? convertReturn(jsonResults.movies)
      : [];

    setResults(convertedResults);
    setRequest("");
  };

  return (
    <div>
      <TextAreaField
        id="user-request"
        label="Find me feature films that..."
        val={request}
        setValue={handleChange}
      />
      <button onClick={handleSubmit}>Make request</button>
    </div>
  );
}
