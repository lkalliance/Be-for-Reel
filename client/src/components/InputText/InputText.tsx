// This component renders an input box (text, email, password)

import "./InputText.css";
import { useState } from "react";

interface inputProps {
  type: string;
  id: string;
  placeholder?: string;
  limit?: number;
  val?: string;
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
  keyUp,
  capitalize,
}: inputProps) {
  // create a local state to be used if none passed down
  const [localVal, setLocalVal] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if a change handler has been passed down, use it...
    if (setValue) setValue(e);
    else {
      // ...otherwise just update the local state
      const { value } = e.target;
      setLocalVal(value);
    }
  };
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // if a keyup handler has been passed down, use it...
    if (keyUp) keyUp(e);
    else return;
  };

  // this is our input field
  return (
    <input
      type={type}
      id={id}
      name={id}
      placeholder={placeholder || ""}
      autoCapitalize={capitalize || "on"}
      value={val ? val : localVal}
      onChange={handleChange}
      onKeyUp={handleKeyUp}
    />
  );
}
