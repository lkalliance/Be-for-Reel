// This compenent renders a checkbox

import { useState } from "react";

interface checkboxProps {
  id: string;
  label?: string;
  val?: boolean;
  setValue?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Checkbox({ id, label, val, setValue }: checkboxProps) {
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
        onChange={handleChange}
        checked={val ? val : localVal}
      />
      <label htmlFor={id} className={label ? "" : "hidden"}>
        {label}
      </label>
    </>
  );
}
