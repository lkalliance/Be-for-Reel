// This component renders an input box (text, email, password)

/* REQUIRED PROPS:
type: a string identifying the input type ("text", "email" or "password")
id: the string to be used as the id and name of the input */

/* OPTIONAL PROPS:
label: the string to appear as a title for the input
placeholder: the string to appear as the the input placeholder
classN: optional className to add
val: a string used as the value of the input (defaults to "")
min: the minimum required length of the text
max: the maximum allowed length of the text
disabled: a boolean to set the disabled property
focused: a boolean to put focus on this input
capitalize: a string to set as the autocapitalize value (defaults to "on")
setValue: a callback function for input onChange
keyUp: a callback function for input keyUp */

import "./InputText.css";
import { useState, useRef, useEffect } from "react";

interface inputProps {
  type: "text" | "email" | "password";
  id: string;
  placeholder?: string;
  classN?: string;
  label?: string;
  min?: number;
  max?: number;
  val?: string;
  disabled?: boolean;
  focused?: boolean;
  capitalize?: "words" | "sentences" | "characters" | "off";
  setValue?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function InputText({
  val,
  setValue,
  id,
  classN,
  type,
  placeholder,
  label,
  keyUp,
  capitalize,
  min,
  max,
  disabled,
  focused,
}: inputProps) {
  // create a local state to be used if none passed down
  const [localVal, setLocalVal] = useState("");
  const [charCount, setCharCount] = useState(0);

  // reference the input
  const inputReference = useRef<HTMLInputElement>(null);

  // if it's supposed to be focused, focus it
  useEffect(() => {
    if (focused && inputReference.current) inputReference.current.focus();
  }, [focused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // if a keyup handler has been passed down, use it...
    if (keyUp) keyUp(e);
    else return;
  };

  // this is our input field
  return (
    <>
      <label htmlFor={id} className={label ? "" : "hidden"}>
        {label}
      </label>
      <input
        type={type}
        ref={inputReference}
        className={classN || ""}
        id={id}
        name={id}
        placeholder={placeholder || ""}
        autoCapitalize={capitalize || "on"}
        value={val || localVal}
        disabled={disabled || false}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
      />
      <div className={min || max ? "limit" : "hidden"}>
        {min
          ? charCount === 0
            ? `minimum of ${min} characters`
            : charCount >= min
            ? `minmum of ${min} characters met`
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
