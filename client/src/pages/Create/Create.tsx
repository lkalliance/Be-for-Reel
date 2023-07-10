import "./Create.css";
import { useState } from "react";

export function Create() {
  const [searchField, setSearchField] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(searchField);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { id, value } = e.target;
    setSearchField(value);
  };

  return (
    <section id="create">
      <h2>Create a Poll</h2>
      <h2>Search for a title</h2>
      <input
        id="titleSearchBox"
        type="text"
        onChange={handleInput}
        value={searchField}
      />
      <button onClick={handleSubmit}>Search for title</button>
    </section>
  );
}
