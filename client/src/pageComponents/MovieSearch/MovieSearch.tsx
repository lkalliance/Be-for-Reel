// This component renders the movie search interface

/* REQUIRED PROPS:
setResults: handler for results returned from OpenAI
setSearchError: handler for search error state
setNoResults: setter for flag that search returned no results
sourceDown: state that tracks if we detect the API is down
setSourceDown: setter for flag that there was no response from API
setAISearch: setter for if a search was done with the AI module */

import "./MovieSearch.css";
import { useState, Dispatch, SetStateAction } from "react";
import { movieProps } from "../../utils/interfaces";
import { OpenAIRequest, Tabs, TitleSearch } from "../../components";

interface movieSearchProps {
  setResults: Dispatch<SetStateAction<movieProps[]>>;
  setSearchError: Dispatch<SetStateAction<string>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  setNoResults: Dispatch<SetStateAction<boolean>>;
  sourceDown: boolean;
  setSourceDown: Dispatch<SetStateAction<boolean>>;
  setAISearch: Dispatch<SetStateAction<boolean>>;
}

export function MovieSearch({
  setResults,
  setSearchError,
  setErrorMessage,
  setNoResults,
  sourceDown,
  setSourceDown,
  setAISearch,
}: movieSearchProps) {
  const [whichTab, setTab] = useState<"title" | "AI">("title");

  const tabHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = e.currentTarget;
    if (id === "title" || id === "AI") setTab(id);
  };

  const clearErrors = (clearAI: boolean) => {
    setSearchError("");
    setErrorMessage("");
    setNoResults(false);
    setSourceDown(false);
    if (clearAI) setAISearch(false);
  };

  return (
    <>
      <Tabs
        list={["title", "AI"]}
        current={whichTab}
        handler={tabHandler}
        beta="AI"
      />
      <TitleSearch
        setResults={setResults}
        setNoResults={setNoResults}
        sourceDown={sourceDown}
        setSourceDown={setSourceDown}
        setAIsearch={setAISearch}
        setSearchError={setSearchError}
        clearErrors={clearErrors}
        active={whichTab === "title"}
      />

      <OpenAIRequest
        setResults={setResults}
        // setSearchField={setSearchField}
        setSearchError={setSearchError}
        setNoResults={setNoResults}
        // setSourceDown={setSourceDown}
        // searching={searching}
        // setSearching={setSearching}
        // handleReturn={handleReturn}
        clearErrors={clearErrors}
        setAISearch={setAISearch}
        active={whichTab === "AI"}
      />
    </>
  );
}
