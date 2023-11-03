// This page component renders the "About your poll" form

import "./AboutPoll.css";
import { InputText } from "../../components";

interface aboutPollProps {
  pollData: {
    title: string;
    description: string;
  };
  handlePollData: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}

export function AboutPoll({ pollData, handlePollData }: aboutPollProps) {
  return (
    <form>
      <fieldset>
        <InputText
          type="text"
          id="title"
          placeholder="Poll title"
          val={pollData.title}
          setValue={handlePollData}
        />
        <textarea
          id="description"
          placeholder="Poll description"
          value={pollData.description}
          onChange={handlePollData}
        ></textarea>
      </fieldset>
    </form>
  );
}
