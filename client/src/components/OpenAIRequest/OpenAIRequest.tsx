import "./OpenAIRequest.css";
import { useState } from "react";
import axios from "axios";
import { TextAreaField } from "../../components";

export function OpenAIRequest() {
  const [request, setRequest] = useState("");

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
    const searchResults = await axios.post("/api/movies/cast-director-search", {
      userRequest: request,
    });
    const jsonResults = JSON.parse(searchResults.data);
    console.log(jsonResults);

    // convertReturn(searchResults.data);
  };

  // const generateResponse = async () => {
  //   try {
  //     const response = await axios.post(
  //       "https://api.openai.com/v1/engines/davinci-codex/completions",
  //       {
  //         prompt:
  //           "What are all movies with Leonardo DiCaprio directed by Martin Scorcese?",
  //         max_tokens: 200,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer xxxxxx`,
  //         },
  //       }
  //     );

  //     setResponse(response.data.choices[0].text);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
