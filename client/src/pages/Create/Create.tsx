import "./Create.css";
import { useState } from "react";
import { SearchResult } from "../../components/SearchResult";
import { movieProps } from "../../utils/interfaces";

export function Create() {
  const [searchField, setSearchField] = useState("");
  const [results, setResults] = useState<movieProps[]>([]);
  const [selected, setSelected] = useState<movieProps[]>([]);

  const handleSubmit = async () => {
    setResults([]);
    const searchUrl = `/api/search/${searchField}`;
    const movieData = await fetch(searchUrl);
    const result = await movieData.json();
    setResults(result);
    setSearchField("");
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { value } = e.target;
    setSearchField(value);
  };

  const handleReturn = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const selectResult = (e: React.MouseEvent<HTMLElement>) => {
    const type = e.currentTarget.dataset.type;
    const originList = type === "search" ? [...results] : [...selected];
    const clicked = originList.splice(Number(e.currentTarget.dataset.index), 1);
    const destinationList =
      type === "search" ? [...selected, ...clicked] : [...results, ...clicked];

    if (type === "search") {
      setResults(originList);
      setSelected(destinationList);
    } else {
      setResults(destinationList);
      setSelected(originList);
    }
  };

  const removeSelect = (e: React.MouseEvent<HTMLElement>) => {
    console.log("Removing an event");
  };

  return (
    <section id="create">
      <h2>Create a Poll</h2>
      <h2>Search for a title</h2>
      <input
        id="titleSearchBox"
        type="text"
        onChange={handleInput}
        onKeyUp={handleReturn}
        value={searchField}
      />
      <button onClick={handleSubmit}>Search for title</button>
      <div id="results">
        <h3>Search Results</h3>
        <ul>
          {results.map((result, index) => {
            return (
              <SearchResult
                value={result}
                key={index}
                dataIndex={index}
                type="search"
                onClick={selectResult}
              />
            );
          })}
        </ul>
      </div>
      <div id="selected">
        <h3>Selected Films</h3>
        <ul>
          {selected.map((selected, index) => {
            return (
              <SearchResult
                value={selected}
                key={index}
                dataIndex={index}
                type="selected"
                onClick={selectResult}
              />
            );
          })}
        </ul>
      </div>
    </section>
  );
}
