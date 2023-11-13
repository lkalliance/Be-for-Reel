// This renders an option for a select menu component

/* REQUIRED PROPS:
value: the string value of this option 
title: text to appear with this option */

import "./SelectOption.css";

interface selectOptionProps {
  value: string;
  title: string;
}

export function SelectOption({ value, title }: selectOptionProps) {
  return <option value={value}>{title}</option>;
}
