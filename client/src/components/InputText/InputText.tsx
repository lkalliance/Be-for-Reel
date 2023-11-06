// This component renders an input box (text, email, password)

import "./InputText.css";
import { useState } from "react";

interface inputProps {
  type: string;
  id: string;
  placeholder?: string;
  label?: string;
  min?: number;
  max?: number;
  val?: string;
  disabled?: boolean;
  capitalize?: string;
  setValue?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function InputText({
  val,
  setValue,
  id,
  type,
  placeholder,
  label,
  keyUp,
  capitalize,
  min,
  max,
  disabled,
}: inputProps) {
  // create a local state to be used if none passed down
  const [localVal, setLocalVal] = useState("");
  const [charCount, setCharCount] = useState(0);

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
