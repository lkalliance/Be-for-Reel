// This compenent renders a checkbox

/* REQUIRED PROPS:
id: the string to be used as the id and name of the checkbox */

/* OPTIONAL PROPS:
label: the string to appear at the right of the checkbox
val: the boolean value of the checkbox (defaults to false)
disabled: the boolean of the checkbox disabled state (defaults to false)
setValue: a callback function for checkbox onChange */

import { useState } from "react";

interface checkboxProps {
  id: string;
  label?: string;
  val?: boolean;
  disabled?: boolean;
  setValue?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Checkbox({
  id,
  label,
  val,
  disabled,
  setValue,
}: checkboxProps) {
  // create a local state as a fallback
  const [localVal, setLocalVal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if a handler has been passed in, use it, otherwised just do the local
    if (setValue) setValue(e);
    else setLocalVal(!localVal);
  };

  return (
    <>
      <input
        type="checkbox"
        id={id}
        name={id}
        disabled={disabled || false}
        onChange={handleChange}
        checked={val || localVal}
      />
      <label htmlFor={id} className={label ? "" : "hidden"}>
        {label}
      </label>
    </>
  );
}
