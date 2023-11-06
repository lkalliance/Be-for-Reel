// This component renders a two-handled slider (really two separate sliders)
import { useState } from "react";

interface doubleSliderProps {
  id: string;
  label?: string;
  min1: number;
  max1: number;
  min2: number;
  max2: number;
  val1?: number;
  val2?: number;
  step?: number;
  disabled?: boolean;
  setValue1?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue2?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DoubleSlider({
  id,
  label,
  min1,
  max1,
  min2,
  max2,
  val1,
  val2,
  step,
  setValue1,
  setValue2,
}: doubleSliderProps) {
  // create a local states as a fallback
  const [localVal1, setLocalVal1] = useState(0);
  const [localVal2, setLocalVal2] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const which = id.charAt(id.length - 1);
    console.log(which);
    // if a handler has been passed in, use it, otherwised just do the local
    if (which === "1") {
      if (setValue1) setValue1(e);
      else setLocalVal1(parseInt(value));
    } else if (which === "2") {
      if (setValue2) setValue2(e);
      else setLocalVal2(parseInt(value));
    }
  };

  return (
    <>
      <legend className={label ? "" : "hidden"}>{label}</legend>
      <input
        type="range"
        className="form-range"
        min={min1}
        max={max1}
        step={step || ""}
        id={`${id}1`}
        value={val1 || localVal1}
        onChange={handleChange}
      ></input>
      <input
        type="range"
        className="form-range"
        min={min2}
        max={max2}
        step={step || ""}
        id={`${id}2`}
        value={val2 || localVal2}
        onChange={handleChange}
      ></input>
    </>
  );
}
