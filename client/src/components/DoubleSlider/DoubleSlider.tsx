// This component renders a two-handled slider

/* REQUIRED PROPS:
id: the string to be the basis of the sliders' ids and names
min: the low value of the range covered by the slider group
max: the high value of the range covered by the slider group */

/* OPTIONAL PROPS:
label: the string to appear as a title for the slider group
labelVal: the string to describe the current selected range
step: the amount of change in value per slider position (defaults to 1)
startVal: an object with starting values for each slider:
  -- min: the low value for the slider group (defaults to min)
  -- max: the high value for the slider group (defaults to max)
sliderKey: an object with labels for each end of the slider group:
  -- min: text to display on the left side of the slider group
  -- max: text to display on the right side of the slider group
setValue: a callback function for slider group onChange */

import "./DoubleSlider.css";
import { useState, useEffect, useRef, useCallback } from "react";
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
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  const [minVal, setMinVal] = useState(startVal ? startVal.min : min);
  const [maxVal, setMaxVal] = useState(startVal ? startVal.max : max);
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (startVal) {
      setMinVal(startVal.min);
      setMaxVal(startVal.max);
    }
  }, [startVal]);

  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value);

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

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

  return (
    <div id={id} className="double-slider">
      <legend className={label ? "sliderTitle" : "hidden"}>
        <span>{label}</span>
        <span className="val">{labelVal || ""}</span>
      </legend>
      <div className="inputs">
        <input
          id={`${id}-max`}
          name={`${id}-max`}
          ref={maxValRef}
          type="range"
          min={min}
          max={max}
          value={startVal ? startVal.max : maxVal}
          step={step || ""}
          onChange={handleChange}
          className={classnames("input-zindex-3", {
            "form-range input-zindex-5": minVal > max - (step || 1),
          })}
        />
        <input
          id={`${id}-min`}
          name={`${id}-min`}
          ref={minValRef}
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
          <div ref={range} className="slider-range"></div>
        </div>
      </div>
      <div className={sliderKey ? "legend" : "hidden"}>
        <span className="lower">{sliderKey ? sliderKey.min : ""}</span>
        <span className="upper">{sliderKey ? sliderKey.max : ""}</span>
      </div>
    </div>
  );
}
