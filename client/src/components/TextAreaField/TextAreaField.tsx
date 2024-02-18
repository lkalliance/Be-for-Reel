// This component renders a textarea element

/* REQUIRED PROPS:
id: the string to be the basis of the textarea's id and name */

/* OPTIONAL PROPS:
label: the string to appear as a title for the textarea
placeholder: the string to appear as the the textarea placeholder
val: a string used as the value of the textarea (defaults to "")
min: the minimum required length of the text
max: the maximum allowed length of the text
height: pixel height
width: pixel width
disabled: a boolean to set the disabled property (defaults to false)
setValue: a callback function for textarea onChange
keyUp: a callback function for textarea keyUp */

import "./TextAreaField.css";
import { useState } from "react";

interface textAreaProps {
  id: string;
  placeholder?: string;
  label?: string;
  min?: number;
  max?: number;
  val?: string;
  height?: number;
  width?: number;
  disabled?: boolean;
  setValue?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  keyUp?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function TextAreaField({
  id,
  placeholder,
  label,
  min,
  max,
  val,
  disabled,
  setValue,
  keyUp,
  height,
  width,
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
    <div className="textarea">
      <label htmlFor={id} className={label ? "" : "hidden"}>
        {label}
      </label>
      <textarea
        id={id}
        placeholder={placeholder ? placeholder : ""}
        value={val || localVal}
        disabled={disabled || false}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
      ></textarea>
      {(min || max) && (
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
      )}
    </div>
  );
}
