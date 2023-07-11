import "./Create.css";
import { useState } from "react";
import { SearchResult } from "../../components/SearchResult";
import { movieProps } from "../../utils/interfaces";

interface searchOptions {
  [key: string]: string | boolean;
}

export function Create() {
  const blankOptions = {
    from: "",
    to: "",
    years: false,
    G: false,
    PG: false,
    PG13: false,
    R: false,
    oscar: false,
  };
  const [searchField, setSearchField] = useState("");
  const [options, setOptions] = useState(blankOptions as searchOptions);
  const [results, setResults] = useState<movieProps[]>([]);
  const [noResults, setNoResults] = useState<boolean>(false);
  const [selected, setSelected] = useState<movieProps[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSubmit = async () => {
    setResults([]);
    if (searchField === "") return;
    const { to, from, years, G, PG, PG13, R, oscar } = options;
    let searchUrl = `/api/search/${searchField}`;
    let paramParts = [];

    if (years) {
      if (Number(from) > 0) paramParts.push(`from=${from}`);
      if (Number(to) > 0) paramParts.push(`to=${to}`);
    }
    if (G || PG || PG13 || R) {
      const ratings = [];
      if (G) ratings.push("us:G");
      if (PG) ratings.push("us:PG");
      if (PG13) ratings.push("us:PG-13");
      if (R) ratings.push("us:R");
      paramParts.push(`certificates=${ratings.join(",")}`);
    }
    if (oscar) paramParts.push("groups=oscar_best_picture_nominees");

    searchUrl += paramParts.length > 0 ? `?${paramParts.join("&")}` : "";

    const movieData = await fetch(searchUrl);
    const result = await movieData.json();

    setNoResults(result.length === 0);
    setResults(result);
    setSearchField("");
    setOptions(blankOptions);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { value } = e.target;
    setSearchField(value);
  };

  const handleOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const today = new Date();
    const thisYear = Number(today.getFullYear());
    let changeYear = id === "from" || id === "to";

    const newValue = changeYear ? value : !options[id];
    const newOptions = { ...options, [id]: newValue };
    newOptions.years =
      !(newOptions.from === "" && newOptions.to === "") &&
      (newOptions.from === "" ||
        (Number(newOptions.from) >= 1927 &&
          Number(newOptions.from) <= thisYear)) &&
      (newOptions.to === "" ||
        (Number(newOptions.to) >= 1927 && Number(newOptions.to) <= thisYear));
    setOptions(newOptions);
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

    if (type === "search")
      setSelectedIds([...selectedIds, String(clicked[0].id)]);
    else {
      const whichOne = selectedIds.indexOf(clicked[0].id);
      let newList = [...selectedIds];
      newList.splice(whichOne, 1);
      setSelectedIds(newList);
    }
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
      <h3>Search options</h3>
      <form>
        <fieldset>
          <legend>Released</legend>
          <input
            type="text"
            id="from"
            placeholder="From"
            onChange={handleOption}
            value={String(options.from)}
          />
          <input
            type="text"
            id="to"
            placeholder="To"
            onChange={handleOption}
            value={String(options.to)}
          />
        </fieldset>
        <fieldset>
          <legend>Search only these US ratings</legend>
          <div>
            <input
              type="checkbox"
              id="G"
              name="G"
              onChange={handleOption}
              checked={Boolean(options.G)}
            />
            <label htmlFor="G">G</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="PG"
              name="PG"
              onChange={handleOption}
              checked={Boolean(options.PG)}
            />
            <label htmlFor="PG">PG</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="PG13"
              name="PG13"
              onChange={handleOption}
              checked={Boolean(options.PG13)}
            />
            <label htmlFor="PG13">PG-13</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="R"
              name="R"
              onChange={handleOption}
              checked={Boolean(options.R)}
            />
            <label htmlFor="R">R</label>
          </div>
        </fieldset>
        <fieldset>
          <div>
            <input
              type="checkbox"
              id="oscar"
              name="oscar"
              onChange={handleOption}
              checked={Boolean(options.oscar)}
            />
            <label htmlFor="oscar">Nominated for Best Picture</label>
          </div>
        </fieldset>
      </form>
      <button onClick={handleSubmit}>Search for title</button>
      <div id="results">
        <h3>Search Results</h3>
        <ul>
          {noResults ? <li>No search results</li> : ""}
          {results.map((result, index) => {
            if (selectedIds.indexOf(result.id) >= 0) return "";
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
