// This component renders the Create a Poll page

import "./Create.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { cloneDeep } from "@apollo/client/utilities";
import { AuthService } from "../../utils/auth";
import { movieProps } from "../../utils/interfaces";
import { ADD_POLL, NEW_CODE } from "../../utils/mutations";
import { QUERY_ALL_POLLS, QUERY_SINGLE_USER } from "../../utils/queries";
import { pollLimit } from "../../utils/typeUtils";
import { MovieSearch, AboutPoll } from "../../pageComponents";
import { SearchResult, EmailVerifyModal } from "../../components";

interface genreObj {
  [key: string]: number;
}

interface pollOptions {
  [key: string]: string;
  title: string;
  description: string;
  userGenre: string;
}

export function Create() {
  const auth = new AuthService();

  const navigate = useNavigate();

  const [results, setResults] = useState<movieProps[]>([]); // tracks results from most recent search
  const [selected, setSelected] = useState<movieProps[]>([]); // tracks movies selected for poll
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // tracks IMDb ids of selected movies
  const [pollData, setPollData] = useState<pollOptions>({
    title: "",
    description: "",
    userGenre: "all",
  }); // tracks text in poll title and description fields
  const [noResults, setNoResults] = useState<boolean>(false); // flag for this kind of error message
  const [sourceDown, setSourceDown] = useState<boolean>(false); // flag for this kind of error message
  const [errorMessage, setErrorMessage] = useState<string>(""); // tracks error message for poll submission
  const [searchError, setSearchError] = useState<string>(""); // tracks error message for search results
  const [aiSearch, setAiSearch] = useState<boolean>(false); // was this search an AI search
  const [profError, setProfError] = useState<boolean>(false); // profanity alert
  const [building, setBuilding] = useState<boolean>(false); // tracks message that poll is being built
  const [genreTracker, setGenreTracker] = useState<genreObj>({}); // tracks available genre submissions
  const [newCodeSent, setNewCodeSent] = useState(false); // tracks if a new code has been sent for email confirmation

  const {
    lookupName,
    activePolls,
    email,
    confirmed,
    _id: user_id,
  } = auth.getProfile();

  const closeModal = () => {
    try {
      setNewCodeSent(false);
    } catch (err) {
      console.log(err);
    }
  };

  const [addPoll] = useMutation(ADD_POLL, {
    refetchQueries: () => [
      {
        query: QUERY_ALL_POLLS,
        variables: { username: "" },
      },
      {
        query: QUERY_SINGLE_USER,
        variables: { lookupname: lookupName },
      },
    ],
  });

  const [newEmailCode] = useMutation(NEW_CODE);

  const handleCreate = async () => {
    // handler for submission of quiz to be created

    // poll title must exist and at least two films selected
    if (!(pollData.title.length > 0 && selected.length > 1)) return;

    const profaneTitle = await axios.get(
      `https://www.purgomalum.com/service/containsprofanity?text=${pollData.title}`
    );
    const profaneDesc = await axios.get(
      `https://www.purgomalum.com/service/containsprofanity?text=${pollData.description}`
    );

    if (profaneTitle.data || profaneDesc.data) {
      setProfError(true);
      setPollData({ ...pollData, title: "", description: "" });
      return;
    }

    // display the alert that poll is being built
    setBuilding(true);

    // create list of movie titles to check against on server
    const movieTitles: string[] = [];
    selected.forEach((movie) => movieTitles.push(movie.title));

    try {
      const { data } = await addPoll({
        variables: {
          title: pollData.title,
          description: pollData.description,
          movieIds: selectedIds,
          movieTitles,
          userGenre: pollData.userGenre,
        },
      });

      if (data.addPoll.message.length > 0) {
        // there were films that were removed from the list
        const removedFilms = data.addPoll.message.split(" ----- ");
        const filteredSelected = selected.filter((option) => {
          return removedFilms.indexOf(option.title) === -1;
        });
        setBuilding(false);
        setErrorMessage(
          "One or more suggestions by ChatGPT were invalid as feature films. They have been removed from the list, and the poll is not yet created."
        );

        setSelected(filteredSelected);

        // remove selected IDs
        return;
      }

      // after creating, update user with newly created poll
      auth.login(data.addPoll.token.token);
      // once poll is created, navigate the browser to it
      navigate(data.addPoll.redirect);
    } catch (err: any) {
      if (err.message.indexOf("urlTitle") > -1) {
        setBuilding(false);
        setErrorMessage(
          `You already have a quiz with the title "${pollData.title}"`
        );
      }
    }
  };

  const handleReturn = (e: React.KeyboardEvent<HTMLElement>) => {
    // Handler to assign a keyboard enter to the title search button
    console.log(`key: ${e.key}`);
    if (e.key === "Enter" && pollData.title.length > 0 && selected.length > 1) {
      handleCreate();
    }
  };

  const genreValid = () => {
    // checks to make sure the current user-selected genre still good

    return !(
      selected.length === 0 ||
      genreTracker[pollData.userGenre] / selected.length < 0.5
    );
  };

  const handlePollData = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    // Handler for managing changes to poll title and description
    const { id, value } = e.target;
    // clear any error message
    setErrorMessage("");
    setProfError(false);
    // update the poll data
    setPollData({
      ...pollData,
      [id]: value,
    });
  };

  const selectResult = (e: React.MouseEvent<HTMLElement>) => {
    // Handler to move a clicked search result to saved, or vice versa

    // determine origin and destination, remove clicked from origin and put in destination
    const type = e.currentTarget.dataset.type;
    // if this is an attempt to add a 13th film, forget it.
    if (type === "search" && selected.length >= 12) return;

    const genres = e.currentTarget.dataset.genres;
    const originList = type === "search" ? [...results] : [...selected];
    const clicked = originList.splice(Number(e.currentTarget.dataset.index), 1);
    const destinationList =
      type === "search" ? [...selected, ...clicked] : [...results, ...clicked];

    // set states based on which list was the origin
    if (type === "search") {
      setResults(originList);
      setSelected(destinationList);
    } else {
      setResults(destinationList);
      setSelected(originList);
    }

    // add or remove IMDb id to or from list of selected films
    if (type === "search")
      setSelectedIds([...selectedIds, String(clicked[0].id)]);
    else {
      const whichOne = selectedIds.indexOf(clicked[0].id);
      let newList = [...selectedIds];
      newList.splice(whichOne, 1);
      setSelectedIds(newList);
    }

    // adjust genreTracker
    const genreList = genres?.split(", ");
    let genreTemp = cloneDeep(genreTracker);
    const incrementer = type === "search" ? 1 : -1;
    genreList?.forEach((genre) => {
      if (!genreTemp[genre]) genreTemp[genre] = type === "search" ? 1 : 0;
      else genreTemp[genre] += incrementer;
    });
    setGenreTracker(genreTemp);

    // check if user genre selection needs to be nulled
    if (!genreValid()) setPollData({ ...pollData, userGenre: "all" });
  };

  const resendHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // handler to re-send verification link

    // if there is no email, never mind
    if (!email || !user_id || email.length === 0 || user_id.length === 0)
      return;

    try {
      // request new code if needed
      const newCode = await newEmailCode({
        variables: {
          user_id,
          email,
        },
      });

      if (newCode.data.newEmailCode.success) {
        // if the operation succeeded, pass it along to the email API
        await axios.post("/api/email/validate-send", {
          email,
        });
      }
      console.log(newCode.data?.newEmailCode.message);
      setNewCodeSent(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <section id="create">
        <div className="container">
          <h1>Create a Poll</h1>
          {!confirmed ? (
            <div className="container list-member-12" id="resend-alert">
              <button
                className="btn btn-danger btn-sm"
                id="resend"
                onClick={resendHandler}
              >
                resend
              </button>
              <p>
                Your account's email address <strong>{email}</strong> has not
                been confirmed. Only users with confirmed emails can create
                polls. If you have confirmed your account, try logging out and
                logging back in.
              </p>
            </div>
          ) : activePolls.length < pollLimit("standard") ? (
            <div className="row">
              <div id="titleSearch" className="col-12 col-sm-6">
                <h3>Search for films</h3>

                <div className="create-container">
                  <MovieSearch
                    setResults={setResults}
                    setSearchError={setSearchError}
                    setNoResults={setNoResults}
                    sourceDown={sourceDown}
                    setSourceDown={setSourceDown}
                    setAISearch={setAiSearch}
                    setErrorMessage={setErrorMessage}
                  />
                </div>

                <div id="results">
                  <h5 className="center">
                    Search Results
                    <span>(click or tap to add to your poll)</span>
                  </h5>

                  {aiSearch && (
                    <p className="chat-gpt-disclaimer">
                      These results were found by an AI assistant, and may not
                      be perfect or complete.
                    </p>
                  )}
                  {noResults && !sourceDown && (
                    <div className="alert alert-danger">No search results</div>
                  )}
                  {searchError.length > 0 && !sourceDown && (
                    <div className="alert alert-danger">
                      Something went wrong with the search. It sometimes helps
                      to rephrase your search term. Please try again.
                    </div>
                  )}
                  {sourceDown && (
                    <div className="alert alert-danger">{searchError}</div>
                  )}
                  <ul>
                    {results.map((result, index) => {
                      if (selectedIds.indexOf(result.id) >= 0) return "";
                      return (
                        <SearchResult
                          value={result}
                          key={index}
                          dataIndex={index}
                          type="search"
                          onClick={selectResult}
                        />
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div id="about" className="col-12 col-sm-6">
                <h3>About your poll</h3>
                <div className="create-container">
                  <AboutPoll
                    pollData={pollData}
                    handlePollData={handlePollData}
                    genreObj={genreTracker}
                    totalSelect={selected.length}
                    keyup={handleReturn}
                  />
                  <button
                    onClick={handleCreate}
                    className="btn btn-primary"
                    disabled={
                      !(pollData.title.length > 0 && selected.length > 1)
                    }
                  >
                    Create poll
                  </button>
                </div>
                {errorMessage.length > 0 ? (
                  <div className="alert alert-danger">{errorMessage}</div>
                ) : profError ? (
                  <div className="alert alert-danger">
                    Please no profanity in poll titles or descriptions.
                  </div>
                ) : (
                  ""
                )}
                {building ? (
                  <div className="alert alert-primary">
                    Building your poll...
                  </div>
                ) : (
                  ""
                )}
                <h5 className="center">
                  Selected Films
                  <span>(click or tap to remove from your poll)</span>
                </h5>
                {selected.length >= 12 ? (
                  <div className="alert alert-primary">
                    Maximum poll options reached.
                  </div>
                ) : (
                  ""
                )}
                <ul id="selected">
                  {selected.map((selected, index) => {
                    return (
                      <SearchResult
                        value={selected}
                        key={index}
                        dataIndex={index}
                        type="selected"
                        onClick={selectResult}
                      />
                    );
                  })}
                </ul>
              </div>
            </div>
          ) : (
            <p className="list-member-12">
              You have reached your creation limit for the most recent month.
              You will need to wait for one of your polls to expire before you
              can create a new one.
            </p>
          )}
        </div>
      </section>

      {newCodeSent && (
        <EmailVerifyModal
          close={closeModal}
          email={email.length > 0 ? email : "the provided email address"}
        />
      )}
    </>
  );
}
