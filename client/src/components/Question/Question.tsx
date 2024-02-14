// This component renders a poll question

/* REQUIRED PROPS:
question: string of the text of the poll question
description: string of the description of the poll
username: string of the username of the poll's creator */

import "./Question.css";
import { UsernameLink } from "../../components";

interface questionProps {
  question: string;
  description?: string;
  username: string;
  current: boolean;
}

export function Question({
  question,
  description,
  username,
  current,
}: questionProps) {
  return (
    <div id="question">
      <h2>{question}</h2>
      {description ? <p className="desc m-1">{description}</p> : ""}
      <div className="m-3">
        <UsernameLink username={username} current={current} />
      </div>
    </div>
  );
}
