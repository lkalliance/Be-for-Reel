// This renders a select menu component

/* REQUIRED PROPS:
id: the string to be used as the id and name of the select menu 
options: the array of options to be used in the checklist */

/* OPTIONAL PROPS:
label: the string to appear above the select menu
val: the string value of the select menu (defaults to false)
setValue: a callback function for select onChange */

import "./Select.css";
import { useState } from "react";
import { SelectOption } from "../../components";

interface optionProps {
  value: string;
  title: string;
}

interface selectProps {
  id: string;
  options: optionProps[];
  label?: string;
  val?: string;
  setValue?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function Select({ options, label, id, val, setValue }: selectProps) {
  // create local variable if needed
  const [localVal, setLocalVal] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (setValue) setValue(e);
    else setLocalVal(value);
  };

  return (
    <>
      <label htmlFor={id} className={label ? "" : "hidden"}>
        {label}
      </label>
      <select
        id={id}
        className="form-select"
        onChange={handleChange}
        value={val || localVal}
      >
        {options.map((opt: optionProps, index: number) => {
          return (
            <SelectOption value={opt.value} key={index} title={opt.title} />
          );
        })}
      </select>
    </>
  );
}
