// This page component renders the "About your poll" form

/* REQUIRED PROPS:
pollData: an object with the current states of fields
handlePollData: a handler for field changes
genreObj: a tracking object for genres available for user selection
totalSelect: number of currently selected films */

import "./AboutPoll.css";
import { InputText, TextAreaField, Select } from "../../components";

interface aboutPollProps {
  pollData: {
    title: string;
    description: string;
    userGenre: string;
  };
  handlePollData: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
  genreObj: {
    [key: string]: number;
  };
  totalSelect: number;
  keyup: (e: React.KeyboardEvent<HTMLElement>) => void;
}

export function AboutPoll({
  pollData,
  handlePollData,
  genreObj,
  totalSelect,
  keyup,
}: aboutPollProps) {
  const whatGenres = () => {
    // returns an array of available genres

    // if there are no selected movies, return an empty array
    if (totalSelect === 0) return [];

    const genres = [{ title: "Select a genre for this poll", value: "all" }];
    for (const genre in genreObj) {
      if (genreObj[genre] / totalSelect >= 0.5) {
        // if half of selected movies include a genre, include it
        genres.push({ title: genre, value: genre });
      }
    }
    return genres;
  };

  const genres = whatGenres();

  return (
    <form>
      <fieldset>
        <InputText
          type="text"
          id="title"
          max={60}
          placeholder="Poll title (required)"
          val={pollData.title}
          setValue={handlePollData}
          keyUp={keyup}
        />
        <TextAreaField
          id="description"
          placeholder="Poll description"
          max={200}
          val={pollData.description}
          setValue={handlePollData}
        />
        {genres.length > 2 && totalSelect > 1 && (
          <Select
            id="userGenre"
            options={genres}
            val={pollData.userGenre}
            setValue={handlePollData}
          />
        )}
      </fieldset>
    </form>
  );
}
