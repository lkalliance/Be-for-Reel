// Multi-Slider component

import "./MultiSlider.css";
import { useState, useRef, useCallback, useEffect } from "react";
import classnames from "classnames";

interface multiSliderProps {
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  onChange: (value: { min: number; max: number }) => void;
  setValue?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MultiSlider({
  min,
  max,
  onChange,
  prefix,
  suffix,
  step,
}: multiSliderProps) {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value); // Precede with '+' to convert the value from type string to type number

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

  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <div className="slider-container">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        step={step || ""}
        ref={minValRef}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const value = Math.min(+event.target.value, maxVal - 1);
          setMinVal(value);
          event.target.value = value.toString();
        }}
        className={classnames("thumb thumb-zindex-3", {
          "thumb-zindex-5": minVal > max - 100,
        })}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        step={step || ""}
        ref={maxValRef}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const value = Math.max(+event.target.value, minVal + 1);
          setMaxVal(value);
          event.target.value = value.toString();
        }}
        className="thumb thumb-zindex-4"
      />

      <div className="slider">
        <div className="slider-track"></div>
        <div ref={range} className="slider-range"></div>
        <div className="slider-left-value">{`${prefix || ""}${minVal}${
          suffix || ""
        }`}</div>
        <div className="slider-right-value">{`${prefix || ""}${maxVal}${
          suffix || ""
        }`}</div>
      </div>
    </div>
  );
}
