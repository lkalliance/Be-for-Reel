// This componenent renders a range slider
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
        <span>{label}</span>
        <span className="val">{labelVal || ""}</span>
      </legend>
      <input
        type="range"
        className={`form-range ${width ? `width-${width}` : ""}`}
        min={min}
        max={max}
        step={step || ""}
        id={id}
        value={val || min}
        onChange={handleChange}
      ></input>
      <div className={sliderKey ? "legend" : "hidden"}>
        <span className="lower">{sliderKey ? sliderKey.min : ""}</span>
        <span className="upper">{sliderKey ? sliderKey.max : ""}</span>
      </div>
    </div>
  );
}
