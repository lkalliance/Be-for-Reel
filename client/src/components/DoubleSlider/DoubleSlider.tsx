// This component renders a two-handled slider
import "./DoubleSlider.css";
import { useState, useRef, useCallback, useEffect } from "react";
import { dualOptions } from "../../utils/interfaces";
const classnames = require("classnames");

interface doubleSliderProps {
  id: string;
  min: number;
  max: number;
  label?: string;
  step?: number;
  setValue?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DoubleSlider({
  id,
  min,
  max,
  step,
  setValue,
  label,
}: doubleSliderProps) {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const val = parseInt(value);
    const pieces = id.split("-");
    if (pieces[1] === "min") {
      if (val <= maxVal - (step || 1)) {
        setMinVal(val);
        if (setValue) setValue(e);
      }
    } else {
      if (val >= minVal + (step || 1)) {
        setMaxVal(val);
        if (setValue) setValue(e);
      }
    }
  };

  return (
    <>
      {" "}
      <legend className={label ? "" : "hidden"}>{label}</legend>
      <div id={id} className="double-slider">
        <input
          id={`${id}-min`}
          name={`${id}-min`}
          type="range"
          min={min}
          max={max}
          value={minVal}
          step={step || ""}
          onChange={handleChange}
        />
        <input
          id={`${id}-max`}
          name={`${id}-max`}
          type="range"
          min={min}
          max={max}
          value={maxVal}
          step={step || ""}
          onChange={handleChange}
        />
        <div className="slider">
          <div className="slider-track"></div>
          <div className="slider-range"></div>
        </div>
      </div>
    </>
  );
}
