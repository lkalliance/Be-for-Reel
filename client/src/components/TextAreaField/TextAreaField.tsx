// This component renders a textarea element

import "./TextAreaField.css";
import { useState } from "react";

interface textAreaProps {
  id: string;
  placeholder?: string;
  limit?: number;
  val?: string;
  setValue?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  keyUp?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function TextAreaField({
  id,
  placeholder,
  limit,
  val,
  setValue,
  keyUp,
}: textAreaProps) {
  // create a local state to be used if none passed down
  const [localVal, setLocalVal] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // if a change handler has been passed down, use it...
    if (setValue) setValue(e);
    else {
      // ...otherwise just update the local state
      const { value } = e.target;
      setLocalVal(value);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // if a keyup handler has been passed down, use it...
    if (keyUp) keyUp(e);
    else return;
  };

  return (
    <textarea
      id={id}
      placeholder={placeholder ? placeholder : ""}
      value={val ? val : localVal}
      onChange={handleChange}
      onKeyUp={handleKeyUp}
    ></textarea>
  );
}
