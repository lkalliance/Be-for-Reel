import "./Create.css";
import { useState } from "react";
import { SearchResult } from "../../components/SearchResult";

export function Create() {
  const [searchField, setSearchField] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setResults([]);
    const searchUrl = `/api/search/${searchField}`;
    const movieData = await fetch(searchUrl);
    const result = await movieData.json();
    setResults(result);
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
      <div id="results">
        <ul>
          {results.map((result, index) => {
            return <SearchResult movie={result} key={index} />;
          })}
        </ul>
      </div>
    </section>
  );
}
