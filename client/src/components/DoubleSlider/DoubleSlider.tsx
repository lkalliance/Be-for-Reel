// This component renders a two-handled slider
import "./DoubleSlider.css";
import { useState, useRef, useCallback, useEffect } from "react";
import classnames from "classnames";

interface doubleSliderProps {
  id: string;
  min: number;
  max: number;
  label?: string;
  labelVal?: string;
  step?: number;
  sliderKey?: {
    min: string;
    max: string;
  };
  startVal?: {
    min: number;
    max: number;
  };
  setValue?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DoubleSlider({
  id,
  min,
  max,
  step,
  setValue,
  label,
  labelVal,
  startVal,
  sliderKey,
}: doubleSliderProps) {
  useEffect(() => {
    if (startVal) {
      setMinVal(startVal.min);
      setMaxVal(startVal.max);
    }
  });

  const [minVal, setMinVal] = useState(startVal ? startVal.min : min);
  const [maxVal, setMaxVal] = useState(startVal ? startVal.max : max);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const pieces = id.split("-");
    if (pieces[1] === "min") {
      if (+value <= maxVal - (step || 1)) {
        setMinVal(+value);
        if (setValue) setValue(e);
      }
    } else {
      if (+value >= minVal + (step || 1)) {
        setMaxVal(+value);
        if (setValue) setValue(e);
      }
    }
  };

  console.log(minVal, maxVal);

  return (
    <>
      {" "}
      <div id={id} className="double-slider">
        <legend className={label ? "sliderTitle" : "hidden"}>
          <span>{label}</span>
          <span className="val">{labelVal || ""}</span>
        </legend>
        <div className="inputs">
          <input
            id={`${id}-max`}
            name={`${id}-max`}
            type="range"
            min={min}
            max={max}
            value={startVal ? startVal.max : maxVal}
            step={step || ""}
            onChange={handleChange}
            className={classnames("input-zindex-3", {
              "input-zindex-5": minVal > max - (step || 1),
            })}
          />
          <input
            id={`${id}-min`}
            name={`${id}-min`}
            type="range"
            min={min}
            max={max}
            value={startVal ? startVal.min : minVal}
            step={step || ""}
            onChange={handleChange}
            className="input-zindex-4"
          />
          <div className="slider">
            <div className="slider-track"></div>
            <div className="slider-range"></div>
          </div>
        </div>
        <div className={sliderKey ? "legend" : "hidden"}>
          <span className="lower">{sliderKey ? sliderKey.min : ""}</span>
          <span className="upper">{sliderKey ? sliderKey.max : ""}</span>
        </div>
      </div>
    </>
  );
}
