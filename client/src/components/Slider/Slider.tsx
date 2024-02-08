// This componenent renders a range slider

/* REQUIRED PROPS:
id: the string to be the basis of the slider's id and name
min: the low value of the range covered by the slider
max: the high value of the range covered by the slider */

/* OPTIONAL PROPS:
label: the string to appear as a title for the slider
labelVal: the string to describe the current selected value
step: the amount of change in value of slider positions (defaults to 1)
width: value for the pixel size of the control
val: a number of the current value of the slider
disabled: a boolean used for the disabled state of the slider (defaults to false)
sliderKey: an object with labels for each end of the slider:
  -- min: text to display on the left side of the slider
  -- max: text to display on the right side of the slider
setValue: a callback function for slider onChange */

import "./Slider.css";
import { useState } from "react";

interface sliderProps {
  id: string;
  label?: string;
  labelVal?: string;
  val?: number;
  min: number;
  max: number;
  step?: number;
  width?: 100 | 200 | 400;
  sliderKey?: {
    min: string;
    max: string;
  };
  disabled?: boolean;
  setValue?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Slider({
  id,
  setValue,
  val,
  label,
  labelVal,
  min,
  max,
  width,
  step,
  sliderKey,
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
    <div className="single-slider">
      <legend className={label ? "sliderTitle" : "hidden"}>
        {label}
        <span className="val">{labelVal || ""}</span>
      </legend>
      <input
        type="range"
        className={`form-range ${width ? `width-${width}` : ""}`}
        min={min}
        max={max}
        step={step || ""}
        id={id}
        value={val || min || localVal}
        onChange={handleChange}
      ></input>
      <div className={sliderKey ? "legend" : "hidden"}>
        <span className="lower">{sliderKey ? sliderKey.min : ""}</span>
        <span className="upper">{sliderKey ? sliderKey.max : ""}</span>
      </div>
    </div>
  );
}
