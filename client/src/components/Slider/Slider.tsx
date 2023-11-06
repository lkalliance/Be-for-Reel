// This componenent renders a range slider
import { useState } from "react";

interface sliderProps {
  id: string;
  label?: string;
  val?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  setValue?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export function Slider({
  id,
  setValue,
  val,
  label,
  min,
  max,
  step,
}: sliderProps) {
  // create a local state as a fallback
  const [localVal, setLocalVal] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // if a handler has been passed in, use it, otherwised just do the local
    if (setValue) setValue(e);
    else setLocalVal(parseInt(value));
  };

  return (
    <>
      <legend className={label ? "" : "hidden"}>{label}</legend>
      <input
        type="range"
        className="form-range"
        min={min}
        max={max}
        step={step || ""}
        id={id}
        value={val || 0}
        onChange={handleChange}
      ></input>
    </>
  );
}
