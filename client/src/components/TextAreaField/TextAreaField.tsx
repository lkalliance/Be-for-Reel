// This component renders a textarea element

import "./TextAreaField.css";
import { useState } from "react";

interface textAreaProps {
  id: string;
  placeholder?: string;
  min?: number;
  max?: number;
  val?: string;
  setValue?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  keyUp?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function TextAreaField({
  id,
  placeholder,
  min,
  max,
  val,
  setValue,
  keyUp,
}: textAreaProps) {
  // create a local state to be used if none passed down
  const [localVal, setLocalVal] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    // check against a maxiumum value and stop if it's already reached
    if (max && value.length > max) return;
    // if a change handler has been passed down, use it...
    if (setValue) setValue(e);
    // ...otherwise just update the local state
    else setLocalVal(value);
    // update the character count
    setCharCount(value.length);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // if a keyup handler has been passed down, use it...
    if (keyUp) keyUp(e);
    else return;
  };

  return (
    <>
      <textarea
        id={id}
        placeholder={placeholder ? placeholder : ""}
        value={val ? val : localVal}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
      ></textarea>
      <div className={min || max ? "limit" : "hidden"}>
        {min
          ? charCount === 0
            ? `minimum of ${min} characters`
            : `${charCount} characters (min. ${min})`
          : max
          ? charCount === 0
            ? `maximum of ${max} characters`
            : `${charCount} of ${max} characters`
          : ""}
      </div>
    </>
  );
}
